"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Moon, PanelLeftClose, PanelLeftOpen, Sun, Users } from "lucide-react";
import { useState } from "react";
import ChatlyLogo from "@/components/landing/ChatlyLogo";
import { useTheme } from "@/components/ui/ThemeProvider";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "User Management", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarLockedOpen, setIsSidebarLockedOpen] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const isExpanded = isSidebarLockedOpen || isSidebarHovered;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 transition-colors duration-300 dark:bg-[#05070d] dark:text-zinc-100">
      <div className="flex min-h-screen">
        <aside
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
          className={`hidden shrink-0 border-r border-slate-200 bg-white/95 transition-[width,background-color,border-color] duration-300 ease-out dark:border-white/10 dark:bg-[#070b17]/95 md:flex md:flex-col ${
            isExpanded ? "w-72" : "w-[64px]"
          }`}
        >
          <button
            type="button"
            onClick={() => setIsSidebarLockedOpen((value) => !value)}
            className={`m-3 flex h-12 items-center rounded-xl text-slate-900 transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-white/5 ${
              isExpanded ? "justify-between px-3" : "justify-center px-0"
            }`}
            title={isSidebarLockedOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <span className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-w-[180px] opacity-100" : "max-w-0 opacity-0"}`}>
              <ChatlyLogo markClassName="h-9 w-9" textClassName="text-lg text-slate-950 dark:text-zinc-100" />
            </span>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-lg font-black text-white transition-all duration-300 ${
              isExpanded ? "max-w-0 scale-75 opacity-0" : "max-w-8 scale-100 opacity-100"
            }`}>
              C
            </span>
            <span className={`shrink-0 text-slate-500 dark:text-zinc-400 ${isExpanded ? "block" : "hidden"}`}>
              {isSidebarLockedOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
            </span>
          </button>

          <nav className="mt-4 flex-1 space-y-2 px-3">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`flex h-12 items-center rounded-xl text-sm font-bold transition-all duration-200 ${
                    isExpanded ? "justify-start gap-3 px-4" : "justify-center px-0"
                  } ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isExpanded ? "max-w-[160px] opacity-100" : "max-w-0 opacity-0"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="space-y-2 border-t border-slate-200 p-3 dark:border-white/10">
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className={`flex h-12 w-full items-center rounded-xl text-sm font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white ${
                isExpanded ? "justify-start gap-3 px-4" : "justify-center px-0"
              }`}
            >
              {theme === "dark" ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
              <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isExpanded ? "max-w-[160px] opacity-100" : "max-w-0 opacity-0"}`}>
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
            <form action="/api/admin/logout" method="post">
              <button
                className={`flex h-12 w-full items-center rounded-xl text-sm font-bold text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-500 dark:text-zinc-400 ${
                  isExpanded ? "justify-start gap-3 px-4" : "justify-center px-0"
                }`}
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isExpanded ? "max-w-[160px] opacity-100" : "max-w-0 opacity-0"}`}>
                  Logout
                </span>
              </button>
            </form>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-[#05070d]/90 md:hidden">
            <div className="flex items-center justify-between">
              <ChatlyLogo markClassName="h-9 w-9" textClassName="text-lg text-slate-950 dark:text-zinc-100" />
              <div className="flex items-center gap-2">
                <button onClick={toggleTheme} className="rounded-xl border border-slate-200 p-2 text-slate-500 dark:border-white/10 dark:text-zinc-400">
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <form action="/api/admin/logout" method="post">
                  <button className="rounded-xl border border-slate-200 p-2 text-slate-500 dark:border-white/10 dark:text-zinc-400">
                    <LogOut className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
            <nav className="mt-3 grid grid-cols-2 gap-2">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 dark:border-white/10 dark:text-zinc-300">
                    <Icon className="h-4 w-4 text-emerald-500" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
