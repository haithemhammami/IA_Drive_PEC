"use client"

import { useState } from "react"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeatureShowcase } from "@/components/feature-showcase"
import { TutorialVideo } from "@/components/tutorial-video"
import { CustomerReviews } from "@/components/customer-reviews"
import { Footer } from "@/components/footer"
import { AIShoppingAssistant } from "@/components/ai-shopping-assistant"
import { TrustFeatures } from "@/components/trust-features"
import { FAQ } from "@/components/faq"

export default function Home() {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)

  const handleStartClick = () => {
    setIsAIAssistantOpen(true)
  }

  return (
    <main className="flex min-h-screen flex-col">
      <AnnouncementBanner />
      <Header />
      <HeroSection onStartClick={() => setIsAIAssistantOpen(true)} />
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

