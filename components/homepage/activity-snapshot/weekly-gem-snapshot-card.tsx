"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { WeeklyGemSnapshotCardProps } from "./types"
import { Gem, Sparkles } from "lucide-react"

export const WeeklyGemSnapshotCard: React.FC<WeeklyGemSnapshotCardProps> = ({ item, isActive }) => {
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95, filter: "blur(5px)" },
    animate: {
      opacity: isActive ? 1 : 0.7,
      y: isActive ? 0 : 10,
      scale: isActive ? 1 : 0.97,
      filter: isActive ? "blur(0px)" : "blur(2px)",
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="bg-gradient-to-br from-purple-900/60 via-gray-800/80 to-gray-900/70 backdrop-blur-lg p-5 md:p-6 rounded-xl shadow-2xl h-full flex flex-col group border border-purple-700/50 hover:border-purple-500 transition-all duration-300 min-h-[420px] md:min-h-[450px]"
    >
      <div className="flex items-center mb-3">
        <Gem className="w-7 h-7 mr-3 text-purple-400 group-hover:animate-spin group-hover:[animation-duration:2s]" />
        <h3 className="text-xl font-semibold text-gray-100">{item.category}</h3>
      </div>
      <div className="relative w-full h-40 sm:h-48 rounded-lg overflow-hidden mb-4 shadow-lg">
        <Image
          src={item.imageUrl || "/placeholder.svg?width=400&height=225&text=Weekly+Gem"}
          alt={item.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <h4 className="text-lg font-medium text-purple-300 mb-1 group-hover:text-purple-200 transition-colors line-clamp-2">
        {item.title}
      </h4>
      <p className="text-sm text-gray-400 mb-3 flex-grow line-clamp-3">{item.description}</p>
      <div className="mb-4">
        {item.tags.slice(0, 3).map(
          (
            tag, // Limit tags for space
          ) => (
            <span
              key={tag}
              className="inline-block bg-purple-700/60 text-purple-300 text-xs px-2 py-1 rounded-full mr-1.5 mb-1.5"
            >
              #{tag}
            </span>
          ),
        )}
      </div>
      <Link href={item.ctaLink} passHref legacyBehavior>
        <Button
          asChild
          variant="ghost"
          className="w-full group/button text-purple-300 hover:bg-purple-800/70 hover:text-purple-100 mt-auto"
        >
          <a>
            {item.ctaText}
            <Sparkles className="w-4 h-4 ml-2 text-purple-400 group-hover/button:text-yellow-300 transition-colors group-hover/button:animate-ping group-hover/button:[animation-duration:1s]" />
          </a>
        </Button>
      </Link>
    </motion.div>
  )
}
