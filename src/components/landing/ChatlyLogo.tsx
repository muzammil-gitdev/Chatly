"use client";

import React from "react";

type ChatlyLogoProps = {
    className?: string;
    markClassName?: string;
    textClassName?: string;
    showText?: boolean;
};

const ChatlyLogo = ({
    className = "",
    markClassName = "h-10 w-10",
    textClassName = "text-2xl",
    showText = true,
}: ChatlyLogoProps) => {
    return (
        <span className={`inline-flex items-center gap-3 ${className}`}>
            <svg
                className={markClassName}
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <rect width="48" height="48" rx="15" fill="url(#chatly-mark-bg)" />
                <path
                    d="M14.5 23.4C14.5 18.18 18.74 14 24.34 14H30.5C32.16 14 33.5 15.34 33.5 17V23.08C33.5 28.6 29.25 32.75 23.65 32.75H22.46L17.86 35.5C17.03 36 16 35.4 16 34.43V30.51C15.04 28.98 14.5 26.58 14.5 23.4Z"
                    fill="#061111"
                    fillOpacity="0.92"
                />
                <path
                    d="M28.45 21.1C27.64 19.74 26.25 18.96 24.47 18.96C21.84 18.96 19.9 20.92 19.9 23.5C19.9 26.11 21.86 28.04 24.51 28.04C26.28 28.04 27.69 27.25 28.5 25.85"
                    stroke="white"
                    strokeWidth="3.15"
                    strokeLinecap="round"
                />
                <defs>
                    <linearGradient id="chatly-mark-bg" x1="6" y1="5" x2="43" y2="44" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#20E7D2" />
                        <stop offset="1" stopColor="#10B981" />
                    </linearGradient>
                </defs>
            </svg>
            {showText ? (
                <span className={`font-outfit font-black tracking-normal text-foreground ${textClassName}`}>
                    Chatly
                </span>
            ) : null}
        </span>
    );
};

export default ChatlyLogo;
