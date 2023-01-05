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
const fetch = require("node-fetch");

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

const fetchJourney = (url) => {
	fetch(url)
		.then((response) => {
			return response.text();
		})
		.then((text) =>
			csvtojson({
				headers: [
					"Departure",
					"Return",
					"Departure_station_id",
					"Departure_station_name",
					"Return_station_id",
					"Return_station_name",
					"Covered_distance",
					"Duration",
				],
				delimiter: ",",
			}).fromString(text),
		)
		.then((result) => {
			const filteredResult = result.filter(
				(item) => item.Covered_distance > 10 && item.Duration > 10,
			);

			Journey.insertMany(filteredResult)
				.then(function () {
					console.log("data inserted");
				})
				.catch((error) => {
					console.log(error);
				});
		});
};

const insertJourneyToMongoDB = async () => {
	await fetchJourney("https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv");
	await fetchJourney("https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv");
	await fetchJourney("https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv");
	mongoose.connection.close();
};

insertJourneyToMongoDB();

// fetch stations from db
app.get("/stations", (req, res) => {
	Station.find((error, data) => {
		if (error) {
			console.error(error);
		}
		res.json(data);
	});
});

// fetch journeys from db
app.get("/journeys", (req, res) => {
	Journey.find({}).then((data) => {
		return res.json(data);
	});
});

const PORT = 3003;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
