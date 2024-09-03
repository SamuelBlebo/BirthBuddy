import { DefaultTheme, DarkTheme } from "@react-navigation/native";

const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#fff",
    text: "#333",
    primary: "#007bff",
  },
};

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#232628",
    text: "#fff",
    primary: "#007bff",
  },
};
