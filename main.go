package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

type ResponseLogin struct {
	Success bool   `json:"Success"`
	Data    string `json:"Data"`
	Token   string `json:"Token"`
}

type ResponseStandard struct {
	Success bool   `json:"Success"`
	Data    string `json:"Data"`
}

type ResponseError struct {
	Success bool   `json:"Success"`
	Error   string `json:"Error"`
}

type LoginType struct {
	Username string `json:"Username"`
	Password string `json:"Password"`
}

type TokenType struct {
	Token string `json:"Token"`
}

type NewUser struct {
	Username string `json:"Username"`
	Password string `json:"Password"`
}

type MyCustomClaims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

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
			ExpiresAt: time.Now().Add(time.Minute * 600).Unix(),
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
	now := time.Now()
	epoch := now.Unix()
	expiration := epoch + 86400

	// Load the env file
	err := godotenv.Load("variables.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Get the Mongo DB environment variable
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Fatal("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect to the Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	// Close the database connection at the end of the function
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	// Set the database name and collection name
	coll := client.Database("go_project1").Collection("tokens")

	// Setup a result variable to check if the user already exists in the database
	var result bson.M

	// Query the database to see if the user already exists
	err = coll.FindOne(context.TODO(), bson.D{{"Token", token}}).Decode(&result)
	// Send error response if the user exists
	if err != mongo.ErrNoDocuments {
		filter := bson.D{{"Token", token}}
		update := bson.D{{"$set", bson.D{{"Username", username}, {"Expiration", expiration}}}}
		_, err := coll.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			panic(err)
		}
		return
	}

	// Insert the user into the database with the hashed password
	doc := bson.D{{"Username", username}, {"Token", token}, {"Expiration", expiration}}
	_, err = coll.InsertOne(context.TODO(), doc)
	if err != nil {
		panic(err)
	}
	return
}

// Function for checking token, for verifying a token is authentic, or not expired
func CheckToken(token string) bool {
	now := time.Now()
	epoch := now.Unix()

	// Load the env file
	err := godotenv.Load("variables.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Get MongoDB environment variable for connecting to database
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Fatal("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect go Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	// Close the database connection at the end of the function call
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	// Set the database name and collection name
	coll := client.Database("go_project1").Collection("tokens")

	type TokenStruct struct {
		Username   string `bson:"Username" json:"Username"`
		Token      string `bson:"Token" json:"Token"`
		Expiration int64  `bson:"Expiration" json:"Expiration"`
	}

	// A variable to put the database result into
	var result TokenStruct

	// Query the database for the provided username, send a error response if no user is found
	err = coll.FindOne(context.TODO(), bson.D{{"Token", token}}).Decode(&result)
	// If no document is found
	if err == mongo.ErrNoDocuments {
		return false
	}

	expiration := result.Expiration

	if expiration <= epoch {
		return false
	}

	return true
}

func GetTokenUsername(token string) string {
	// Load the env file
	err := godotenv.Load("variables.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Get MongoDB environment variable for connecting to database
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Fatal("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect go Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	// Close the database connection at the end of the function call
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	// Set the database name and collection name
	coll := client.Database("go_project1").Collection("tokens")

	// Struct for token database results
	type TokenStruct struct {
		Username   string `bson:"Username" json:"Username"`
		Token      string `bson:"Token" json:"Token"`
		Expiration int64  `bson:"Expiration" json:"Expiration"`
	}

	// A variable to put the database result into
	var result TokenStruct

	// Query the database for the provided username, send a error response if no user is found
	err = coll.FindOne(context.TODO(), bson.D{{"Token", token}}).Decode(&result)
	// If no document is found
	if err == mongo.ErrNoDocuments {
		return ""
	}

	return result.Username
}

// Route: Login, Protected by BasicAuth, takes a username and password in request body
func RouteLogin(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	// Set content-type to JSON
	w.Header().Set("Content-Type", "application/json")

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
		log.Fatal("Error loading .env file")
	}

	// Get MongoDB environment variable for connecting to database
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Fatal("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect go Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	// Close the database connection at the end of the function call
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
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

	filter := bson.D{{"username", username}}
	update := bson.D{{"$set", bson.D{{"LastLogin", timeFormat}}}}
	_, err = coll.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		panic(err)
	}

	// After verifying user exists, and provided password is correct, create the token
	token, err := createToken(username)
	if err != nil {
		fmt.Println(err)
	}

	AddToken(token, username)

	// Setup ResponseLogin struct variable to provide in response
	response := ResponseLogin{
		Success: true,
		Data:    "Logged In! " + username,
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
		log.Fatal("Error loading .env file")
	}

	// Get Mongo DB environment variable
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Fatal("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect to Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	// Close the database connection at the end of the function
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	// Select the database name and collection name
	coll := client.Database("go_project1").Collection("users")

	// Query the database for the user list
	cursor, err := coll.Find(context.TODO(), bson.D{})
	// If no documents were found, send a response and return
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No documents were found")
		return
	}

	// Setup a variable for the database results
	var data []Data

	// Send all database results to results variable
	if err = cursor.All(context.TODO(), &data); err != nil {
		panic(err)
	}

	// Setup a variable with the ResponseStandard struct
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

	// Load the env file
	err = godotenv.Load("variables.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Get the Mongo DB environment variable
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Fatal("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect to the Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	// Close the database connection at the end of the function
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
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
		panic(err)
	}

	// Send success response to the user in JSON
	output, _ := json.Marshal(map[string]bool{"Success": true})
	fmt.Fprintf(w, "%s\n", output)
}

// Route: New User, for creating a new user, adds user to database, password is hashed. Takes a username and password in the request body
func RouteDeleteUser(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	// Set content-type to JSON
	w.Header().Set("Content-Type", "application/json")

	type DeleteUser struct {
		Username string `json:"Username"`
	}

	// Declare a new NewUser struct.
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

	// Load the env file
	err = godotenv.Load("variables.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Get the Mongo DB environment variable
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Fatal("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect to the Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	// Close the database connection at the end of the function
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	// Set the database name and collection name
	coll := client.Database("go_project1").Collection("users")

	filter := bson.D{{"username", username}}
	_, err = coll.DeleteOne(context.TODO(), filter)
	if err != nil {
		panic(err)
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

	// Declare a new LoginType struct.
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

	username := GetTokenUsername(token)

	if username == "" {
		response := ResponseError{
			Success: false,
			Error:   "Invalid token",
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
		log.Fatal("Error loading .env file")
	}

	// Get MongoDB environment variable for connecting to database
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Fatal("You must set your 'MONGO_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}

	// Connect go Mongo Database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	// Close the database connection at the end of the function call
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
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
		panic(err)
	}

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

	handler := cors.AllowAll().Handler(router)
	log.Fatal(http.ListenAndServe(":8081", handler))
}
