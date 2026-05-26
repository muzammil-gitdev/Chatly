import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen py-24 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full glass p-12 rounded-3xl border-border">
        <h1 className="text-4xl font-black mb-6">Security Infrastructure</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Security is built into every layer of Chatly. From AES-256 encryption at rest to 
          perfect forward secrecy in transit, we employ industry-leading protocols to protect 
          your conversations.
        </p>
        <Link href="/" className="inline-flex items-center space-x-2 text-primary font-bold hover:underline">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
