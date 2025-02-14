"use client"
import { useState, useEffect } from "react"
import Head from "next/head";
import localFont from "next/font/local";
import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/LandingPage/theme-provider";
import { Header } from "@/components/LandingPage/header";
import { Footer } from "@/components/LandingPage/footer";
import type React from "react";
import { AnnouncementBanner } from "@/components/LandingPage/announcement-banner"
import { AIShoppingAssistant } from "@/components/LandingPage/ai-shopping-assistant"
//import { HeroSection } from "@/components/LandingPage/hero-section";

const inter = Inter({ subsets: ["latin"] });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

/*const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});*/

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isDashboardPage, setIsDashboardPage] = useState(false);

  /*const handleStartClick = () => {
    setIsAIAssistantOpen(true);
  };*/

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDashboardPage(window.location.pathname.startsWith("/dashboard"));
    }
  }, []);

  return (
    <html lang="fr" className={`${poppins.variable}`} suppressHydrationWarning>
      <Head>
        <title>IA Drive PEC</title>
        <meta name="description" content="Application Drive alimentaire enrichie par IA" />
      </Head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {!isDashboardPage && <AnnouncementBanner />}
          {!isDashboardPage && <Header />}
          <main className="flex-1">{children}</main>
          {!isDashboardPage && <Footer />}
          <AIShoppingAssistant isOpen={isAIAssistantOpen} />  
        </ThemeProvider>
      </body>
    </html>
  );
}
