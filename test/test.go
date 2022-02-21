package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	now := time.Now()
	fmt.Printf("%T\n", now)

	format := fmt.Sprint(now.Month(), now.Day(), now.Year(), now.Hour(), ":", now.Minute())

	fmt.Println(format)

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
