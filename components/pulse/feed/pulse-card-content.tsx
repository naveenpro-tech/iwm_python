'use client'

/**
 * Pulse Card Content Component
 * Text content with hashtags and mentions highlighted
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PulseCardContentProps {
  content: string
}

const MAX_LENGTH = 280

export default function PulseCardContent({ content }: PulseCardContentProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const needsTruncation = content.length > MAX_LENGTH

  const displayContent = needsTruncation && !isExpanded
    ? content.slice(0, MAX_LENGTH) + '...'
    : content

  // Highlight hashtags and mentions
  const highlightedContent = displayContent.split(/(\s+)/).map((word, index) => {
    if (word.startsWith('#')) {
      return (
        <span key={index} className="text-[#00BFFF] hover:underline cursor-pointer">
          {word}
        </span>
      )
    }
    if (word.startsWith('@')) {
      return (
        <span key={index} className="text-[#00BFFF] hover:underline cursor-pointer">
          {word}
        </span>
      )
    }
    return <span key={index}>{word}</span>
  })

  return (
    <div>
      <p className="text-[#E0E0E0] font-['DM_Sans'] text-base leading-relaxed whitespace-pre-wrap">
        {highlightedContent}
      </p>

      {needsTruncation && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-[#00BFFF] hover:underline text-sm font-medium"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  )
}

