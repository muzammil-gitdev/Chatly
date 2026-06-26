"use client";

import React from "react";

interface SystemLogProps {
  text: string;
}

const SystemLog = ({ text }: SystemLogProps) => (
  <div className="flex justify-center my-3">
    <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-600 bg-zinc-100 dark:bg-[#14161f]/60 border border-zinc-200 dark:border-white/[0.04] px-3 py-1.5 rounded-full uppercase tracking-wider">
      {text}
    </span>
  </div>
);

export default SystemLog;
