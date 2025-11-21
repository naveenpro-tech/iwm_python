"use client"

import { useRef, useEffect, useState } from "react"

interface ParallaxOptions {
  speed?: number // Positive values move opposite to scroll, negative values move with scroll
  direction?: "horizontal" | "vertical"
  reverse?: boolean
}

export function useParallax({ speed = 0.1, direction = "vertical", reverse = false }: ParallaxOptions = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return

      const element = ref.current
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate how far the element is from the viewport center
      const distanceFromCenter = rect.top + rect.height / 2 - windowHeight / 2

      // Calculate the parallax offset
      const parallaxOffset = distanceFromCenter * speed * (reverse ? -1 : 1)

      setPosition(parallaxOffset)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed, reverse])

  const style =
    direction === "vertical" ? { transform: `translateY(${position}px)` } : { transform: `translateX(${position}px)` }

  return { ref, style }
}
