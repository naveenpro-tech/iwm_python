'use client'

/**
 * Tag Chip Component
 * Removable tag chip for tagged items
 */

import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import { TaggedItem } from '@/types/pulse'

interface TagChipProps {
  tag: TaggedItem
  onRemove: () => void
}

export default function TagChip({ tag, onRemove }: TagChipProps) {
  const displayText = tag.type === 'movie'
    ? `🎬 ${tag.title} (${tag.year})`
    : `🏏 ${tag.team1} vs ${tag.team2}`

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded-full"
    >
      <span className="text-sm text-[#00BFFF] font-medium font-['DM_Sans']">
        {displayText}
      </span>
      <button
        onClick={onRemove}
        className="p-0.5 hover:bg-[#00BFFF]/20 rounded-full transition-colors"
      >
        <X size={14} className="text-[#00BFFF]" />
      </button>
    </motion.div>
  )
}

