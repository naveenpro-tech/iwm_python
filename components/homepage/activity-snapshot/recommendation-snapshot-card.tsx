"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { RecommendationSnapshotCardProps } from "./types"
import { Star, ThumbsUp } from "lucide-react"

export const RecommendationSnapshotCard: React.FC<RecommendationSnapshotCardProps> = ({ item, isActive }) => {
  const cardVariants = {
    initial: { opacity: 0, x: 20, filter: "blur(5px)" },
    animate: {
      opacity: isActive ? 1 : 0.7,
      x: isActive ? 0 : 10,
      filter: isActive ? "blur(0px)" : "blur(2px)",
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-xl shadow-xl overflow-hidden h-full flex flex-col group border border-gray-700 hover:border-primary/70 transition-all duration-300 min-h-[420px] md:min-h-[450px]"
    >
      <div className="relative w-full h-60 sm:h-64">
        <Image
          src={item.posterUrl || "/placeholder.svg?width=300&height=450&text=Recommendation"}
          alt={item.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end">
          <h3 className="text-lg font-semibold text-white shadow-text line-clamp-2">{item.title}</h3>
          {item.rating && item.genres && (
            <div className="flex items-center text-xs text-yellow-400 mt-1">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span>{item.rating.toFixed(1)}</span>
              <span className="text-gray-400 mx-1.5">|</span>
              <span className="text-gray-300 line-clamp-1">{item.genres.slice(0, 2).join(", ")}</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 md:p-5 flex flex-col flex-grow">
        <p className="text-sm text-gray-400 mb-3 flex-grow italic line-clamp-3">"{item.reason}"</p>
        <Link href={item.ctaLink} passHref legacyBehavior>
          <Button
            asChild
            variant="outline"
            className="w-full text-gray-300 border-gray-600 hover:bg-primary hover:text-gray-900 hover:border-primary mt-auto group/button"
          >
            <a>
              View Details
              <ThumbsUp className="w-4 h-4 ml-2 group-hover/button:animate-bounce" />
            </a>
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
