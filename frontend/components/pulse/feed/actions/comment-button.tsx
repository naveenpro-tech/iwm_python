'use client'

/**
 * Comment Button Component
 * Expand/collapse comment section
 */

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

interface CommentButtonProps {
  commentCount: number
  onClick: () => void
  isExpanded: boolean
}

export default function CommentButton({ commentCount, onClick, isExpanded }: CommentButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ rotate: 360 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-2 group"
    >
      <MessageCircle
        size={20}
        className={`transition-colors ${
          isExpanded ? 'text-[#00BFFF]' : 'text-[#A0A0A0] group-hover:text-[#00BFFF]'
        }`}
      />
      <span className={`text-sm font-medium ${isExpanded ? 'text-[#00BFFF]' : 'text-[#A0A0A0]'}`}>
        {commentCount}
      </span>
    </motion.button>
  )
}

