"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Lock, Globe } from "lucide-react"
import { createPlaylist } from "@/lib/api/playlists"

export interface Playlist {
  id: string
  title: string
  description: string
  movieCount: number
  isPublic: boolean
  createdAt: string
  posterImages?: string[]
}

interface CreatePlaylistModalProps {
  onClose: () => void
  onCreate: (playlist: Playlist) => void
}

export function CreatePlaylistModal({ onClose, onCreate }: CreatePlaylistModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({})

  const validateForm = () => {
    const newErrors: { title?: string; description?: string } = {}
    if (!title.trim()) newErrors.title = "Title is required"
    else if (title.trim().length < 3) newErrors.title = "Title must be at least 3 characters"
    else if (title.trim().length > 100) newErrors.title = "Title must be less than 100 characters"
    if (description.trim().length > 500) newErrors.description = "Description must be less than 500 characters"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      const result = await createPlaylist({ title: title.trim(), description: description.trim(), isPublic })
      const newPlaylist: Playlist = {
        id: result.id,
        title: result.title ?? title.trim(),
        description: result.description ?? description.trim(),
        movieCount: result.movieCount ?? 0,
        isPublic: result.isPublic ?? isPublic,
        createdAt: result.createdAt ?? new Date().toISOString(),
        posterImages: result.posterImages ?? [],
      }
      onCreate(newPlaylist)
    } catch (err) {
      console.error("Failed to create playlist:", err)
      setErrors(prev => ({ ...prev, title: (err as Error).message }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="bg-[#282828] border border-[#3A3A3A] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-[#3A3A3A]">
            <h2 className="text-2xl font-inter font-bold text-[#E0E0E0]">Create New Playlist</h2>
            <button onClick={onClose} className="p-2 text-[#A0A0A0] hover:text-[#E0E0E0] hover:bg-[#3A3A3A] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#00BFFF]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-dm-sans font-medium text-[#E0E0E0] mb-2">Playlist Title <span className="text-[#EF4444]">*</span></label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors({ ...errors, title: undefined }) }}
                placeholder="My Watch Night Playlist"
                className={`w-full px-4 py-2.5 bg-[#1A1A1A] border ${errors.title ? "border-[#EF4444]" : "border-[#3A3A3A]"} rounded-lg text-[#E0E0E0] placeholder-[#A0A0A0] font-dm-sans focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/20 transition-colors`}
                maxLength={100}
              />
              {errors.title && <p className="mt-1 text-sm text-[#EF4444] font-dm-sans">{errors.title}</p>}
              <p className="mt-1 text-xs text-[#A0A0A0] font-dm-sans">{title.length}/100 characters</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-dm-sans font-medium text-[#E0E0E0] mb-2">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors({ ...errors, description: undefined }) }}
                placeholder="Movies for a cozy weekend..."
                rows={4}
                className={`w-full px-4 py-2.5 bg-[#1A1A1A] border ${errors.description ? "border-[#EF4444]" : "border-[#3A3A3A]"} rounded-lg text-[#E0E0E0] placeholder-[#A0A0A0] font-dm-sans focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/20 transition-colors resize-none`}
                maxLength={500}
              />
              {errors.description && <p className="mt-1 text-sm text-[#EF4444] font-dm-sans">{errors.description}</p>}
              <p className="mt-1 text-xs text-[#A0A0A0] font-dm-sans">{description.length}/500 characters</p>
            </div>

            <div>
              <label className="block text-sm font-dm-sans font-medium text-[#E0E0E0] mb-3">Privacy</label>
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsPublic(true)} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${isPublic ? "border-[#00BFFF] bg-[#00BFFF]/10 text-[#00BFFF]" : "border-[#3A3A3A] bg-[#1A1A1A] text-[#A0A0A0] hover:border-[#00BFFF]/50"}`}>
                  <Globe className="w-5 h-5" />
                  <span className="font-dm-sans font-medium">Public</span>
                </button>
                <button type="button" onClick={() => setIsPublic(false)} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${!isPublic ? "border-[#00BFFF] bg-[#00BFFF]/10 text-[#00BFFF]" : "border-[#3A3A3A] bg-[#1A1A1A] text-[#A0A0A0] hover:border-[#00BFFF]/50"}`}>
                  <Lock className="w-5 h-5" />
                  <span className="font-dm-sans font-medium">Private</span>
                </button>
              </div>
              <p className="mt-2 text-xs text-[#A0A0A0] font-dm-sans">{isPublic ? "Anyone can view this playlist" : "Only you can view this playlist"}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3A3A3A]">
              <button type="button" onClick={onClose} className="px-6 py-2.5 border border-[#3A3A3A] text-[#E0E0E0] font-dm-sans font-medium rounded-lg hover:bg-[#3A3A3A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00BFFF]">Cancel</button>
              <button type="submit" disabled={isSubmitting || !title.trim()} className="px-6 py-2.5 bg-[#00BFFF] text-white font-dm-sans font-medium rounded-lg hover:bg-[#00BFFF]/90 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:ring-offset-2 focus:ring-offset-[#282828] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                {isSubmitting ? "Creating..." : "Create Playlist"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  )
}

