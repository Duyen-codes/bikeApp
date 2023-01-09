import React from "react";

import { useState, useEffect } from "react";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

import {
	DataGrid,
	GridColDef,
	GridValueGetterParams,
	GridRowParams,
	GridToolbar,
} from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";
import { TextField } from "@mui/material";

import Button from "@mui/material/Button";

const Stations = () => {
	const [journeys, setJourneys] = useState([]);
	const [loading, setLoading] = useState(false);
	const [notification, setNotification] = useState(false);
	const [page, setPage] = useState(0);
	const [pages, setPages] = useState(1);
	const [pageSize, setPageSize] = useState(50);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [rowCount, setRowCount] = useState(0);

	const [search, setSearch] = useState("");

	const navigate = useNavigate();

	const fetchJourneys = async () => {
		setLoading(true);
		try {
			const res = await fetch(
				`/api/journeys?page=${page}?limit=${rowsPerPage}`,
			);

			const { data, pages: totalPages, documentCount } = await res.json();
			setPages(totalPages);
			setJourneys(data);
			setRowCount(documentCount);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setNotification("Some error occurred");
		}
	};
	useEffect(() => {
		fetchJourneys();
	}, [page, search]);

	const getJourneysBySearch = async (searchQuery) => {
		setLoading(true);

		console.log("searchQuery", searchQuery);
		console.log("searchQuery.search", searchQuery.search);
		try {
			const res = await fetch(
				`/api/journeys/search?search=${searchQuery.search || "none"}`,
			);
			const { data, documentCount } = await res.json();
			setJourneys(data);
			setRowCount(documentCount);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setNotification("Some error occurred");
		}
	};

	const columns: GridColDef[] = [
		{
			field: "departureTime",
			headerName: "Departure Time",
			width: 200,
		},
		{
			field: "returnTime",
			headerName: "Return Time",
			width: 200,
		},
		{
			field: "departureStation",
			headerName: "Departure station",
			width: 180,
		},
		{
			field: "returnStation",
			headerName: "Return station",
			width: 180,
		},
		{
			field: "coveredDistance",
			headerName: "Covered distance (km)",
			width: 180,
		},
		{
			field: "duration",
			headerName: "Duration (min)",
			width: 180,
		},
	];

	const rows = journeys.map((journey) => {
		return {
			id: journey.id,
			departureTime: journey.Departure,
			returnTime: journey.Return,
			departureStation: journey.Departure_station_name,
			returnStation: journey.Return_station_name,
			coveredDistance: journey.Covered_distance / 1000,
			duration: Math.floor(journey.Duration / 60),
		};
	});

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChangePage = (newPage) => {
		console.log("newPage", newPage);
		setPage(newPage);
	};

	const searchJourney = () => {
		if (search.trim()) {
			console.log("search", search);
			getJourneysBySearch({ search });
		} else {
			navigate("/");
		}
	};

	return (
		<div>
			<h2>Journeys</h2>
			<TextField
				value={search}
				onChange={({ target }) => setSearch(target.value)}
				placeholder='Search...'
			/>

			<Button onClick={searchJourney} variant='contained' color='primary'>
				{" "}
				search
			</Button>

			<div style={{ height: 500, width: "100%" }}>
				<DataGrid
					filterMode='server'
					loading={loading}
					rows={rows}
					page={page}
					rowCount={rowCount}
					columns={columns}
					pageSize={pageSize}
					onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
					rowsPerPageOptions={[10, 25, 50, 100]}
					onRowsPerPageChange={handleChangeRowsPerPage}
					onPageChange={handleChangePage}
					components={{
						Toolbar: GridToolbar,
						LoadingOverlay: LinearProgress,
					}}
					disableSelectionOnClick
				/>
			</div>
		</div>
	);
};

export default Stations;
