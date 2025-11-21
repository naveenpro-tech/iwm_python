'use client'

/**
 * Character Counter Component
 * Shows character count with color transitions
 */

import { motion } from 'framer-motion'

interface CharacterCounterProps {
  current: number
  max: number
}

export default function CharacterCounter({ current, max }: CharacterCounterProps) {
  const percentage = (current / max) * 100
  
  // Determine status and color
  let status: 'safe' | 'warning' | 'error' = 'safe'
  let color = '#10B981' // Green
  
  if (current > max) {
    status = 'error'
    color = '#EF4444' // Red
  } else if (current > max * 0.96) { // 480+ chars
    status = 'warning'
    color = '#F59E0B' // Orange
  } else if (current > max * 0.8) { // 400+ chars
    status = 'warning'
    color = '#F59E0B' // Orange
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2"
    >
      {/* Circular Progress */}
      <svg width="24" height="24" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="#3A3A3A"
          strokeWidth="2"
        />
        {/* Progress circle */}
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={`${2 * Math.PI * 10}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 10 }}
          animate={{
            strokeDashoffset: 2 * Math.PI * 10 * (1 - Math.min(percentage, 100) / 100),
          }}
          transition={{ duration: 0.3 }}
        />
      </svg>

      {/* Text Counter */}
      <motion.span
        className="text-sm font-medium font-['DM_Sans']"
        animate={{ color }}
        transition={{ duration: 0.3 }}
      >
        {current}/{max}
      </motion.span>
    </motion.div>
  )
}

