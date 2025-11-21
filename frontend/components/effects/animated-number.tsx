"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { animate } from "framer-motion"

interface AnimatedNumberProps {
  value: number
  duration?: number
  precision?: number
  className?: string
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 0.8, precision = 0, className }) => {
  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    const controls = animate(currentValue, value, {
      duration: duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        setCurrentValue(Number.parseFloat(latest.toFixed(precision)))
      },
    })
    return () => controls.stop()
  }, [value, duration, precision, currentValue]) // Added currentValue to dependencies to restart animation if value changes back to a previous one after being 0 or similar

  return (
    <span className={className}>
      {currentValue.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision })}
    </span>
  )
}

export default AnimatedNumber
