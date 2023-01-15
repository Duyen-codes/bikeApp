import React from "react";

import { useState, useEffect } from "react";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

import { styled } from "@mui/material/styles";
import { Container } from "@mui/system";

import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import { Typography } from "@mui/material";
import {
	TextField,
	InputAdornment,
	IconButton,
	Button,
	Snackbar,
	Table,
	TableCellClasses,
	TableHead,
	TableRow,
	TableBody,
	TableContainer,
	Paper,
	TablePagination,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

import journeyService from "../services/journeys";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const Journeys = () => {
	// read journeys
	const [journeys, setJourneys] = useState([]);
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(true);

	// pagination
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [rowCount, setRowCount] = useState(0);

	const fetchJourneys = async () => {
		console.log("fetchJourneys...");
		try {
			console.log("page", page);
			console.log(typeof page);
			const { journeys, count } = await journeyService.fetchJourneys({
				page: page + 1,
				pageSize: rowsPerPage,
			});

			setJourneys(journeys);
			setCount(count);
			setRowCount(count);

			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchJourneys();
		console.log("page", page, "pageSize", rowsPerPage);
	}, [page, rowsPerPage]);

	const handleChangePage = (event, newPage) => {
		console.log("newPage", newPage);
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", mt: "7rem", justifyContent: "center" }}>
				<CircularProgress />
			</Box>
		);
	}
	return (
		<Container sx={{ pt: "7rem" }}>
			<Typography align='center' variant='h2' pb={3}>
				Journeys
			</Typography>

			{count ? (
				<Container>
					<TableContainer sx={{ maxHeight: 650 }}>
						<Table stickyHeader>
							<TableHead>
								<TableRow>
									<StyledTableCell>
										<b>Index</b>
									</StyledTableCell>
									<StyledTableCell>
										<b>Departure time</b>
									</StyledTableCell>
									<StyledTableCell>
										<b>Return time</b>
									</StyledTableCell>
									<StyledTableCell>
										<b>Departure station</b>
									</StyledTableCell>
									<StyledTableCell>
										<b>Return station</b>
									</StyledTableCell>
									<StyledTableCell>
										<b>Covered distance (km)</b>
									</StyledTableCell>
									<StyledTableCell>
										<b>Duration (m)</b>
									</StyledTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{journeys?.map(
									(
										{
											id,
											Departure,
											Return,
											Departure_station_name,
											Return_station_name,
											Covered_distance,
											Duration,
										},
										index,
									) => (
										<TableRow
											key={id}
											hover
											sx={{
												"&:last-child td, &:last-child th": { border: 0 },
												"&.MuiDataGrid-row:hover": {
													cursor: "none",
												},
											}}
										>
											<TableCell>{index + 1}</TableCell>
											<TableCell>
												{new Date(Departure).toLocaleString()}
											</TableCell>
											<TableCell>{new Date(Return).toLocaleString()}</TableCell>
											<TableCell>{Departure_station_name}</TableCell>
											<TableCell>{Return_station_name}</TableCell>
											<TableCell>
												{(Covered_distance / 1000).toFixed(2)}
											</TableCell>
											<TableCell>{Math.floor(Duration / 60)}</TableCell>
										</TableRow>
									),
								)}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						component='div'
						count={count}
						page={page}
						rowsPerPage={rowsPerPage}
						rowsPerPageOptions={[5, 10, 25, 50, 100]}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Container>
			) : (
				<h4 className='text-center alert alert-primary p-4'>
					No journeys to display
				</h4>
			)}
		</Container>
	);
};

export default Journeys;
