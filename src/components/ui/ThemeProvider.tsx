"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setThemeState] = useState<Theme>("light");

    const applyTheme = (t: Theme) => {
        setThemeState(t);
        if (t === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        const systemQuery = window.matchMedia("(prefers-color-scheme: dark)");

        if (savedTheme) {
            setTimeout(() => applyTheme(savedTheme), 0);
        } else {
            setTimeout(() => applyTheme(systemQuery.matches ? "dark" : "light"), 0);
            
            const handler = (e: MediaQueryListEvent) => {
                if (!localStorage.getItem("theme")) {
                    applyTheme(e.matches ? "dark" : "light");
                }
            };
            systemQuery.addEventListener("change", handler);
            return () => systemQuery.removeEventListener("change", handler);
        }
    }, []);

    const setTheme = (t: Theme) => {
        localStorage.setItem("theme", t);
        applyTheme(t);
    };

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
