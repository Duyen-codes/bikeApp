require("dotenv").config();
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
const csv = require("csv-parser");

const Journey = require("./models/journey");
const Station = require("./models/station");

mongoose.set("strictQuery", false);

// Connect to the MongoDB cluster
mongoose.connect(process.env.MONGODB_URI).then(() => {
	console.log("connected to", process.env.MONGODB_URI);
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

const insertStationToMongoDB = (stationUrl) => {
	needle
		.get(stationUrl)
		.pipe(fastcsv.parse({ headers: true }))
		.on("error", (error) => console.log("error:", error))
		.on("data", function (data) {
			console.log("got data");
			const doc = new Station(data);
			doc.save((error) => {
				if (error) {
					console.error(error);
				}
			});
		})
		.on("end", function () {
			console.log(`stations have been successfully uploaded`);
		});
};

const insertDataToMongoDB = async () => {
	console.log("inserting...");
	await fetchJourney(journeyUrls[0]);
	await fetchJourney(journeyUrls[1]);
	await fetchJourney(journeyUrls[2]);
	await insertStationToMongoDB(stationUrl);
};

// Check if database exists, if not insert data to MongoDB

mongoose.connection.on("open", function (ref) {
	mongoose.connection.db.listCollections().toArray(function (error, names) {
		console.log("names", names);
		const result = names.some(
			(collection) =>
				collection.name === "stations" || collection.name === "journeys",
		);
		console.log("result", result);
		if (result) {
			return;
		} else {
			console.log("inserting to db");
			insertDataToMongoDB();
		}
	});
});

function checkDatabase(bikeApp) {
	let alreadyExist;

	new Admin(mongoose.connection.db).listDatabases((err, result) => {
		let allDatabases = result.databases;
		console.log("allDataBases", allDatabases);
		alreadyExist = allDatabases.some((database) => database.name === "bikeApp");
		return alreadyExist;
	});
}

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
