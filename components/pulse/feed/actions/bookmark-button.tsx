'use client'

/**
 * Bookmark Button Component
 * Bounce animation on toggle
 */

import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'

interface BookmarkButtonProps {
  isBookmarked: boolean
  onClick: () => void
}

export default function BookmarkButton({ isBookmarked, onClick }: BookmarkButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: [1, 1.2, 0.9, 1] }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Bookmark
        size={20}
        className={`transition-colors ${
          isBookmarked ? 'text-[#FFD700] fill-[#FFD700]' : 'text-[#A0A0A0] group-hover:text-[#FFD700]'
        }`}
      />
    </motion.button>
  )
}

