"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Plus, Check } from "lucide-react"
import type { UserCollection } from "@/types/profile"
import { getUserCollections, addMovieToCollection, removeMovieFromCollection, createCollection } from "@/lib/api/collections"
import { useToast } from "@/hooks/use-toast"

interface AddToCollectionModalProps {
  movieId: string
  movieTitle: string
  onClose: () => void
}

export function AddToCollectionModal({
  movieId,
  movieTitle,
  onClose,
}: AddToCollectionModalProps) {
  const [collections, setCollections] = useState<UserCollection[]>([])
  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(new Set())
  const [initialCollections, setInitialCollections] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadCollections = async () => {
      setIsLoading(true)
      try {
        const { getCurrentUser } = await import("@/lib/auth")
        const current = await getCurrentUser()
        const data = await getUserCollections(current.id)
        const collectionsArray = Array.isArray(data) ? data : []
        setCollections(collectionsArray)

        // Pre-select collections that already contain this movie
        const alreadyIn = collectionsArray
          .filter((c: any) => c.movies?.some((m: any) => m.id === movieId || m.external_id === movieId))
          .map((c: any) => c.id || c.external_id)
        setSelectedCollections(new Set(alreadyIn))
        setInitialCollections(new Set(alreadyIn))
      } catch (error) {
        console.error("Failed to load collections:", error)
        toast({
          title: "Error",
          description: "Failed to load collections. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadCollections()
  }, [movieId, toast])

  const toggleCollection = (collectionId: string) => {
    setSelectedCollections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(collectionId)) {
        newSet.delete(collectionId)
      } else {
        newSet.add(collectionId)
      }
      return newSet
    })
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // Determine which collections to add to and remove from
      const toAdd = Array.from(selectedCollections).filter(id => !initialCollections.has(id))
      const toRemove = Array.from(initialCollections).filter(id => !selectedCollections.has(id))

      // Add movie to new collections
      for (const collectionId of toAdd) {
        await addMovieToCollection(collectionId, movieId)
      }

      // Remove movie from deselected collections
      for (const collectionId of toRemove) {
        await removeMovieFromCollection(collectionId, movieId)
      }

      toast({
        title: "Success",
        description: `${movieTitle} has been updated in your collections.`,
      })

      onClose()
    } catch (error) {
      console.error("Failed to update collections:", error)
      toast({
        title: "Error",
        description: "Failed to update collections. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-[#282828] border border-[#3A3A3A] rounded-lg w-full max-w-md max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#3A3A3A]">
            <div>
              <h2 className="text-xl font-inter font-bold text-[#E0E0E0]">
                Add to Collection
              </h2>
              <p className="text-sm text-[#A0A0A0] font-dm-sans mt-1">
                {movieTitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#A0A0A0] hover:text-[#E0E0E0] hover:bg-[#3A3A3A] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#00BFFF]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Collections List */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : collections.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#A0A0A0] font-dm-sans mb-4">
                  You don't have any collections yet
                </p>
                <button
                  onClick={() => {
                    // In real implementation, this would open create collection modal
                    console.log("Create new collection")
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#00BFFF] text-white font-dm-sans font-medium rounded-lg hover:bg-[#00BFFF]/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Collection
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {collections.map(collection => (
                  <button
                    key={collection.id}
                    onClick={() => toggleCollection(collection.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      selectedCollections.has(collection.id)
                        ? "border-[#00BFFF] bg-[#00BFFF]/10"
                        : "border-[#3A3A3A] hover:border-[#00BFFF]/50"
                    }`}
                  >
                    <div className="flex-1 text-left">
                      <h3 className="font-dm-sans font-medium text-[#E0E0E0]">
                        {collection.title}
                      </h3>
                      <p className="text-sm text-[#A0A0A0] mt-0.5">
                        {collection.movieCount} {collection.movieCount === 1 ? "movie" : "movies"}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedCollections.has(collection.id)
                          ? "border-[#00BFFF] bg-[#00BFFF]"
                          : "border-[#3A3A3A]"
                      }`}
                    >
                      {selectedCollections.has(collection.id) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-6 border-t border-[#3A3A3A]">
            <p className="text-sm text-[#A0A0A0] font-dm-sans">
              {selectedCollections.size} {selectedCollections.size === 1 ? "collection" : "collections"} selected
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="px-6 py-2.5 border border-[#3A3A3A] text-[#E0E0E0] font-dm-sans font-medium rounded-lg hover:bg-[#3A3A3A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00BFFF] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#00BFFF] text-white font-dm-sans font-medium rounded-lg hover:bg-[#00BFFF]/90 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:ring-offset-2 focus:ring-offset-[#282828] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

