"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Play, Eye, MessageSquare, Bookmark, Flame, Clock, Camera } from "lucide-react"
import type { Scene } from "./types"

interface SceneListItemProps {
  scene: Scene
  onSelect: (scene: Scene) => void
}

export default function SceneListItem({ scene, onSelect }: SceneListItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="bg-gray-900 rounded-lg overflow-hidden shadow-lg cursor-pointer group flex flex-col md:flex-row"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.2 },
      }}
      onClick={() => onSelect(scene)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Section */}
      <div className="relative aspect-video md:w-2/5 lg:w-1/3">
        <Image
          src={scene.thumbnail || "/placeholder.svg"}
          alt={`Scene from ${scene.movieTitle}: ${scene.title}`}
          fill
          className="object-cover transition-all duration-300 group-hover:brightness-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
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
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-14 relative flex-shrink-0">
              <Image
                src={scene.moviePoster || "/placeholder.svg"}
                alt={scene.movieTitle}
                fill
                className="object-cover rounded"
                sizes="40px"
              />
            </div>
            <div>
              <h3 className="text-gray-300 text-sm font-medium">
                {scene.movieTitle} <span className="text-gray-500">({scene.releaseYear})</span>
              </h3>
              <h2 className="text-white font-semibold text-lg">{scene.title}</h2>
            </div>
          </div>

          <p className="text-gray-400 text-sm mb-3">{scene.description}</p>

          <div className="flex flex-wrap gap-2 mb-3">
            {scene.isVisualTreat && (
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <Camera size={12} className="mr-1" />
                Visual Treat
              </span>
            )}
            <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full flex items-center">
              <Clock size={12} className="mr-1" />
              {scene.duration}
            </span>
            {scene.sceneType && (
              <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full">{scene.sceneType}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400 mt-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Eye size={16} className="mr-1" />
              <span>{scene.viewCount}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare size={16} className="mr-1" />
              <span>{scene.commentCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Director: {scene.director}</span>
            <button className="text-gray-400 hover:text-blue-400 transition-colors">
              <Bookmark size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
