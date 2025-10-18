"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import type { HelpTopic } from "./types"

interface HelpHeaderProps {
  onSearch: (query: string) => void
  popularTopics: HelpTopic[]
}

export default function HelpHeader({ onSearch, popularTopics }: HelpHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <div className="bg-[#282828] py-12">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-white text-center mb-8"
        >
          How can we help you?
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A1A] text-white border border-[#444] rounded-lg py-3 px-4 pl-12 focus:outline-none focus:border-[#00BFFF] transition-colors"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#A0A0A0]" size={20} />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#00BFFF] text-white px-4 py-1 rounded-md hover:bg-[#00A0E0] transition-colors"
            >
              Search
            </button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {popularTopics.map((topic, index) => (
            <motion.button
              key={topic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
              onClick={() => onSearch(topic.title)}
              className="bg-[#1A1A1A] text-[#E0E0E0] px-4 py-2 rounded-full hover:bg-[#333] transition-colors"
            >
              {topic.title}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
