import React from "react";

import { useState, useEffect } from "react";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

import {
	DataGrid,
	GridColDef,
	GridRowsProps,
	GridToolbarContainer,
	GridToolbarColumnsButton,
	GridToolbarFilterButton,
	GridToolbarExport,
	GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Container } from "@mui/system";
import JourneyFormDialog from "./JourneyFormDialog";

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

	const [open, setOpen] = useState(false);

	const [rowsData, setRowsData] = useState([]);

	const handleClickOpen = () => {
		console.log("open click");
		setOpen(true);
	};

	const handleClose = () => {
		console.log("close click");
		setOpen(false);
	};

	const navigate = useNavigate();

	const fetchJourneys = async () => {
		console.log("fetching journeys...");
		setLoading(true);
		try {
			setLoading(true);
			const res = await fetch(`/api/journeys?page=${page}&limit=${pageSize}`);
			console.log("pageSize", pageSize);

			const { data, pages, documentCount } = await res.json();
			console.log("data", data);
			setPages(pages);
			setJourneys(data);
			setRowsData(data);
			setRowCount(documentCount);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setNotification("Some error occurred");
		}
	};

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
			type: "number",
		},
		{
			field: "duration",
			headerName: "Duration (min)",
			width: 180,
		},
	];

	const rows: GridRowsProps = rowsData.map((journey) => {
		console.log("journey", journey);
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

	useEffect(() => {
		fetchJourneys();
	}, [page, search, pageSize]);

	console.log("rows", rows);
	// const handleChangeRowsPerPage = (event) => {
	// 	setRowsPerPage(parseInt(event.target.value, 10));
	// 	setPage(0);
	// };

	const handleChangePage = (newPage) => {
		console.log("handleChangePage");
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

			<JourneyFormDialog
				open={open}
				setOpen={setOpen}
				handleClose={handleClose}
			/>

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
						onPageChange={handleChangePage}
						rowCount={rowCount}
						columns={columns}
						pageSize={pageSize}
						onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
						rowsPerPageOptions={[10, 25, 50, 100]}
						components={{
							Toolbar: () => (
								<CustomToolbar
									search={search}
									setSearch={setSearch}
									searchJourney={searchJourney}
									handleClickOpen={handleClickOpen}
									handleClose={handleClose}
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

function CustomToolbar({ handleClickOpen }) {
	return (
		<GridToolbarContainer>
			<GridToolbarColumnsButton />
			<GridToolbarFilterButton />
			<GridToolbarDensitySelector />
			<GridToolbarExport />

			<Button variant='text' startIcon={<AddIcon />} onClick={handleClickOpen}>
				Add Journey
			</Button>
		</GridToolbarContainer>
	);
}
