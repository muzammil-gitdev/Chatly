"use client";

import React from "react";
import { MessageSquare, Users, Settings } from "lucide-react";

interface SidebarProps {
    activeView: "messages" | "groups" | "settings";
    onViewChange: (view: "messages" | "groups" | "settings") => void;
}

const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
    return (
        <div className="w-20 flex-shrink-0 border-r border-border flex flex-col items-center py-8 space-y-8 bg-secondary/20 h-full">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-white font-bold text-xl">C</span>
            </div>
            
            <div className="flex flex-col space-y-6">
                <button 
                    onClick={() => onViewChange("messages")}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                        activeView === "messages" ? "bg-primary/20 text-primary shadow-sm" : "text-muted-foreground hover:text-primary hover:bg-secondary"
                    }`} 
                    aria-label="Messages"
                >
                    <MessageSquare />
                </button>
                <button 
                    onClick={() => onViewChange("groups")}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                        activeView === "groups" ? "bg-primary/20 text-primary shadow-sm" : "text-muted-foreground hover:text-primary hover:bg-secondary"
                    }`} 
                    aria-label="Groups"
                >
                    <Users />
                </button>
            </div>

            <div className="mt-auto">
                <button 
                    onClick={() => onViewChange("settings")}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                        activeView === "settings" ? "bg-primary/20 text-primary shadow-sm" : "text-muted-foreground hover:text-primary hover:bg-secondary"
                    }`} 
                    aria-label="Settings"
                >
                    <Settings />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
