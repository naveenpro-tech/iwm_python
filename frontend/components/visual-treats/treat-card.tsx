"use client"

import type React from "react"

import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, Eye, PlusCircle, Share2, Film } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { VisualTreat } from "./types"
import { useState } from "react"

interface TreatCardProps {
  treat: VisualTreat
  onOpenModal: (treat: VisualTreat) => void
  onLikeToggle: (id: string) => void
  onBookmarkToggle: (id: string) => void // For adding to collection/bookmark
  viewMode?: "grid" | "list" // Optional, defaults to grid
}

export function TreatCard({ treat, onOpenModal, onLikeToggle, onBookmarkToggle, viewMode = "grid" }: TreatCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const cardVariants = {
    rest: { scale: 1, boxShadow: "0px 5px 10px rgba(0,0,0,0.1)" },
    hover: { scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" },
  }
  const overlayVariants = {
    rest: { opacity: 0 },
    hover: { opacity: 1 },
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent modal open if a button inside card is clicked
    if ((e.target as HTMLElement).closest("button")) {
      return
    }
    onOpenModal(treat)
  }

  if (viewMode === "list") {
    return (
      <motion.div
        variants={cardVariants}
        initial="rest"
        whileHover="hover"
        animate="rest"
        onClick={handleCardClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="bg-[#282828] border border-gray-700 rounded-lg overflow-hidden shadow-lg cursor-pointer flex transition-all duration-300 ease-in-out hover:border-[#00BFFF]/50"
      >
        <div className="relative w-32 h-full sm:w-40 flex-shrink-0">
          <Image
            src={treat.imageUrl || "/placeholder.svg?width=200&height=300&query=movie+still"}
            alt={treat.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 33vw, 160px"
          />
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <Film className="w-10 h-10 text-white/70" />
          </motion.div>
        </div>
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-semibold text-white leading-tight">{treat.title}</h3>
            <Badge variant="outline" className="text-xs bg-[#3A3A3A] text-gray-300 border-gray-600 whitespace-nowrap">
              {treat.category}
            </Badge>
          </div>
          <p className="text-xs text-gray-400 mb-2">
            {treat.film} ({treat.year})
          </p>
          <p className="text-sm text-gray-300 mb-3 line-clamp-2">{treat.description}</p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center">
                <Heart
                  className={`h-3.5 w-3.5 mr-1 ${treat.userLiked ? "text-red-500 fill-red-500" : "text-gray-500"}`}
                />
                {treat.likes.toLocaleString()}
              </span>
              <span className="flex items-center">
                <Eye className="h-3.5 w-3.5 mr-1 text-gray-500" />
                {treat.views.toLocaleString()}
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-400 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation()
                  onLikeToggle(treat.id)
                }}
              >
                <Heart className={`h-4 w-4 ${treat.userLiked ? "text-red-500 fill-red-500" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-400 hover:text-[#00BFFF]"
                onClick={(e) => {
                  e.stopPropagation()
                  onBookmarkToggle(treat.id)
                }}
              >
                <PlusCircle className={`h-4 w-4 ${treat.userBookmarked ? "text-[#00BFFF] fill-[#00BFFF]" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Grid View
  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      onClick={handleCardClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-[#282828] border border-gray-700 rounded-lg overflow-hidden shadow-lg aspect-[3/4] cursor-pointer group transition-all duration-300 ease-in-out hover:border-[#00BFFF]/50"
    >
      <Image
        src={treat.imageUrl || "/placeholder.svg?width=400&height=600&query=cinematic+still"}
        alt={treat.title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <motion.div
        variants={overlayVariants}
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end"
      >
        <h3 className="text-lg font-semibold text-white mb-1 leading-tight line-clamp-2">{treat.title}</h3>
        <p className="text-xs text-gray-300 mb-2 line-clamp-1">
          {treat.film} ({treat.year})
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center">
              <Heart
                className={`h-3.5 w-3.5 mr-1 ${treat.userLiked ? "text-red-500 fill-red-500" : "text-gray-200"}`}
              />
              {treat.likes.toLocaleString()}
            </span>
            <span className="flex items-center">
              <Eye className="h-3.5 w-3.5 mr-1 text-gray-200" />
              {treat.views.toLocaleString()}
            </span>
          </div>
          <Badge variant="outline" className="text-xs bg-black/30 text-gray-200 border-gray-500 backdrop-blur-sm">
            {treat.category}
          </Badge>
        </div>
      </motion.div>

      {/* Hover Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-2 right-2 flex flex-col gap-2"
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-black/50 text-white hover:bg-black/70 hover:text-red-500 rounded-full"
          onClick={(e) => {
            e.stopPropagation()
            onLikeToggle(treat.id)
          }}
        >
          <Heart className={`h-4 w-4 ${treat.userLiked ? "text-red-500 fill-red-500" : ""}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-black/50 text-white hover:bg-black/70 hover:text-[#00BFFF] rounded-full"
          onClick={(e) => {
            e.stopPropagation()
            onBookmarkToggle(treat.id)
          }}
        >
          <PlusCircle className={`h-4 w-4 ${treat.userBookmarked ? "text-[#00BFFF] fill-[#00BFFF]" : ""}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-black/50 text-white hover:bg-black/70 rounded-full"
          onClick={(e) => {
            e.stopPropagation()
            console.log("Share treat:", treat.id) /* Mock share */
          }}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  )
}
