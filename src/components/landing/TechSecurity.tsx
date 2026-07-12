import React from "react";
import { Database, KeyRound, ShieldCheck, Zap } from "lucide-react";

const TechSecurity = () => {
    return (
        <section id="security" className="py-20 sm:py-24 relative bg-secondary/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">
                                Uncompromising Security. <br />
                                <span className="text-gradient">Lightning Fast.</span>
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Chatly keeps access intentional with OTP verification and protected app routes, while realtime updates keep every conversation moving smoothly.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div
                                className="flex items-start gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-500 mt-1">
                                    <KeyRound className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">Secure OTP Verification</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">Email-based OTP checks help confirm the right person is signing in before they enter the chat workspace.</p>
                                </div>
                            </div>

                            <div
                                className="flex items-start gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0 text-cyan-500 mt-1">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">Protected App Access</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">Authenticated routes, request handling, and profile checks keep the chat experience controlled and predictable.</p>
                                </div>
                            </div>

                            <div
                                className="flex items-start gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 text-indigo-500 mt-1">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">Real-Time Updates</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">Messages, delivery states, and active conversations refresh quickly so the interface feels alive without extra effort.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div
                            className="relative mx-auto max-w-md rounded-3xl border border-border bg-background/70 p-5 shadow-2xl shadow-black/5 backdrop-blur dark:shadow-black/20 sm:p-6"
                        >
                            <div className="rounded-2xl border border-border bg-secondary/60 p-5">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-muted-foreground">Access check</p>
                                        <h3 className="text-2xl font-black">OTP verified</h3>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        ["Email OTP", "Passed"],
                                        ["Session", "Active"],
                                        ["Chat route", "Allowed"],
                                    ].map(([label, status]) => (
                                        <div key={label} className="flex items-center justify-between rounded-xl border border-border bg-background/80 px-4 py-3 text-sm">
                                            <span className="font-semibold text-foreground">{label}</span>
                                            <span className="font-bold text-primary">{status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                                    <Database className="mb-3 h-5 w-5 text-cyan-500" />
                                    <p className="text-sm font-bold">Synced data</p>
                                    <p className="mt-1 text-xs text-muted-foreground">Realtime chat state</p>
                                </div>
                                <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                                    <Zap className="mb-3 h-5 w-5 text-primary" />
                                    <p className="text-sm font-bold">Fast updates</p>
                                    <p className="mt-1 text-xs text-muted-foreground">Low-friction UI</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechSecurity;
