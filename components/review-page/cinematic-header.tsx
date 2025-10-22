"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"

interface CinematicHeaderProps {
  backdropUrl: string
  movieTitle: string
  releaseYear: number
}

export function CinematicHeader({ backdropUrl, movieTitle, releaseYear }: CinematicHeaderProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // Parallax effect
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])

  return (
    <div ref={ref} className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-full"
      >
        <Image
          src={backdropUrl || "/placeholder-backdrop.jpg"}
          alt={movieTitle}
          fill
          className="object-cover"
          priority
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#1A1A1A]" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative h-full flex items-center justify-center text-center px-4"
      >
        <div className="max-w-4xl">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-inter text-white mb-4 drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {movieTitle}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-[#E0E0E0] font-dmsans drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {releaseYear}
          </motion.p>
        </div>
      </motion.div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1A1A1A] to-transparent" />
    </div>
  )
}

