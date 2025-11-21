"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface SmokeAnimationProps {
  className?: string
  intensity?: number // 1-10 scale for intensity
  color?: string
  speed?: number // 1-10 scale for speed
}

export function SmokeAnimation({
  className = "",
  intensity = 5,
  color = "rgba(0, 191, 255, 0.2)",
  speed = 5,
}: SmokeAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Smoke particle class
    class SmokeParticle {
      x: number
      y: number
      radius: number
      color: string
      velocity: { x: number; y: number }
      life: number
      opacity: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.radius = Math.random() * 20 + 10
        this.color = color
        this.velocity = {
          x: (Math.random() - 0.5) * 0.2 * (intensity / 5),
          y: -Math.random() * 0.5 * (intensity / 5),
        }
        this.life = Math.random() * 100 + 100
        this.opacity = Math.random() * 0.5 + 0.4
      }

      draw() {
        if (!ctx) return

        ctx.beginPath()
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius)

        gradient.addColorStop(0, this.color.replace(")", `, ${this.opacity})`))
        gradient.addColorStop(1, this.color.replace(")", ", 0)"))

        ctx.fillStyle = gradient
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      update() {
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.life -= speed / 5
        this.opacity -= 0.005 * (speed / 5)

        if (this.opacity < 0) this.opacity = 0

        this.draw()
      }
    }

    // Particles array
    const particles: SmokeParticle[] = []

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Add new particles
      if (Math.random() < 0.1 * (intensity / 5)) {
        const x = Math.random() * canvas.width
        const y = canvas.height + 10
        particles.push(new SmokeParticle(x, y))
      }

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()

        // Remove dead particles
        if (particles[i].life <= 0 || particles[i].opacity <= 0) {
          particles.splice(i, 1)
          i--
        }
      }
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [intensity, color, speed])

  return (
    <motion.canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  )
}
