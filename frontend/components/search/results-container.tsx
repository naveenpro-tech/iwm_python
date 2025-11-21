"use client"

import { motion } from "framer-motion"
import { MovieResults } from "@/components/search/results/movie-results"
import { PeopleResults } from "@/components/search/results/people-results"
import { PulseResults } from "@/components/search/results/pulse-results"
import { CricketResults } from "@/components/search/results/cricket-results"

interface ResultsContainerProps {
  type: string
  query: string
}

export function ResultsContainer({ type, query }: ResultsContainerProps) {
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Render appropriate results based on type
  const renderResults = () => {
    switch (type) {
      case "all":
        return (
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Movies</h2>
              <MovieResults query={query} limit={4} />
              {/* Show more link */}
              <div className="mt-4 text-right">
                <a href={`/search?q=${query}&type=movies`} className="text-[#00BFFF] hover:underline text-sm">
                  Show all movie results
                </a>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">People</h2>
              <PeopleResults query={query} limit={4} />
              <div className="mt-4 text-right">
                <a href={`/search?q=${query}&type=people`} className="text-[#00BFFF] hover:underline text-sm">
                  Show all people results
                </a>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Pulses</h2>
              <PulseResults query={query} limit={3} />
              <div className="mt-4 text-right">
                <a href={`/search?q=${query}&type=pulses`} className="text-[#00BFFF] hover:underline text-sm">
                  Show all pulse results
                </a>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Cricket</h2>
              <CricketResults query={query} limit={3} />
              <div className="mt-4 text-right">
                <a href={`/search?q=${query}&type=cricket`} className="text-[#00BFFF] hover:underline text-sm">
                  Show all cricket results
                </a>
              </div>
            </section>
          </div>
        )

      case "movies":
        return <MovieResults query={query} />

      case "people":
        return <PeopleResults query={query} />

      case "pulses":
        return <PulseResults query={query} />

      case "cricket":
        return <CricketResults query={query} />

      default:
        return null
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {renderResults()}
    </motion.div>
  )
}
