"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { IntroSequence } from "./intro-sequence"
import { HeroSection } from "./hero-section"
import { DualPassionShowcase } from "./dual-passion-showcase"
import { FeatureHighlights } from "./feature-highlights"
import { FinalCta } from "./final-cta"
import { LoadingScreen } from "./loading-screen"
import { ParticleBackground } from "./particle-background"
import { SkipForward } from "lucide-react"

export function LandingExperience() {
  const [loading, setLoading] = useState(true)
  const [introComplete, setIntroComplete] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const router = useRouter()

  // Simulate loading assets
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleIntroComplete = () => {
    setIntroComplete(true)
  }

  const handleExploreClick = () => {
    router.push("/homepage")
  }

  const handleSkipIntro = () => {
    setLoading(false) // Ensure loading is marked as false
    setIntroComplete(true) // Mark intro as "complete" to prevent it from trying to render
    router.push("/homepage") // Navigate to the homepage
  }

  const sections = [
    <HeroSection key="hero" onContinue={() => setCurrentSection(1)} />,
    <DualPassionShowcase key="dual-passion" onContinue={() => setCurrentSection(2)} />,
    <FeatureHighlights key="features" onContinue={() => setCurrentSection(3)} />,
    <FinalCta key="cta" onExplore={handleExploreClick} />,
  ]

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1A1A1A] text-[#E0E0E0]">
      <ParticleBackground />

      {/* Skip Button */}
      <AnimatePresence>
        {!loading && !introComplete && (
          <motion.button
            key="skip-button"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.5 }} // Delay to appear after loading screen fades
            onClick={handleSkipIntro}
            className="absolute top-6 right-6 z-[60] px-4 py-2 bg-black/40 hover:bg-black/60 text-sm text-neutral-300 hover:text-white rounded-lg backdrop-blur-sm transition-colors flex items-center shadow-md"
            aria-label="Skip intro"
          >
            Skip Intro <SkipForward size={16} className="ml-2" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50"
          >
            <LoadingScreen />
          </motion.div>
        )}

        {!loading && !introComplete && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-40"
          >
            <IntroSequence onComplete={handleIntroComplete} />
          </motion.div>
        )}

        {!loading && introComplete && sections[currentSection] && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-30"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`section-${currentSection}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="h-full"
              >
                {sections[currentSection]}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
