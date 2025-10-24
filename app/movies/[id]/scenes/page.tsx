"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Play, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Scene {
  id: string
  title: string
  description: string
  timecode: string
  thumbnail?: string
  duration?: string
}

interface ScenesResponse {
  scenes: Scene[]
  total: number
  page: number
  limit: number
}

export default function ScenesPage() {
  const params = useParams()
  const movieId = params.id as string
  const { toast } = useToast()

  const [scenes, setScenes] = useState<Scene[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(12)
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null)

  const totalPages = Math.ceil(total / limit)

  useEffect(() => {
    const fetchScenes = async () => {
      setLoading(true)
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
        const response = await fetch(`${apiBase}/api/v1/scene-explorer/by-movie/${movieId}?page=${page}&limit=${limit}`)

        if (!response.ok) {
          console.warn(`Scenes API returned ${response.status}, using empty state`)
          setScenes([])
          setTotal(0)
          setLoading(false)
          return
        }

        const data: ScenesResponse = await response.json()
        setScenes(data.scenes || [])
        setTotal(data.total || 0)
      } catch (error) {
        console.error("Failed to fetch scenes:", error)
        setScenes([])
        setTotal(0)
        toast({
          title: "Unable to Load Scenes",
          description: "Scenes for this movie are not available yet.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchScenes()
  }, [movieId, page, limit, toast])

  if (loading && scenes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Movie Scenes</h1>
        <p className="text-muted-foreground">Explore key scenes from this movie</p>
      </div>

      {/* Scenes Grid */}
      {scenes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No scenes available for this movie</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            <AnimatePresence>
              {scenes.map((scene, index) => (
                <motion.div
                  key={scene.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => setSelectedScene(scene)}
                  >
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      {scene.thumbnail ? (
                        <Image src={scene.thumbnail} alt={scene.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-700 to-slate-900">
                          <Play className="h-12 w-12 text-white/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      {scene.timecode && (
                        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white font-mono">
                          {scene.timecode}
                        </div>
                      )}
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">{scene.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{scene.description}</p>
                      {scene.duration && <p className="text-xs text-muted-foreground mt-2">Duration: {scene.duration}</p>}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Scene Detail Modal */}
      <AnimatePresence>
        {selectedScene && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedScene(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video bg-muted">
                {selectedScene.thumbnail ? (
                  <Image src={selectedScene.thumbnail} alt={selectedScene.title} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-700 to-slate-900">
                    <Play className="h-16 w-16 text-white/50" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{selectedScene.title}</h2>
                {selectedScene.timecode && (
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Timecode:</strong> {selectedScene.timecode}
                  </p>
                )}
                {selectedScene.duration && (
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Duration:</strong> {selectedScene.duration}
                  </p>
                )}
                <p className="text-base mb-6">{selectedScene.description}</p>
                <div className="flex gap-2">
                  <Button onClick={() => setSelectedScene(null)}>Close</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

