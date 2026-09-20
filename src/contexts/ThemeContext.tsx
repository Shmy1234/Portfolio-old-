import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type ThemeMode = "autumn" | "night" | "winter";

interface ThemeContextType {
  theme: ThemeMode;
  cycleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("autumn");

  const cycleTheme = useCallback(() => {
    setTheme((current) => {
      switch (current) {
        case "autumn":
          return "night";
        case "night":
          return "winter";
        case "winter":
          return "autumn";
        default:
          return "autumn";
      }
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
