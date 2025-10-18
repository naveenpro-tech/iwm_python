"use client"

import { motion } from "framer-motion"
import { TagsIcon } from "lucide-react" // Changed from Tag to TagsIcon for clarity
import Link from "next/link"

interface RelatedGenresProps {
  relatedGenres: string[]
}

export function RelatedGenres({ relatedGenres }: RelatedGenresProps) {
  if (!relatedGenres || relatedGenres.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="w-full"
    >
      <h3 className="text-base font-semibold text-gray-100 mb-2.5 flex items-center">
        {" "}
        {/* Adjusted size and margin */}
        <TagsIcon className="text-[#00BFFF] mr-1.5" size={18} /> {/* Adjusted size */}
        Related Genres
      </h3>

      <div className="flex flex-wrap gap-1.5">
        {" "}
        {/* Reduced gap for sidebar */}
        {relatedGenres.map((genre, index) => (
          <motion.div
            key={genre}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.05 * index }}
            whileHover={{ scale: 1.05 }}
          >
            <Link
              href={`/genres/${genre.toLowerCase().replace(/\s+/g, "-")}`}
              className="block bg-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-600/70 px-2.5 py-1 rounded-md text-[11px] transition-colors shadow-sm"
            >
              {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
