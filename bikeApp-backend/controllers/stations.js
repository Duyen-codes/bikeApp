const router = require("express").Router();

const Journey = require("../models/journey");
const Station = require("../models/station");

// @desc get all current stations from db
// @route GET /api/stations
router.get("/", async (req, res) => {
	try {
		let result = await Station.find({});

		res.status(200).json({
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Server error",
		});
	}
});

router.get("/:id", async (req, res) => {
	const id = req.params.id;

	const station = await Station.findById(id);
	if (station) {
		const departuresFromStationCount = await Journey.countDocuments({
			Departure_station_id: station.ID,
		});

		const returnsAtStationCount = await Journey.countDocuments({
			Return_station_id: station.ID,
		});

		// calculate average distance of a journey starting from the station

		const averageDistanceFromStation = await Journey.aggregate([
			{
				$match: {
					Departure_station_id: station.ID,
				},
			},
			{
				$group: {
					_id: null,
					averageDistanceFromStation: {
						$avg: "$Covered_distance",
					},
				},
			},
		]);

		const departureAvgDistance = Math.round(
			averageDistanceFromStation[0].averageDistanceFromStation,
		);

		// average distance of a journey returning at the station
		const averageDistanceToStation = await Journey.aggregate([
			{ $match: { Return_station_id: station.ID } },
			{
				$group: {
					_id: null,
					averageDistanceToStation: {
						$avg: "$Covered_distance",
					},
				},
			},
		]);

		const returnAvgDistance = Math.round(
			averageDistanceToStation[0].averageDistanceToStation,
		);

		// Top 5 most popular return stations for journeys starting from the station

		const top5ReturnStations = await Journey.aggregate([
			{ $match: { Departure_station_id: station.ID } },
			{
				$group: {
					_id: "$Return_station_name",
					count: {
						$count: {},
					},
				},
			},
			{
				$sort: { count: -1 },
			},
			{
				$limit: 5,
			},
		]);

		const top5DepartureStations = await Journey.aggregate([
			{ $match: { Return_station_id: station.ID } },
			{
				$group: {
					_id: "$Departure_station_name",
					count: {
						$count: {},
					},
				},
			},
			{
				$sort: { count: -1 },
			},
			{
				$limit: 5,
			},
		]);

		res.json({
			station,
			departuresFromStationCount,
			returnsAtStationCount,
			departureAvgDistance,
			returnAvgDistance,
			top5ReturnStations,
			top5DepartureStations,
		});
	} else {
		res.status(404).end();
	}
});

router.post("/", async (req, res) => {
	const { ID } = req.body;
	const existingStation = await Station.findOne({ ID });
	if (existingStation) {
		return res.status(400).json({
			error: `station with ID ${ID} already exists in station collections`,
		});
	}
	const station = new Station(req.body);

	const savedStation = await station.save();

	res.status(201).json(savedStation);
});

module.exports = router;
