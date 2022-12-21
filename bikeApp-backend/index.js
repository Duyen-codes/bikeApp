const http = require("http");
const express = require("express");
const app = express();
const csvtojson = require("csvtojson");
const mongoose = require("mongoose");

const MONGODB_URI =
	"mongodb+srv://bikeApp:bikeApp@cluster0.imz7ykd.mongodb.net/bikeApp?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
csvtojson()
	.fromFile("./dataset/bezkoder.csv")
	.then((csvData) => {
		console.log(csvData);
		mongoose.connect(MONGODB_URI);
	});

// const app = http.createServer((request, response) => {
// 	response.writeHead(200, { "Content-Type": "text/plain" });
// 	response.end("Hello World");
// });

app.get("/", (req, res) => {
	res.end("hello world");
});

const PORT = 3003;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
