"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Save, ChevronDown, Clock, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { SavedSearch } from "./types"

interface AdvancedSearchHeaderProps {
  query: string
  savedSearches: SavedSearch[]
  onSearch: (query: string) => void
  onSaveSearch: (name: string) => void
}

export function AdvancedSearchHeader({ query, savedSearches, onSearch, onSaveSearch }: AdvancedSearchHeaderProps) {
  const [searchQuery, setSearchQuery] = useState(query)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSearchQuery(query)
  }, [query])

  useEffect(() => {
    // Simulate live suggestions
    if (searchQuery.length > 2) {
      setSuggestions([
        `${searchQuery} in sci-fi movies`,
        `${searchQuery} directed by Christopher Nolan`,
        `${searchQuery} with high SidduScore`,
        `${searchQuery} from 2020s`,
        `${searchQuery} award winners`,
      ])
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [searchQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
    setShowSuggestions(false)
  }

  return (
    <div className="relative" ref={searchRef}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-white mb-6">Advanced Search</h1>

        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies, actors, directors, or any combination..."
              className="pl-10 bg-[#282828] border-gray-700 text-white h-12"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-700">
                <Star className="mr-2" size={16} />
                Saved
                <ChevronDown className="ml-2" size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#282828] border-gray-700">
              {savedSearches.length > 0 ? (
                savedSearches.map((search) => (
                  <DropdownMenuItem key={search.id} className="text-white hover:bg-[#333333]">
                    <Clock className="mr-2" size={14} />
                    {search.name}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled className="text-gray-500">
                  No saved searches
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const name = prompt("Save this search as:")
              if (name) onSaveSearch(name)
            }}
            className="border-gray-700"
          >
            <Save size={16} />
          </Button>

          <Button type="submit" className="bg-[#00BFFF] hover:bg-[#0099CC]">
            Search
          </Button>
        </form>
      </motion.div>

      {/* Live Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#282828] border border-gray-700 rounded-lg shadow-xl z-50"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setSearchQuery(suggestion)
                  setShowSuggestions(false)
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-[#333333] transition-colors flex items-center"
              >
                <Search className="mr-3 text-gray-400" size={16} />
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
