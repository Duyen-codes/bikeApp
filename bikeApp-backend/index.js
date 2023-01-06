require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const csvtojson = require("csvtojson");
const mongoose = require("mongoose");
const fastcsv = require("fast-csv");
const https = require("https");
const axios = require("axios");
const needle = require("needle");
const fetch = require("node-fetch");

const Journey = require("./models/journey");
const Station = require("./models/station");
const { readdirSync } = require("fs");

app.use(express.json());

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
		const result = names.some(
			(collection) =>
				collection.name === "stations" || collection.name === "journeys",
		);
		if (result) {
			return;
		} else {
			console.log("inserting to db");
			insertDataToMongoDB();
		}
	});
});

// fetch stations from db
app.get("/api/stations", async (req, res) => {
	try {
		let query = Station.find();
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.limit) || 50;
		const skip = (page - 1) * pageSize;
		const total = await Station.countDocuments();

		const pages = Math.ceil(total / pageSize);

		query = query.skip(skip).limit(pageSize);

		if (page > pages) {
			return res.status(404).json({
				status: "fail",
				message: "No page found",
			});
		}

		const result = await query;

		res.status(200).json({
			status: "success",
			count: result.length,
			page,
			pages,
			data: result,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			status: "error",
			message: "Server error",
		});
	}
});

app.get("/api/stations/:id", (req, res) => {
	const id = req.params.id;
	const station = Station.findById(id).then((result) => {
		console.log(result);
		res.json(result);
	});
});

// fetch journeys from db
app.get("/api/journeys", async (req, res) => {
	try {
		let query = Journey.find();
		const page = parseInt(req.query.page);
		const pageSize = parseInt(req.query.limit) || 50;
		const skip = (page - 1) * pageSize;
		const total = await Journey.countDocuments();
		const pages = Math.ceil(total / pageSize);

		query = query.skip(skip).limit(pageSize);

		let result = await query;

		return res.status(200).json({
			status: "success",
			count: result.length,
			page,
			pages,
			data: result,
		});
	} catch (error) {
		console.log(error);
	}
});

app.get("/api/journeys/:id", (req, res) => {
	const id = req.params.id;
	const journey = Journey.findById(id).then((result) => {
		console.log(result);
		res.json(result);
	});
});

const PORT = process.env.PORT || 3003;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
