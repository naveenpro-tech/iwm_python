"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Play, Eye, MessageSquare, Bookmark, Flame } from "lucide-react"
import type { Scene } from "./types"

interface SceneCardProps {
  scene: Scene
  onSelect: (scene: Scene) => void
}

export default function SceneCard({ scene, onSelect }: SceneCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="bg-gray-900 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.2 },
      }}
      onClick={() => onSelect(scene)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Section */}
      <div className="relative aspect-video">
        <Image
          src={scene.thumbnail || "/placeholder.svg"}
          alt={`Scene from ${scene.movieTitle}: ${scene.title}`}
          fill
          className="object-cover transition-all duration-300 group-hover:brightness-110 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="bg-black bg-opacity-50 rounded-full p-3 text-white"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isHovered ? 1 : 0.7,
              scale: isHovered ? 1 : 0.9,
            }}
            transition={{ duration: 0.2 }}
          >
            <Play size={24} fill="white" />
          </motion.div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {scene.duration}
        </div>

        {/* Popularity Badge (if popular) */}
        {scene.isPopular && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Flame size={12} className="mr-1" />
            <span>Popular</span>
          </div>
        )}

        {/* Visual Treat Badge (if applicable) */}
        {scene.isVisualTreat && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full">
            Visual Treat
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <div className="w-8 h-12 relative flex-shrink-0">
            <Image
              src={scene.moviePoster || "/placeholder.svg"}
              alt={scene.movieTitle}
              fill
              className="object-cover rounded"
              sizes="32px"
            />
          </div>
          <div>
            <h3 className="text-gray-300 text-sm font-medium">
              {scene.movieTitle} <span className="text-gray-500">({scene.releaseYear})</span>
            </h3>
            <h2 className="text-white font-semibold line-clamp-1">{scene.title}</h2>
          </div>
        </div>

        <p className="text-gray-400 text-sm line-clamp-2 mb-3">{scene.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Eye size={14} className="mr-1" />
              <span>{scene.viewCount}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare size={14} className="mr-1" />
              <span>{scene.commentCount}</span>
            </div>
          </div>
          <button className="text-gray-400 hover:text-blue-400 transition-colors">
            <Bookmark size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
