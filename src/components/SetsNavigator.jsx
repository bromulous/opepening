import { Box, Typography, IconButton } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const SetsNavigator = ({ address, setNumber, setName, updateSetNumber }) => {
    const navigate = useNavigate();

    const handlePrevious = () => {
        if (setNumber > 1) {
            // navigate(`/${address}/sets/${setNumber - 1}`);
            updateSetNumber(setNumber - 1);
        }
    };

    const handleNext = () => {
        // navigate(`/${address}/sets/${setNumber + 1}`);
        updateSetNumber(setNumber + 1);
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <IconButton onClick={handlePrevious} disabled={setNumber <= 1}>
                <Typography variant="h6" color={grey[500]}>
                    {"<"}
                </Typography>
            </IconButton>
            <Typography variant="h6" mx={1}>
                {setNumber} : {setName}
            </Typography>
            <IconButton onClick={handleNext}>
                <Typography variant="h6" color={grey[500]}>
                    {">"}
                </Typography>
            </IconButton>
        </Box>
    );
};

export default SetsNavigator;
