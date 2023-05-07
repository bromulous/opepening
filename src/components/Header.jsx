import { Box, Typography, Button, FormGroup, FormControlLabel, Switch } from "@mui/material";
import styled  from "@emotion/styled";
import logo from "../assets/img/card_logo.png";
import logoLight from "../assets/img/logo_light1.png";
import logoDark from "../assets/img/logo_dark1.png";
import logoLightL from "../assets/img/logo_light.png";
import logoDarkL from "../assets/img/logo_dark.png";
// import packsIcon from "../assets/img/packs_icon.png";

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

function Header({ isDarkTheme, changeTheme }) {
  const logo = isDarkTheme ? logoDark : logoLight;
  const logoL = isDarkTheme ? logoDarkL : logoLightL;
  return (
    <HeaderContainer>
      <LogoContainer>
        <LogoImage src={logoL} alt="Logo" />
        <Typography variant="h6">Opepen Packs</Typography>
      </LogoContainer>
      <ButtonContainer>
        <RoundedButton variant="outlined" startIcon={<img src={logo} alt="Packs" />}>
          Packs
        </RoundedButton>
        <RoundedButton variant="outlined">Connect</RoundedButton>
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