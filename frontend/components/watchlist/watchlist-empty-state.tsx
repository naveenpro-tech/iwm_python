"use client"

import { motion } from "framer-motion"
import { FilmIcon, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { WatchStatus } from "./types"

interface WatchlistEmptyStateProps {
  activeStatus: WatchStatus | "all"
  isFiltered?: boolean
}

export function WatchlistEmptyState({ activeStatus, isFiltered = false }: WatchlistEmptyStateProps) {
  const getEmptyStateMessage = () => {
    if (isFiltered) {
      return "No items match your current filters."
    }

    switch (activeStatus) {
      case "want-to-watch":
        return "You haven't added any movies to your 'Want to Watch' list yet."
      case "watching":
        return "You aren't currently watching any movies."
      case "watched":
        return "You haven't marked any movies as watched yet."
      default:
        return "Your watchlist is empty."
    }
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center py-16 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-20 h-20 rounded-full bg-[#282828] flex items-center justify-center mb-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <FilmIcon className="w-10 h-10 text-[#00BFFF]" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold mb-2 text-[#E0E0E0]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {isFiltered ? "No matches found" : activeStatus === "all" ? "Your watchlist is empty" : "Nothing here yet"}
      </motion.h2>

      <motion.p
        className="text-[#A0A0A0] max-w-md mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {getEmptyStateMessage()} {!isFiltered && "Start building your collection by exploring our recommendations."}
      </motion.p>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {isFiltered ? (
          <Button variant="outline" className="border-[#3A3A3A] hover:bg-[#3A3A3A]">
            Clear Filters
          </Button>
        ) : (
          <Link href="/movies">
            <Button className="bg-[#00BFFF] hover:bg-[#00BFFF]/80 text-[#1A1A1A]">
              <PlusCircle className="mr-2 h-4 w-4" />
              Discover Movies
            </Button>
          </Link>
        )}
      </motion.div>
    </motion.div>
  )
}
