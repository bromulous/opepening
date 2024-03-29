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
import { CachedSetsProvider } from "./components/CachedSetsContext";
import { CircularProgress } from "@mui/material";

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
    const [setNumber, setSetNumber] = useState(null);

    useEffect(() => {
        fetch("https://api.opepen.art/v1/opepen/sets")
            .then((response) => response.json())
            .then((data) => {
                setSetNumber(data.length);
            })
            .catch((error) => console.error("Error:", error));
    }, []);

    const changeTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    const updateAddress = (newAddress) => {
        // console.log("updated address: ", newAddress);
        if (newAddress == !address) {
            setAddress(newAddress);
        }
    };

    const updateSetNumber = (newSetNumber) => {
        // console.log("updated set number: ", newSetNumber);
        setSetNumber(newSetNumber);
    };

    const SetsPageWrapper = () => {
        const { address: urlAddress, setNumber: urlSetNumber } = useParams();
        const navigate = useNavigate();

        useEffect(() => {
            if (urlAddress) {
                setAddress(urlAddress);
            }
        }, [urlAddress]);

        useEffect(() => {
            if (urlSetNumber && parseInt(urlSetNumber) !== setNumber) {
                updateSetNumber(parseInt(urlSetNumber));
            }
        }, [urlSetNumber]);

        useEffect(() => {
            var _mtm = window._mtm = window._mtm || [];
            _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.async=true; g.src='https://cdn.matomo.cloud/opepeningart.matomo.cloud/container_weAbtC96.js'; s.parentNode.insertBefore(g,s);
           }, [])

        const handleAddressSubmit = (newAddress) => {
            if (newAddress === address) {
                return;
            }
            updateAddress(newAddress);
            navigate(`/${newAddress}/sets/${setNumber}`);
        };

        const handleSetUpdate = (newSetNumber) => {
            updateSetNumber(newSetNumber);
            if (address) {
                navigate(`/${address}/sets/${newSetNumber}`);
            } else {
                navigate(`/sets/${newSetNumber}`);
            }
        };

        return (
            <SetsPage
                address={address}
                onAddressSubmit={handleAddressSubmit}
                setNumber={setNumber}
                updateSetNumber={handleSetUpdate}
            />
        );
    };

    if (setNumber === null) {
        return <CircularProgress />;
    }

    return (
        <ThemeProvider
            theme={isDarkTheme ? createTheme(dark) : createTheme(light)}
        >
            <CachedSetsProvider address={address}>
                <CssBaseline />
                <BrowserRouter>
                    <Container maxWidth={false}>
                        <Header
                            isDarkTheme={isDarkTheme}
                            changeTheme={changeTheme}
                            address={address}
                            updateAddress={updateAddress}
                            setNumber={setNumber}
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
            </CachedSetsProvider>
        </ThemeProvider>
    );
};

export default App;
