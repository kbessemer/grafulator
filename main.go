// GRAFULATOR
// Last Modified: March 3, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

package main

import (
	"context"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"
	"unicode"

	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
	"github.com/tealeg/xlsx"
	"github.com/xuri/excelize/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

// Struct for a standard response in JSON format
type ResponseStandard struct {
	Success bool   `json:"Success"`
	Data    string `json:"Data"`
}

// Struct for an error response in JSON format
type ResponseError struct {
	Success bool   `json:"Success"`
	Error   string `json:"Error"`
}

// Struct for JWT claims
type MyCustomClaims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

// JWT signing key
var mySigningKey = []byte("jFi$9!949FSkjmcF@9$@(@fFJFl9(@!!")

// Function for authenticating, BasicAuth, Enabled on login route
func BasicAuth(h httprouter.Handle, requiredUser, requiredPassword string) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		// Get the Basic Authentication credentials
		user, password, hasAuth := r.BasicAuth()

		if hasAuth && user == requiredUser && password == requiredPassword {
			// Forwards to the given route if authentication details are correct
			h(w, r, ps)
		} else {
			// Sends a unauthorized message if the authentication details are incorrect
			w.Header().Set("WWW-Authenticate", "Basic realm=Restricted")
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		}
	}
}

// Function for authenticating, JWT Auth, Enabled on all routes except login
func JWTAuth(h httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		// Get the token from the request header
		ss := r.Header.Get("Authorization")

		// Use CheckToken function to check token in database for existence and expiration
		if !CheckToken(ss) {
			// Setup error response
			response := ResponseError{
				Success: false,
				Error:   "Bad token",
			}

			// Marshal into JSON
			responseJson, err := json.Marshal(response)
			if err != nil {
				fmt.Println(err)
			}

			// Send error response to user in JSON
			fmt.Fprintf(w, "%s\n", responseJson)
			return
		}

		// Verifies signing method
		afterVerificationToken, err := jwt.ParseWithClaims(ss, &MyCustomClaims{}, func(beforeVerificationToken *jwt.Token) (interface{}, error) {
			if beforeVerificationToken.Method.Alg() != jwt.SigningMethodHS256.Alg() {
				return nil, fmt.Errorf("changed signing method")
			}
			return mySigningKey, nil
		})

		isEqual := err == nil && afterVerificationToken.Valid
		if isEqual {
			// Forwards to the given route if the token is valid
			h(w, r, ps)
		} else {
			// Setup error response
			response := ResponseError{
				Success: false,
				Error:   "Bad token",
			}

			// Marshal into JSON
			responseJson, err := json.Marshal(response)
			if err != nil {
				fmt.Println(err)
			}

			// Send error response to user in JSON
			fmt.Fprintf(w, "%s\n", responseJson)
			return
		}
	}
}

// Function for generating a JWT and providing it to the login route
func createToken(user string) (string, error) {
	// Create the claims
	claims := MyCustomClaims{
		user,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Minute * 1440).Unix(),
			Issuer:    "test",
		},
	}

	// Create the token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString(mySigningKey)
	return ss, err
}

// Function for adding a new token to the database
func AddToken(token string, username string) {
	// Time settings
	now := time.Now()
	epoch := now.Unix()
	expiration := epoch + 86400

	// Load the env file
	err := godotenv.Load("variables.env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	// Get the Mongo DB environment variable
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		fmt.Println("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect to the Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		fmt.Println(err)
	}

	// Close the database connection at the end of the function
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			fmt.Println(err)
		}
	}()

	// Set the database name and collection name
	coll := client.Database("go_project1").Collection("tokens")

	// Setup a result variable to check if the user already exists in the database
	var result bson.M

	// Query the database to see if the user already exists
	err = coll.FindOne(context.TODO(), bson.D{{"Token", token}}).Decode(&result)
	// If the token exists in the database, update it
	if err != mongo.ErrNoDocuments {
		filter := bson.D{{"Token", token}}
		update := bson.D{{"$set", bson.D{{"Username", username}, {"Expiration", expiration}}}}
		_, err := coll.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			fmt.Println(err)
		}
		return
	}

	// Insert the token into the database with the expiration
	doc := bson.D{{"Username", username}, {"Token", token}, {"Expiration", expiration}}
	_, err = coll.InsertOne(context.TODO(), doc)
	if err != nil {
		fmt.Println(err)
	}
	return
}

// Function for checking token, for verifying a token is authentic, or not expired
func CheckToken(token string) bool {
	type TokenStruct struct {
		Username   string `bson:"Username" json:"Username"`
		Token      string `bson:"Token" json:"Token"`
		Expiration int64  `bson:"Expiration" json:"Expiration"`
	}

	// Time settings
	now := time.Now()
	epoch := now.Unix()

	// Load the env file
	err := godotenv.Load("variables.env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	// Get MongoDB environment variable for connecting to database
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		fmt.Println("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect to Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		fmt.Println(err)
	}

	// Close the database connection at the end of the function call
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			fmt.Println(err)
		}
	}()

	// Set the database name and collection name
	coll := client.Database("go_project1").Collection("tokens")

	// A variable to put the database result into
	var result TokenStruct

	// Query the database for the provided username, send a error response if no user is found
	err = coll.FindOne(context.TODO(), bson.D{{"Token", token}}).Decode(&result)
	// If no token is found in database
	if err == mongo.ErrNoDocuments {
		return false
	}

	// Find expiration time of given token
	expiration := result.Expiration

	// Check if token is expired
	if expiration <= epoch {
		return false
	}

	// If all checks pass, return true, token valid
	return true
}

func GetTokenUsername(token string) string {
	// Struct for token database results
	type TokenStruct struct {
		Username   string `bson:"Username" json:"Username"`
		Token      string `bson:"Token" json:"Token"`
		Expiration int64  `bson:"Expiration" json:"Expiration"`
	}

	// Load the env file
	err := godotenv.Load("variables.env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	// Get MongoDB environment variable for connecting to database
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		fmt.Println("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect to Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		fmt.Println(err)
	}

	// Close the database connection at the end of the function call
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			fmt.Println(err)
		}
	}()

	// Set the database name and collection name
	coll := client.Database("go_project1").Collection("tokens")

	// A variable to put the database result into
	var result TokenStruct

	// Query the database for the provided username, send a error response if no user is found
	err = coll.FindOne(context.TODO(), bson.D{{"Token", token}}).Decode(&result)
	// If no document is found
	if err == mongo.ErrNoDocuments {
		return ""
	}

	// Return the username found in the database
	return result.Username
}

// Function for converting a csv file to xlsx
func generateXLSXFromCSV(csvPath string, XLSXPath string, delimiter string) error {
	// Open file
	csvFile, err := os.Open(csvPath)
	if err != nil {
		return err
	}

	// Close file at the end of the function
	defer csvFile.Close()

	// Setup a csv reader for the file
	reader := csv.NewReader(csvFile)

	// Check or assign the delimiter
	if len(delimiter) > 0 {
		reader.Comma = rune(delimiter[0])
	} else {
		reader.Comma = rune(';')
	}

	// Create a new xlsx file
	xlsxFile := xlsx.NewFile()

	// Setup the sheet in the xlsx file
	sheet, err := xlsxFile.AddSheet("Sheet1")
	if err != nil {
		return err
	}

	// Read the csv file, then write it to the xlsx file
	fields, err := reader.Read()
	for err == nil {
		row := sheet.AddRow()
		for _, field := range fields {
			if field == "" {
				newField := "none"
				cell := row.AddCell()
				cell.Value = newField
			} else {
				cell := row.AddCell()
				cell.Value = field
			}
		}
		fields, err = reader.Read()
	}
	if err != nil {
		fmt.Printf(err.Error())
	}

	// Return the path of the saved xlsx file
	return xlsxFile.Save(XLSXPath)
}

// Route: Login, Protected by BasicAuth, takes a username and password in request body
func RouteLogin(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	// Set content-type to JSON
	w.Header().Set("Content-Type", "application/json")

	type ResponseLogin struct {
		Success bool   `json:"Success"`
		Data    string `json:"Data"`
		Token   string `json:"Token"`
	}

	type LoginType struct {
		Username string `json:"Username"`
		Password string `json:"Password"`
	}

	// Declare a new LoginType struct.
	var p1 LoginType

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&p1)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Assign username and password variables from request body
	username := p1.Username
	password := p1.Password

	// Load the env file
	err = godotenv.Load("variables.env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	// Get MongoDB environment variable for connecting to database
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		fmt.Println("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect to Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		fmt.Println(err)
	}

	// Close the database connection at the end of the function call
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			fmt.Println(err)
		}
	}()

	// Set the database name and collection name
	coll := client.Database("go_project1").Collection("users")

	// A variable to put the database result into
	var result bson.M

	// Query the database for the provided username, send a error response if no user is found
	err = coll.FindOne(context.TODO(), bson.D{{"username", username}}).Decode(&result)
	// If no document is found
	if err == mongo.ErrNoDocuments {
		response := ResponseError{
			Success: false,
			Error:   "No user found",
		}

		// Marshal into JSON
		responseJson, err := json.Marshal(response)
		if err != nil {
			fmt.Println(err)
		}

		// Send error response to user in JSON
		fmt.Fprintf(w, "%s\n", responseJson)
		return
	}

	// Get hashed password from database query result
	var hashedPassword = result["password"]
	passwordObject := hashedPassword.(primitive.Binary).Data

	// Compare hashed password to request body password
	err = bcrypt.CompareHashAndPassword(passwordObject, []byte(password))
	// If password does not match, send error response
	if err != nil {
		response := ResponseError{
			Success: false,
			Error:   "Bad password",
		}

		// Marshal into JSON
		responseJson, err := json.Marshal(response)
		if err != nil {
			fmt.Println(err)
		}

		// Send error response to user in JSON
		fmt.Fprintf(w, "%s\n", responseJson)
		return
	}

	// Last Login Time
	now := time.Now()
	timeFormat := fmt.Sprint(now.Month(), now.Day(), now.Year(), now.Hour(), ":", now.Minute())

	// Update user's database with current last login time
	filter := bson.D{{"username", username}}
	update := bson.D{{"$set", bson.D{{"LastLogin", timeFormat}}}}
	_, err = coll.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		fmt.Println(err)
	}

	// After verifying user exists, and provided password is correct, create the token
	token, err := createToken(username)
	if err != nil {
		fmt.Println(err)
	}

	// Add token to database for future verification
	AddToken(token, username)

	// Setup ResponseLogin struct variable to provide in response
	response := ResponseLogin{
		Success: true,
		Data:    "Logged In!",
		Token:   token,
	}

	// Marshal into JSON
	responseJson, err := json.Marshal(response)
	if err != nil {
		fmt.Println(err)
	}

	// Send success response with token to user
	fmt.Fprintf(w, "%s\n", responseJson)
}

// Route: Get Users, for getting a list of users
func RouteGetUsers(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	// Set content-type to JSON
	w.Header().Set("Content-Type", "application/json")

	type Data struct {
		Username  string `bson:"username" json:"username"`
		LastLogin string `bson:"LastLogin" json:"LastLogin"`
	}

	type Response struct {
		Success bool   `json:"Success"`
		Data    []Data `json:"Data"`
	}

	// Load the env file
	err := godotenv.Load("variables.env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	// Get Mongo DB environment variable
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		fmt.Println("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect to Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		fmt.Println(err)
	}

	// Close the database connection at the end of the function
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			fmt.Println(err)
		}
	}()

	// Select the database name and collection name
	coll := client.Database("go_project1").Collection("users")

	// Query the database for the user list
	cursor, err := coll.Find(context.TODO(), bson.D{})
	// If no documents were found, send a response and return
	if err == mongo.ErrNoDocuments {
		response := ResponseError{
			Success: false,
			Error:   "No users found",
		}

		// Marshal into JSON
		responseJson, err := json.Marshal(response)
		if err != nil {
			fmt.Println(err)
		}

		// Send error response to the user in JSON, then return
		fmt.Fprintf(w, "%s\n", responseJson)
		return
	}

	// Setup a variable for the database results
	var data []Data

	// Send all database results to data variable
	if err = cursor.All(context.TODO(), &data); err != nil {
		fmt.Println(err)
	}

	// Setup a variable with the Response struct
	response := Response{
		Success: true,
		Data:    data,
	}

	// Marshal into JSON
	responseJson, err := json.Marshal(response)
	if err != nil {
		fmt.Println(err)
	}

	// Send success response to user in JSON
	fmt.Fprintf(w, "%s\n", responseJson)
}

// Route: New User, for creating a new user, adds user to database, password is hashed. Takes a username and password in the request body
func RouteNewUser(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	// Set content-type to JSON
	w.Header().Set("Content-Type", "application/json")

	type NewUser struct {
		Username string `json:"Username"`
		Password string `json:"Password"`
	}

	// Declare a new NewUser struct.
	var p1 NewUser

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&p1)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Setup username and password variables from request body
	username := p1.Username
	password := p1.Password

	// Hash the password and store it in a variable
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		response := ResponseError{
			Success: false,
			Error:   "Error hashing password",
		}

		// Marshal into JSON
		responseJson, err := json.Marshal(response)
		if err != nil {
			fmt.Println(err)
		}

		// Send error response to the user in JSON, then return
		fmt.Fprintf(w, "%s\n", responseJson)
		return
	}

	// Load the env file
	err = godotenv.Load("variables.env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	// Get the Mongo DB environment variable
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		fmt.Println("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect to the Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		fmt.Println(err)
	}

	// Close the database connection at the end of the function
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			fmt.Println(err)
		}
	}()

	// Set the database name and collection name
	coll := client.Database("go_project1").Collection("users")

	// Setup a result variable to check if the user already exists in the database
	var result bson.M

	// Query the database to see if the user already exists
	err = coll.FindOne(context.TODO(), bson.D{{"username", username}}).Decode(&result)
	// Send error response if the user exists
	if err != mongo.ErrNoDocuments {
		response := ResponseError{
			Success: false,
			Error:   "User exists",
		}

		// Marshal into JSON
		responseJson, err := json.Marshal(response)
		if err != nil {
			fmt.Println(err)
		}

		// Send error response to the user in JSON, then return
		fmt.Fprintf(w, "%s\n", responseJson)
		return
	}

	// Insert the user into the database with the hashed password
	doc := bson.D{{"username", username}, {"password", hashedPassword}, {"LastLogin", "Never"}}
	_, err = coll.InsertOne(context.TODO(), doc)
	if err != nil {
		fmt.Println(err)
	}

	// Send success response to the user in JSON
	output, _ := json.Marshal(map[string]bool{"Success": true})
	fmt.Fprintf(w, "%s\n", output)
}

// Route: Delete User
func RouteDeleteUser(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	// Set content-type to JSON
	w.Header().Set("Content-Type", "application/json")

	type DeleteUser struct {
		Username string `json:"Username"`
		Token    string `json:"Token"`
	}

	// Declare a new DeleteUser struct.
	var p1 DeleteUser

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&p1)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Setup username and password variables from request body
	username := p1.Username
	token := p1.Token

	// Get information from the provided token: current user
	tokenUser := GetTokenUsername(token)

	// Check if user is trying to delete their own account
	if tokenUser == username {
		response := ResponseError{
			Success: false,
			Error:   "Can not delete self",
		}

		// Marshal into JSON
		responseJson, err := json.Marshal(response)
		if err != nil {
			fmt.Println(err)
		}

		// Send error response to user in JSON
		fmt.Fprintf(w, "%s\n", responseJson)
		return
	}

	// Load the env file
	err = godotenv.Load("variables.env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	// Get the Mongo DB environment variable
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		fmt.Println("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect to the Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		fmt.Println(err)
	}

	// Close the database connection at the end of the function
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			fmt.Println(err)
		}
	}()

	// Set the database name and collection name
	coll := client.Database("go_project1").Collection("users")

	// Delete the user from the database
	filter := bson.D{{"username", username}}
	_, err = coll.DeleteOne(context.TODO(), filter)
	if err != nil {
		fmt.Println(err)
	}

	// Send success response to the user in JSON
	output, _ := json.Marshal(map[string]bool{"Success": true})
	fmt.Fprintf(w, "%s\n", output)
}

// Route for changing the user's account password
func RouteMyPassword(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	// Set content-type to JSON
	w.Header().Set("Content-Type", "application/json")

	type MyPass struct {
		Password    string `json:"password"`
		NewPassword string `json:"newPassword"`
		Session     string `json:"session"`
	}

	// Declare a new MyPass struct.
	var p1 MyPass

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&p1)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Assign username and password variables from request body
	password := p1.Password
	newPassword := p1.NewPassword
	token := p1.Session

	// Hash the password and store it in a variable
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), 14)
	if err != nil {
		response := ResponseError{
			Success: false,
			Error:   "Error hashing password",
		}

		// Marshal into JSON
		responseJson, err := json.Marshal(response)
		if err != nil {
			fmt.Println(err)
		}

		// Send error response to user in JSON
		fmt.Fprintf(w, "%s\n", responseJson)
		return
	}

	// Get data from provided token: current user
	username := GetTokenUsername(token)

	if username == "" {
		response := ResponseError{
			Success: false,
			Error:   "Invalid token, no user found",
		}

		// Marshal into JSON
		responseJson, err := json.Marshal(response)
		if err != nil {
			fmt.Println(err)
		}

		// Send error response to user in JSON
		fmt.Fprintf(w, "%s\n", responseJson)
		return
	}

	// Load the env file
	err = godotenv.Load("variables.env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	// Get MongoDB environment variable for connecting to database
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		fmt.Println("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect to Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		fmt.Println(err)
	}

	// Close the database connection at the end of the function call
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			fmt.Println(err)
		}
	}()

	// Set the database name and collection name
	coll := client.Database("go_project1").Collection("users")

	// Setup a result2 variable to check if the user already exists in the database
	var result2 bson.M

	// Query the database to see if the user already exists
	err = coll.FindOne(context.TODO(), bson.D{{"username", username}}).Decode(&result2)
	// Send error response if the user exists
	if err != mongo.ErrNoDocuments {
		// Get current hashed password from database query result
		var currentHashedPassword = result2["password"]
		passwordObject := currentHashedPassword.(primitive.Binary).Data

		// Compare hashed password to request body password
		err = bcrypt.CompareHashAndPassword(passwordObject, []byte(password))
		// If password does not match, send error response
		if err != nil {
			response := ResponseError{
				Success: false,
				Error:   "Bad password",
			}

			// Marshal into JSON
			responseJson, err := json.Marshal(response)
			if err != nil {
				fmt.Println(err)
			}

			// Send error response to user in JSON
			fmt.Fprintf(w, "%s\n", responseJson)
			return
		}

	}

	// Update password in database with hashed password
	filter := bson.D{{"username", username}}
	update := bson.D{{"$set", bson.D{{"password", hashedPassword}}}}
	_, err = coll.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		fmt.Println(err)
	}

	// Send success response to the user in JSON
	output, _ := json.Marshal(map[string]bool{"Success": true})
	fmt.Fprintf(w, "%s\n", output)
}

// Route for uploading spreadsheet files to be analyed
func RouteUpload(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// Set response type
	w.Header().Set("Content-Type", "application/json")

	// Max file size
	r.ParseMultipartForm(16 * 1024 * 1024) // 16MB
	file, handler, err := r.FormFile("file")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Create an empty file on filesystem
	f, err := os.OpenFile(filepath.Join("uploads", handler.Filename), os.O_WRONLY|os.O_CREATE, 0666)

	// Copy the file to the uploads directory
	io.Copy(f, file)

	type MyLine struct {
		Label           string   `json:"label"`
		Data            []string `json:"data"`
		BorderColor     string   `json:"borderColor"`
		BackgroundColor string   `json:"backgroundColor"`
	}

	type MyData struct {
		Labels []string `json:"labels"`
		Data   []MyLine `json:"data"`
	}

	type MyFile struct {
		Success bool   `json:"Success"`
		Data    MyData `json:"data"`
	}

	// Setup variable data holders with proper structs
	var myLine MyLine
	var myData MyData
	var myFile MyFile

	// Set path to uploaded file
	path := "uploads/" + handler.Filename

	// Check the file extension, only csv and xlsx allowed
	ext := strings.Split(handler.Filename, ".")
	if ext[1] != "csv" && ext[1] != "xlsx" {
		// If file extension is not allowed, send error response
		response := ResponseError{
			Success: false,
			Error:   "Bad extension",
		}

		// Marshal into JSON
		responseJson, err := json.Marshal(response)
		if err != nil {
			fmt.Println(err)
		}

		// Send error response to the user in JSON, then return
		fmt.Fprintf(w, "%s\n", responseJson)
		return
	}

	// Do this if it is a csv file
	if handler.Header.Get("Content-Type") == "text/csv" {

		// Setup path to convert csv file to xlsx
		xlsxPath := "uploads/" + ext[0] + ".xlsx"

		// Convert file from csv to xlsx
		err := generateXLSXFromCSV(path, xlsxPath, ",")
		if err != nil {
			fmt.Println(err)
			response := ResponseError{
				Success: false,
				Error:   "Error opening file",
			}

			// Marshal into JSON
			responseJson, err := json.Marshal(response)
			if err != nil {
				fmt.Println(err)
			}

			// Send error response to the user in JSON, then return
			fmt.Fprintf(w, "%s\n", responseJson)
			return
		}

		// Initialize variable for no header line in spreadsheet
		noHeader := false

		// Open the xlsx file
		fxlsx, err := excelize.OpenFile(xlsxPath)
		if err != nil {
			fmt.Println(err)
			response := ResponseError{
				Success: false,
				Error:   "Error opening file",
			}

			// Marshal into JSON
			responseJson, err := json.Marshal(response)
			if err != nil {
				fmt.Println(err)
			}

			// Send error response to the user in JSON, then return
			fmt.Fprintf(w, "%s\n", responseJson)
			return
		}

		// Get all the rows in the Sheet1
		cols, err := fxlsx.GetCols("Sheet1")
		if err != nil {
			fmt.Println(err)
			response := ResponseError{
				Success: false,
				Error:   "Error opening file",
			}

			// Marshal into JSON
			responseJson, err := json.Marshal(response)
			if err != nil {
				fmt.Println(err)
			}

			// Send error response to the user in JSON, then return
			fmt.Fprintf(w, "%s\n", responseJson)
			return
		}

		// Iterate over all columns
		for i, col := range cols {

			// If at column 0
			if i == 0 {
				for j, field := range col {
					if j == 0 {
						// Check if header line exists
						if field != "none" {
							if !unicode.IsLetter(rune(field[1])) {
								fmt.Println("Inside: Is Not Letter")
								noHeader = true
								for _, field2 := range col {
									myData.Labels = append(myData.Labels, field2)
								}
							} else {
								fmt.Println("Inside: Is Letter")
								for x, field2 := range col {
									if x != 0 {
										myData.Labels = append(myData.Labels, field2)
									}
								}
							}
						} else {
							fmt.Println("Inside: Line is empty")
							for x, field2 := range col {
								if x != 0 {
									myData.Labels = append(myData.Labels, field2)
								}
							}
						}
					}
				}
				// If not at column 0
			} else {
				// Do this if file is determined to not have a header liner
				if noHeader {
					fmt.Println("Inside No Header")
					for _, field := range col {
						myLine.Label = strconv.Itoa(i)
						myLine.Data = append(myLine.Data, field)
					}
					myLine.BorderColor = "none"
					myLine.BackgroundColor = "none"
					myData.Data = append(myData.Data, myLine)
					// Do this if file has a header line
				} else {
					fmt.Println("Inside Has Header")
					for j, field := range col {
						if j == 0 {
							myLine.Label = field
						} else {
							myLine.Data = append(myLine.Data, field)
						}
					}
					myLine.BorderColor = "none"
					myLine.BackgroundColor = "none"
					myData.Data = append(myData.Data, myLine)
				}
			}
			// Clear Data variable for next iteration
			myLine.Data = []string{}
		}
		// Setup response struct
		myFile.Data = myData
		myFile.Success = true

		// Close the file
		fxlsx.Close()

		// Remove the file from the system
		err = os.Remove(xlsxPath)
		if err != nil {
			fmt.Println(err)
		}

		// Do this if file is not csv
	} else {

		// Initialize no header variable
		noHeader := false

		// Open the xlsx file
		fxlsx, err := excelize.OpenFile(path)
		if err != nil {
			fmt.Println(err)
			response := ResponseError{
				Success: false,
				Error:   "Error opening file",
			}

			// Marshal into JSON
			responseJson, err := json.Marshal(response)
			if err != nil {
				fmt.Println(err)
			}

			// Send error response to the user in JSON, then return
			fmt.Fprintf(w, "%s\n", responseJson)
			return
		}

		// Get all the rows in the Sheet1.
		cols, err := fxlsx.GetCols("Sheet1")
		if err != nil {
			fmt.Println(err)
			response := ResponseError{
				Success: false,
				Error:   "Error opening file",
			}

			// Marshal into JSON
			responseJson, err := json.Marshal(response)
			if err != nil {
				fmt.Println(err)
			}

			// Send error response to the user in JSON, then return
			fmt.Fprintf(w, "%s\n", responseJson)
			return
		}

		// Iterate over all columns
		for i, col := range cols {

			// If on column 0
			if i == 0 {
				for j, field := range col {
					if j == 0 {
						// Check if file has a header line
						if field != "" {
							fmt.Printf("%T\n", field[0])
							if !unicode.IsLetter(rune(field[0])) {
								fmt.Println("Inside: Is Not Letter")
								noHeader = true
								for _, field2 := range col {
									myData.Labels = append(myData.Labels, field2)
								}
							} else {
								fmt.Println("Inside: Is Letter")
								for x, field2 := range col {
									if x != 0 {
										myData.Labels = append(myData.Labels, field2)
									}
								}
							}
						} else {
							fmt.Println("Inside: Line is empty")
							for x, field2 := range col {
								if x != 0 {
									myData.Labels = append(myData.Labels, field2)
								}
							}
						}
					}
				}
				// If not on column 0
			} else {
				// If file does not have a header line
				if noHeader {
					fmt.Println("Inside No Header")
					for _, field := range col {
						myLine.Label = strconv.Itoa(i)
						myLine.Data = append(myLine.Data, field)
					}
					myLine.BorderColor = "none"
					myLine.BackgroundColor = "none"
					myData.Data = append(myData.Data, myLine)
					// If file has a header line
				} else {
					fmt.Println("Inside Has Header")
					for j, field := range col {
						if j == 0 {
							myLine.Label = field
						} else {
							myLine.Data = append(myLine.Data, field)
						}
					}
					myLine.BorderColor = "none"
					myLine.BackgroundColor = "none"
					myData.Data = append(myData.Data, myLine)
				}
			}
			// Clear data variable for next iteration
			myLine.Data = []string{}
		}

		// Setup response data
		myFile.Data = myData
		myFile.Success = true

		// Close file
		fxlsx.Close()

	}

	// Load the env file
	err = godotenv.Load("variables.env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	// Get the Mongo DB environment variable
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		fmt.Println("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect to the Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		fmt.Println(err)
	}

	// Close the database connection at the end of the function
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			fmt.Println(err)
		}
	}()

	// Set the database name and collection name
	coll := client.Database("go_project1").Collection("graphs")

	// Last Login Time
	now := time.Now()
	timeFormat := fmt.Sprint(now.Month(), now.Day(), now.Year(), now.Hour(), ":", now.Minute())

	// Insert the graph into the database
	doc := bson.D{{"Timestamp", timeFormat}, {"GraphData", myData}}
	_, err = coll.InsertOne(context.TODO(), doc)
	if err != nil {
		fmt.Println(err)
	}

	// Close files
	f.Close()
	file.Close()

	// Remove file from system
	err = os.Remove(path)
	if err != nil {
		fmt.Println(err)
	}

	// Marshal into JSON
	responseJson, err := json.Marshal(myFile)
	if err != nil {
		fmt.Println(err)
	}

	// Send success response to user in JSON
	fmt.Fprintf(w, "%s\n", responseJson)
}

// Route: Get Graphs, for getting a list of graphs
func RouteGetGraphs(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	// Set content-type to JSON
	w.Header().Set("Content-Type", "application/json")

	type TempData struct {
		ID        primitive.ObjectID `bson:"_id" json:"_id"`
		Timestamp string             `bson:"Timestamp" json:"Timestamp"`
	}

	type Response struct {
		Success bool       `json:"Success"`
		Data    []TempData `json:"Data"`
	}

	// Load the env file
	err := godotenv.Load("variables.env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	// Get Mongo DB environment variable
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		fmt.Println("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect to Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		fmt.Println(err)
	}

	// Close the database connection at the end of the function
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			fmt.Println(err)
		}
	}()

	// Select the database name and collection name
	coll := client.Database("go_project1").Collection("graphs")

	opts := options.Find().SetSort(bson.D{{"_id", -1}})

	// Query the database for the user list
	cursor, err := coll.Find(context.TODO(), bson.D{}, opts)
	// If no documents were found, send a response and return
	if err == mongo.ErrNoDocuments {
		response := ResponseError{
			Success: false,
			Error:   "No graphs found",
		}

		// Marshal into JSON
		responseJson, err := json.Marshal(response)
		if err != nil {
			fmt.Println(err)
		}

		// Send error response to the user in JSON, then return
		fmt.Fprintf(w, "%s\n", responseJson)
		return
	}

	// Setup a variable for the database results
	var data []TempData

	// Send all database results to data variable
	if err = cursor.All(context.TODO(), &data); err != nil {
		fmt.Println(err)
	}

	// Setup a variable with the Response struct
	response := Response{
		Success: true,
		Data:    data,
	}

	// Marshal into JSON
	responseJson, err := json.Marshal(response)
	if err != nil {
		fmt.Println(err)
	}

	// Send success response to user in JSON
	fmt.Fprintf(w, "%s\n", responseJson)
}

// Route: Get Graph, for getting data on a saved graph
func RouteGetGraph(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	// Set content-type to JSON
	w.Header().Set("Content-Type", "application/json")

	type NewGraph struct {
		ID string `json:"ID"`
	}

	type Response struct {
		Success bool   `json:"Success"`
		Data    bson.M `json:"Data"`
	}

	// Declare a new NewGraph struct.
	var p1 NewGraph

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&p1)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Setup username and password variables from request body
	graphID := p1.ID
	graphObjID, err := primitive.ObjectIDFromHex(graphID)
	if err != nil {
		response := ResponseError{
			Success: false,
			Error:   "An error occured",
		}

		// Marshal into JSON
		responseJson, err := json.Marshal(response)
		if err != nil {
			fmt.Println(err)
		}

		// Send error response to the user in JSON, then return
		fmt.Fprintf(w, "%s\n", responseJson)
		return
	}

	// Load the env file
	err = godotenv.Load("variables.env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	// Get the Mongo DB environment variable
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		fmt.Println("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect to the Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		fmt.Println(err)
	}

	// Close the database connection at the end of the function
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			fmt.Println(err)
		}
	}()

	// Set the database name and collection name
	coll := client.Database("go_project1").Collection("graphs")

	// Setup a result variable to check if the user already exists in the database
	var result bson.M

	// Query the database to see if the user already exists
	err = coll.FindOne(context.TODO(), bson.D{{"_id", graphObjID}}).Decode(&result)
	// Send error response if the user exists
	if err == mongo.ErrNoDocuments {
		response := ResponseError{
			Success: false,
			Error:   "Graph not found",
		}

		// Marshal into JSON
		responseJson, err := json.Marshal(response)
		if err != nil {
			fmt.Println(err)
		}

		// Send error response to the user in JSON, then return
		fmt.Fprintf(w, "%s\n", responseJson)
		return
	}

	// Setup a variable with the Response struct
	response := Response{
		Success: true,
		Data:    result,
	}

	// Marshal into JSON
	responseJson, err := json.Marshal(response)
	if err != nil {
		fmt.Println(err)
	}

	// Send error response to the user in JSON, then return
	fmt.Fprintf(w, "%s\n", responseJson)
	return
}

// Route: Delete Graph from database
func RouteDeleteGraph(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	// Set content-type to JSON
	w.Header().Set("Content-Type", "application/json")

	type DeleteGraph struct {
		ID string `json:"_id"`
	}

	// Declare a new DeleteGraph struct.
	var p1 DeleteGraph

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&p1)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Setup username and password variables from request body
	id := p1.ID
	graphID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		response := ResponseError{
			Success: false,
			Error:   "An error occured",
		}

		// Marshal into JSON
		responseJson, err := json.Marshal(response)
		if err != nil {
			fmt.Println(err)
		}

		// Send error response to the user in JSON, then return
		fmt.Fprintf(w, "%s\n", responseJson)
		return
	}

	// Load the env file
	err = godotenv.Load("variables.env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	// Get the Mongo DB environment variable
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		fmt.Println("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect to the Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		fmt.Println(err)
	}

	// Close the database connection at the end of the function
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			fmt.Println(err)
		}
	}()

	// Set the database name and collection name
	coll := client.Database("go_project1").Collection("graphs")

	// Delete the graph from the database
	filter := bson.D{{"_id", graphID}}
	_, err = coll.DeleteOne(context.TODO(), filter)
	if err != nil {
		fmt.Println(err)
	}

	// Send success response to the user in JSON
	output, _ := json.Marshal(map[string]bool{"Success": true})
	fmt.Fprintf(w, "%s\n", output)
}

func RouteAutoLogin(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	// Auto checks token in header

	// Send success response to the user in JSON
	output, _ := json.Marshal(map[string]bool{"Success": true})
	fmt.Fprintf(w, "%s\n", output)
}

func main() {
	// BasicAuth username and password
	user := "kyle"
	pass := "bessemer!"

	// HTTPRouter Settings and Routes
	router := httprouter.New()
	router.POST("/login/", BasicAuth(RouteLogin, user, pass))
	router.GET("/getusers/", JWTAuth(RouteGetUsers))
	router.POST("/newuser/", JWTAuth(RouteNewUser))
	router.POST("/deleteuser/", JWTAuth(RouteDeleteUser))
	router.POST("/mypassword/", JWTAuth(RouteMyPassword))
	router.POST("/upload/", JWTAuth(RouteUpload))
	router.GET("/getgraphs/", JWTAuth(RouteGetGraphs))
	router.POST("/graph/", JWTAuth(RouteGetGraph))
	router.POST("/deletegraph/", JWTAuth(RouteDeleteGraph))
	router.GET("/autologin/", JWTAuth(RouteAutoLogin))

	handler := cors.AllowAll().Handler(router)
	fmt.Println(http.ListenAndServe(":8081", handler))
}
