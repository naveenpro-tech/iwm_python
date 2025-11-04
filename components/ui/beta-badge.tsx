"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface BetaBadgeProps {
  variant?: "default" | "compact" | "minimal"
  className?: string
}

export function BetaBadge({ variant = "default", className = "" }: BetaBadgeProps) {
  const isBeta = process.env.NEXT_PUBLIC_BETA_VERSION === "true"
  
  if (!isBeta) return null

  if (variant === "minimal") {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 ${className}`}>
        BETA
      </span>
    )
  }

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 ${className}`}
      >
        <Sparkles className="w-3 h-3 text-orange-400" />
        <span className="text-xs font-bold text-orange-400">BETA</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 backdrop-blur-sm ${className}`}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <Sparkles className="w-4 h-4 text-orange-400" />
      </motion.div>
      <span className="text-sm font-bold text-orange-400 tracking-wide">BETA</span>
    </motion.div>
  )
}

