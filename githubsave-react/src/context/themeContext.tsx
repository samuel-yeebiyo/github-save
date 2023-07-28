import { createContext, useReducer, useContext } from "react";

const initialTheme = {
  dark: true,
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
  return {
    ...theme,
    ...action,
  };
};
