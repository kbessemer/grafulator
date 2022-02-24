package main

import (
	"fmt"

	"github.com/xuri/excelize/v2"
)

func main() {
	ParseFile()

}

func ParseFile() {

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

	fxlsx, err := excelize.OpenFile("../uploads/NoHeader.xlsx")
	if err != nil {
		fmt.Println(err)
		return
	}

	// Get all the rows in the Sheet1.
	cols, err := fxlsx.GetCols("Sheet1")
	if err != nil {
		fmt.Println(err)
		return
	}

	for i, line := range cols {

		if i == 0 {
			for _, field := range line {
				fmt.Println(field)
			}
		}

	}

	fxlsx.Close()
}
