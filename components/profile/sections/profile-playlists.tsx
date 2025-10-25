"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { getUserPlaylists } from "@/lib/api/playlists"
import { CreatePlaylistModal, type Playlist } from "../playlists/create-playlist-modal"
import { EmptyState } from "../empty-state"

interface ProfilePlaylistsProps {
  userId: string
}

export function ProfilePlaylists({ userId }: ProfilePlaylistsProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const data = await getUserPlaylists(userId)
        const items: any[] = Array.isArray(data) ? data : data?.items || []
        const mapped: Playlist[] = items.map((p: any) => ({
          id: p.id || p.external_id || `playlist-${Math.random()}`,
          title: p.title || "Untitled",
          description: p.description || "",
          movieCount: p.movieCount ?? p.movies?.length ?? 0,
          isPublic: p.isPublic ?? p.public ?? true,
          createdAt: p.createdAt || p.created_at || new Date().toISOString(),
          posterImages: p.posterImages || [],
        }))
        setPlaylists(mapped)
      } catch (e) {
        console.error("Failed to load playlists:", e)
        setPlaylists([])
      } finally {
        setIsLoading(false)
      }
    }
    if (userId) load()
  }, [userId])

  const handleCreate = (playlist: Playlist) => {
    setPlaylists(prev => [playlist, ...prev])
    setShowCreateModal(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#A0A0A0] font-dm-sans">Loading playlists...</p>
        </div>
      </div>
    )
  }

  if (playlists.length === 0) {
    return (
      <>
        <EmptyState
          icon="🎵"
          title="No Playlists Yet"
          description="Create your first playlist to group movies for any mood"
          actionLabel="Create Your First Playlist"
          onAction={() => setShowCreateModal(true)}
        />
        <AnimatePresence>
          {showCreateModal && (
            <CreatePlaylistModal onClose={() => setShowCreateModal(false)} onCreate={handleCreate} />
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-inter font-bold text-[#E0E0E0]">My Playlists</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00BFFF] text-white font-dm-sans font-medium rounded-lg hover:bg-[#00BFFF]/90 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Create Playlist</span>
          <span className="sm:hidden">Create</span>
        </button>
      </div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" variants={containerVariants} initial="hidden" animate="visible">
        <AnimatePresence mode="popLayout">
          {playlists.map((p) => (
            <motion.div key={p.id} variants={itemVariants} layout exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}>
              <div className="bg-[#1E1E1E] border border-[#2F2F2F] rounded-xl p-4 hover:border-[#00BFFF]/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-md bg-[#2A2A2A] flex items-center justify-center text-xl">🎬</div>
                  <div>
                    <h3 className="text-[#E0E0E0] font-inter font-semibold">{p.title}</h3>
                    <p className="text-[#A0A0A0] text-sm font-dm-sans">{p.movieCount} movies • {p.isPublic ? "Public" : "Private"}</p>
                  </div>
                </div>
                {p.description && <p className="text-[#B0B0B0] text-sm line-clamp-2 mb-3">{p.description}</p>}
                <div className="flex gap-2">
                  {(p.posterImages || []).slice(0, 4).map((src, idx) => (
                    <img key={idx} src={src || "/placeholder.svg?height=80&width=60"} alt="Poster" className="w-12 h-16 object-cover rounded" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showCreateModal && (
          <CreatePlaylistModal onClose={() => setShowCreateModal(false)} onCreate={handleCreate} />
        )}
      </AnimatePresence>
    </div>
  )
}

