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

const Stations = () => {
	const [stations, setStations] = useState([]);
	const [loading, setLoading] = useState(false);
	const [notification, setNotification] = useState(false);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [pageSize, setPageSize] = useState(50);

	const [search, setSearch] = useState("");

	const navigate = useNavigate();
	useEffect(() => {
		const fetchStations = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/stations`);

				const { data, pages: totalPages } = await res.json();

				setPages(totalPages);
				setStations(data);
				setLoading(false);
			} catch (error) {
				console.log(error);
				setLoading(false);
				setNotification("Some error occurred");
			}
		};

		fetchStations();
	}, [page, search]);

	const columns: GridColDef[] = [
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

	const rows = stations.map((station) => {
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

	const handleRowClick: GridEventListener<"rowClick"> = (
		params,
		event,
		details,
	) => {
		console.log(`${params.row.id}`);
		navigate(`/stations/${params.row.id}`, {
			state: stations,
		});
	};

	const searchStation = (e) => {
		e.preventDefault();

		const searchResult = stations.filter(
			(station) =>
				station.Name.toLowerCase() === search.toLowerCase() ||
				station.Adress.toLowerCase() === search.toLowerCase(),
		);

		setStations(searchResult);
	};

	return (
		<div>
			<Typography align='center' variant='h2'>
				Stations
			</Typography>
			<Container>
				<div>
					<form
						onSubmit={searchStation}
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
						rowCount={stations.length}
						columns={columns}
						pageSize={pageSize}
						onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
						rowsPerPageOptions={[10, 25, 50, 100]}
						onRowsPerPageChange={handleChangeRowsPerPage}
						onPageChange={handleChangePage}
						components={{
							Toolbar: () => (
								<CustomToolbar search={search} setSearch={setSearch} />
							),
							LoadingOverlay: LinearProgress,
						}}
						disableSelectionOnClick
						onRowClick={handleRowClick}
					/>
				</div>
			</Container>
		</div>
	);
};

export default Stations;

function CustomToolbar() {
	return (
		<GridToolbarContainer>
			<GridToolbarColumnsButton />
			<GridToolbarFilterButton />
			<GridToolbarDensitySelector />
			<GridToolbarExport />

			<Button variant='text' startIcon={<AddIcon />}>
				Add Station
			</Button>
		</GridToolbarContainer>
	);
}
