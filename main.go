package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
	"github.com/julienschmidt/httprouter"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"os"
	"time"
)

type Response struct {
	Success bool   `json:"Success"`
	Data    string `json:"Data"`
	Token   string `json:"Token"`
}

type Response2 struct {
	Success bool   `json:"Success"`
	Data    string `json:"Data"`
}

type LoginType struct {
	Username string `json:"Username"`
	Password string `json:"Password"`
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

func BasicAuth(h httprouter.Handle, requiredUser, requiredPassword string) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		// Get the Basic Authentication credentials
		user, password, hasAuth := r.BasicAuth()

		if hasAuth && user == requiredUser && password == requiredPassword {
			// Delegate request to the given handle
			h(w, r, ps)
		} else {
			// Request Basic Authentication otherwise
			w.Header().Set("WWW-Authenticate", "Basic realm=Restricted")
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		}
	}
}

func JWTAuth(h httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		//var p1 TokenCheck
		//
		//// Try to decode the request body into the struct. If there is an error,
		//// respond to the client with the error message and a 400 status code.
		//err := json.NewDecoder(r.Body).Decode(&p1)
		//if err != nil {
		//	http.Error(w, err.Error(), http.StatusBadRequest)
		//	return
		//}
		//
		//ss := p1.Authorization

		ss := r.Header.Get("Authorization")

		afterVerificationToken, err := jwt.ParseWithClaims(ss, &MyCustomClaims{}, func(beforeVerificationToken *jwt.Token) (interface{}, error) {
			if beforeVerificationToken.Method.Alg() != jwt.SigningMethodHS256.Alg() {
				return nil, fmt.Errorf("changed signing method")
			}
			return mySigningKey, nil
		})

		isEqual := err == nil && afterVerificationToken.Valid
		if isEqual {
			// Delegate request to the given handle
			h(w, r, ps)
		} else {
			// Request Basic Authentication otherwise
			w.Header().Set("WWW-Authenticate", "Basic realm=Restricted")
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		}
	}
}

func Index(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	u := Response{
		Success: true,
		Data:    "Index",
	}

	// Marshal into JSON
	uj, err := json.Marshal(u)
	if err != nil {
		fmt.Println(err)
	}

	// Write content-type, statuscode, payload
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) // 200
	fmt.Fprintf(w, "%s\n", uj)
}

func Login(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	// Write content-type, statuscode, payload
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) // 200

	// Declare a new Person struct.
	var p1 LoginType

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&p1)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	username := p1.Username
	password := p1.Password

	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Fatal("You must set your 'MONGODB_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()
	coll := client.Database("go_project1").Collection("users")

	var result bson.M

	//type UserType struct {
	//	Username string
	//	Password string
	//}

	err = coll.FindOne(context.TODO(), bson.D{{"username", username}}).Decode(&result)
	if err == mongo.ErrNoDocuments {
		output, _ := json.Marshal(map[string]bool{"Success": false})
		fmt.Fprintf(w, "%s\n", output)
		return
	}

	var hashedPassword = result["password"]
	passwordObject := hashedPassword.(primitive.Binary).Data

	//jsonData, err := json.Marshal(result)

	//var jsonResult UserType
	//err = json.Unmarshal(jsonData, &jsonResult)
	//
	err = bcrypt.CompareHashAndPassword(passwordObject, []byte(password))
	if err != nil {
		output, _ := json.Marshal(map[string]string{"Success": "Bad password"})
		fmt.Fprintf(w, "%s\n", output)
		return
	}

	token, err := createToken(username)
	if err != nil {
		fmt.Println(err)
	}

	u := Response{
		Success: true,
		Data:    "Logged In! " + username,
		Token:   token,
	}

	// Marshal into JSON
	uj, err := json.Marshal(u)
	if err != nil {
		fmt.Println(err)
	}

	fmt.Fprintf(w, "%s\n", uj)
}

func RouteCheckToken(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	// Write content-type, statuscode, payload
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) // 200

	message := "Token Valid"

	u := Response2{
		Success: true,
		Data:    message,
	}

	// Marshal into JSON
	uj, err := json.Marshal(u)
	if err != nil {
		fmt.Println(err)
	}

	fmt.Fprintf(w, "%s\n", uj)
}

func createToken(user string) (string, error) {
	// Create the Claims
	claims := MyCustomClaims{
		user,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Minute * 600).Unix(),
			Issuer:    "test",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString(mySigningKey)
	return ss, err
}

func RouteGetUsers(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	// Write content-type, statuscode, payload
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) // 200

	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Fatal("You must set your 'MONGODB_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()
	coll := client.Database("go_project1").Collection("users")
	cursor, err := coll.Find(context.TODO(), bson.D{})
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No documents were found")
		return
	}
	if err != nil {
		panic(err)
	}
	var results []bson.M
	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	for _, result := range results {
		output, err := json.MarshalIndent(result, "", "    ")
		if err != nil {
			panic(err)
		}
		fmt.Fprintf(w, "%s\n", output)
	}
}

func RouteNewUser(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	// Write content-type, statuscode, payload
	w.Header().Set("Content-Type", "application/json")

	// Declare a new Person struct.
	var p1 NewUser

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&p1)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	username := p1.Username
	password := p1.Password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 14)

	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Fatal("You must set your 'MONGODB_URI' environmental variable. See\n\t https://docs.mongodb.com/drivers/go/current/usage-examples/#environment-variable")
	}
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()
	coll := client.Database("go_project1").Collection("users")
	var result bson.M
	err = coll.FindOne(context.TODO(), bson.D{{"username", username}}).Decode(&result)
	if err != mongo.ErrNoDocuments {
		output, _ := json.Marshal(map[string]bool{"Success": false})
		fmt.Fprintf(w, "%s\n", output)
		return
	}

	doc := bson.D{{"username", username}, {"password", hashedPassword}}
	_, err = coll.InsertOne(context.TODO(), doc)
	if err != nil {
		panic(err)
	}

	output, _ := json.Marshal(map[string]bool{"Success": true})
	fmt.Fprintf(w, "%s\n", output)
}

func main() {
	user := "kyle"
	pass := "bessemer!"

	router := httprouter.New()
	router.GET("/", Index)
	router.POST("/login/", BasicAuth(Login, user, pass))
	router.POST("/checktoken/", JWTAuth(RouteCheckToken))
	router.POST("/getusers/", JWTAuth(RouteGetUsers))
	router.POST("/newuser/", JWTAuth(RouteNewUser))

	log.Fatal(http.ListenAndServe(":8081", router))
}
