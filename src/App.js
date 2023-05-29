import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Container, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "./components/Header";
import SetsPage from "./pages/SetsPage";

const light = {
  palette: {
    mode: "light",
  },
};

const dark = {
  palette: {
    mode: "dark",
  },
};

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [address, setAddress] = useState("");
  const [setNumber, setSetNumber] = useState(1);

  const changeTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const updateAddress = (newAddress) => {
    setAddress(newAddress);
  };

  const updateSetNumber = (newSetNumber) => {
    setSetNumber(newSetNumber);
  };

  const SetsPageWrapper = () => {
    const { address: urlAddress } = useParams();
    useEffect(() => {
      if (urlAddress) {
        setAddress(urlAddress);
      }
    }, [urlAddress]);

    return (
      <SetsPage
        address={address}
        onAddressSubmit={updateAddress}
        setNumber={setNumber}
        updateSetNumber={updateSetNumber}
      />
    );
  };

  return (
    <ThemeProvider
      theme={isDarkTheme ? createTheme(dark) : createTheme(light)}
    >
      <CssBaseline />
      <BrowserRouter>
        <Container maxWidth={false}>
          <Header
            isDarkTheme={isDarkTheme}
            changeTheme={changeTheme}
            address={address}
            updateAddress={updateAddress}
          />
          <Routes>
            <Route
              path="/"
              element={<Navigate to={`/sets/${setNumber}`} />}
            />
            <Route
              path="/sets/:setNumber"
              element={<SetsPageWrapper />}
            />
            <Route
              path="/:address/sets/:setNumber"
              element={<SetsPageWrapper />}
            />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;