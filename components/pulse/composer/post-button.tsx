'use client'

/**
 * Post Button Component
 * Submit button with loading and success states
 */

import { motion } from 'framer-motion'
import { Loader2, Check } from 'lucide-react'

interface PostButtonProps {
  onClick: () => void
  disabled: boolean
  isSubmitting: boolean
}

export default function PostButton({
  onClick,
  disabled,
  isSubmitting,
}: PostButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`px-6 py-2 rounded-lg font-semibold font-['DM_Sans'] transition-all ${
        disabled
          ? 'bg-[#3A3A3A] text-[#A0A0A0] cursor-not-allowed opacity-50'
          : 'bg-gradient-to-r from-[#00BFFF] to-[#0080FF] text-white shadow-lg shadow-[#00BFFF]/20'
      }`}
    >
      {isSubmitting ? (
        <span className="flex items-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          Posting...
        </span>
      ) : (
        'Post'
      )}
    </motion.button>
  )
}

