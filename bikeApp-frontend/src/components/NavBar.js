import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import { NavLink } from "react-router-dom";
import Link from "@mui/material/Link";

const drawerWidth = 240;
const navItems = ["stations", "journeys"];

function DrawerAppBar(props) {
	const { window } = props;
	const [mobileOpen, setMobileOpen] = React.useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen((prevState) => !prevState);
	};

	const drawer = (
		<Box
			onClick={handleDrawerToggle}
			sx={{ textAlign: "center", backgroundColor: "primary" }}
		>
			<Link href='/' sx={{ my: 2, textDecoration: "none" }} variant='h5'>
				<DirectionsBikeIcon fontSize='large' /> CityBike
			</Link>
			<Divider />
			<List>
				{navItems.map((item) => (
					<ListItem key={item} disablePadding>
						<ListItemButton sx={{ textAlign: "center" }}>
							<NavLink
								to={`/${item}`}
								key={item}
								style={{
									textDecoration: "none",
									color: "#1976d2",
									fontSize: "18px",
								}}
							>
								{item}
							</NavLink>
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	const container =
		window !== undefined ? () => window().document.body : undefined;

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar component='nav'>
				<Toolbar>
					<IconButton
						color='inherit'
						aria-label='open drawer'
						edge='start'
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: "none" } }}
					>
						<MenuIcon />
					</IconButton>
					<Link
						href='/'
						color='inherit'
						variant='h5'
						sx={{
							flexGrow: 1,
							textDecoration: "none",
							display: { xs: "none", sm: "block" },
						}}
					>
						<DirectionsBikeIcon fontSize='large' /> CityBike
					</Link>
					<Box sx={{ display: { xs: "none", sm: "block" } }}>
						{navItems.map((item) => (
							<NavLink
								to={`/${item}`}
								key={item}
								style={{
									color: "white",
									textDecoration: "none",
									paddingLeft: "2rem",
									fontSize: "18px",
								}}
							>
								{item}
							</NavLink>
						))}
					</Box>
				</Toolbar>
			</AppBar>
			<Box component='nav'>
				<Drawer
					container={container}
					variant='temporary'
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: "block", sm: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
				>
					{drawer}
				</Drawer>
			</Box>
			<Box component='main' sx={{ p: 3 }}>
				<Toolbar />
			</Box>
		</Box>
	);
}

export default DrawerAppBar;
