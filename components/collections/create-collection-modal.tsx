"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface CreateCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateCollection: (collection: any) => void
}

export function CreateCollectionModal({ isOpen, onClose, onCreateCollection }: CreateCollectionModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [selectedMovies, setSelectedMovies] = useState<any[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newCollection = {
      id: `user-${Date.now()}`,
      title,
      description,
      creator: "You",
      movieCount: selectedMovies.length,
      followers: 0,
      isPublic,
      posterImages: [
        "/inception-movie-poster.png",
        "/dark-knight-poster.png",
        "/interstellar-poster.png",
        "/oppenheimer-inspired-poster.png",
      ],
      createdAt: new Date().toISOString(),
    }

    onCreateCollection(newCollection)
    onClose()

    // Reset form
    setTitle("")
    setDescription("")
    setSelectedMovies([])
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative bg-[#1E1E1E] rounded-lg border border-[#333333] w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-[#333333]">
              <h2 className="text-xl font-bold text-white">Create New Collection</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-[#A0A0A0] hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">
                  Collection Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter collection title..."
                  className="bg-[#2A2A2A] border-[#444444] text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your collection..."
                  className="bg-[#2A2A2A] border-[#444444] text-white min-h-[100px]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Public Collection</Label>
                  <p className="text-sm text-[#A0A0A0]">Allow others to discover and follow this collection</p>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>

              <div className="space-y-4">
                <Label className="text-white">Add Movies</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0A0]" />
                  <Input
                    placeholder="Search for movies to add..."
                    className="pl-10 bg-[#2A2A2A] border-[#444444] text-white"
                  />
                </div>

                {selectedMovies.length === 0 && (
                  <div className="text-center py-8 text-[#A0A0A0]">
                    <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Search and add movies to your collection</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#333333]">
                <Button type="button" variant="outline" onClick={onClose} className="border-[#444444] text-[#A0A0A0]">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#6e4bbd] hover:bg-[#5d3ba9] text-white">
                  Create Collection
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
