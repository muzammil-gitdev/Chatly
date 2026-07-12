"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, EnvelopeSimple, Lock, Eye, EyeSlash } from "@phosphor-icons/react";
import { AuthProvider, useAuth } from "@/context/AuthContext";

const spring = { type: "spring", stiffness: 300, damping: 25 } as const;

function Alert({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={spring}
      className="px-4 py-3 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/20 text-red-400"
    >
      {message}
    </motion.div>
  );
}

const LoginContent = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Logged in successfully -> trigger redirect to secure workspace
      await login(form.email, form.password);
      router.push("/chat");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      if (msg.includes("user-not-found") || msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        setError("Invalid email or password.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] py-24 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="w-full max-w-md"
      >


        {/* Card */}
        <div className="bg-[#11131a]/80 backdrop-blur-xl border border-zinc-800/40 p-8 rounded-3xl shadow-2xl">
          {/* Guest Accounts */}
          <div className="mb-6 p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
            <p className="text-xs text-zinc-400 mb-3 uppercase tracking-wider font-semibold text-center">Guest Accounts</p>
            <div className="flex flex-col gap-2">
              {[
                { email: 'guest_user@gmail.com', pass: '12345678' },
                { email: 'guest_user1@gmail.com', pass: '12345678' },
                { email: 'guest_user2@gmail.com', pass: '12345678' },
              ].map((guest, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setForm({ email: guest.email, password: guest.pass })}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-700/30 hover:border-emerald-500/30 hover:bg-zinc-800/50 transition-all text-left group"
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-zinc-300 group-hover:text-emerald-400 transition-colors">{guest.email}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">PWD: {guest.pass}</span>
                  </div>
                  <span className="text-xs text-zinc-500 group-hover:text-emerald-400/70 transition-colors whitespace-nowrap ml-4">Click to use</span>
                </button>
              ))}
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <AnimatePresence>
              {error && <Alert key="err" message={error} />}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Email Address</label>
              <div className="relative">
                <EnvelopeSimple className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#1a1d28] border border-zinc-800/60 focus:border-emerald-500/40 focus:bg-[#1e2130] rounded-xl outline-none transition-all text-sm text-zinc-200 placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full pl-11 pr-12 py-3.5 bg-[#1a1d28] border border-zinc-800/60 focus:border-emerald-500/40 focus:bg-[#1e2130] rounded-xl outline-none transition-all text-sm text-zinc-200 placeholder:text-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-zinc-500 hover:text-emerald-400 transition-colors">
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              transition={spring}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-emerald-500 hover:text-emerald-400 transition-colors">
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

const LoginPage = () => (
  <AuthProvider>
    <LoginContent />
  </AuthProvider>
);

export default LoginPage;
