"use client"

import { HeroSection } from "@/components/LandingPage/hero-section"
import { FeatureShowcase } from "@/components/LandingPage/feature-showcase"
import { TutorialVideo } from "@/components/LandingPage/tutorial-video"
import { CustomerReviews } from "@/components/LandingPage/customer-reviews"
import { TrustFeatures } from "@/components/LandingPage/trust-features"
import { FAQ } from "@/components/LandingPage/faq"
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <FeatureShowcase />
      <TrustFeatures />
      <TutorialVideo />
      <FAQ />
      <CustomerReviews />
      <Image 
        src="https://img.youtube.com/vi/N0ADpGqGhY8/maxresdefault.jpg" 
        alt="Tutorial Video Thumbnail" 
        width={1280} 
        height={720} 
      />
    </main>
  )
}

