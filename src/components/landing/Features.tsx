"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell, Users, Settings, MessageSquare } from "lucide-react";

const Features = () => {
    return (
        <section id="features" className="py-24 bg-secondary/30 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-black mb-4"
                    >
                        Engineered for Excellence.
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-muted-foreground max-w-2xl mx-auto text-lg"
                    >
                        Chatly brings enterprise-grade features to a serverless architecture, delivering unparalleled control and speed.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[240px]">
                    
                    {/* Card 1: Large - Real-time Messaging */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-2 lg:row-span-2 p-8 rounded-[2rem] glass border-2 border-primary/5 dark:border-border/50 shadow-xl dark:shadow-none hover:border-primary/30 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:bg-primary/20 transition-colors duration-500" />
                        
                        <div className="relative z-10 flex-1 flex flex-col justify-center items-center mb-8">
                            {/* CSS Typing Indicator Animation */}
                            <div className="w-full max-w-[280px] bg-card/80 border border-border backdrop-blur-sm rounded-2xl p-4 shadow-xl flex items-end space-x-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                                    C
                                </div>
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
                                Experience zero-latency messaging with WebSocket-powered reactive state mutations. See typing indicators and read receipts instantly.
                            </p>
                        </div>
                    </motion.div>

                    {/* Card 2: Medium - Push Notifications */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-2 lg:row-span-1 p-8 rounded-[2rem] glass border-2 border-primary/5 dark:border-border/50 shadow-xl dark:shadow-none hover:border-primary/30 transition-all duration-300 relative overflow-hidden group flex justify-between items-center"
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

                        <div className="relative z-10 w-32 h-32 flex items-center justify-center">
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
                        className="lg:col-span-1 lg:row-span-1 p-6 rounded-[2rem] glass border-2 border-primary/5 dark:border-border/50 shadow-xl dark:shadow-none hover:border-primary/30 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
                    >
                        <div className="flex -space-x-3 mb-4 group-hover:scale-105 transition-transform duration-300 origin-left">
                            <div className="w-10 h-10 rounded-full border-2 border-background bg-emerald-500 z-30 flex items-center justify-center text-xs font-bold text-white shadow-md">U1</div>
                            <div className="w-10 h-10 rounded-full border-2 border-background bg-cyan-500 z-20 flex items-center justify-center text-xs font-bold text-white shadow-md">U2</div>
                            <div className="w-10 h-10 rounded-full border-2 border-background bg-indigo-500 z-10 flex items-center justify-center text-xs font-bold text-white shadow-md">U3</div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-1">Group Chats</h3>
                            <p className="text-sm text-muted-foreground">Hierarchical mapping & sync.</p>
                        </div>
                    </motion.div>

                    {/* Card 4: Small - Profile Customization */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="lg:col-span-1 lg:row-span-1 p-6 rounded-[2rem] glass border-2 border-primary/5 dark:border-border/50 shadow-xl dark:shadow-none hover:border-primary/30 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
                    >
                        <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 group-hover:rotate-90 transition-transform duration-500">
                            <Settings className="w-6 h-6 text-foreground" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-1">Customization</h3>
                            <p className="text-sm text-muted-foreground">Personalize your workspace.</p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default Features;