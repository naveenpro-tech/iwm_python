"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import { formatTimeRemaining } from "../../utils"

interface CircularTimerProps {
  timeRemaining: number
  totalTime: number
}

export default function CircularTimer({ timeRemaining, totalTime }: CircularTimerProps) {
  const [percentage, setPercentage] = useState(100)
  const [timerState, setTimerState] = useState<"normal" | "warning" | "danger">("normal")

  // Calculate percentage and state
  useEffect(() => {
    const calculatedPercentage = (timeRemaining / totalTime) * 100
    setPercentage(calculatedPercentage)

    if (calculatedPercentage > 50) {
      setTimerState("normal")
    } else if (calculatedPercentage > 25) {
      setTimerState("warning")
    } else {
      setTimerState("danger")
    }
  }, [timeRemaining, totalTime])

  // Animation variants
  const containerVariants = {
    normal: {
      scale: [1, 1.02, 1],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        duration: 3,
        ease: "easeInOut",
      },
    },
    warning: {
      scale: [1, 1.03, 1],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        duration: 2,
        ease: "easeInOut",
      },
    },
    danger: {
      scale: [1, 1.05, 1],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        duration: 1,
        ease: "easeInOut",
      },
    },
  }

  // Colors based on timer state
  const colors = {
    normal: {
      stroke: "#8B5CF6", // Purple-500
      text: "#C4B5FD", // Purple-300
      glow: "rgba(139, 92, 246, 0.5)",
    },
    warning: {
      stroke: "#F59E0B", // Amber-500
      text: "#FCD34D", // Amber-300
      glow: "rgba(245, 158, 11, 0.5)",
    },
    danger: {
      stroke: "#EF4444", // Red-500
      text: "#FCA5A5", // Red-300
      glow: "rgba(239, 68, 68, 0.5)",
    },
  }

  // Calculate stroke dash
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <motion.div
      className="relative flex items-center justify-center mt-4 md:mt-0"
      variants={containerVariants}
      animate={timerState}
    >
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* SVG Circle */}
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0 transform -rotate-90">
          {/* Background circle */}
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="6" />

          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={colors[timerState].stroke}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 4px ${colors[timerState].glow})`,
            }}
          />
        </svg>

        {/* Timer content */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <span className="text-lg font-mono font-bold" style={{ color: colors[timerState].text }}>
            {formatTimeRemaining(timeRemaining)}
          </span>
          <Clock className="h-4 w-4 mt-0.5 opacity-70" style={{ color: colors[timerState].text }} />
        </div>
      </div>
    </motion.div>
  )
}
