"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Share2,
  Bookmark,
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  BarChart2,
  Film,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Scene } from "./types"

interface SceneModalProps {
  scene: Scene
  isOpen: boolean
  onClose: () => void
}

export default function SceneModal({ scene, isOpen, onClose }: SceneModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [activeTab, setActiveTab] = useState("comments")

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Convert seconds to MM:SS format
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Parse duration string to seconds (assuming format like "2:45")
  const durationInSeconds = () => {
    const [minutes, seconds] = scene.duration.split(":").map(Number)
    return minutes * 60 + seconds
  }

  // Calculate progress percentage
  const progressPercentage = () => {
    return (currentTime / durationInSeconds()) * 100
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-900 rounded-lg overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close and action buttons */}
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h2 className="text-white font-semibold truncate">{scene.title}</h2>
              <div className="flex items-center gap-2">
                <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800">
                  <Share2 size={18} />
                </button>
                <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800">
                  <Bookmark size={18} />
                </button>
                <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800">
                  <MoreHorizontal size={18} />
                </button>
                <button
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 ml-2"
                  onClick={onClose}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              <Image
                src={scene.thumbnail || "/placeholder.svg"}
                alt={scene.title}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />

              {/* Play/Pause Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  className="bg-black bg-opacity-50 rounded-full p-4 text-white hover:bg-opacity-70 transition-all"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} fill="white" />}
                </button>
              </div>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                {/* Progress Bar */}
                <div className="relative h-1 bg-gray-700 rounded-full mb-3 cursor-pointer">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
                    style={{ width: `${progressPercentage()}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <button className="text-white hover:text-blue-400" onClick={togglePlay}>
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button className="text-white hover:text-blue-400" onClick={toggleMute}>
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {scene.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="text-white hover:text-blue-400">
                      <Maximize size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Timeline Navigation */}
              <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center px-4 pointer-events-none">
                <button
                  className="bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-all pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentTime(Math.max(0, currentTime - 10))
                  }}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-all pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentTime(Math.min(durationInSeconds(), currentTime + 10))
                  }}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {/* Scene Info */}
            <div className="p-4 border-b border-gray-800">
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
                  <p className="text-gray-400 text-sm mt-1">{scene.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                <span>
                  Director: <span className="text-gray-300">{scene.director}</span>
                </span>
                <span className="mx-1">•</span>
                <span>
                  Cinematographer: <span className="text-gray-300">{scene.cinematographer}</span>
                </span>
                <span className="mx-1">•</span>
                <span>
                  Duration: <span className="text-gray-300">{scene.duration}</span>
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex-1 overflow-y-auto">
              <Tabs defaultValue="comments" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start px-4 pt-2 bg-gray-900 border-b border-gray-800">
                  <TabsTrigger value="comments" className="data-[state=active]:text-blue-400">
                    <MessageSquare size={16} className="mr-2" />
                    Comments
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="data-[state=active]:text-blue-400">
                    <BarChart2 size={16} className="mr-2" />
                    Analysis
                  </TabsTrigger>
                  <TabsTrigger value="related" className="data-[state=active]:text-blue-400">
                    <Film size={16} className="mr-2" />
                    Related Scenes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="comments" className="p-4 space-y-4">
                  <div className="space-y-4">
                    {/* Sample Comments */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden relative">
                        <Image src="/user-avatar-1.png" alt="User Avatar" fill className="object-cover" sizes="32px" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-200">CinemaFan42</span>
                          <span className="text-xs text-gray-500">2 days ago</span>
                        </div>
                        <p className="text-gray-300 text-sm mt-1">
                          This scene perfectly captures the essence of the character's internal struggle. The lighting
                          and camera work are exceptional.
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <button className="hover:text-gray-300">Like (24)</button>
                          <button className="hover:text-gray-300">Reply</button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden relative">
                        <Image src="/user-avatar-2.png" alt="User Avatar" fill className="object-cover" sizes="32px" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-200">FilmStudentNYC</span>
                          <span className="text-xs text-gray-500">1 week ago</span>
                        </div>
                        <p className="text-gray-300 text-sm mt-1">
                          At 1:24 you can see how the director uses the reflection to symbolize the duality of the
                          protagonist's nature. Brilliant storytelling through visual language.
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <button className="hover:text-gray-300">Like (42)</button>
                          <button className="hover:text-gray-300">Reply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="analysis" className="p-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Technical Analysis</h3>
                    <p className="text-gray-300 text-sm">
                      This scene employs a combination of handheld camera work and steadicam to create a sense of both
                      urgency and control. The director of photography, {scene.cinematographer}, uses natural lighting
                      supplemented with practical sources to create depth and atmosphere.
                    </p>

                    <h3 className="text-lg font-semibold text-white mt-6">Narrative Significance</h3>
                    <p className="text-gray-300 text-sm">
                      Within the context of the film, this scene represents a pivotal moment where the protagonist must
                      confront their past decisions. The visual metaphors, particularly the use of reflective surfaces
                      and depth of field, reinforce the thematic elements of duality and self-discovery that run
                      throughout the film.
                    </p>

                    <h3 className="text-lg font-semibold text-white mt-6">Behind the Scenes</h3>
                    <p className="text-gray-300 text-sm">
                      According to production notes, this scene was filmed over two days and required extensive
                      rehearsal to coordinate the complex blocking and timing. The director, {scene.director},
                      reportedly insisted on minimal cuts to preserve the emotional intensity of the performance.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="related" className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Sample Related Scenes */}
                    <div className="bg-gray-800 rounded overflow-hidden group cursor-pointer">
                      <div className="relative aspect-video">
                        <Image
                          src="/cinematic-scene.png"
                          alt="Related Scene"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 384px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-2 left-2 text-white text-sm font-medium">Another Key Scene</div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded overflow-hidden group cursor-pointer">
                      <div className="relative aspect-video">
                        <Image
                          src="/dramatic-movie-moment.png"
                          alt="Related Scene"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 384px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-2 left-2 text-white text-sm font-medium">
                          Similar Visual Style
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded overflow-hidden group cursor-pointer">
                      <div className="relative aspect-video">
                        <Image
                          src="/placeholder.svg?height=720&width=1280&query=emotional%20scene%20cinema"
                          alt="Related Scene"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 384px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-2 left-2 text-white text-sm font-medium">Same Director</div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded overflow-hidden group cursor-pointer">
                      <div className="relative aspect-video">
                        <Image
                          src="/placeholder.svg?height=720&width=1280&query=cinematic%20masterpiece%20scene"
                          alt="Related Scene"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 384px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-2 left-2 text-white text-sm font-medium">
                          Thematic Connection
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
