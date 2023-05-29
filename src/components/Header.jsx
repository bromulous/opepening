import { Box, Typography, FormGroup, FormControlLabel, Switch, TextField } from "@mui/material";
import { useEffect } from "react";
import styled from "@emotion/styled";
import logoLight from "../assets/img/logo_light1.png";
import logoDark from "../assets/img/logo_dark1.png";
import logoLightL from "../assets/img/logo_light.png";
import logoDarkL from "../assets/img/logo_dark.png";
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
  height: 32px;
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

function Header({ isDarkTheme, changeTheme, address, updateAddress }) {
  const logo = isDarkTheme ? logoDark : logoLight;
  const logoL = isDarkTheme ? logoDarkL : logoLightL;
  const [inputAddress, setInputAddress] = useState(address);
  const navigate = useNavigate();

  useEffect(() => {
    setInputAddress(address);
  }, [address]);

  const debouncedUpdateAddress = debounce((inputAddress) => {
    updateAddress(inputAddress);
    navigate(`/${inputAddress}/sets/1`);
  }, 500);

  const handleAddressChange = (e) => {
    setInputAddress(e.target.value);
    debouncedUpdateAddress(e.target.value);
  };

  return (
    <HeaderContainer>
      <LogoContainer>
        <LogoImage src={logoL} alt="Logo" />
        <Typography variant="h6">Opepening</Typography>
      </LogoContainer>
      <ButtonContainer>
        <Box marginRight={2}>
          <RoundedTextField
            variant="outlined"
            value={inputAddress}
            onChange={handleAddressChange}
            InputLabelProps={{ shrink: false }}
            placeholder="Enter your address"
          />
        </Box>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={isDarkTheme} onChange={changeTheme} />}
            label="Dark Theme"
          />
        </FormGroup>
      </ButtonContainer>
    </HeaderContainer>
  );
}

export default Header;