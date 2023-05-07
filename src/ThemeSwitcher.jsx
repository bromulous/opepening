import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import Switch from "@mui/material/Switch";

const ThemeSwitcher = () => {
  const { themeMode, setThemeMode } = useContext(ThemeContext);

  const handleThemeChange = (event) => {
    setThemeMode(event.target.checked ? "dark" : "light");
  };

  return (
    <Switch
      checked={themeMode === "dark"}
      onChange={handleThemeChange}
      color="default"
    />
  );
};

export default ThemeSwitcher;
