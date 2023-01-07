import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useMatch,
} from "react-router-dom";
import Stations from "./components/Stations";
import Home from "./components/Home";
import Journeys from "./components/Journeys";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<Router>
			<App />
		</Router>
	</React.StrictMode>,
);
