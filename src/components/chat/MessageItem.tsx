"use client";

import React from "react";
import { Check, CheckCheck } from "lucide-react";

interface MessageItemProps {
    text: string;
    sent: boolean;
    time: string;
    status?: string;
}

const MessageItem = ({ text, sent, time, status }: MessageItemProps) => {
    return (
        <div className={`flex ${sent ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] p-4 rounded-3xl ${
                sent 
                ? "bg-primary text-primary-foreground rounded-tr-none" 
                : "glass border-white/10 rounded-tl-none"
            }`}>
                <p className="text-sm leading-relaxed">{text}</p>
                <div className={`flex items-center mt-2 space-x-1 ${sent ? "justify-end" : "justify-start"}`}>
                    <span className="text-[10px] opacity-60 font-medium">{time}</span>
                    {sent && (
                        <div className="ml-1">
                            {status === "read" ? (
                                <CheckCheck className="w-3 h-3 text-white" />
                            ) : (
                                <Check className="w-3 h-3 text-white opacity-60" />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageItem;
