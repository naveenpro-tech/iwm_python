"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Loader2 } from "lucide-react"
import { MovieResults } from "@/components/search/results/movie-results"
import { PeopleResults } from "@/components/search/results/people-results"
import { PulseResults } from "@/components/search/results/pulse-results"
import { CricketResults } from "@/components/search/results/cricket-results"
import Link from "next/link"

interface SearchResultsProps {
  query: string
  isLoading: boolean
  hasResults: boolean
}

type TabType = "all" | "movies" | "people" | "pulses" | "cricket"

export function SearchResults({ query, isLoading, hasResults }: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all")

  const tabs: { id: TabType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "movies", label: "Movies" },
    { id: "people", label: "People" },
    { id: "pulses", label: "Pulses" },
    { id: "cricket", label: "Cricket" },
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: { duration: 0.2 },
    },
  }

  const tabsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
        staggerChildren: 0.03,
      },
    },
  }

  const tabVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      className="bg-[#282828] rounded-xl overflow-hidden max-h-[60vh]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-[#00BFFF] animate-spin mb-4" />
          <p className="text-[#E0E0E0] font-dmsans">Searching for "{query}"...</p>
        </div>
      ) : hasResults ? (
        <div className="flex flex-col h-full">
          {/* Tabs */}
          <motion.div className="flex overflow-x-auto scrollbar-hide border-b border-[#3A3A3A]" variants={tabsVariants}>
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className={`px-4 py-3 font-inter text-sm whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:ring-inset ${
                  activeTab === tab.id
                    ? "text-[#E0E0E0] border-b-2 border-[#00BFFF]"
                    : "text-[#A0A0A0] hover:text-[#E0E0E0]"
                }`}
                onClick={() => setActiveTab(tab.id)}
                variants={tabVariants}
              >
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Results Content */}
          <div className="overflow-y-auto max-h-[calc(60vh-48px)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="p-4"
              >
                {activeTab === "all" && (
                  <div className="space-y-6">
                    <MovieResults query={query} limit={4} />
                    <PeopleResults query={query} limit={3} />
                    <PulseResults query={query} limit={2} />
                    <CricketResults query={query} limit={2} />

                    <div className="flex justify-center pt-2 pb-4">
                      <Link
                        href={`/search?q=${encodeURIComponent(query)}`}
                        className="text-[#00BFFF] font-inter text-sm flex items-center hover:underline"
                      >
                        View all results
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                )}

                {activeTab === "movies" && <MovieResults query={query} limit={12} />}
                {activeTab === "people" && <PeopleResults query={query} limit={10} />}
                {activeTab === "pulses" && <PulseResults query={query} limit={8} />}
                {activeTab === "cricket" && <CricketResults query={query} limit={8} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12">
          <p className="text-[#E0E0E0] font-dmsans text-center">No results found for "{query}"</p>
          <p className="text-[#A0A0A0] font-dmsans text-center mt-2">Try different keywords or check spelling</p>
        </div>
      )}
    </motion.div>
  )
}
