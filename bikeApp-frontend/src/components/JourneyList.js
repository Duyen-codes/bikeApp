import React from "react";
import Pagination from "./Pagination";
import { useState, useEffect } from "react";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
import { Container } from "@mui/system";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import journeyService from "../services/journeys";
import JourneyFormDialog from "./JourneyFormDialog";

const JourneyList = () => {
	const [journeys, setJourneys] = useState([]);
	const [count, setCount] = useState(journeys.length);
	const [loading, setLoading] = useState(true);

	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [pageSize, setPageSize] = useState(50);

	const [search, setSearch] = useState("");

	const navigate = useNavigate();

	// toggle dialog visibility
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const fetchAllJourneys = async () => {
			try {
				const { journeys, count } = await journeyService.fetchJourneys({
					page,
					pageSize,
				});

				setJourneys(journeys);
				setCount(count);
				setLoading(false);
			} catch (error) {
				console.log(error);
				setLoading(false);
			}
		};

		fetchAllJourneys();
	}, [page, search]);

	const columns: GridColDef[] = [
		{
			field: "Departure",
			headerName: "Departure time",
			width: 220,
		},
		{
			field: "Return",
			headerName: "Return time",
			width: 220,
		},
		{
			field: "Departure_station_name",
			headerName: "Departure station",
			width: 180,
		},

		{
			field: "Return_station_name",
			headerName: "Return station",
			width: 180,
		},
		{
			field: "Covered_distance",
			headerName: "Covered distance (km)",
			width: 160,
		},
		{
			field: "Duration",
			headerName: "Duration (m)",
		},
	];

	const rows = journeys.map((journey) => {
		return {
			id: journey.id,
			Departure: journey.Departure,
			Return: journey.Return,
			Departure_station_name: journey.Departure_station_name,
			Return_station_name: journey.Return_station_name,
			Covered_distance: journey.Covered_distance,
			Duration: journey.Duration,
		};
	});

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	// dialog visibility
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleAddJourney = (journeyObject) => {
		// journeyService.create(journeyObject).then((response) => {
		// 	setJourneys(journeys.concat(response.data));
		// });
	};

	return (
		<Container sx={{ pt: "7rem" }}>
			<Typography align='center' variant='h2'>
				Journey List
			</Typography>
			<JourneyFormDialog
				open={open}
				setOpen={setOpen}
				handleClose={handleClose}
				handleAddJourney={handleAddJourney}
			/>

			<Container>
				<div>
					<Box sx={{ display: "flex", alignItems: "flex-end" }}>
						<SearchIcon sx={{ mr: 1, my: 0.5 }} />
						<TextField
							id='standard-basic'
							label='Search by journey name'
							type='search'
							value={search}
							onChange={({ target }) => setSearch(target.value)}
							variant='standard'
							size='small'
							sx={{ width: "25ch" }}
						/>
					</Box>
				</div>
				<div style={{ height: 650, width: "100%" }}>
					<DataGrid
						loading={loading}
						rows={rows}
						rowCount={count}
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
									handleClickOpen={handleClickOpen}
									handleClose={handleClose}
								/>
							),
							LoadingOverlay: LinearProgress,
						}}
						disableSelectionOnClick
						sx={{
							"&.MuiDataGrid-row:hover": {
								cursor: "pointer",
							},
						}}
					/>
				</div>
			</Container>
		</Container>
	);
};

export default JourneyList;

function CustomToolbar({ handleClickOpen }) {
	return (
		<GridToolbarContainer>
			<GridToolbarColumnsButton />
			<GridToolbarFilterButton />
			<GridToolbarDensitySelector />
			<GridToolbarExport />

			<Button onClick={handleClickOpen} variant='text' startIcon={<AddIcon />}>
				Add Journey
			</Button>
		</GridToolbarContainer>
	);
}
