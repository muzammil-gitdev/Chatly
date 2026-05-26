"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    Mail,
    Lock,
    User,
    ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RegisterPage = () => {
    const [step, setStep] = useState(1); // 1: Signup, 2: OTP

    return (
        <div className="min-h-screen py-24 flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center space-x-2 mb-8 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">C</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Chatly</span>
                    </Link>
                    <h1 className="text-3xl font-black mb-2">Create Account.</h1>
                    <p className="text-muted-foreground">Join the zero-trust messaging ecosystem.</p>
                </div>

                <div className="glass p-8 rounded-3xl border-border shadow-2xl relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="signup"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">Username</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-green-500 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="johndoe"
                                            className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-transparent focus:border-primary/30 focus:bg-background rounded-2xl transition-all duration-300 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-green-500 transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="name@company.com"
                                            className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-transparent focus:border-primary/30 focus:bg-background rounded-2xl transition-all duration-300 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-green-500 transition-colors" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-transparent focus:border-primary/30 focus:bg-background rounded-2xl transition-all duration-300 outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-xl shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
                                >
                                    <span>Continue</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShieldCheck className="w-8 h-8 text-emerald-500" />
                                    </div>
                                    <h2 className="text-xl font-bold">Verify Identity</h2>
                                    <p className="text-sm text-muted-foreground mt-1">We've sent a code to your email.</p>
                                </div>

                                <div className="flex justify-between space-x-2">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            maxLength={1}
                                            className="w-12 h-14 bg-secondary/50 border border-transparent focus:border-primary/30 focus:bg-background rounded-xl text-center text-xl font-bold outline-none transition-all duration-300"
                                        />
                                    ))}
                                </div>

                                <button
                                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-xl shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
                                >
                                    <span>Verify & Complete</span>
                                    <ShieldCheck className="w-5 h-5" />
                                </button>

                                <button
                                    onClick={() => setStep(1)}
                                    className="w-full text-sm font-bold text-muted-foreground hover:text-green-500 transition-colors"
                                >
                                    Change Email / Back
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account? <Link href="/login" className="font-bold text-green-600 hover:underline">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div> // <-- Fixed from </section> to </div>
    );
};

export default RegisterPage;