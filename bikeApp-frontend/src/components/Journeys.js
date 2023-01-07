import React from "react";

import { useState, useEffect } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import axios from "axios";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

const Stations = () => {
	const [journeys, setJourneys] = useState([]);
	const [loading, setLoading] = useState(false);
	const [notification, setNotification] = useState(false);
	const [page, setPage] = useState(0);
	const [pages, setPages] = useState(1);
	const [pageSize, setPageSize] = useState(100);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [rowCount, setRowCount] = useState(0);

	useEffect(() => {
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

		fetchJourneys();
	}, [page]);

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

	return (
		<div>
			<h2>Journeys</h2>
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
				/>
			</div>
		</div>
	);
};

export default Stations;
