import { createContext, useReducer, useContext } from "react";

const theme = localStorage.getItem("ghs-theme");
if (!theme) localStorage.setItem("ghs-theme", "dark");

const initialTheme = {
  dark: theme ? theme == "dark" : "dark",
};

const ThemeContext = createContext(initialTheme);
const ThemeDispatchContext = createContext<any>(null);

export default ThemeContext;

export const ThemeProvider = ({ children }: any) => {
  const [theme, dispatch] = useReducer(themeReducer, initialTheme);

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeDispatchContext.Provider value={dispatch}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeDispatch() {
  return useContext(ThemeDispatchContext);
}

const themeReducer = (theme: typeof initialTheme, action: any) => {
  localStorage.setItem("ghs-theme", theme.dark ? "light" : "dark");
  return {
    ...theme,
    ...action,
  };
};
