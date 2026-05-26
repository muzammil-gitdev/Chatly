"use client";

import React from "react";
import { MessageSquare, Users, Settings } from "lucide-react";

const Sidebar = () => {
    return (
        <div className="w-20 border-r border-border flex flex-col items-center py-8 space-y-8 bg-secondary/20 h-full">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-white font-bold text-xl">C</span>
            </div>
            
            <div className="flex flex-col space-y-6">
                <button className="p-3 bg-primary/10 rounded-xl hover:text-primary transition-colors text-primary" aria-label="Messages">
                    <MessageSquare />
                </button>
                <button className="p-3 text-muted-foreground hover:text-primary transition-colors" aria-label="Groups">
                    <Users />
                </button>
                <button className="p-3 text-muted-foreground hover:text-primary transition-colors" aria-label="Settings">
                    <Settings />
                </button>
            </div>

            <div className="mt-auto">
                <div className="w-10 h-10 rounded-full bg-secondary border-2 border-primary cursor-pointer hover:scale-105 transition-transform" />
            </div>
        </div>
    );
};

export default Sidebar;
