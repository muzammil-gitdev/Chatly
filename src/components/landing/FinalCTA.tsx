"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const FinalCTA = () => {
    return (
        <section className="py-24 relative overflow-hidden bg-background">
            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative p-12 md:p-20 rounded-[3rem] text-center overflow-hidden border border-border shadow-2xl glass"
                >
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-cyan-500/10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                            Ready to upgrade your <br className="hidden md:block" />
                            <span className="text-gradient">chatting experience?</span>
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                            Join thousands of users communicating without limits. Serverless architecture means zero lag, worldwide.
                        </p>
                        
                        <Link 
                            href="/register" 
                            className="inline-block px-12 py-5 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 hover:scale-105 transition-all duration-300 text-lg"
                        >
                            Join Now
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCTA;
