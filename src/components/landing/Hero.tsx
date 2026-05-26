"use client";

import React from "react";
import Link from "next/link";

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass border-white/20 mb-8 animate-reveal" style={{ animationDelay: '0.1s' }}>
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold tracking-widest uppercase text-primary">
                        Next-Gen Messaging
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight animate-reveal text-foreground" style={{ animationDelay: '0.2s' }}>
                    Messaging for the <br />
                    <span className="text-gradient">Zero-Trust Era.</span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 animate-reveal leading-relaxed" style={{ animationDelay: '0.3s' }}>
                    Chatly is a serverless real-time platform with dual-layer permissions and hierarchical group structures. Built for security, designed for speed.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-reveal" style={{ animationDelay: '0.4s' }}>
                    <Link
                        href="/register"
                        className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-2xl text-lg font-bold shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300"
                    >
                        Get Started Free
                    </Link>
                    <Link
                        href="#demo"
                        className="w-full sm:w-auto px-8 py-4 glass rounded-2xl text-lg font-bold hover:bg-white/10 transition-all duration-300"
                    >
                        Live Demo
                    </Link>
                </div>

                {/* Abstract visualization */}
                <div className="mt-20 relative animate-reveal" style={{ animationDelay: '0.6s' }}>
                    <div className="relative mx-auto max-w-5xl rounded-3xl border border-border shadow-2xl overflow-hidden glass p-4">
                        <div className="aspect-[16/9] bg-card rounded-2xl flex items-center justify-center overflow-hidden border border-border">
                            {/* Animated placeholder for chat app */}
                            <div className="relative w-full h-full p-8 flex space-x-4">
                                <div className="w-1/3 h-full bg-white/5 rounded-xl animate-pulse" />
                                <div className="flex-1 space-y-4">
                                    <div className="h-12 bg-white/10 rounded-xl w-3/4 animate-float" style={{ animationDelay: '1s' }} />
                                    <div className="h-12 bg-emerald-500/20 rounded-xl w-1/2 self-end animate-float" style={{ animationDelay: '2s' }} />
                                    <div className="h-40 bg-white/5 rounded-xl w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Blobs */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] animate-float" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
                </div>
            </div>
        </section>
    );
};

export default Hero;