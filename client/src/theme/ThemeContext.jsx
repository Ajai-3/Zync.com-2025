import React, { createContext, useContext, useState, useEffect } from "react";

const savedTheme = localStorage.getItem("theme") || "light";
document.body.className = savedTheme;

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const ThemeProviderComponent = ({ children }) => {
  const [themeName, setThemeName] = useState(savedTheme);

  const changeTheme = (newTheme) => {
    setThemeName(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme;
  };
  useEffect(() => {
    document.body.className = themeName;
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProviderComponent;