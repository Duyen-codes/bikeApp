const router = require("express").Router();

const Journey = require("../models/journey");
const Station = require("../models/station");

// fetch stations from db
router.get("/", async (req, res) => {
	try {
		let result = await Station.find({});

		res.status(200).json({
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

router.get("/:id", async (req, res) => {
	const id = req.params.id;
	console.log("id", id);
	const station = await Station.findById(id);
	console.log("station", station);

	const departuresFromStation = await Journey.countDocuments({
		Departure_station_id: station.ID,
	});

	const returnsAtStation = await Journey.countDocuments({
		Return_station_id: station.ID,
	});
	console.log(departuresFromStation);
	console.log(returnsAtStation);

	res.json({ station, departuresFromStation, returnsAtStation });
});

router.post("/", (req, res) => {
	const station = new Station(req.body);
	station.save().then((result) => {
		console.log("result", result);
		res.status(201).json(result);
	});
});

module.exports = router;
