const mongoose = require("mongoose");

const journeySchema = mongoose.Schema({
    Departure: Date,
    Return: Date,
    Departure station id: Number,
    Departure station name: String,
    Return station id: Number,
    Return station name: String,
    Covered distance(m): Number,
    Duration (sec.): Number
})

module.exports = mongoose.model('journey', journeySchema)