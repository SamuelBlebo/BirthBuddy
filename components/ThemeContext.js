// themeContext.js
import React, { createContext, useState, useContext } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState("system");

  const currentColorScheme = theme === "system" ? systemColorScheme : theme;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
