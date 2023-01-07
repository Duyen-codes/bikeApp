import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import axios from "axios";

// Components
import Stations from "./components/Stations";
import Home from "./components/Home";
import Journeys from "./components/Journeys";

const App = () => {
	return (
		<div className='App'>
			<nav>
				<Link to='/'>home</Link>
				<Link to='/stations'>Stations</Link>
				<Link to='/journeys'>Journeys</Link>
			</nav>

			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='stations' element={<Stations />} />
				<Route path='journeys' element={<Journeys />} />
			</Routes>
		</div>
	);
};

export default App;
