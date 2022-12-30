const http = require("http");
const express = require("express");
const app = express();
const csvtojson = require("csvtojson");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const fastcsv = require("fast-csv");
const https = require("https");
const axios = require("axios");
const needle = require("needle");

const Journey = require("./models/journey");
const Station = require("./models/station");

const MONGODB_URI =
	"mongodb+srv://bikeApp:bikeApp@cluster0.imz7ykd.mongodb.net/bikeApp?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);

// Connect to the MongoDB cluster
mongoose.connect(MONGODB_URI).then(() => {
	console.log("connected to", MONGODB_URI);
});

const journeyUrls = [
	"https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv",
	"https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv",
	"https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv",
];

const stationUrl =
	"https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv";

const csvfile =
	__dirname +
	"/dataset/stations/Helsingin_ja_Espoon_kaupunkipy%C3%B6r%C3%A4asemat_avoin.csv";
const stream = fs.createReadStream(csvfile);

// const readFile = (url) => {
// 	https.get(url, (response) => {
// 		response.setEncoding("utf-8");
// 		let body = "";
// 		response.on("data", (data) => {
// 			body += data;
// 		});
// 		response.on("end", () => {
// 			console.log(body);
// 			// You can write the contents of the file to a local file using the fs module,
// 			// or do something else with the data here.
// 		});
// 	});
// };

// const saveFile = (data) => {
// 	const journey = new Journey({
// 		data,
// 	});
// 	journey.save((error, file) => {
// 		if (error) {
// 			console.log(error);
// 		} else {
// 			console.log(`File saved: ${file}`);
// 		}
// 	});
// };
// journeyUrls.forEach((url) => {
// 	readFile(url, (data) => {
// 		saveFile(data);
// 	});
// });

const readFile = (url) => {
	needle.get(url);
};

// Read the CSV file
needle
	.get(stationUrl)
	.pipe(fastcsv.parse({ headers: true }))
	.on("error", (error) => console.error(error))
	.on("data", function (data) {
		const doc = new Station(data);
		doc.save((error) => {
			if (error) {
				console.error(error);
			}
		});
	})
	.on("end", function () {
		console.log(` stations have been successfully uploaded`);
	});

app.get("/stations", (req, res) => {
	Station.find((error, data) => {
		if (error) {
			console.error(error);
		}
		res.json(data);
	});
});

const PORT = 3003;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
