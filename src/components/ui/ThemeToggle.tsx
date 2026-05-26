"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = () => {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const initialTheme = savedTheme || systemTheme;
        
        setTheme(initialTheme);
        if (initialTheme === "dark") {
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:scale-110 transition-transform duration-300 overflow-hidden relative"
            aria-label="Toggle Theme"
        >
            <AnimatePresence mode="wait">
                {theme === "light" ? (
                    <motion.div
                        key="sun"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Sun className="w-5 h-5 text-amber-500" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Moon className="w-5 h-5 text-indigo-400" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
};

export default ThemeToggle;
