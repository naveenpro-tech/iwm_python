"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchHeaderProps {
  query: string
  setQuery: (query: string) => void
  toggleFilters: () => void
  showFiltersButton: boolean
}

export function SearchHeader({ query, setQuery, toggleFilters, showFiltersButton }: SearchHeaderProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isSticky, setIsSticky] = useState(false)

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  // Clear search query
  const clearSearch = () => {
    setQuery("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-4 ${
        isSticky ? "bg-[#1A1A1A]/90 backdrop-blur-md shadow-md" : "bg-[#1A1A1A]"
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-gray-400" size={20} />

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, people, pulses, cricket..."
              className="w-full h-14 pl-12 pr-20 bg-[#282828] border border-gray-700 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
            />

            {query && (
              <button type="button" onClick={clearSearch} className="absolute right-16 text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            )}

            {showFiltersButton && (
              <Button
                type="button"
                onClick={toggleFilters}
                variant="ghost"
                size="icon"
                className="absolute right-4 text-gray-400 hover:text-white"
              >
                <SlidersHorizontal size={18} />
              </Button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  )
}
