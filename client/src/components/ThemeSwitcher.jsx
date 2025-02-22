import React from "react";
import { useTheme } from "../theme/ThemeContext";
import { Select, MenuItem } from "@mui/material";

const ThemeSwitcher = () => {
  const { themeName, changeTheme } = useTheme();

  return (
    <div className="p-4 flex justify-center">
      <Select value={themeName} onChange={(e) => changeTheme(e.target.value)}>
        <MenuItem value="light">Light Theme</MenuItem>
        <MenuItem value="dark">Dark Theme</MenuItem>
        <MenuItem value="blue">Blue Theme</MenuItem>
        <MenuItem value="green">Green Theme</MenuItem>
      </Select>
    </div>
  );
};

export default ThemeSwitcher;
