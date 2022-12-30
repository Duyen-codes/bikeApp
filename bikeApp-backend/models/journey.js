const mongoose = require("mongoose");

const journeySchema = mongoose.Schema({
	Departure: Date,
	Return: Date,
	Departure_station_id: Number,
	Departure_station_name: String,
	Return_station_id: Number,
	Return_station_name: String,
	Covered_distance: Number,
	Duration: Number,
});

module.exports = mongoose.model("journey", journeySchema);
