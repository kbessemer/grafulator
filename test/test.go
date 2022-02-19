package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
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
	var results []bson.M

	// Send all database results to results variable
	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	if err := client.Disconnect(context.TODO()); err != nil {
		panic(err)
	}

	yayResults := []string{}

	for k := range results {
		a := fmt.Sprint(results[k]["username"])
		yayResults = append(yayResults, a)
	}

	print(yayResults)
}
