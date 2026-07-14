"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import ChatlyLogo from "@/components/landing/ChatlyLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Invalid admin credentials.");
      return;
    }

    router.replace("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-950 dark:bg-[#080a0f] dark:text-zinc-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.12),transparent_28%)]" />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-2xl shadow-slate-950/10 backdrop-blur dark:border-white/10 dark:bg-[#11131a]/90 dark:shadow-black/30 sm:p-8">
        <div className="mb-8">
          <ChatlyLogo markClassName="h-11 w-11" textClassName="text-2xl text-slate-950 dark:text-zinc-100" />
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            Admin access
          </div>
          <h1 className="mt-4 text-2xl font-black">Sign in to admin portal</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-zinc-400">Manage Chatly users and cached analytics from one secure dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Email</span>
            <span className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-white/[0.03]">
              <Mail className="h-4 w-4 text-emerald-400" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                placeholder="admin@name.com"
                autoComplete="email"
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Password</span>
            <span className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-white/[0.03]">
              <Lock className="h-4 w-4 text-emerald-400" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                placeholder="Password"
                autoComplete="current-password"
                required
              />
            </span>
          </label>

          {error ? (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-emerald-500 px-4 text-sm font-black text-[#061111] transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
