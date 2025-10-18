"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ChevronRight, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PulseCard } from "@/components/pulse-card"

interface Pulse {
  id: string
  userId: string
  username: string
  isVerified: boolean
  avatarUrl?: string
  timestamp: string
  content: string
  hashtags: string[]
  likes: number
  comments: number
  shares: number
  userHasLiked: boolean
}

interface SidduPulseSectionProps {
  movieTitle: string
  movieId: string
  pulses: Pulse[]
}

export function SidduPulseSection({ movieTitle, movieId, pulses }: SidduPulseSectionProps) {
  const [isMobile, setIsMobile] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  // Check if we're on mobile (this would normally use a hook like useMediaQuery or similar)
  useState(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }

      checkMobile()
      window.addEventListener("resize", checkMobile)
      return () => window.removeEventListener("resize", checkMobile)
    }
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        delay: 0.4,
        type: "spring",
        stiffness: 200,
      },
    },
  }

  return (
    <motion.section
      ref={sectionRef}
      className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="bg-[#151515] rounded-lg p-6 md:p-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.h2 className="text-2xl md:text-3xl font-bold font-inter text-[#E0E0E0]" variants={itemVariants}>
            Pulses about {movieTitle}
          </motion.h2>

          {/* Desktop Post Button */}
          {!isMobile && (
            <motion.div variants={buttonVariants} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
              <Button className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD] font-inter">
                <Edit className="mr-2 h-4 w-4" />
                Post a Pulse
              </Button>
            </motion.div>
          )}
        </div>

        {/* Optional Subtitle */}
        <motion.p className="text-[#A0A0A0] font-dmsans text-sm mb-6" variants={itemVariants}>
          Join the conversation with quick thoughts, reactions, and insights about this movie
        </motion.p>

        {/* Pulse Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          {pulses.slice(0, isMobile ? 2 : 4).map((pulse, index) => (
            <motion.div key={pulse.id} variants={itemVariants} custom={index} transition={{ delay: 0.2 + index * 0.1 }}>
              <PulseCard pulse={pulse} />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div className="flex justify-center md:justify-end mt-6" variants={buttonVariants}>
          <Button
            variant="ghost"
            className="text-[#00BFFF] hover:text-[#00A3DD] hover:bg-[#00BFFF]/10 font-inter"
            asChild
          >
            <Link href={`/movies/${movieId}/pulses`}>
              View All Pulses
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Mobile FAB */}
      {isMobile && (
        <motion.div
          className="fixed bottom-6 right-6 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD] shadow-lg"
            aria-label="Post a Pulse"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
    </motion.section>
  )
}
