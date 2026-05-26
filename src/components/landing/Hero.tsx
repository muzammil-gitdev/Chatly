"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Hero = () => {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8 mb-20 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 whitespace-nowrap"
                >
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary">Next-Gen Messaging</span>
                </motion.div>
                
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight text-foreground"
                >
                    Messaging for the <br />
                    <span className="text-gradient">Zero-Trust Era.</span>
                </motion.h1>
                
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                >
                    Chatly is a serverless real-time platform with dual-layer permissions and hierarchical group structures. Built for security, designed for speed.
                </motion.p>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto mx-auto"
                >
                    <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300 text-center">
                        Get Started Free
                    </Link>
                    <Link href="/about" className="w-full sm:w-auto px-10 py-5 glass border border-border rounded-2xl font-bold hover:bg-secondary transition-all duration-300 text-center">
                        How it Works
                    </Link>
                </motion.div>
            </div>

            {/* Restored Mockup Animation */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-5xl w-full mx-auto relative group px-4 sm:px-0"
                id="demo"
            >
                <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="glass p-2 sm:p-4 rounded-[2rem] border-border shadow-2xl relative overflow-hidden">
                    <div className="aspect-[16/9] bg-card rounded-2xl flex items-center justify-center overflow-hidden border border-border">
                        {/* Animated placeholder for chat app */}
                        <div className="relative w-full h-full p-4 sm:p-12 flex space-x-6">
                            <div className="w-1/4 h-full bg-secondary/80 rounded-2xl animate-pulse" />
                            <div className="flex-1 space-y-6">
                                <div className="h-14 bg-secondary/90 rounded-2xl w-3/4 animate-float" style={{ animationDelay: '1s' }} />
                                <div className="h-14 bg-emerald-500/40 rounded-2xl w-1/2 self-end animate-float" style={{ animationDelay: '2s' }} />
                                <div className="h-44 bg-secondary/60 rounded-2xl w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
            
            {/* Background Decorations */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
        </section>
    );
};

export default Hero;