import { Wrapper, Status } from "@googlemaps/react-wrapper";

import React, {
	useEffect,
	useRef,
	useState,
	Children,
	isValidElement,
	cloneElement,
} from "react";

const GoogleMap = ({ station }) => {
	const center = {
		lat: station?.y,
		lng: station?.x,
	};

	const render = (status) => {
		switch (status) {
			case Status.LOADING:
				return <p>loading map...</p>;
			case Status.FAILURE:
				return <p>error loading map</p>;
			case Status.SUCCESS:
				return (
					<Map
						center={center}
						zoom={13}
						style={{
							height: "450px",
						}}
					>
						<Marker position={center} />
					</Map>
				);
		}
	};

	return (
		<Wrapper
			apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
			render={render}
		></Wrapper>
	);
};

const Map = ({ children, style, zoom, center }) => {
	const ref = useRef(null);
	const [map, setMap] = useState();

	useEffect(() => {
		if (ref.current && !map) {
			setMap(new window.google.maps.Map(ref.current, { center, zoom }));
		}
	}, [ref, map, center, zoom]);

	return (
		<>
			<div ref={ref} style={style} />
			{Children.map(children, (child) => {
				if (isValidElement(child)) {
					return cloneElement(child, { map });
				}
			})}
		</>
	);
	// [END maps_react_map_component_return]
};

const Marker = (options) => {
	const [marker, setMarker] = useState();

	useEffect(() => {
		if (!marker) {
			setMarker(new window.google.maps.Marker());
		}
		// remove marker from map on unmount
		return () => {
			if (marker) {
				marker.setMap(null);
			}
		};
	}, [marker]);

	useEffect(() => {
		if (marker) {
			marker.setOptions(options);
		}
	}, [marker, options]);
	return null;
};

export default GoogleMap;
