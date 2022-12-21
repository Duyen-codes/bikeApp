const mongoose = require("mongoose");

const stationSchema = mongoose.Schema({
	FID: Number,
	ID: Number,
	Namn: String,
	Name: String,
	Osoite: String,
	Adress: String,
	Kaupunki: String,
	Stad: String,
	Operaattor: String,
	Kapasiteet: String,
	x: Number,
	y: Number,
});

module.exports = mongoose.model("station", stationSchema);
