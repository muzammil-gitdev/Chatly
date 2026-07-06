"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Checks, CheckCircle } from "@phosphor-icons/react";
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
  forwarded?: boolean;
  edited?: boolean;
  selected?: boolean;
  selectionMode?: boolean;
  onToggleSelect?: () => void;
}

const MessageItem = ({
  text,
  sent,
  time,
  status,
  type,
  senderId,
  showSenderName,
  forwarded,
  edited,
  selected,
  selectionMode,
  onToggleSelect,
}: MessageItemProps) => {
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
        role={onToggleSelect ? "button" : undefined}
        tabIndex={onToggleSelect ? 0 : undefined}
        onClick={onToggleSelect}
        onKeyDown={(e) => {
          if (!onToggleSelect) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleSelect();
          }
        }}
        className={clsx(
          "max-w-[85%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed relative group transition-all",
          onToggleSelect && "cursor-pointer",
          selected && "ring-2 ring-emerald-400/70",
          selectionMode && !selected && "ring-1 ring-white/10",
          sent
            ? "bg-emerald-600 text-white rounded-br-sm shadow-lg shadow-emerald-900/20"
            : "bg-[#1a1d28] border border-white/[0.04] text-zinc-200 rounded-bl-sm"
        )}
      >
        {selected && (
          <span className={clsx("absolute -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg", sent ? "-left-2" : "-right-2")}>
            <CheckCircle size={14} weight="fill" />
          </span>
        )}
        {showSenderName && senderId && (
          <p className="text-[10px] font-bold text-emerald-400 mb-1 truncate">
            {senderId}
          </p>
        )}
        {forwarded && (
          <p className="mb-1 text-[10px] font-semibold italic opacity-60">Forwarded</p>
        )}
        <p className="whitespace-pre-wrap break-words">{text}</p>
        <div className="flex items-center justify-end gap-1.5 mt-1">
          {edited && <span className="text-[10px] font-medium opacity-45">Edited</span>}
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
