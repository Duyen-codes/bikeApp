import React from "react";
import { Typography } from "@mui/material";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import helsinkicitybikestation from "../assets/helsinkicitybikestation.jpeg";
import bikes1 from "../assets/bikes1.jpeg";
import Helsinkibikes from "../assets/Helsinki-bikes.jpg";

import { Slide } from "react-awesome-reveal";

const Home = () => {
	return (
		<Box
			sx={{ pt: "10rem" }}
			style={{
				background: `linear-gradient(
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0.5)
    ), url(${Helsinkibikes})`,
				backgroundSize: "cover",
				backgroundPosition: "bottom ",
				height: "100vh",
			}}
		>
			<Slide direction='down' triggerOnce>
				<div
					style={{
						color: "white",
						paddingTop: "5rem",
					}}
				>
					<Typography
						variant='h2'
						component='h2'
						align='center'
						pt={2}
						sx={{
							fontWeight: "bold",
							textTransform: "uppercase",
							color: "white",
						}}
					>
						Helsinki city bikes
					</Typography>
					<Container maxWidth='sm' sx={{ textAlign: "center" }}>
						<Typography sx={{ p: 2 }}>
							This application shows data of city bikes in the Helsinki Capital
							area.
						</Typography>
						<Stack
							direction={{ xs: "column", sm: "row" }}
							spacing={{ xs: 1, sm: 2, md: 4 }}
							justifyContent='center'
							alignItems='center'
						>
							<Button
								variant='contained'
								size='medium'
								href='/stations'
								sx={{
									display: "inline",
									textDecoration: "none",
									textTransform: "uppercase",
								}}
							>
								Explore stations{" "}
							</Button>

							<Button
								variant='contained'
								size='medium'
								href='/journeys'
								sx={{
									display: "inline",
									textDecoration: "none",
									textTransform: "uppercase",
								}}
							>
								Explore journeys{" "}
							</Button>
						</Stack>
					</Container>
				</div>
			</Slide>
		</Box>
	);
};

export default Home;
