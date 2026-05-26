import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-24 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full glass p-12 rounded-3xl border-border">
        <h1 className="text-4xl font-black mb-6">Privacy Policy</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your privacy is our mission. We do not collect, store, or sell your data. 
          All communications on Chatly are encrypted at the edge and accessible only 
          by you and your intended recipients.
        </p>
        <Link href="/" className="inline-flex items-center space-x-2 text-primary font-bold hover:underline">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
