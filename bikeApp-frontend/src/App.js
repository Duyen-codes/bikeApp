import "./App.css";
import { Routes, Route } from "react-router-dom";

// Components
import Stations from "./components/Stations";
import Home from "./components/Home";
import Journeys from "./components/Journeys";
import StationDetails from "./components/StationDetails";

import NavBar from "./components/NavBar";

const App = () => {
	return (
		<div className='App'>
			<NavBar />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/stations' element={<Stations />} />
				<Route path='/journeys' element={<Journeys />} />
				<Route path='/stations/:stationId' element={<StationDetails />} />
			</Routes>
		</div>
	);
};

export default App;
