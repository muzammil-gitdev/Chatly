import React from "react";
import { motion } from "framer-motion";

export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div className={`relative overflow-hidden bg-zinc-200/60 dark:bg-white/[0.03] rounded-lg ${className}`}>
      <motion.div
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/[0.04] to-transparent"
      />
    </div>
  );
};

export const ChatItemSkeleton = () => (
  <div className="flex items-center gap-3 p-3">
    <Skeleton className="w-12 h-12 rounded-xl" />
    <div className="flex-1 space-y-2">
      <div className="flex justify-between">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-10 h-3" />
      </div>
      <Skeleton className="w-full h-3 opacity-50" />
    </div>
  </div>
);

export const MessageSkeleton = ({ sent }: { sent?: boolean }) => (
  <div className={`flex ${sent ? "justify-end" : "justify-start"} mb-4`}>
    <Skeleton className={`w-[60%] h-16 ${sent ? "rounded-l-2xl rounded-tr-2xl" : "rounded-r-2xl rounded-tl-2xl"}`} />
  </div>
);
