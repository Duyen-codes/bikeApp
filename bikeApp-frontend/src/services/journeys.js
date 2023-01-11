import axios from "axios";
const baseUrl = "/api/journeys";

const fetchJourneys = (page, pageSize) => {
	const request = axios.get(`${baseUrl}?page=${page}&limit=${pageSize}`);
	return request.then((response) => {
		return response.data;
	});
};

export default { fetchJourneys };
