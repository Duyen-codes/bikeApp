import axios from "axios";
const baseUrl = "/api/stations";

const fetchAllStations = () => {
	const request = axios.get(baseUrl);
	return request.then((response) => {
		return response.data;
	});
};

const create = (newObject) => {
	const request = axios.post(baseUrl, newObject);
	return request.then((response) => {
		console.log("response", response);
		return response.data;
	});
};
export default { fetchAllStations, create };
