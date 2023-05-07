import { createContext, useState, useEffect } from "react";
import { createTheme } from "@mui/material/styles";

const getTheme = (mode) =>
    createTheme({
        palette: {
            mode,
            // Add any other theme customization here
        },
    });

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState("light");
    const [theme, setTheme] = useState(getTheme(themeMode));

    useEffect(() => {
        setTheme(getTheme(themeMode));
    }, [themeMode]);

    return (
        <ThemeContext.Provider value={{ theme, themeMode, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};