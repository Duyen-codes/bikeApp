import axios from "axios";
const baseUrl = "/api/journeys";

const fetchJourneys = ({ page, pageSize }) => {
	console.log("page", page, "pageSize: ", pageSize);
	const request = axios.get(`${baseUrl}?page=${page}&pageSize=${pageSize}`);
	return request.then((response) => {
		return response.data;
	});
};

const getJourneysBySearch = async (searchQuery) => {
	const response = await axios.get(
		`${baseUrl}/search?search=${searchQuery.search}`,
	);

	return response.data;
};
export default { fetchJourneys, getJourneysBySearch };
