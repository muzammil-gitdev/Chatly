"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "../ui/ThemeToggle";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? "glass py-3 shadow-lg" : "bg-transparent py-5"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-xl">C</span>
                    </div>
                    <span className="text-2xl font-bold font-outfit tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Chatly
                    </span>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
                    <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
                    <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
                </div>

                <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    <Link
                        href="/login"
                        className="px-5 py-2 text-sm font-semibold hover:text-primary transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;