"use client";

import React from "react";
import { Shield, Zap, Users, Lock, MessageSquare, Globe } from "lucide-react";

const features = [
    {
        title: "Zero-Trust Security",
        description: "Dual-layer permission system ensures your data is only accessible by verified identities.",
        icon: <Shield className="w-6 h-6 text-emerald-500" />,
        delay: "0.1s"
    },
    {
        title: "Serverless Speed",
        description: "Built on Vercel Edge infrastructure for ultra-low latency messaging worldwide.",
        icon: <Zap className="w-6 h-6 text-emerald-500" />,
        delay: "0.2s"
    },
    {
        title: "Hierarchical Groups",
        description: "Granular authorization mapping for group admins and sovereign node connections.",
        icon: <Users className="w-6 h-6 text-emerald-500" />,
        delay: "0.3s"
    },
    {
        title: "E2E Handshake",
        description: "Messages are blocked until recipients explicitly accept the connection request.",
        icon: <Lock className="w-6 h-6 text-emerald-500" />,
        delay: "0.4s"
    },
    {
        title: "Reactive Sync",
        description: "Real-time state mutations with Gray and Green tick delivery receipts.",
        icon: <MessageSquare className="w-6 h-6 text-emerald-500" />,
        delay: "0.5s"
    },
    {
        title: "Multi-Tenant Hub",
        description: "Independent workspaces designed for high-performance corporate ecosystems.",
        icon: <Globe className="w-6 h-6 text-emerald-500" />,
        delay: "0.6s"
    }
];

const Features = () => {
    return (
        <section id="features" className="py-24 bg-secondary/30 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 animate-reveal">
                    <h2 className="text-4xl md:text-5xl font-black mb-4">Engineered for Excellence.</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Chatly brings enterprise-grade features to a serverless architecture, delivering unparalleled control and speed.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div 
                            key={index}
                            className="p-8 rounded-3xl glass border-border hover:border-primary/30 hover:-translate-y-2 transition-all duration-300 group animate-reveal"
                            style={{ animationDelay: feature.delay }}
                        >
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-outfit">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;