"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface MousePosition {
  x: number
  y: number
  elementX: number
  elementY: number
  elementWidth: number
  elementHeight: number
  relativeX: number // 0 to 1 position within element
  relativeY: number // 0 to 1 position within element
}

export function useMousePosition(ref: React.RefObject<HTMLElement>) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
    elementWidth: 0,
    elementHeight: 0,
    relativeX: 0,
    relativeY: 0,
  })

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      if (!ref.current) return

      const element = ref.current
      const rect = element.getBoundingClientRect()

      // Calculate position relative to the element
      const elementX = ev.clientX - rect.left
      const elementY = ev.clientY - rect.top

      // Calculate relative position (0 to 1)
      const relativeX = Math.max(0, Math.min(1, elementX / rect.width))
      const relativeY = Math.max(0, Math.min(1, elementY / rect.height))

      setMousePosition({
        x: ev.clientX,
        y: ev.clientY,
        elementX,
        elementY,
        elementWidth: rect.width,
        elementHeight: rect.height,
        relativeX,
        relativeY,
      })
    }

    window.addEventListener("mousemove", updateMousePosition)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
    }
  }, [ref])

  return mousePosition
}
