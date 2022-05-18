# GRAFULATOR
A Go and React app using MongoDB which is used to upload csv or xlsx files and automatically generate a graph based on the data in the spreadsheet. Features advanced statistical features, such as the ability to view a specific range of timestamps in the graph, and plot a custom resolution with custom formulas.

# Screenshots
Screenshots can be found at: http://www.kylebessemer.com/portfolio/graph.html

# Installation
Step 1: Create a mongodb database called "grafulator"

Step 2: Create your environment file "variables.env" with your MONGO_URI variable (MONGO_URI=mongodb://localhost:27017/grafulator)

Step 3: Customize your port and add SSL support if needed in main.go file, Go is used to serve the files over the web