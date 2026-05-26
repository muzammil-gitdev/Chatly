"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
    Mail, 
    ArrowRight, 
    ShieldCheck, 
    ChevronLeft,
    Handshake
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [email, setEmail] = useState("");

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
                        <span className="text-2xl font-bold font-outfit tracking-tight">Chatly</span>
                    </Link>
                    <h1 className="text-3xl font-black mb-2">Reset Password.</h1>
                    <p className="text-muted-foreground">We'll help you get back into your account.</p>
                </div>

                <div className="glass p-8 rounded-3xl border-border shadow-2xl relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="email"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@company.com"
                                            className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-transparent focus:border-primary/30 focus:bg-background rounded-2xl transition-all duration-300 outline-none"
                                        />
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setStep(2)}
                                    disabled={!email}
                                    className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    <span>Send Reset Code</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                
                                <Link href="/login" className="flex items-center justify-center space-x-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors pt-2">
                                    <ChevronLeft className="w-4 h-4" />
                                    <span>Back to Login</span>
                                </Link>
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
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShieldCheck className="w-8 h-8 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold">Check your email</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Sent code to <b>{email}</b></p>
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

                                <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2">
                                    <span>Verify Code</span>
                                    <ShieldCheck className="w-5 h-5" />
                                </button>

                                <button 
                                    onClick={() => setStep(1)}
                                    className="w-full text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Resend Code or Change Email
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
