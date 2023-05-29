import { Box, Typography, Grid } from "@mui/material";
import Deck from "../components/Deck";
import logoDarkL from "../assets/img/deck1.png";

const HomePage = () => {
    const svgUrl = "../assets/img/deck3d.svg"; // Replace with your SVG file path

    // Add your deck URLs here
    const deckUrls = [logoDarkL, logoDarkL, logoDarkL, logoDarkL];

    return (
        <Box>
            <Typography
                variant="h2"
                align="center"
                gutterBottom
                sx={{ marginTop: "2rem" }}
            >
                Opepen Meta Packs
            </Typography>
            <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ marginTop: "2rem" }}
            >
                {deckUrls.map((url, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <Box display="flex" justifyContent="center">
                            <Deck svgUrl={url} />
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Add more content for the homepage here */}
        </Box>
    );
};

export default HomePage;
