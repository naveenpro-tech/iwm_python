"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"

interface CriticReviewHeroProps {
  backdropUrl: string
  movieTitle: string
  movieYear: number
  criticUsername: string
  criticName: string
  criticAvatar: string
}

export function CriticReviewHero({
  backdropUrl,
  movieTitle,
  movieYear,
  criticUsername,
  criticName,
  criticAvatar,
}: CriticReviewHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])

  return (
    <div ref={containerRef} className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-full"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backdropUrl})`,
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/80 via-transparent to-[#1A1A1A]/80" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col justify-end pb-12 px-4 md:px-8 max-w-7xl mx-auto"
      >
        {/* Breadcrumb Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6 flex items-center gap-2 text-sm text-[#A0A0A0]"
        >
          <Link href="/" className="hover:text-[#00BFFF] transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/critics" className="hover:text-[#00BFFF] transition-colors">
            Critics
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/critic/${criticUsername}`} className="hover:text-[#00BFFF] transition-colors">
            {criticName}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#E0E0E0]">Review</span>
        </motion.nav>

        {/* Movie Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold font-inter mb-4 bg-gradient-to-r from-[#E0E0E0] via-[#00BFFF] to-[#E0E0E0] bg-clip-text text-transparent"
        >
          {movieTitle}
        </motion.h1>

        {/* Year & Critic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
        >
          <span className="text-xl md:text-2xl text-[#A0A0A0] font-dmsans">
            {movieYear}
          </span>

          <div className="hidden md:block w-px h-8 bg-[#3A3A3A]" />

          {/* Critic Badge */}
          <div className="flex items-center gap-3 bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#3A3A3A] rounded-full px-4 py-2 w-fit">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-[#00BFFF]"
                style={{ backgroundImage: `url(${criticAvatar})` }}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00BFFF] rounded-full border-2 border-[#1A1A1A] flex items-center justify-center">
                <svg className="w-2 h-2 text-[#1A1A1A]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm text-[#A0A0A0]">Review by</p>
              <p className="text-[#E0E0E0] font-medium">{criticName}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-[#00BFFF] rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1 h-2 bg-[#00BFFF] rounded-full"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

