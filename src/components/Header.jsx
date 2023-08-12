import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Switch,
    TextField,
    Button,
    Menu,
    MenuItem,
} from "@mui/material";
import { useEffect } from "react";
import styled from "@emotion/styled";
import logoLight from "../assets/img/logo_light1.png";
import logoDark from "../assets/img/logo_dark1.png";
import logoLightL from "../assets/img/logo_light.png";
import logoDarkL from "../assets/img/logo_dark.png";
import cl from "../assets/img/cl3.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

const HeaderContainer = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
`;

const LogoContainer = styled(Box)`
    display: flex;
    align-items: center;
`;

const LogoImage = styled("img")`
    width: 32px;
    height: auto;
    margin-right: 8px;
`;

const ButtonContainer = styled(Box)`
    display: flex;
    align-items: center;
`;

const RoundedTextField = styled(TextField)`
    border-radius: 24px;
    .MuiOutlinedInput-root {
        border-radius: 24px;
        padding-right: 8px;
    }
    .MuiInputLabel-outlined {
        transform: translateY(7px);
    }
    .MuiOutlinedInput-input {
        padding: 10px 14px;
    }
`;

function Header({
    isDarkTheme,
    changeTheme,
    address,
    updateAddress,
    setNumber,
}) {
    const logo = isDarkTheme ? logoDark : logoLight;
    const logoL = isDarkTheme ? logoDarkL : logoLightL;
    const [inputAddress, setInputAddress] = useState(address);
    const navigate = useNavigate();

    useEffect(() => {
        setInputAddress(address);
    }, [address]);

    const debouncedUpdateAddress = debounce((inputAddress) => {
        updateAddress(inputAddress);
        if (inputAddress === "") {
            navigate(`sets/${setNumber}`);
        } else {
            navigate(`/${inputAddress}/sets/${setNumber}`);
        }
    }, 500);

    const handleAddressChange = (e) => {
        setInputAddress(e.target.value);
        debouncedUpdateAddress(e.target.value);
    };

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    return (
        <HeaderContainer>
            <LogoContainer>
                <LogoImage src={cl} alt="Logo" />
                <Typography variant="h6">Opepening</Typography>
            </LogoContainer>
            <ButtonContainer>
            <Box marginRight>
                    <a
                        href="https://checkcade.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            variant="outlined"
                            style={{
                                backgroundColor: "transparent",
                                color: "white",
                                boxShadow: "none",
                                borderColor: "gray",
                            }}
                        >
                            checkade
                        </Button>
                    </a>
                </Box>
                <Box marginRight>
                    <Button
                        variant="outlined"
                        onClick={handleMenuOpen}
                        style={{
                            backgroundColor: "transparent",
                            color: "white",
                            boxShadow: "none",
                            borderColor: "gray",
                        }}
                    >
                        OPEPEFY
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem
                            onClick={handleMenuClose}
                            component="a"
                            href="https://www.opepefy.art/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Classic
                        </MenuItem>
                        <MenuItem
                            onClick={handleMenuClose}
                            component="a"
                            href="https://twitter.opepefy.art/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Twitter
                        </MenuItem>
                    </Menu>
                </Box>
                <Box>
                    <a
                        href="https://opepen.accountant/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            variant="outlined"
                            style={{
                                backgroundColor: "transparent",
                                color: "white",
                                boxShadow: "none",
                                borderColor: "gray",
                            }}
                        >
                            Odds
                        </Button>
                    </a>
                </Box>
                <Box marginRight={2} marginLeft>
                    <RoundedTextField
                        variant="outlined"
                        value={inputAddress}
                        onChange={handleAddressChange}
                        InputLabelProps={{ shrink: false }}
                        placeholder="Enter your address"
                    />
                </Box>
                {/* <FormGroup>
          <FormControlLabel
            control={<Switch checked={isDarkTheme} onChange={changeTheme} />}
            label="Dark Theme"
          />
        </FormGroup> */}
            </ButtonContainer>
        </HeaderContainer>
    );
}

export default Header;
