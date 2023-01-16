const router = require("express").Router();

const Journey = require("../models/journey");
const Station = require("../models/station");

// fetch journeys from db
router.get("/", async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const pageSize = parseInt(req.query.pageSize) || 50;
	try {
		const count = await Journey.countDocuments({});

		const skip = (page - 1) * pageSize;

		let journeys = await Journey.find({}).skip(skip).limit(pageSize);

		return res.status(200).json({
			status: "success",
			page,
			journeys,
			count,
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
});

router.get("/search", async (req, res) => {
	console.log("req.query", req.query);
	const search = req.query.search;
	console.log("search", search);
	const page = parseInt(req.query.page) || 1;
	const pageSize = parseInt(req.query.pageSize) || 50;
	console.log("page", page);
	console.log("pageSize", pageSize);
	try {
		const searchTerm = new RegExp(search, "i");

		const skip = (page - 1) * pageSize;
		console.log(skip);

		const journeys = await Journey.find({
			$or: [
				{ Departure_station_name: searchTerm },
				{ Return_station_name: searchTerm },
			],
		})
			.skip(skip)
			.limit(pageSize);

		const count = await Journey.find({
			$or: [
				{ Departure_station_name: searchTerm },
				{ Return_station_name: searchTerm },
			],
		}).countDocuments({});

		console.log("count: ", count);

		res.json({
			count,
			journeys,
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
});

// endpoint to store new journey
router.post("/", async (req, res) => {
	const journey = new Journey({ ...req.body });

	const savedJourney = await journey.save();

	res.status(201).json(savedJourney);
});

module.exports = router;
