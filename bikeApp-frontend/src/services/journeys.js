import axios from "axios";
const baseUrl = "/api/journeys";

const fetchJourneys = ({ page, pageSize }) => {
	const request = axios.get(`${baseUrl}?page=${page}&pageSize=${pageSize}`);
	return request.then((response) => {
		return response.data;
	});
};

const getJourneysBySearch = async ({ searchQuery, page, pageSize }) => {
	console.log("searchQuery", searchQuery);
	const response = await axios.get(
		`${baseUrl}/search?search=${searchQuery}&page=${page}&pageSize=${pageSize}`,
	);
	console.log("response", response);

	return response.data;
};
export default { fetchJourneys, getJourneysBySearch };
