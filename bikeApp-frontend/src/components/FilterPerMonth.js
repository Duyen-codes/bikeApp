import React, { useState } from "react";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import { Stack } from "@mui/system";
import { Button } from "@mui/material";

const FilterPerMonth = () => {
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("submit form");
		console.log("startDate", startDate.$d);
		console.log("endDate", endDate.$d);
	};

	return (
		<div>
			<Typography m={2} variant='h6'>
				Show data per month
			</Typography>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<Stack
					onSubmit={handleSubmit}
					component='form'
					sx={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						gap: "2rem",
					}}
				>
					<DatePicker
						label='Start date'
						value={startDate}
						minDate={dayjs("2021-05-01")}
						onChange={(newValue) => {
							setStartDate(newValue);
						}}
						renderInput={(params) => <TextField {...params} />}
					/>
					<DatePicker
						label='End date'
						value={endDate}
						minDate={dayjs("2021-05-01")}
						onChange={(newValue) => {
							setEndDate(newValue);
						}}
						renderInput={(params) => <TextField {...params} />}
					/>
					<Button variant='contained' size='large' type='submit'>
						show
					</Button>
				</Stack>
			</LocalizationProvider>
		</div>
	);
};

export default FilterPerMonth;
