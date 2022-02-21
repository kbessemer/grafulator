package main

import (
	"encoding/csv"
	"fmt"
	"log"
	"os"
)

func main() {
	ParseFile()

}

func ParseFile() {

	type MyData struct {
		Label           string   `json:"label"`
		Data            []string `json:"data"`
		BorderColor     string   `json:"borderColor"`
		BackgroundColor string   `json:"backgroundColor"`
	}

	type MyFile struct {
		Labels []string `json:"labels"`
		Data   []MyData `json:"data"`
	}

	var myData MyData
	var myFile MyFile

	// open file
	f, err := os.Open("../uploads/DummySpreadsheet.csv")
	if err != nil {
		log.Fatal(err)
	}

	// remember to close the file at the end of the program
	defer f.Close()

	// read csv values using csv.Reader
	csvReader := csv.NewReader(f)
	data, err := csvReader.ReadAll()
	if err != nil {
		log.Fatal(err)
	}

	colors := []string{"#00ff12", "#f6ff00", "#ff0000", "#00ff12", "#f6ff00", "#ff0000"}

	for i, line := range data {
		if i == 0 {
			for j, field := range line {
				if j == 0 {

				} else {
					myFile.Labels = append(myFile.Labels, field)
				}
			}
		} else {
			for j, field := range line {
				if j == 0 {
					myData.Label = field
				} else {
					myData.Data = append(myData.Data, field)
				}
			}
			myData.BorderColor = colors[i]
			myData.BackgroundColor = colors[i]
		}

		myFile.Data = append(myFile.Data, myData)
	}

	fmt.Println(myFile)

}
