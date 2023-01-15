import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack } from "@mui/system";

// stationService
import stationService from "../services/stations";

const NewStationDialog = ({ open, handleClose, handleAddStation }) => {
	const [FID, setFID] = useState(0);
	const [ID, setID] = useState(0);
	const [Namn, setNamn] = useState("");
	const [Name, setName] = useState("");
	const [Osoite, setOsoite] = useState("");
	const [Adress, setAdress] = useState("");
	const [Kaupunki, setKaupunki] = useState("");
	const [Stad, setStad] = useState("");
	const [Operaattor, setOperaattor] = useState("");
	const [Kapasiteet, setKapasiteet] = useState("");
	const [x, setX] = useState(0);
	const [y, setY] = useState(0);

	const handleAdd = () => {
		console.log("add new station");
		const stationObject = {
			FID: Number(FID),
			ID: Number(ID),
			Namn,
			Name,
			Osoite,
			Adress,
			Kaupunki,
			Stad,
			Operaattor,
			Kapasiteet: Number(Kapasiteet),
			x: Number(x),
			y: Number(y),
		};
		handleAddStation(stationObject);

		setFID(0);
		setID(0);
		setNamn("");
		setName("");
		setOsoite("");
		setAdress("");
		setKaupunki("");
		setStad("");
		setOperaattor("");
		setKapasiteet(0);
		setX(0);
		setY(0);

		handleClose();
	};
	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Add Station</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Fill in the form and hit add to store a new station.
				</DialogContentText>
				<TextField
					value={FID}
					autoFocus
					margin='dense'
					id='FID'
					label='FID'
					type='number'
					fullWidth
					variant='standard'
					onChange={({ target }) => setFID(target.value)}
				/>
				<TextField
					value={ID}
					autoFocus
					margin='dense'
					id='ID'
					label='ID'
					type='number'
					fullWidth
					variant='standard'
					onChange={({ target }) => setID(target.value)}
				/>

				<TextField
					value={Namn}
					autoFocus
					margin='dense'
					id='Namn'
					label='Namn'
					type='text'
					fullWidth
					variant='standard'
					onChange={({ target }) => setNamn(target.value)}
				/>
				<TextField
					value={Name}
					autoFocus
					margin='dense'
					id='Name'
					label='Name'
					type='text'
					fullWidth
					variant='standard'
					onChange={({ target }) => setName(target.value)}
				/>

				<TextField
					value={Osoite}
					autoFocus
					margin='dense'
					id='Osoite'
					label='Osoite'
					type='text'
					fullWidth
					variant='standard'
					onChange={({ target }) => setOsoite(target.value)}
				/>
				<TextField
					value={Adress}
					autoFocus
					margin='dense'
					id='Adress'
					label='Address'
					type='text'
					fullWidth
					variant='standard'
					onChange={({ target }) => setAdress(target.value)}
				/>
				<TextField
					value={Kaupunki}
					autoFocus
					margin='dense'
					id='Kaupunki'
					label='Kaupunki'
					type='text'
					fullWidth
					variant='standard'
					onChange={({ target }) => setKaupunki(target.value)}
				/>
				<TextField
					value={Stad}
					autoFocus
					margin='dense'
					id='Stad'
					label='Stad'
					type='text'
					fullWidth
					variant='standard'
					onChange={({ target }) => setStad(target.value)}
				/>
				<TextField
					value={Operaattor}
					autoFocus
					margin='dense'
					id='Operaattor'
					label='Operaattori'
					type='text'
					fullWidth
					variant='standard'
					onChange={({ target }) => setOperaattor(target.value)}
				/>
				<TextField
					value={Kapasiteet}
					autoFocus
					margin='dense'
					id='Kapasiteet'
					label='Kapasiteet'
					type='number'
					fullWidth
					variant='standard'
					onChange={({ target }) => setKapasiteet(target.value)}
				/>
				<TextField
					value={x}
					autoFocus
					margin='dense'
					id='x'
					label='Longitude'
					type='number'
					fullWidth
					variant='standard'
					onChange={({ target }) => setX(target.value)}
				/>
				<TextField
					value={y}
					autoFocus
					margin='dense'
					id='y'
					label='Latitude'
					type='number'
					fullWidth
					variant='standard'
					onChange={({ target }) => setY(target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleAdd}>Add</Button>
			</DialogActions>
		</Dialog>
	);
};

export default NewStationDialog;
