import axios from "axios";
const baseUrl = "/api/stations";

const fetchAllStations = () => {
	const request = axios.get(baseUrl);
	return request.then((response) => {
		return response.data;
	});
};

export default { fetchAllStations };
