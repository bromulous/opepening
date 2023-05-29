import { Box, Typography, Button, FormGroup, FormControlLabel, Switch, TextField } from "@mui/material";
import { useEffect } from "react";
import styled  from "@emotion/styled";
import logo from "../assets/img/card_logo.png";
import logoLight from "../assets/img/logo_light1.png";
import logoDark from "../assets/img/logo_dark1.png";
import logoLightL from "../assets/img/logo_light.png";
import logoDarkL from "../assets/img/logo_dark.png";
import { useState } from "react";
import {useNavigate} from "react-router-dom";

const HeaderContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`

const LogoContainer = styled(Box)`
  display: flex;
  align-items: center;
`

const LogoImage = styled('img')`
  width: 32px;
  height: 32px;
  margin-right: 8px;
`

const ButtonContainer = styled(Box)`
  display: flex;
  align-items: center;
`

const RoundedButton = styled(Button)`
  border-radius: 24px;
  margin-right: 8px;
`

function Header({ isDarkTheme, changeTheme, address, updateAddress }) { // Add address and updateAddress props
  const logo = isDarkTheme ? logoDark : logoLight;
  const logoL = isDarkTheme ? logoDarkL : logoLightL;
  const [inputAddress, setInputAddress] = useState(address);
  const navigate = useNavigate();

  useEffect(() => {
    setInputAddress(address);
  }, [address]);

  const handlePacksClick = () => {
    if (inputAddress) {
      updateAddress(inputAddress); // Update the address using the callback
      navigate(`/${inputAddress}/sets/1`);
    }
  };

  return (
    <HeaderContainer>
      <LogoContainer>
        <LogoImage src={logoL} alt="Logo" />
        <Typography variant="h6">Opepening</Typography>
      </LogoContainer>
        <ButtonContainer>
        <TextField
          variant="outlined"
          label="Enter your address"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
        />
          <RoundedButton
            variant="outlined"
            // startIcon={<img src={logo} alt="Packs" />}
            onClick={handlePacksClick}
          >
            Submit
          </RoundedButton>
        
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