import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DateTimePickerToolbar } from "@mui/x-date-pickers/DateTimePicker/DateTimePickerToolbar";
import axios from "axios";
import { Box } from "@mui/system";
import Grid from "@mui/material/Grid";

const JourneyFormDialog = ({ open, handleClose }) => {
	const [departureTimestamp, setDepartureTimestamp] = React.useState(
		dayjs("2022-04-07"),
	);

	const [returnTimestamp, setReturnTimestamp] = useState(dayjs("2022-04-07"));

	const [departureStationId, setDepartureStationId] = useState(0);
	const [departureStationName, setDepartureStationName] = useState("");
	const [returnStationId, setReturnStationId] = useState(0);
	const [returnStationName, setReturnStationName] = useState("");
	const [coveredDistanceM, setCoveredDistanceM] = useState();
	let durationSec = returnTimestamp.diff(departureTimestamp, "second");

	const handleAdd = async () => {
		const journey = {
			Departure: new Date(departureTimestamp).toISOString(),
			Return: new Date(returnTimestamp).toISOString(),
			Departure_station_id: Number(departureStationId),
			Departure_station_name: departureStationName,
			Return_station_id: Number(returnStationId),
			Return_station_name: returnStationName,
			Covered_distance: coveredDistanceM,
			Duration: durationSec,
		};

		console.log("journey", journey);

		const response = await axios.post("/api/journeys", journey);
		console.log(response);
		handleClose();
	};

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Add Journey</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Fill in the form and hit add to store your journey.
				</DialogContentText>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<Grid
						container
						spacing={2}
						sx={{
							display: "flex",
							justifyContent: "space-between",
							marginTop: "1rem",
							marginBottom: "1rem",
						}}
					>
						<DateTimePicker
							renderInput={(props) => <TextField {...props} />}
							autoFocus
							label='Departure time'
							value={departureTimestamp}
							onChange={(newValue) => {
								setDepartureTimestamp(newValue);
							}}
							showToolbar
						/>

						<DateTimePicker
							renderInput={(props) => <TextField {...props} />}
							autoFocus
							label='Return time'
							value={returnTimestamp}
							onChange={(newValue) => {
								setReturnTimestamp(newValue);
							}}
							showToolbar
						/>
					</Grid>
				</LocalizationProvider>

				<TextField
					value={departureStationId}
					autoFocus
					margin='dense'
					id='Departure_station_id'
					label='Departure station id'
					type='number'
					fullWidth
					variant='standard'
					onChange={({ target }) => setDepartureStationId(target.value)}
				/>
				<TextField
					value={departureStationName}
					autoFocus
					margin='dense'
					id='Departure_station_name'
					label='Departure station name'
					type='text'
					fullWidth
					variant='standard'
					onChange={({ target }) => setDepartureStationName(target.value)}
				/>
				<TextField
					value={returnStationId}
					autoFocus
					margin='dense'
					id='Return_station_id'
					label='Return station id'
					type='number'
					fullWidth
					variant='standard'
					onChange={({ target }) => setReturnStationId(target.value)}
				/>

				<TextField
					value={returnStationName}
					autoFocus
					margin='dense'
					id='Return_station_name'
					label='Return station name'
					type='text'
					fullWidth
					variant='standard'
					onChange={({ target }) => setReturnStationName(target.value)}
				/>

				<TextField
					value={coveredDistanceM}
					autoFocus
					margin='dense'
					id='Covered_distance'
					label='Covered Distance (m)'
					type='number'
					fullWidth
					variant='standard'
					onChange={({ target }) => setCoveredDistanceM(target.value)}
				/>

				<TextField
					value={durationSec}
					autoFocus
					margin='dense'
					id='Duration'
					label='Duration (sec)'
					type='number'
					fullWidth
					variant='standard'
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleAdd}>Add</Button>
			</DialogActions>
		</Dialog>
	);
};

export default JourneyFormDialog;
