import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-24 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full glass p-12 rounded-3xl border-border">
        <h1 className="text-4xl font-black mb-6">About Chatly</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Chatly is a next-generation communications platform built on zero-trust principles. 
          We believe that privacy is a human right, and our architecture ensures that your data 
          remains yours alone.
        </p>
        <Link href="/" className="inline-flex items-center space-x-2 text-primary font-bold hover:underline">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
