import React, { useState, useEffect, useRef, Children } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { Container, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import GoogleMap from "./GoogleMap";

const StationDetails = (props) => {
	const { state } = useLocation();
	const { stationId } = useParams();

	const [station, setStation] = useState(
		state.find((item) => item.id === stationId),
	);
	const [loading, setLoading] = useState(true);
	const [departuresFromStation, setDeparturesFromStation] = useState();
	const [returnsAtStation, setReturnsAtStation] = useState();

	const [center, setCenter] = React.useState({
		lat: 0,
		lng: 0,
	});
	const fetchStationData = async () => {
		try {
			const res = await fetch(`/api/stations/${stationId}`);
			const { departuresFromStation, returnsAtStation } = await res.json();
			console.log(departuresFromStation);
			setDeparturesFromStation(departuresFromStation);
			setReturnsAtStation(returnsAtStation);
			console.log(returnsAtStation);
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
		return <Box sx={{ pt: "7rem" }}>loading...</Box>;
	}

	return (
		<Container sx={{ width: "100vw", paddingTop: "7rem" }}>
			<div style={{ textAlign: "center" }}>
				<Typography variant='h2'>{station.Name}</Typography>
				<Typography sx={{ fontWeight: "bold" }}>
					Address: {station.Adress}, {station.Kaupunki}
				</Typography>
				<p>
					Station coordinates (lat,lng): {station.y},{station.x}
				</p>
			</div>

			<p>
				Total number of journeys starting from the station:{" "}
				{departuresFromStation}
			</p>
			<p>Total number of journeys ending at the station: {returnsAtStation}</p>

			<GoogleMap station={station} />
		</Container>
	);
};

export default StationDetails;
