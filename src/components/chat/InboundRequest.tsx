"use client";

import React from "react";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

interface InboundRequestProps {
    onAccept: () => void;
    onDecline: () => void;
}

const InboundRequest = ({ onAccept, onDecline }: InboundRequestProps) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mx-auto max-w-md glass p-6 rounded-3xl border-border text-center mb-8 relative z-20"
        >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Inbound Connection Gateway</h3>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                Protocol: LinkedIn-Style Handshake. This user is not in your connections. Accept to enable sync pipelines?
            </p>
            <div className="flex space-x-3">
                <button 
                    onClick={onAccept}
                    className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
                >
                    Accept Request
                </button>
                <button 
                    onClick={onDecline}
                    className="flex-1 py-2.5 bg-secondary text-foreground rounded-xl text-xs font-bold hover:bg-secondary/80 transition-all"
                >
                    Decline
                </button>
            </div>
        </motion.div>
    );
};

export default InboundRequest;
