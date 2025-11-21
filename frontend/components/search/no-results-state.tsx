"use client"

import { motion } from "framer-motion"
import { SearchX } from "lucide-react"

interface NoResultsStateProps {
  query: string
}

export function NoResultsState({ query }: NoResultsStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-20 h-20 rounded-full bg-[#282828] flex items-center justify-center mb-6">
        <SearchX size={32} className="text-gray-400" />
      </div>

      <h3 className="text-xl font-semibold mb-2">No results found</h3>
      <p className="text-gray-400 max-w-md mb-6">
        We couldn't find any matches for "{query}". Please try another search term or check your spelling.
      </p>

      <div className="bg-[#282828] rounded-lg p-4 max-w-md">
        <h4 className="font-medium mb-2">Search tips:</h4>
        <ul className="text-sm text-gray-300 text-left space-y-2">
          <li>• Check your spelling</li>
          <li>• Try more general keywords</li>
          <li>• Try different keywords</li>
          <li>• Try fewer keywords</li>
        </ul>
      </div>
    </motion.div>
  )
}
