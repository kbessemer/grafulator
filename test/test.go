package main

import (
	"fmt"

	"github.com/xuri/excelize/v2"
)

func main() {
	ParseFile()

}

func ParseFile() {

	f, err := excelize.OpenFile("../uploads/XLSXTest.xlsx")
	if err != nil {
		fmt.Println(err)
		return
	}

	defer f.Close()

	// Get all the rows in the Sheet1.
	rows, err := f.GetRows("Sheet1")
	if err != nil {
		fmt.Println(err)
		return
	}

	for _, row := range rows {
		for _, colCell := range row {
			fmt.Print(colCell, "\t")
		}
		fmt.Println()
	}

}
