import React from "react";
import { UserPlus, ShieldCheck, UserCircle, MessageCircle, BellRing } from "lucide-react";

const steps = [
    {
        title: "Register Account",
        description: "Join the platform with a simple registration process to get started.",
        icon: <UserPlus className="w-6 h-6 text-emerald-500" />
    },
    {
        title: "Verify via OTP",
        description: "Secure your account with our dual-layer permission system and OTP verification.",
        icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />
    },
    {
        title: "Set up Profile",
        description: "Personalize your workspace by setting up your avatar and display name.",
        icon: <UserCircle className="w-6 h-6 text-emerald-500" />
    },
    {
        title: "Connect & Chat",
        description: "Select a person to chat 1-on-1 or create hierarchical groups instantly.",
        icon: <MessageCircle className="w-6 h-6 text-emerald-500" />
    },
    {
        title: "Stay in Control",
        description: "Manage your connections. Block unwanted contacts and receive smart push notifications.",
        icon: <BellRing className="w-6 h-6 text-emerald-500" />
    }
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 relative overflow-hidden bg-background">
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2
                        className="text-4xl md:text-5xl font-black mb-4"
                    >
                        Your Journey Begins Here.
                    </h2>
                    <p
                        className="text-muted-foreground max-w-2xl mx-auto text-lg"
                    >
                        A seamless, step-by-step onboarding process designed for security and speed.
                    </p>
                </div>

                <div className="relative">
                    {/* The slim connecting line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-border -translate-x-1/2 overflow-hidden rounded-full z-0">
                        <div className="h-full w-full bg-primary/70 shadow-[0_0_15px_rgba(16,185,129,0.7)]" />
                    </div>

                    <div className="space-y-16 md:space-y-24">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`relative flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                            >
                                {/* Center Icon Point */}
                                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 bg-background border-2 border-primary rounded-full z-10 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                                </div>

                                {/* Horizontal Connector */}
                                <div
                                    className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[2px] bg-primary shadow-[0_0_15px_rgba(16,185,129,1)] z-0 ${index % 2 === 0 ? "right-1/2" : "left-1/2"}`}
                                    style={{ width: "4rem" }}
                                />

                                {/* Content Card */}
                                <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-16" : "md:pl-16"}`}>
                                    <div className="p-8 rounded-[2rem] glass border-2 border-primary/5 dark:border-border/50 shadow-xl dark:shadow-none hover:border-primary/30 transition-colors duration-300 relative group">
                                        <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                            {step.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
