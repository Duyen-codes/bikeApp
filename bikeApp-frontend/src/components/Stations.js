import React from "react";
import Pagination from "./Pagination";
import { useState, useEffect } from "react";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TablePagination from "@mui/material/TablePagination";
import {
	DataGrid,
	GridColDef,
	GridValueGetterParams,
	GridRowParams,
	GridToolbar,
	GridEventListener,
} from "@mui/x-data-grid";

const Stations = () => {
	const [stations, setStations] = useState([]);
	const [loading, setLoading] = useState(false);
	const [notification, setNotification] = useState(false);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [pageSize, setPageSize] = useState(50);

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
	}, [page]);

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
	return (
		<div>
			<h2>Stations</h2>

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
						Toolbar: GridToolbar,
					}}
					disableSelectionOnClick
					onRowClick={handleRowClick}
				/>
			</div>
		</div>
	);
};

export default Stations;
