import React, { useState } from "react";

import { useLocation, useParams } from "react-router-dom";

import { Wrapper } from "@googlemaps/react-wrapper";

function MyMapComponent({
	center,
	zoom,
}: {
	center: google.maps.LatLngLiteral,
	zoom: number,
}) {
	const ref = useRef();

	useEffect(() => {
		new window.google.maps.Map(ref.current, {
			center,
			zoom,
		});
	});

	return <div ref={ref} id='map' />;
}
const StationDetails = () => {
	const { state } = useLocation();
	const { stationId } = useParams();
	console.log("state", state);
	console.log("stationId", stationId);
	const [station, setStation] = useState(
		state.find((item) => item.id === stationId),
	);

	console.log("station", station);
	return (
		<div>
			station details here
			{station.Name}
			{station.Adress}
			{station.x},{station.y}
			{/* Station name
Station address
Total number of journeys starting from the station
Total number of journeys ending at the station */}
			<Wrapper apiKey={"YOUR_API_KEY"}>
				<MapComponent />
			</Wrapper>
		</div>
	);
};

export default StationDetails;
