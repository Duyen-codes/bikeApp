import React from "react";

import { useState, useEffect } from "react";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

import {
	DataGrid,
	GridColDef,
	GridValueGetterParams,
	GridRowParams,
	GridToolbar,
	GridToolbarContainer,
	GridToolbarColumnsButton,
	GridToolbarFilterButton,
	GridToolbarExport,
	GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Container } from "@mui/system";

const Journeys = () => {
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
			setLoading(true);
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
			setLoading(true);
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

	const searchJourney = (e) => {
		e.preventDefault();
		console.log("form submitted");
		if (search.trim()) {
			console.log("search", search);
			getJourneysBySearch({ search });
		} else {
			navigate("/");
		}
	};

	return (
		<div>
			<Typography align='center' variant='h2'>
				Journeys
			</Typography>

			<Container>
				<div>
					<form
						onSubmit={searchJourney}
						sx={{ display: "flex", alignItems: "flex-end" }}
					>
						<Box sx={{ display: "flex", alignItems: "flex-end" }}>
							<SearchIcon sx={{ mr: 1, my: 0.5 }} />

							<TextField
								id='standard-basic'
								label='Search'
								value={search}
								onChange={({ target }) => setSearch(target.value)}
								variant='standard'
								size='small'
							/>
						</Box>
					</form>
				</div>
				<div style={{ height: 500, width: "100%" }}>
					<DataGrid
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
							Toolbar: () => (
								<CustomToolbar
									search={search}
									setSearch={setSearch}
									searchJourney={searchJourney}
								/>
							),
							LoadingOverlay: LinearProgress,
						}}
						disableSelectionOnClick
					/>
				</div>
			</Container>
		</div>
	);
};

export default Journeys;

function CustomToolbar() {
	return (
		<GridToolbarContainer>
			<GridToolbarColumnsButton />
			<GridToolbarFilterButton />
			<GridToolbarDensitySelector />
			<GridToolbarExport />

			<Button variant='text' startIcon={<AddIcon />}>
				Add Journey
			</Button>
		</GridToolbarContainer>
	);
}
