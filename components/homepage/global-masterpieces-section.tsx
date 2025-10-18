"use client"

import type React from "react"
import { MasterpieceCarousel } from "./masterpiece-carousel"
import type { MasterpieceFilm } from "./types" // Assuming a shared MasterpieceFilm type
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Globe } from "lucide-react"

interface GlobalMasterpiecesSectionProps {
  films: MasterpieceFilm[]
}

export const GlobalMasterpiecesSection: React.FC<GlobalMasterpiecesSectionProps> = ({ films }) => {
  if (!films || films.length === 0) {
    return (
      <section className="py-8 md:py-12 bg-slate-950">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Global Masterpieces</h2>
          <p className="text-slate-400">No masterpieces to display at the moment.</p>
        </div>
      </section>
    )
  }
  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 flex items-center">
            <Globe className="w-7 h-7 mr-2.5 text-amber-400" />
            Global Masterpieces
          </h2>
          <Link href="/explore?category=masterpieces" passHref>
            <Button variant="link" className="text-amber-400 hover:text-amber-300 px-0 group">
              Discover More
              <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        <MasterpieceCarousel films={films} />
      </div>
    </section>
  )
}
