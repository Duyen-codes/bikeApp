import React, { useState, useEffect, useRef, Children } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { Container, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import GoogleMap from "./GoogleMap";
import { Fade } from "react-awesome-reveal";
import CircularProgress from "@mui/material/CircularProgress";

const StationDetails = (props) => {
	const { state } = useLocation();
	const { stationId } = useParams();

	const [station, setStation] = useState(
		state.find((item) => item.id === stationId),
	);
	const [loading, setLoading] = useState(true);
	const [departuresFromStationCount, setDeparturesFromStationCount] =
		useState();
	const [returnsAtStationCount, setReturnsAtStationCount] = useState();
	const [departureAvgDistance, setDepartureAvgDistance] = useState();

	const [returnAvgDistance, setReturnAvgDistance] = useState();

	const [top5ReturnStations, setTop5ReturnStations] = useState();
	const [top5DepartureStations, setTop5DepartureStations] = useState();

	const [center, setCenter] = React.useState({
		lat: 0,
		lng: 0,
	});
	const fetchStationData = async () => {
		try {
			const res = await fetch(`/api/stations/${stationId}`);
			const {
				departuresFromStationCount,
				returnsAtStationCount,
				departureAvgDistance,
				returnAvgDistance,
				top5ReturnStations,
				top5DepartureStations,
			} = await res.json();

			setDeparturesFromStationCount(departuresFromStationCount);
			setReturnsAtStationCount(returnsAtStationCount);

			setDepartureAvgDistance(departureAvgDistance);
			setReturnAvgDistance(returnAvgDistance);

			setTop5ReturnStations(top5ReturnStations);
			setTop5DepartureStations(top5DepartureStations);
			setCenter({ lat: station.x, lng: station.y });
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		fetchStationData();
	}, [stationId]);

	if (loading) {
		return (
			<Box
				sx={{ display: "flex", paddingTop: "7rem", justifyContent: "center" }}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Fade>
			<Container
				sx={{
					paddingTop: "7rem",
					textAlign: "center",
				}}
			>
				<Typography variant='h2' fontWeight='bold'>
					{station.Name}
				</Typography>
				<Typography sx={{ fontWeight: "bold" }}>
					Address: {station.Adress}, {station.Kaupunki}
				</Typography>

				<p>
					Total number of journeys starting from the station:{" "}
					{departuresFromStationCount}
				</p>
				<p>
					Total number of journeys ending at the station:{" "}
					{returnsAtStationCount}
				</p>
				<p>
					The average distance of a journey starting from the station:
					{departureAvgDistance}m
				</p>
				<p>
					The average distance of a journey ending at the station:
					{returnAvgDistance}m
				</p>
				<div>
					Top 5 most popular return stations for journeys starting from the
					station:
					{top5ReturnStations.map((station) => (
						<li key={station._id}>
							{station._id}
							<p>Returns: {station.count}</p>
						</li>
					))}
				</div>

				<div>
					Top 5 most popular departure stations for journeys returning at the
					station:
					{top5DepartureStations.map((station) => (
						<li key={station._id}>
							{station._id}
							<p>Departures: {station.count}</p>
						</li>
					))}
				</div>

				<GoogleMap station={station} />
			</Container>
		</Fade>
	);
};

export default StationDetails;
