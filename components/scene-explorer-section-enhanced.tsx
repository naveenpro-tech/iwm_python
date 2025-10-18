"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Play, Video, ChevronLeft, ChevronRight, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Scene {
  id: string
  thumbnailUrl: string
  title: string
  timestamp: string
  duration: string
  description: string
  tags?: string[]
}

interface SceneExplorerSectionEnhancedProps {
  movie: {
    id: string
    title: string
    scenes: Scene[]
  }
}

export function SceneExplorerSectionEnhanced({ movie }: SceneExplorerSectionEnhancedProps) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [showSceneModal, setShowSceneModal] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const activeScene = movie.scenes[activeSceneIndex]

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

  // Handle scene navigation
  const navigateScene = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setActiveSceneIndex((prev) => (prev > 0 ? prev - 1 : movie.scenes.length - 1))
    } else {
      setActiveSceneIndex((prev) => (prev < movie.scenes.length - 1 ? prev + 1 : 0))
    }
  }

  // Handle carousel scroll
  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return

    const carousel = carouselRef.current
    const scrollAmount = direction === "left" ? -300 : 300

    carousel.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    })
  }

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return

    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return

    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  // Handle mouse up/leave to end dragging
  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Auto-play scene preview
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        setIsPlaying(false)
      }, 5000) // 5 seconds preview

      return () => clearTimeout(timer)
    }
  }, [isPlaying])

  return (
    <motion.section
      ref={sectionRef}
      className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="bg-[#151515] rounded-lg p-6 md:p-8 overflow-hidden">
        {/* Section Title with Animation */}
        <motion.div className="flex items-center justify-between mb-6" variants={itemVariants}>
          <h2 className="text-2xl md:text-3xl font-bold font-inter text-[#E0E0E0]">Explore Key Scenes</h2>

          <div className="hidden md:flex items-center gap-2">
            <Badge variant="outline" className="bg-[#282828] text-[#A0A0A0] border-none">
              {movie.scenes.length} Scenes
            </Badge>
          </div>
        </motion.div>

        {/* Featured Scene Preview */}
        <motion.div variants={itemVariants} className="mb-6">
          <div
            className="relative w-full aspect-video bg-[#1A1A1A] rounded-md overflow-hidden border border-[#282828] shadow-md cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Scene Thumbnail with Hover Effect */}
            <motion.div
              className="relative w-full h-full"
              animate={{
                scale: isHovered ? 1.03 : 1,
                filter: isPlaying ? "brightness(0.7)" : "brightness(1)",
              }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={activeScene.thumbnailUrl || "/placeholder.svg?height=720&width=1280&query=cinematic scene"}
                alt={`${activeScene.title} scene`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />

              {/* Gradient Overlay for Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-transparent to-transparent" />

              {/* Scene Navigation Arrows */}
              <motion.button
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateScene("prev")
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateScene("next")
                }}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </motion.div>

            {/* Play Indicator with Animation */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              variants={playPulseVariants}
              initial="initial"
              animate={isPlaying ? "initial" : "animate"}
              onClick={() => {
                setIsPlaying(true)
                // In a real app, this would play a video preview
              }}
            >
              <motion.div
                className="bg-[#00BFFF]/20 backdrop-blur-sm rounded-full p-6 md:p-8"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 191, 255, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-12 h-12 md:w-16 md:h-16 text-[#E0E0E0] fill-current" />
              </motion.div>
            </motion.div>

            {/* Scene Information with Animation */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4 md:p-6"
              initial={{ y: 10, opacity: 0.8 }}
              animate={{
                y: isHovered ? 0 : 10,
                opacity: isHovered ? 1 : 0.8,
              }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg md:text-xl font-inter font-medium text-[#E0E0E0] mb-1">{activeScene.title}</h3>
              <div className="flex items-center gap-2 text-sm font-dmsans text-[#A0A0A0]">
                <span>{activeScene.timestamp}</span>
                <span>•</span>
                <span>{activeScene.duration}</span>
              </div>

              {/* Tags */}
              {activeScene.tags && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {activeScene.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-[#282828]/50 text-[#A0A0A0] border-none text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* View Details Button */}
              <motion.button
                className="mt-3 text-[#00BFFF] hover:text-[#00A3DD] text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowSceneModal(true)
                }}
                whileHover={{ x: 3 }}
                whileTap={{ x: 0 }}
              >
                View Details <ChevronRight className="w-4 h-4 ml-1" />
              </motion.button>
            </motion.div>

            {/* Scene Selection Indicators */}
            <div className="absolute bottom-4 right-4 flex gap-1">
              {movie.scenes.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === activeSceneIndex ? "bg-[#00BFFF]" : "bg-[#A0A0A0]/50"}`}
                  whileHover={{ scale: 1.5 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveSceneIndex(index)
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scene Carousel */}
        <motion.div variants={itemVariants} className="relative mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-[#E0E0E0]">All Scenes</h3>

            {/* Carousel Navigation */}
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => scrollCarousel("left")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
                onClick={() => scrollCarousel("right")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Draggable Carousel */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            {movie.scenes.map((scene, index) => (
              <motion.div
                key={scene.id}
                className={`flex-shrink-0 w-[220px] snap-start ${index === activeSceneIndex ? "ring-2 ring-[#00BFFF]" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSceneIndex(index)}
              >
                <div className="bg-[#282828] rounded-lg overflow-hidden">
                  <div className="relative aspect-video">
                    <Image
                      src={scene.thumbnailUrl || "/placeholder.svg?height=720&width=1280&query=cinematic scene"}
                      alt={scene.title}
                      fill
                      className="object-cover"
                      sizes="220px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#282828] via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 text-xs text-[#E0E0E0] bg-black/50 px-1.5 py-0.5 rounded">
                      {scene.timestamp}
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="bg-[#00BFFF]/20 backdrop-blur-sm rounded-full p-2">
                        <Play className="w-6 h-6 text-[#E0E0E0] fill-current" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-[#E0E0E0] line-clamp-1">{scene.title}</h4>
                    <p className="text-xs text-[#A0A0A0] mt-1">{scene.duration}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Launch Button */}
        <motion.div variants={itemVariants} className="flex justify-center md:justify-start">
          <motion.div
            whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(0, 191, 255, 0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
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

      {/* Scene Detail Modal */}
      <AnimatePresence>
        {showSceneModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSceneModal(false)}
          >
            <motion.div
              className="bg-[#1A1A1A] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <Image
                  src={activeScene.thumbnailUrl || "/placeholder.svg?height=720&width=1280&query=cinematic scene"}
                  alt={activeScene.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/30 to-transparent" />

                <Button
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2"
                  size="icon"
                  onClick={() => setShowSceneModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-[#E0E0E0]">{activeScene.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-[#A0A0A0] mt-1">
                    <span>{activeScene.timestamp}</span>
                    <span>•</span>
                    <span>{activeScene.duration}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-[#E0E0E0] mb-4">{activeScene.description}</p>

                {activeScene.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activeScene.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-[#282828] text-[#A0A0A0] border-none">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" className="border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10">
                    <Info className="mr-2 h-4 w-4" />
                    Scene Analysis
                  </Button>

                  <Button className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD]">
                    <Play className="mr-2 h-4 w-4 fill-current" />
                    Play Scene
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
