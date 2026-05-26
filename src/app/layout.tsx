import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Chatly | Serverless Real-Time Messaging",
  description: "High-performance, serverless real-time messaging platform with zero-trust security.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
