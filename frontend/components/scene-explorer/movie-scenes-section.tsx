"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Play, ChevronRight, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockScenes } from "./mock-data"
import type { Scene } from "./types"

interface MovieScenesProps {
  movieId: string
  movieTitle: string
  limit?: number
  showViewAll?: boolean
}

export function MovieScenesSection({ movieId, movieTitle, limit = 4, showViewAll = true }: MovieScenesProps) {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>("all")

  const sceneTypes = ["all", "action", "dialogue", "emotional", "vfx", "one-shot"]

  useEffect(() => {
    // Simulate API call to fetch scenes for this movie
    setIsLoading(true)

    setTimeout(() => {
      // Filter scenes by movieId
      const filteredScenes = mockScenes.filter((scene) => scene.movieId === movieId)
      setScenes(filteredScenes)
      setIsLoading(false)
    }, 500)
  }, [movieId])

  // Apply filters and limit
  const filteredScenes = activeFilter === "all" ? scenes : scenes.filter((scene) => scene.sceneType === activeFilter)

  const displayedScenes = filteredScenes.slice(0, limit)

  if (isLoading) {
    return (
      <div className="w-full py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#E0E0E0]">Iconic Scenes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#282828] rounded-lg overflow-hidden">
                <div className="aspect-video bg-[#333333] animate-pulse"></div>
                <div className="p-4">
                  <div className="h-5 bg-[#333333] rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-[#333333] rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (scenes.length === 0) {
    return (
      <div className="w-full py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#E0E0E0]">Iconic Scenes</h2>
          </div>
          <div className="bg-[#282828] rounded-lg p-8 text-center">
            <h3 className="text-xl text-[#E0E0E0] mb-2">No scenes available</h3>
            <p className="text-[#A0A0A0]">We don't have any scenes for this movie yet.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold text-[#E0E0E0]">Iconic Scenes</h2>

          <div className="flex items-center mt-4 sm:mt-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-gray-200 mr-4">
                  <Filter className="h-4 w-4 mr-2" />
                  {activeFilter === "all" ? "All Types" : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-gray-200">
                <DropdownMenuLabel>Scene Types</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuGroup>
                  {sceneTypes.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      className={activeFilter === type ? "bg-gray-700" : ""}
                      onClick={() => setActiveFilter(type)}
                    >
                      {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {showViewAll && scenes.length > limit && (
              <Link
                href={`/scene-explorer?movie=${movieId}`}
                className="text-[#00BFFF] hover:text-[#00A3DD] transition-colors flex items-center"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedScenes.map((scene) => (
            <motion.div
              key={scene.id}
              className="group relative rounded-lg overflow-hidden bg-[#282828] hover:bg-[#303030] transition-colors"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={`/scene-explorer?scene=${scene.id}`} className="block">
                <div className="aspect-video relative">
                  <Image src={scene.thumbnail || "/placeholder.svg"} alt={scene.title} fill className="object-cover" />

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded-md px-2 py-1">
                    <span className="text-xs font-medium text-white">{scene.duration}</span>
                  </div>

                  {/* Visual treat badge */}
                  {scene.isVisualTreat && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-blue-500 text-white border-0">
                        Visual Treat
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-white line-clamp-1">{scene.title}</h3>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">{scene.description}</p>

                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>{scene.sceneType.charAt(0).toUpperCase() + scene.sceneType.slice(1)}</span>
                    <span>{(scene.viewCount / 1000).toFixed(1)}K views</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {showViewAll && scenes.length > limit && (
          <div className="flex justify-center mt-8 sm:hidden">
            <Link
              href={`/scene-explorer?movie=${movieId}`}
              className="text-[#00BFFF] hover:text-[#00A3DD] transition-colors flex items-center"
            >
              View All Scenes
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
