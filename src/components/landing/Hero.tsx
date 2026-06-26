"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const Hero = () => {
    const { user, loading } = useAuth();

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
                    Seamless Conversations, <br />
                    <span className="text-gradient">Real-Time Connection.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                >
                    Experience zero lag with secure OTP verification, real-time sync, and fluid group chats. Built for the way you actually want to communicate.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto mx-auto"
                >
                    <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300 text-center">
                        Start Chatting Now
                    </Link>

                    <Link href="#how-it-works" className="w-full sm:w-auto px-10 py-5 glass border border-border rounded-2xl font-bold hover:bg-secondary transition-all duration-300 text-center">
                        How it Works
                    </Link>
                </motion.div>
            </div>

            {/* Animated Grid & Orbs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 dark:opacity-20 z-0 overflow-hidden">
                <div className="absolute w-[800px] h-[800px] border-[1px] border-primary/20 rounded-full animate-spin-slow" style={{ animationDuration: '40s' }} />
                <div className="absolute w-[600px] h-[600px] border-[1px] border-primary/20 rounded-full animate-spin-slow" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
                <div className="absolute w-[400px] h-[400px] border-[1px] border-primary/30 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
                
                {/* Floating blur orbs */}
                <motion.div 
                    animate={{ y: [0, -50, 0], x: [0, 30, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/3 left-1/4 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"
                />
                <motion.div 
                    animate={{ y: [0, 50, 0], x: [0, -40, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"
                />
            </div>

            {/* Background Decorations */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
        </section>
    );
};

export default Hero;