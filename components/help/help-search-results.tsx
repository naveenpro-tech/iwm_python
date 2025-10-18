"use client"

import { motion } from "framer-motion"
import { Search, FileText } from "lucide-react"
import Link from "next/link"
import type { HelpTopic } from "./types"

export interface HelpSearchResultsProps {
  query: string
  results: HelpTopic[]
  isLoading?: boolean
}

export function HelpSearchResults({ query, results, isLoading = false }: HelpSearchResultsProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
      >
        <div className="flex items-center mb-6">
          <Search className="text-[#00BFFF] mr-2" size={24} />
          <h2 className="text-2xl font-bold text-white">Searching for "{query}"...</h2>
        </div>

        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#252525] p-4 rounded-lg">
              <div className="h-6 bg-[#333] rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-[#333] rounded w-full mb-2"></div>
              <div className="h-4 bg-[#333] rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
    >
      <div className="flex items-center mb-6">
        <Search className="text-[#00BFFF] mr-2" size={24} />
        <h2 className="text-2xl font-bold text-white">Search Results for "{query}"</h2>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-300 mb-4">No results found for "{query}"</p>
          <p className="text-gray-400 text-sm">Try using different keywords or browse our help categories below.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
            >
              <Link href={`/help/topic/${result.id}`}>
                <div className="bg-[#252525] hover:bg-[#333] p-4 rounded-lg transition-colors">
                  <div className="flex items-center mb-2">
                    <FileText size={16} className="text-[#00BFFF] mr-2" />
                    <h3 className="text-lg font-medium text-white">{result.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-2">{result.content.substring(0, 150)}...</p>
                  <div className="mt-2 text-xs text-gray-400">Category: {result.category}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
