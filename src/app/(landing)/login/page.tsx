"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

const LoginPage = () => {
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
                    <h1 className="text-3xl font-black mb-2">Welcome Back.</h1>
                    <p className="text-muted-foreground">Sign in to your secure workspace.</p>
                </div>

                <div className="glass p-8 rounded-3xl border-border shadow-2xl">
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
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
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="password" 
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-transparent focus:border-primary/30 focus:bg-background rounded-2xl transition-all duration-300 outline-none"
                                />
                            </div>
                        </div>

                        <div className="text-right">
                            <Link href="#" className="text-sm font-bold text-primary hover:underline">Forgot Password?</Link>
                        </div>

                        <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2">
                            <span>Sign In</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account? <Link href="/register" className="font-bold text-primary hover:underline">Create Account</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
