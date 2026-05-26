"use client";

import React, { useState } from "react";
import { 
    User, 
    Briefcase, 
    GraduationCap, 
    FileText, 
    Camera,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Building
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SettingsPanel = () => {
    const [activeTab, setActiveTab] = useState<"personal" | "professional" | "education" | "documents">("personal");

    const tabs = [
        { id: "personal", label: "Personal Info", icon: User },
        { id: "professional", label: "Professional", icon: Briefcase },
        { id: "education", label: "Education", icon: GraduationCap },
        { id: "documents", label: "Documents", icon: FileText },
    ] as const;

    return (
        <div className="flex-1 overflow-y-auto bg-background p-8 lg:p-12 animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-black mb-2">My Profile</h1>
                    <p className="text-muted-foreground">Manage your personal and professional information</p>
                </div>

                {/* Profile Header Card */}
                <div className="glass p-8 rounded-3xl border-border shadow-2xl flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-3xl bg-secondary overflow-hidden border-4 border-background shadow-lg">
                            <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                                <User className="w-12 h-12 text-primary/50" />
                            </div>
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-xl shadow-lg hover:scale-110 transition-transform">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-black mb-1">Dr. Adeel Mushtaq</h2>
                        <p className="text-primary font-bold text-sm mb-1">Security Architect / Lead Developer</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">UID: CH-98231-X</p>
                        <button className="mt-4 text-sm font-bold text-primary hover:underline">Change photo</button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-2 p-1 bg-secondary/30 rounded-2xl">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                                activeTab === tab.id 
                                ? "bg-background text-primary shadow-md" 
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Form Content */}
                <div className="glass p-8 lg:p-10 rounded-3xl border-border shadow-xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === "personal" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">First Name</label>
                                        <input type="text" defaultValue="Adeel" className="w-full px-6 py-4 bg-secondary/50 border border-transparent focus:border-primary/30 rounded-2xl outline-none transition-all font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Last Name</label>
                                        <input type="text" defaultValue="Mushtaq" className="w-full px-6 py-4 bg-secondary/50 border border-transparent focus:border-primary/30 rounded-2xl outline-none transition-all font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input type="email" defaultValue="adeel@chatly.com" className="w-full pl-14 pr-6 py-4 bg-secondary/50 border border-transparent focus:border-primary/30 rounded-2xl outline-none transition-all font-medium opacity-70 cursor-not-allowed" disabled />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground ml-1">Contact support to change email</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input type="text" defaultValue="+92 300 1234567" className="w-full pl-14 pr-6 py-4 bg-secondary/50 border border-transparent focus:border-primary/30 rounded-2xl outline-none transition-all font-medium" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Gender</label>
                                        <select className="w-full px-6 py-4 bg-secondary/50 border border-transparent focus:border-primary/30 rounded-2xl outline-none transition-all font-medium appearance-none">
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Date of Birth</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input type="date" className="w-full pl-14 pr-6 py-4 bg-secondary/50 border border-transparent focus:border-primary/30 rounded-2xl outline-none transition-all font-medium" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">City</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input type="text" defaultValue="London" className="w-full pl-14 pr-6 py-4 bg-secondary/50 border border-transparent focus:border-primary/30 rounded-2xl outline-none transition-all font-medium" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Company / Workspace</label>
                                        <div className="relative">
                                            <Building className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input type="text" defaultValue="Chatly HQ" className="w-full pl-14 pr-6 py-4 bg-secondary/50 border border-transparent focus:border-primary/30 rounded-2xl outline-none transition-all font-medium" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab !== "personal" && (
                                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                                    <Building className="w-12 h-12" />
                                    <p className="font-bold">Section coming soon</p>
                                    <p className="text-sm max-w-xs">We are currently integrating these professional details into your global encrypted profile.</p>
                                </div>
                            )}

                            <div className="mt-12 flex justify-end">
                                <button className="px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300">
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
