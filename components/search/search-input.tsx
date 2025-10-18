"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, X, Loader2 } from "lucide-react"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  isLoading?: boolean
}

export function SearchInput({ value, onChange, onClear, isLoading = false }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-[#A0A0A0]" />
      </div>

      <input
        ref={inputRef}
        type="text"
        className="block w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl py-4 pl-12 pr-12 text-[#E0E0E0] placeholder-[#A0A0A0] focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] focus:outline-none font-dmsans text-base md:text-lg transition-all duration-200"
        placeholder="Search movies, people, pulses..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search"
      />

      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
        {isLoading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Loader2 className="h-5 w-5 text-[#A0A0A0] animate-spin" />
          </motion.div>
        ) : value ? (
          <motion.button
            onClick={onClear}
            className="text-[#A0A0A0] hover:text-[#E0E0E0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00BFFF] rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </motion.button>
        ) : null}
      </div>
    </div>
  )
}
