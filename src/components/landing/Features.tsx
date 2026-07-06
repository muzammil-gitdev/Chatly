"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell, Users, Settings, MessageSquare } from "lucide-react";
import ChatlyLogo from "./ChatlyLogo";

const Features = () => {
    return (
        <section id="features" className="py-20 sm:py-24 bg-secondary/30 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12 sm:mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-black mb-4"
                    >
                        Everything your chats need.
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed"
                    >
                        A focused messaging experience with realtime conversations, groups, notifications, and enough control to keep daily communication simple.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:auto-rows-[240px]">
                    
                    {/* Card 1: Large - Real-time Messaging */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-2 lg:row-span-2 p-6 sm:p-8 rounded-3xl glass border border-primary/10 dark:border-border/50 shadow-xl dark:shadow-none hover:border-primary/30 transition-all duration-300 relative overflow-hidden group flex min-h-[360px] flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:bg-primary/20 transition-colors duration-500" />
                        
                        <div className="relative z-10 flex-1 flex flex-col justify-center items-center mb-8">
                            {/* CSS Typing Indicator Animation */}
                            <div className="w-full max-w-[280px] bg-background/80 border border-border backdrop-blur-sm rounded-2xl p-4 shadow-xl flex items-end gap-2">
                                <ChatlyLogo showText={false} markClassName="h-10 w-10 shrink-0" />
                                <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-sm flex space-x-1 items-center h-10">
                                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 text-emerald-500">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Real-time Sync</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Send messages, see delivery states, and keep conversations updated without refreshing the page.
                            </p>
                        </div>
                    </motion.div>

                    {/* Card 2: Medium - Push Notifications */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-2 lg:row-span-1 p-6 sm:p-8 rounded-3xl glass border border-primary/10 dark:border-border/50 shadow-xl dark:shadow-none hover:border-primary/30 transition-all duration-300 relative overflow-hidden group flex items-center justify-between gap-6"
                    >
                        <div className="relative z-10 max-w-[200px] md:max-w-[260px]">
                            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 text-cyan-500">
                                <Bell className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Push Notifications</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Never miss a beat. Smart delivery ensures you only get notified for what matters most.
                            </p>
                        </div>

                        <div className="relative z-10 hidden h-32 w-32 shrink-0 items-center justify-center sm:flex">
                            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500" />
                            <Bell className="w-16 h-16 text-cyan-500 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
                        </div>
                    </motion.div>

                    {/* Card 3: Small - Group Chats */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="lg:col-span-1 lg:row-span-1 p-6 rounded-3xl glass border border-primary/10 dark:border-border/50 shadow-xl dark:shadow-none hover:border-primary/30 transition-all duration-300 relative overflow-hidden group flex min-h-[220px] flex-col justify-between lg:min-h-0"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-105 transition-transform duration-300">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-1">Group Chats</h3>
                            <p className="text-sm text-muted-foreground">Create shared spaces for friends, teams, and quick project updates.</p>
                        </div>
                    </motion.div>

                    {/* Card 4: Small - Profile Customization */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="lg:col-span-1 lg:row-span-1 p-6 rounded-3xl glass border border-primary/10 dark:border-border/50 shadow-xl dark:shadow-none hover:border-primary/30 transition-all duration-300 relative overflow-hidden group flex min-h-[220px] flex-col justify-between lg:min-h-0"
                    >
                        <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 group-hover:rotate-90 transition-transform duration-500">
                            <Settings className="w-6 h-6 text-foreground" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-1">Customization</h3>
                            <p className="text-sm text-muted-foreground">Manage profile details and keep your chat workspace familiar.</p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default Features;
