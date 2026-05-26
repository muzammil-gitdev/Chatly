"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-background border-t border-border py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-6 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-sm">C</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">Chatly</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            A high-performance, serverless messaging platform for the modern era. Secure, fast, and scalable.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-foreground">Product</h4>
                        <ul className="space-y-4">
                            <li><Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="#security" className="text-sm text-muted-foreground hover:text-primary transition-colors">Security</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-foreground">Company</h4>
                        <ul className="space-y-4">
                            <li><Link href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="#careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="#blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-foreground">Connect</h4>
                        <div className="flex space-x-4">
                            {/* Twitter / X SVG */}
                            <Link href="#" className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:scale-110 transition-transform duration-300 text-foreground">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </Link>

                            {/* GitHub SVG */}
                            <Link href="#" className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:scale-110 transition-transform duration-300 text-foreground">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                </svg>
                            </Link>

                            {/* LinkedIn SVG */}
                            <Link href="#" className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:scale-110 transition-transform duration-300 text-foreground">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Chatly Inc. All rights reserved.
                    </p>
                    <div className="flex space-x-8">
                        <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                        <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;