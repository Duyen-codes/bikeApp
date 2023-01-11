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

			setDeparturesFromStation(departuresFromStation);
			setReturnsAtStation(returnsAtStation);

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
					{departuresFromStation}
				</p>
				<p>
					Total number of journeys ending at the station: {returnsAtStation}
				</p>

				<GoogleMap station={station} />
			</Container>
		</Fade>
	);
};

export default StationDetails;
