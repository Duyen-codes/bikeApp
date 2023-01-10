const journeysRouter = require("express").Router();

const Journey = require("../models/journey");
const Station = require("../models/station");

// fetch journeys from db
journeysRouter.get("/", async (req, res) => {
	try {
		let query = Journey.find();
		const page = parseInt(req.query.page);
		const pageSize = parseInt(req.query.limit) || 50;
		const skip = page * pageSize;
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
			documentCount: total,
		});
	} catch (error) {
		console.log(error);
	}
});

journeysRouter.get("/search", async (req, res) => {
	const { search } = req.query;

	console.log("search", search);

	try {
		const searchTerm = new RegExp(search, "i");

		const journeys = await Journey.find({
			$or: [
				{ Departure_station_name: searchTerm },
				{ Return_station_name: searchTerm },
			],
		});
		const documentCount = journeys.length;

		console.log("journeys", journeys);
		res.json({
			documentCount,
			data: journeys,
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
});

// endpoint to store new journey
journeysRouter.post("/", async (req, res) => {
	const journey = new Journey({ ...req.body });

	const savedJourney = await journey.save();

	res.status(201).json(savedJourney);
});

module.exports = journeysRouter;
