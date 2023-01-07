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
	Kapasiteet: Number,
	x: Number,
	y: Number,
});

stationSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("station", stationSchema);
