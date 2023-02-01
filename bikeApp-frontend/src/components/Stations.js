import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
	DataGrid,
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
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

import stationService from "../services/stations";
import NewStationDialog from "./NewStationDialog";

const Stations = () => {
	const [stations, setStations] = useState([]);
	const [loading, setLoading] = useState(true);

	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [pageSize, setPageSize] = useState(50);

	const [search, setSearch] = useState("");

	const navigate = useNavigate();

	// toggle dialog visibility
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const fetchAllStations = async () => {
			try {
				const { data } = await stationService.fetchAllStations();

				setStations(data);
				setLoading(false);
			} catch (error) {
				console.log(error);
				setLoading(false);
			}
		};

		fetchAllStations();
	}, [page, search]);

	const columns = [
		{
			field: "name",
			headerName: "Station name",
			width: 300,
		},
		{
			field: "address",
			headerName: "Address",
			width: 200,
		},
		{
			field: "city",
			headerName: "City",
		},
		{
			field: "capacity",
			headerName: "Capacity",
		},
		{
			field: "x",
			headerName: "Latitude",
		},
		{
			field: "y",
			headerName: "Longitude",
		},
	];

	const filteredStations = stations.filter(
		(station) =>
			station.Name.toLowerCase() === search.toLowerCase() ||
			station.Adress.toLowerCase() === search.toLowerCase(),
	);

	const stationsToShow = search ? filteredStations : stations;

	const rows = stationsToShow.map((station) => {
		return {
			id: station.id,
			name: station.Name,
			address: station.Adress,
			city: station.Kaupunki,
			capacity: station.Kapasiteet,
			x: station.x,
			y: station.y,
		};
	});

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleRowClick = (params, event, details) => {
		navigate(`/stations/${params.row.id}`, {
			state: stations,
		});
	};

	// dialog visibility
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleAddStation = (stationObject) => {
		// stationService.create(stationObject).then((response) => {
		// 	setStations(stations.concat(response.data));
		// });
	};

	return (
		<Container sx={{ pt: "7rem" }}>
			<Typography align='center' variant='h2'>
				Stations
			</Typography>
			<NewStationDialog
				open={open}
				setOpen={setOpen}
				handleClose={handleClose}
				handleAddStation={handleAddStation}
			/>

			<Container>
				<div>
					<Box sx={{ display: "flex", alignItems: "flex-end" }}>
						<SearchIcon sx={{ mr: 1, my: 0.5 }} />
						<TextField
							id='standard-basic'
							label='Search by station name'
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
						rowCount={stations.length}
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
						onRowClick={handleRowClick}
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

export default Stations;

function CustomToolbar({ handleClickOpen }) {
	return (
		<GridToolbarContainer>
			<GridToolbarColumnsButton />
			<GridToolbarFilterButton />
			<GridToolbarDensitySelector />
			<GridToolbarExport />

			<Button onClick={handleClickOpen} variant='text' startIcon={<AddIcon />}>
				Add Station
			</Button>
		</GridToolbarContainer>
	);
}
