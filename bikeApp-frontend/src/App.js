import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import axios from "axios";

// Components
import Stations from "./components/Stations";
import Home from "./components/Home";
import Journeys from "./components/Journeys";
import StationDetails from "./components/StationDetails";
import JourneyList from "./components/JourneyList";

import NavBar from "./components/NavBar";

const App = () => {
	return (
		<div className='App'>
			<NavBar />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/stations' element={<Stations />} />
				<Route path='/journeys' element={<JourneyList />} />
				<Route path='/stations/:stationId' element={<StationDetails />} />
			</Routes>
		</div>
	);
};

export default App;
