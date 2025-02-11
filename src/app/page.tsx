"use client"

import { useState } from "react"
import { AnnouncementBanner } from "@/components/LandingPage/announcement-banner"
import { Header } from "@/components/LandingPage/header"
import { HeroSection } from "@/components/LandingPage/hero-section"
import { FeatureShowcase } from "@/components/LandingPage/feature-showcase"
import { TutorialVideo } from "@/components/LandingPage/tutorial-video"
import { CustomerReviews } from "@/components/LandingPage/customer-reviews"
import { Footer } from "@/components/LandingPage/footer"
import { AIShoppingAssistant } from "@/components/LandingPage/ai-shopping-assistant"
import { TrustFeatures } from "@/components/LandingPage/trust-features"
import { FAQ } from "@/components/LandingPage/faq"

export default function Home() {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)

  const handleStartClick = () => {
    setIsAIAssistantOpen(true)
  }

  return (
    <main className="flex min-h-screen flex-col">
      <AnnouncementBanner />
      <Header />
      <HeroSection onStartClick={() => handleStartClick} />
      <FeatureShowcase />
      <TrustFeatures />
      <TutorialVideo />
      <FAQ />
      <CustomerReviews />
      <Footer />
      <AIShoppingAssistant isOpen={isAIAssistantOpen} />
    </main>
  )
}

