import React, { useState, useEffect, useRef, Children } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";

const StationDetails = () => {
	const { state } = useLocation();
	const { stationId } = useParams();

	const [station, setStation] = useState(
		state.find((item) => item.id === stationId),
	);
	const [loading, setLoading] = useState(true);
	const [departuresFromStation, setDeparturesFromStation] = useState();
	const [returnsAtStation, setReturnsAtStation] = useState();
	const fetchStationData = async () => {
		try {
			const res = await fetch(`/api/stations/${stationId}`);
			const { departuresFromStation, returnsAtStation } = await res.json();
			console.log(departuresFromStation);
			setDeparturesFromStation(departuresFromStation);
			setReturnsAtStation(returnsAtStation);
			console.log(returnsAtStation);
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		fetchStationData();
	}, [stationId]);

	if (loading) {
		return <p>loading...</p>;
	}
	return (
		<div>
			<h1>station details</h1>
			<p>Name: {station.Name}</p>
			<p>Address: {station.Adress}</p>

			{!loading && (
				<>
					<p>
						Total number of journeys starting from the station:
						{departuresFromStation}
					</p>
					<p>
						Total number of journeys ending at the station: {returnsAtStation}
					</p>
				</>
			)}
		</div>
	);
};

export default StationDetails;
