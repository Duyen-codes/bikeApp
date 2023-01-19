const router = require("express").Router();

const Journey = require("../models/journey");
const Station = require("../models/station");

// @desc Get all journeys from db
// @route GET /api/journeys
router.get("/", async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	console.log("page", req.query.page);
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

//  @desc  Get data of the search by name journey
//  @route GET /api/journeys/search
router.get("/search", async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const pageSize = parseInt(req.query.pageSize) || 50;
	const search = req.query.search;

	const skip = (page - 1) * pageSize;

	try {
		const searchTerm = new RegExp(search, "i");

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

// @desc Post new journey data
// @route POST /api/journeys
router.post("/", async (req, res) => {
	const journey = new Journey({ ...req.body });

	const savedJourney = await journey.save();

	res.status(201).json(savedJourney);
});

// @desc Delete a journey
// @route DELETE /api/journeys/:id
// This route is not being used at the moment in the application
router.delete("/:id", async (req, res) => {
	await Journey.findByIdAndRemove(req.params.id);
	res.status(204).end();
});

module.exports = router;
