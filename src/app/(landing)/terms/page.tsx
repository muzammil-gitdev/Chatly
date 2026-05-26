import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-24 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full glass p-12 rounded-3xl border-border">
        <h1 className="text-4xl font-black mb-6">Terms of Service</h1>
        <p className="text-lg text-muted-foreground mb-8">
          By using Chatly, you agree to our zero-trust communication guidelines. 
          We provide the infrastructure for secure messaging, and you maintain complete 
          control over your keys and conversations.
        </p>
        <Link href="/" className="inline-flex items-center space-x-2 text-primary font-bold hover:underline">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
