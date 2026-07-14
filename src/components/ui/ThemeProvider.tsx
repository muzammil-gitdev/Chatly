"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_KEY = "theme";
const THEME_CHANGE_EVENT = "chatly-theme-change";

const isTheme = (value: string | null | undefined): value is Theme => value === "light" || value === "dark";

const readStoredTheme = (): Theme => {
  if (typeof window === "undefined" || typeof document === "undefined") return "light";
  const localTheme = window.localStorage.getItem(THEME_KEY);
  if (isTheme(localTheme)) return localTheme;

  const cookieTheme = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${THEME_KEY}=`))
    ?.split("=")[1];

  return isTheme(cookieTheme) ? cookieTheme : "light";
};

const writeTheme = (theme: Theme) => {
  window.localStorage.setItem(THEME_KEY, theme);
  document.cookie = `${THEME_KEY}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
};

const subscribeToTheme = (callback: () => void) => {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, callback);
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useSyncExternalStore<Theme>(subscribeToTheme, readStoredTheme, () => "light");

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    writeTheme(nextTheme);
    applyTheme(nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(readStoredTheme() === "dark" ? "light" : "dark");
  }, [setTheme]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
