import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Chatly | Messaging for the Zero-Trust Era",
  description: "Secure, real-time messaging with end-to-end encrypted conversations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Inline theme script — prevents flash of unstyled content */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var c=document.cookie.split('; ').find(function(r){return r.indexOf('theme=')===0})?.split('=')[1];var x=t||c||'light';document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(x==='dark'?'dark':'light');document.documentElement.style.colorScheme=x==='dark'?'dark':'light'}catch(e){document.documentElement.classList.add('light');document.documentElement.style.colorScheme='light'}})()`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-inter bg-background text-foreground`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

