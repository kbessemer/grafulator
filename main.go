package main

import (
	"encoding/json"
	"fmt"
	"github.com/golang-jwt/jwt"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
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

type Person struct {
	Username string `json:"username"`
}

type TokenCheck struct {
	Authorization string `json:"authorization"`
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
		var p1 TokenCheck

		// Try to decode the request body into the struct. If there is an error,
		// respond to the client with the error message and a 400 status code.
		err := json.NewDecoder(r.Body).Decode(&p1)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		ss := p1.Authorization
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

func Protected(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	// Declare a new Person struct.
	var p1 Person

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&p1)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	token, err := createToken(p1.Username)
	if err != nil {
		fmt.Println(err)
	}

	u := Response{
		Success: true,
		Data:    "Logged In! " + p1.Username,
		Token:   token,
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

func RouteCheckToken(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
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

	// Write content-type, statuscode, payload
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) // 200
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

func main() {
	user := "kyle"
	pass := "bessemer!"

	router := httprouter.New()
	router.GET("/", Index)
	router.POST("/protected/", BasicAuth(Protected, user, pass))
	router.POST("/checktoken/", JWTAuth(RouteCheckToken))

	log.Fatal(http.ListenAndServe(":8081", router))
}
