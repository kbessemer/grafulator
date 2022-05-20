# GRAFULATOR
A Go and React app using MongoDB which is used to upload csv or xlsx files and automatically generate a graph based on the data in the spreadsheet. Features advanced statistical features, such as the ability to view a specific range of timestamps in the graph, and plot a custom resolution with custom formulas.

# Screenshots
Screenshots can be found at: http://www.kylebessemer.com/portfolio/graph.html

# Online Demo
http://grafulator.kylebessemer.com/ - No SSL/TLS, do not upload sensitive data!

# Installation
Step 1: Create a mongodb database called "grafulator"

Step 2: Create your environment file "variables.env" with your MONGO_URI variable (MONGO_URI=mongodb://localhost:27017/grafulator)

Step 3: If you require a custom port and SSL, edit the main.go file, Go is used to serve the files over the web. You will then need to build your own executable (GOOS=linux GOARCH=amd64 go build)

Step 4: Run your executable, if you build a custom executable simply run it. If not, then run one of the pre-compiled executables: grafulator_windows_amd64.exe, grafulator_darwin_arm64, grafulator_darwin_amd64, grafulator_linux_amd64

A default user is setup when there are no users in the database upon application launch. It is advised to create a new account and delete the default admin account after installation.

Username: admin
Password: p@$Sw0rD!@#

Default port: 8081