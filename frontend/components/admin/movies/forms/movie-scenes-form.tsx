"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus, Edit3, Film, GripVertical } from "lucide-react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export interface SceneItem {
  id: string
  title: string
  description: string
  timecode: string
  thumbnail?: string
  duration?: string
}

interface MovieScenesFormProps {
  initialScenes: SceneItem[]
  onScenesChange: (newScenes: SceneItem[]) => void
}

export function MovieScenesForm({ initialScenes, onScenesChange }: MovieScenesFormProps) {
  const [scenes, setScenes] = useState<SceneItem[]>(initialScenes)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleAddScene = () => {
    const newScene: SceneItem = {
      id: `scene-${Date.now()}`,
      title: "",
      description: "",
      timecode: "00:00:00",
      thumbnail: "",
      duration: "",
    }
    const updatedScenes = [...scenes, newScene]
    setScenes(updatedScenes)
    setEditingId(newScene.id)
    onScenesChange(updatedScenes)
  }

  const handleUpdateScene = (id: string, field: keyof SceneItem, value: string) => {
    const updatedScenes = scenes.map((scene) => (scene.id === id ? { ...scene, [field]: value } : scene))
    setScenes(updatedScenes)
    onScenesChange(updatedScenes)
  }

  const handleDeleteScene = (id: string) => {
    const updatedScenes = scenes.filter((scene) => scene.id !== id)
    setScenes(updatedScenes)
    onScenesChange(updatedScenes)
    toast({
      title: "Scene Deleted",
      description: "The scene has been removed.",
    })
  }

  const handleReorder = (newOrder: SceneItem[]) => {
    setScenes(newOrder)
    onScenesChange(newOrder)
  }

  return (
    <Card className="bg-[#1C1C1C] border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Film className="h-5 w-5 text-[#00BFFF]" />
              Movie Scenes
            </CardTitle>
            <CardDescription className="text-gray-400">
              Add and manage key scenes from the movie. Scenes will be displayed on the public movie page.
            </CardDescription>
          </div>
          <Button onClick={handleAddScene} className="bg-[#00BFFF] hover:bg-[#00BFFF]/80 text-black">
            <Plus className="h-4 w-4 mr-2" />
            Add Scene
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {scenes.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-lg">
            <Film className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No scenes added yet</p>
            <Button onClick={handleAddScene} variant="outline" className="border-gray-600 text-gray-300">
              <Plus className="h-4 w-4 mr-2" />
              Add First Scene
            </Button>
          </div>
        ) : (
          <Reorder.Group axis="y" values={scenes} onReorder={handleReorder} className="space-y-4">
            <AnimatePresence>
              {scenes.map((scene) => (
                <Reorder.Item key={scene.id} value={scene}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-[#282828] rounded-lg p-4 border border-gray-700"
                  >
                    <div className="flex items-start gap-3">
                      <div className="cursor-grab active:cursor-grabbing pt-2">
                        <GripVertical className="h-5 w-5 text-gray-500" />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`scene-title-${scene.id}`} className="text-gray-300">
                              Scene Title *
                            </Label>
                            <Input
                              id={`scene-title-${scene.id}`}
                              value={scene.title}
                              onChange={(e) => handleUpdateScene(scene.id, "title", e.target.value)}
                              placeholder="e.g., Opening Credits, Final Battle"
                              className="bg-[#1C1C1C] border-gray-600 text-white"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`scene-timecode-${scene.id}`} className="text-gray-300">
                              Timecode *
                            </Label>
                            <Input
                              id={`scene-timecode-${scene.id}`}
                              value={scene.timecode}
                              onChange={(e) => handleUpdateScene(scene.id, "timecode", e.target.value)}
                              placeholder="00:00:00"
                              className="bg-[#1C1C1C] border-gray-600 text-white font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`scene-description-${scene.id}`} className="text-gray-300">
                            Description *
                          </Label>
                          <Textarea
                            id={`scene-description-${scene.id}`}
                            value={scene.description}
                            onChange={(e) => handleUpdateScene(scene.id, "description", e.target.value)}
                            placeholder="Describe what happens in this scene..."
                            rows={3}
                            className="bg-[#1C1C1C] border-gray-600 text-white resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`scene-thumbnail-${scene.id}`} className="text-gray-300">
                              Thumbnail URL
                            </Label>
                            <Input
                              id={`scene-thumbnail-${scene.id}`}
                              value={scene.thumbnail || ""}
                              onChange={(e) => handleUpdateScene(scene.id, "thumbnail", e.target.value)}
                              placeholder="https://example.com/scene-thumbnail.jpg"
                              className="bg-[#1C1C1C] border-gray-600 text-white"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`scene-duration-${scene.id}`} className="text-gray-300">
                              Duration
                            </Label>
                            <Input
                              id={`scene-duration-${scene.id}`}
                              value={scene.duration || ""}
                              onChange={(e) => handleUpdateScene(scene.id, "duration", e.target.value)}
                              placeholder="e.g., 2:30"
                              className="bg-[#1C1C1C] border-gray-600 text-white"
                            />
                          </div>
                        </div>

                        {scene.thumbnail && (
                          <div className="space-y-2">
                            <Label className="text-gray-300">Thumbnail Preview</Label>
                            <div className="relative aspect-video w-full max-w-xs rounded-lg overflow-hidden border border-gray-700">
                              <Image
                                src={scene.thumbnail}
                                alt={scene.title || "Scene thumbnail"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingId(editingId === scene.id ? null : scene.id)}
                          className="text-gray-400 hover:text-[#00BFFF] hover:bg-[#00BFFF]/10"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteScene(scene.id)}
                          className="text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}

        {scenes.length > 0 && (
          <div className="mt-6 p-4 bg-[#282828] rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">
              <strong className="text-white">{scenes.length}</strong> scene{scenes.length !== 1 ? "s" : ""} added.
              Drag and drop to reorder scenes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

