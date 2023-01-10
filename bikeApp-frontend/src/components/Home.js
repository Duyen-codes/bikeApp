import React from "react";
import { Typography } from "@mui/material";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";

const Home = () => {
	return (
		<div>
			<Typography variant='h2' component='h2' align='center' my={3}>
				City bikes
			</Typography>
			<Container maxWidth='sm'>
				<Typography>
					This application shows data of city bikes in the Helsinki Capital
					area.
				</Typography>

				<Typography>
					Explore stations {""}
					<Link
						href='/stations'
						sx={{ color: "#2196f3", display: "inline", textDecoration: "none" }}
					>
						here
					</Link>{" "}
				</Typography>
				<Typography>
					Explore journeys{" "}
					<Link
						href='/journeys'
						sx={{ color: "#2196f3", display: "inline", textDecoration: "none" }}
					>
						here
					</Link>{" "}
				</Typography>
			</Container>
		</div>
	);
};

export default Home;
