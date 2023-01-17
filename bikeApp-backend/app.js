const config = require("./utils/config");

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const csvtojson = require("csvtojson");
const fastcsv = require("fast-csv");
const needle = require("needle");
const fetch = require("node-fetch");

const journeysRouter = require("./controllers/journeys");
const stationsRouter = require("./controllers/stations");

const { errorHandler } = require("./utils/middleware");
const logger = require("./utils/logger");

// Connect to the MongoDB cluster
mongoose.set("strictQuery", false);
mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		logger.info("connected to", config.MONGODB_URI);
	})
	.catch((error) => {
		logger.error("error connecting to MongoDB: ", error.message);
	});

app.use(cors());
app.use(express.static("build"));
app.use(express.json());

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

app.use("/api/journeys", journeysRouter);
app.use("/api/stations", stationsRouter);

app.use(errorHandler);

module.exports = app;
