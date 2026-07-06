"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => {
    return (
        <section className="py-20 sm:py-24 relative overflow-hidden bg-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative overflow-hidden rounded-3xl border border-border bg-secondary/40 p-8 text-center shadow-2xl shadow-black/5 dark:shadow-black/20 sm:p-12 md:p-16"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_75%_15%,rgba(6,182,212,0.12),transparent_30%)]" />

                    <div className="relative z-10">
                        <h2 className="text-3xl font-black leading-tight tracking-normal sm:text-4xl md:text-6xl">
                            Ready to upgrade your{" "}
                            <span className="text-gradient">chatting experience?</span>
                        </h2>
                        <p className="mx-auto mb-8 mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg md:text-xl">
                            Start a cleaner messaging workspace with OTP sign-in, realtime conversations, and group chats that feel easy to manage.
                        </p>
                        
                        <Link 
                            href="/register" 
                            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-bold text-primary-foreground shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-emerald-500/35 sm:px-10"
                        >
                            Join Now
                            <ArrowRight className="h-4.5 w-4.5" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCTA;
