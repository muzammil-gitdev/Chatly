"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-3 rounded-xl glass border border-border hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
            aria-label="Toggle theme"
        >
            <div className="relative z-10">
                {theme === "light" ? (
                    <Sun className="w-5 h-5 text-amber-500 transition-transform duration-500 group-hover:rotate-90" />
                ) : (
                    <Moon className="w-5 h-5 text-cyan-400 transition-transform duration-500 group-hover:-rotate-12" />
                )}
            </div>
            
            {/* Subtle glow effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${
                theme === "light" ? "from-amber-200/20 to-transparent" : "from-cyan-400/10 to-transparent"
            }`} />
        </button>
    );
};

export default ThemeToggle;
