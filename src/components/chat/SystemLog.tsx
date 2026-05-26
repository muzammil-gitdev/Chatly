"use client";

import React from "react";

interface SystemLogProps {
    text: string;
}

const SystemLog = ({ text }: SystemLogProps) => {
    return (
        <div className="flex justify-center my-4">
            <div className="glass px-4 py-1.5 rounded-full border-border shadow-sm animate-reveal">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
                    {text}
                </p>
            </div>
        </div>
    );
};

export default SystemLog;
