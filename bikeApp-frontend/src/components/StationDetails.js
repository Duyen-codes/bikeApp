import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
	Card,
	CardContent,
	Container,
	Divider,
	Typography,
} from "@mui/material";

import Box from "@mui/material/Box";

import Grid from "@mui/material/Grid";
import GoogleMap from "./GoogleMap";

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

	const [center, setCenter] = useState({
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

	return (
		<Container
			sx={{
				paddingTop: "5rem",
				textAlign: "center",
				marginBottom: "5rem",
			}}
		>
			<Typography variant='h2' fontWeight='bold'>
				{station.Name}
			</Typography>
			<Typography sx={{ fontWeight: "bold", mb: 1.5 }} variant='h6'>
				Address: {station.Adress}, {station.Kaupunki}
			</Typography>

			<GoogleMap station={station} />
			{loading && (
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						paddingTop: "2rem",
					}}
				>
					<CircularProgress />
					<p> Loading more data...</p>
				</Box>
			)}
			{!loading && (
				<Grid
					container
					spacing={{ xs: 2, md: 3 }}
					sx={{ borderColor: "#e0e0e0", pt: "2rem", mb: "2rem" }}
				>
					<Grid item xs={12} sm={6} md={4} sx={{ borderColor: "#e0e0e0" }}>
						<Card sx={{ height: "100%" }}>
							<CardContent sx={{ textAlign: "left" }}>
								<Typography>
									Total number of journeys starting from the station:{" "}
									{departuresFromStationCount}
								</Typography>

								<Divider sx={{ mb: 1 }} />
								<Typography>
									Total number of journeys ending at the station:{" "}
									{returnsAtStationCount}
								</Typography>
								<Divider sx={{ mb: 1 }} />
								<Typography>
									The average distance of a journey starting from the station:{" "}
									{departureAvgDistance}m
								</Typography>
								<Divider sx={{ mb: 1 }} />
								<Typography>
									The average distance of a journey ending at the station:{" "}
									{returnAvgDistance}m
								</Typography>
							</CardContent>
						</Card>
					</Grid>

					<Grid item xs={12} sm={6} md={4}>
						<Card>
							<CardContent sx={{ textAlign: "left" }}>
								<Typography variant='h6'>
									Top 5 most popular return stations for journeys starting from
									the station:
								</Typography>
								{top5ReturnStations.map((station) => (
									<div key={station._id}>
										<Typography>
											{station._id} <br />
											Returns: {station.count}
										</Typography>
										<Divider sx={{ mb: 1 }} />
									</div>
								))}
							</CardContent>
						</Card>
					</Grid>

					<Grid item xs={12} sm={6} md={4}>
						<Card sx={{ height: "100%" }}>
							<CardContent sx={{ textAlign: "left" }}>
								<Typography variant='h6'>
									Top 5 most popular departure stations for journeys returning
									at the station:
								</Typography>
								{top5DepartureStations.map((station) => (
									<div key={station._id}>
										<Typography>
											{station._id} <br />
											Departures: {station.count}
										</Typography>
										<Divider sx={{ mb: 1 }} />
									</div>
								))}
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			)}
		</Container>
	);
};

export default StationDetails;
