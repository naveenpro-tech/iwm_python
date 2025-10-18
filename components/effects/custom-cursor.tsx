"use client"

import { useState, useEffect } from "react"
import { motion, useSpring } from "framer-motion"

interface CustomCursorProps {
  color?: string
  size?: number
  trailSize?: number
  trailOpacity?: number
  trailLength?: number
}

export function CustomCursor({
  color = "rgba(0, 191, 255, 0.8)",
  size = 20,
  trailSize = 10,
  trailOpacity = 0.3,
  trailLength = 5,
}: CustomCursorProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([])

  // Smooth spring animations for cursor
  const springConfig = { stiffness: 500, damping: 28 }
  const cursorX = useSpring(0, springConfig)
  const cursorY = useSpring(0, springConfig)

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY })
      cursorX.set(ev.clientX)
      cursorY.set(ev.clientY)

      // Update trail
      setTrail((prevTrail) => {
        const newTrail = [...prevTrail, { x: ev.clientX, y: ev.clientY }]
        if (newTrail.length > trailLength) {
          return newTrail.slice(newTrail.length - trailLength)
        }
        return newTrail
      })
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener("mousemove", updateMousePosition)
    window.addEventListener("mouseenter", handleMouseEnter)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      window.removeEventListener("mouseenter", handleMouseEnter)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [cursorX, cursorY, trailLength])

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          width: size,
          height: size,
          backgroundColor: color,
          opacity: isVisible ? 1 : 0,
          filter: "blur(2px)",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Cursor trail */}
      {trail.map((position, index) => (
        <motion.div
          key={index}
          className="fixed top-0 left-0 pointer-events-none z-50 rounded-full mix-blend-screen"
          style={{
            width: trailSize,
            height: trailSize,
            backgroundColor: color,
            opacity: (index / trail.length) * trailOpacity,
            left: position.x,
            top: position.y,
            filter: "blur(3px)",
            transform: "translate(-50%, -50%)",
          }}
          initial={{ scale: 1 }}
          animate={{ scale: 0.8 }}
          transition={{ duration: 0.5 }}
        />
      ))}
    </>
  )
}
