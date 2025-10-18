"use client"

import type React from "react"
import { MovieCarousel } from "./movie-carousel"
import type { Movie } from "./types" // Assuming a shared Movie type
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface NewReleasesSectionProps {
  movies: Movie[]
}

export const NewReleasesSection: React.FC<NewReleasesSectionProps> = ({ movies }) => {
  if (!movies || movies.length === 0) {
    return (
      <section className="py-8 md:py-12 bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">New Releases</h2>
          <p className="text-slate-400">No new releases to display at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-black via-slate-900 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-400">
            Fresh Off The Lot: New Releases
          </h2>
          <Link href="/movies?sort=newest" passHref>
            <Button variant="link" className="text-sky-400 hover:text-sky-300 px-0 group">
              View All
              <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        <MovieCarousel movies={movies} />
      </div>
    </section>
  )
}
