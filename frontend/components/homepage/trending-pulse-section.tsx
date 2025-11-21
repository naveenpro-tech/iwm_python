"use client"

import type React from "react"
import { PulseCardCarousel } from "./pulse-card-carousel"
import type { TrendingPulse } from "./types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react" // Zap or Flame for Pulse

interface TrendingPulseSectionProps {
  pulses: TrendingPulse[]
}

export const TrendingPulseSection: React.FC<TrendingPulseSectionProps> = ({ pulses }) => {
  if (!pulses || pulses.length === 0) {
    return (
      <section className="py-8 md:py-12 bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Trending on Pulse</h2>
          <p className="text-slate-400">No trending pulses to display at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-black via-sky-900/20 to-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-sky-400 flex items-center">
            <Zap className="w-7 h-7 mr-2.5 text-sky-400" />
            What's Buzzing: Trending Pulse
          </h2>
          <Link href="/pulse?filter=trending" passHref>
            <Button variant="link" className="text-sky-400 hover:text-sky-300 px-0 group">
              Join the Conversation
              <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        <PulseCardCarousel pulses={pulses} />
      </div>
    </section>
  )
}
