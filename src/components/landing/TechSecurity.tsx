"use client";

import React from "react";
import { motion } from "framer-motion";
import { Database, Zap, LockKeyhole } from "lucide-react";

const TechSecurity = () => {
    return (
        <section id="security" className="py-24 relative bg-secondary/30">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-1/2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-black mb-6">
                                Uncompromising Security. <br />
                                <span className="text-gradient">Lightning Fast.</span>
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                As developers, we know that trust is built on robust architecture. Chatly combines enterprise-grade security protocols with edge-network speeds, ensuring your data remains private without sacrificing performance.
                            </p>
                        </motion.div>

                        <div className="space-y-6">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="flex items-start space-x-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-500 mt-1">
                                    <LockKeyhole className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">Secure OTP Verification</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">Identity validation backed by a dual-layer permission system ensures only authorized individuals access your workspace.</p>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex items-start space-x-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0 text-cyan-500 mt-1">
                                    <Database className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">Encrypted Database</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">Your data is stored in state-of-the-art secure databases, protecting against breaches and unauthorized access.</p>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex items-start space-x-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 text-indigo-500 mt-1">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">Real-Time Updates</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">Powered by edge functions and WebSockets, delivering sub-millisecond state mutations globally.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="md:w-1/2 w-full">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-square max-w-md mx-auto"
                        >
                            {/* Decorative Tech Graphic */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl opacity-50" />
                            <div className="absolute inset-8 rounded-full border border-primary/20 animate-spin-slow" style={{ animationDuration: '20s' }} />
                            <div className="absolute inset-16 rounded-full border border-primary/40 border-dashed animate-spin-slow" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 bg-background border border-border shadow-2xl rounded-2xl flex items-center justify-center z-20">
                                    <LockKeyhole className="w-12 h-12 text-primary" />
                                </div>
                            </div>
                            
                            {/* Floating nodes */}
                            <div className="absolute top-1/4 left-0 w-12 h-12 glass rounded-xl flex items-center justify-center animate-float shadow-lg">
                                <Database className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div className="absolute bottom-1/4 right-0 w-12 h-12 glass rounded-xl flex items-center justify-center animate-float shadow-lg" style={{ animationDelay: '1s' }}>
                                <Zap className="w-6 h-6 text-cyan-500" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechSecurity;
