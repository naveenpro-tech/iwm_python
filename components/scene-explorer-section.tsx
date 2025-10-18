"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Play, Video } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SceneExplorerSectionProps {
  movie: {
    id: string
    title: string
    featuredScene: {
      thumbnailUrl: string
      title: string
      timestamp: string
      duration: string
    }
  }
}

export function SceneExplorerSection({ movie }: SceneExplorerSectionProps) {
  const [isHovered, setIsHovered] = useState(false)

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

  const playPulseVariants = {
    initial: { scale: 1, opacity: 0.8 },
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 0.6, 0.8],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.section
      className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="bg-[#151515] rounded-lg p-6 md:p-8">
        {/* Section Title */}
        <motion.h2 className="text-2xl md:text-3xl font-bold font-inter text-[#E0E0E0] mb-6" variants={itemVariants}>
          Explore Key Scenes
        </motion.h2>

        {/* Preview Area */}
        <motion.div variants={itemVariants} className="mb-6">
          <div
            className="relative w-full aspect-video bg-[#1A1A1A] rounded-md overflow-hidden border border-[#282828] shadow-md cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Scene Thumbnail */}
            <motion.div
              className="relative w-full h-full"
              animate={{ scale: isHovered ? 1.02 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={movie.featuredScene.thumbnailUrl || "/placeholder.svg"}
                alt={`${movie.featuredScene.title} scene`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />

              {/* Gradient Overlay for Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-transparent to-transparent" />
            </motion.div>

            {/* Play Indicator */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              variants={playPulseVariants}
              initial="initial"
              animate="animate"
            >
              <div className="bg-[#00BFFF]/20 backdrop-blur-sm rounded-full p-6 md:p-8">
                <Play className="w-12 h-12 md:w-16 md:h-16 text-[#E0E0E0] fill-current" />
              </div>
            </motion.div>

            {/* Scene Information */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-inter font-medium text-[#E0E0E0] mb-1">
                {movie.featuredScene.title}
              </h3>
              <div className="flex items-center gap-2 text-sm font-dmsans text-[#A0A0A0]">
                <span>{movie.featuredScene.timestamp}</span>
                <span>•</span>
                <span>{movie.featuredScene.duration}</span>
              </div>
            </div>

            {/* Optional Scene Selection Indicators */}
            <div className="absolute bottom-4 right-4 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-[#00BFFF]" />
              <div className="w-2 h-2 rounded-full bg-[#A0A0A0]/50" />
              <div className="w-2 h-2 rounded-full bg-[#A0A0A0]/50" />
              <div className="w-2 h-2 rounded-full bg-[#A0A0A0]/50" />
            </div>
          </div>
        </motion.div>

        {/* Launch Button */}
        <motion.div variants={itemVariants} className="flex justify-center md:justify-start">
          <motion.div whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
            <Button
              size="lg"
              className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD] font-inter font-semibold px-6 py-3 w-full md:w-auto"
            >
              <Video className="mr-2 h-5 w-5" />
              Launch Scene Explorer
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
