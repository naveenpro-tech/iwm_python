"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { RecentSearches } from "@/components/search/recent-searches"
import { TrendingSearches } from "@/components/search/trending-searches"
import { SearchResults } from "@/components/search/search-results"
import { SearchInput } from "@/components/search/search-input"
import { useDebounce } from "@/hooks/use-debounce"
import { useMobile } from "@/hooks/use-mobile"

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasResults, setHasResults] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const isMobile = useMobile()

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Handle click outside
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  // Fetch search results when debounced query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearchQuery || debouncedSearchQuery.length < 2) {
        setHasResults(false)
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 500))

      setIsLoading(false)
      setHasResults(true)
    }

    fetchResults()
  }, [debouncedSearchQuery])

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Clear search query when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("")
      setHasResults(false)
    }
  }, [isOpen])

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.98,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[100] bg-[#1A1A1A]/90 backdrop-blur-md flex flex-col items-center pt-20 md:pt-32"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          onClick={handleOverlayClick}
          aria-modal="true"
          role="dialog"
          aria-label="Search"
        >
          {/* Close Button */}
          <motion.button
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-[#282828]/70 rounded-full text-[#E0E0E0] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#00BFFF] z-10"
            onClick={onClose}
            variants={contentVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Close search"
          >
            <X className="w-6 h-6" />
          </motion.button>

          {/* Search Input */}
          <motion.div className="w-[90%] md:w-[80%] max-w-3xl mx-auto" variants={contentVariants}>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery("")}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Content Area */}
          <motion.div
            className="w-[90%] md:w-[80%] max-w-3xl mx-auto mt-6 flex-1 overflow-hidden"
            variants={contentVariants}
          >
            {debouncedSearchQuery && debouncedSearchQuery.length >= 2 ? (
              <SearchResults query={debouncedSearchQuery} isLoading={isLoading} hasResults={hasResults} />
            ) : (
              <>
                <RecentSearches />
                <div className="mt-4">
                  <TrendingSearches />
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
