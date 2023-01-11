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

import journeyService from "../services/journeys";

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

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const navigate = useNavigate();

	const fetchJourneys = async () => {
		setLoading(true);
		try {
			setLoading(true);

			const { data, pages, documentCount } = await journeyService.fetchJourneys(
				page,
				pageSize,
			);

			setPages(pages);
			setJourneys(data);

			setRowCount(documentCount);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setNotification("Some error occurred");
		}
	};

	const getJourneysBySearch = async (searchQuery) => {
		setLoading(true);

		try {
			setLoading(true);

			const { data, documentCount } = await journeyService.getJourneysBySearch(
				searchQuery,
			);

			setJourneys(data);
			setRowCount(documentCount);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setNotification("Some error occurred");
		}
	};

	let rows = journeys.map((journey) => {
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

	useEffect(() => {
		fetchJourneys();
	}, [page, search, pageSize]);

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

		if (search.trim()) {
			console.log("search", search);
			getJourneysBySearch({ search });
		} else {
			navigate("/");
		}
	};

	return (
		<Container>
			<Typography align='center' variant='h2' sx={{ pt: "7rem" }}>
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
		</Container>
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
