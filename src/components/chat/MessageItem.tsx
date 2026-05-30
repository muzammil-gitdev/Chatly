"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Checks } from "@phosphor-icons/react";
import clsx from "clsx";

const spring = { type: "spring", stiffness: 300, damping: 25 } as const;

interface MessageItemProps {
  text: string;
  sent: boolean;
  time: string;
  status?: string;
  type?: "text" | "system";
  senderId?: string;
  showSenderName?: boolean;
}

const MessageItem = ({ text, sent, time, status, type, senderId, showSenderName }: MessageItemProps) => {
  if (type === "system") {
    return (
      <div className="flex justify-center my-4 px-6">
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 bg-zinc-900/60 px-4 py-1.5 rounded-full border border-zinc-800/40 text-center">
          {text}
        </span>
      </div>
    );
  }

  const isRead = status === "read";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={spring}
      className={clsx("flex px-4", sent ? "justify-end" : "justify-start")}
    >
      <div
        className={clsx(
          "max-w-[85%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed relative group",
          sent
            ? "bg-emerald-600 text-white rounded-br-sm shadow-lg shadow-emerald-900/20"
            : "bg-[#1a1d28] border border-white/[0.04] text-zinc-200 rounded-bl-sm"
        )}
      >
        {showSenderName && senderId && (
          <p className="text-[10px] font-bold text-emerald-400 mb-1 truncate">
            {senderId}
          </p>
        )}
        <p className="whitespace-pre-wrap break-words">{text}</p>
        <div className="flex items-center justify-end gap-1.5 mt-1">
          <span className="text-[10px] font-medium opacity-50">{time}</span>
          {sent && (
            <div className={clsx("flex items-center", isRead ? "text-[#3dfc82] drop-shadow-[0_0_2px_rgba(61,252,130,0.4)]" : "text-white/40")}>
              {status === "sent" ? (
                <Check size={12} weight="bold" />
              ) : (
                <Checks size={15} weight="bold" />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageItem;
