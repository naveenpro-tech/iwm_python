"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Download } from "lucide-react"
import type { UserCollection } from "@/types/profile"
import { getUserCollections } from "@/lib/api/collections"
import { CollectionCardProfile } from "../collections/collection-card-profile"
import { CreateCollectionModalProfile } from "../collections/create-collection-modal-profile"
import { EditCollectionModalProfile } from "../collections/edit-collection-modal-profile"
import { DeleteCollectionDialog } from "../collections/delete-collection-dialog"
import { ImportCollectionModal } from "../collections/import-collection-modal"
import { EmptyState } from "../empty-state"

interface ProfileCollectionsProps {
  userId: string
}

export function ProfileCollections({ userId }: ProfileCollectionsProps) {
  const [collections, setCollections] = useState<UserCollection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [editingCollection, setEditingCollection] = useState<UserCollection | null>(null)
  const [deletingCollectionId, setDeletingCollectionId] = useState<string | null>(null)

  // Load collections
  useEffect(() => {
    const loadCollections = async () => {
      setIsLoading(true)
      try {
        const data = await getUserCollections(userId)
        console.log("Raw collections data from API:", data)

        const items: any[] = Array.isArray(data) ? data : data?.items || []

        // Map to UserCollection type shape
        const mapped: UserCollection[] = items.map((c: any) => {
          // Backend returns posterImages array, need to convert to movies array
          const movies = c.movies || []

          // If no movies array but posterImages exists, create movies from posterImages
          if (movies.length === 0 && c.posterImages && c.posterImages.length > 0) {
            c.posterImages.forEach((posterUrl: string, index: number) => {
              movies.push({
                id: `movie-${index}`,
                title: "",
                posterUrl: posterUrl,
                year: "",
                genres: [],
              })
            })
          }

          console.log(`Collection "${c.title}": ${movies.length} movies, posterImages:`, c.posterImages)

          return {
            id: c.id || c.external_id || c.slug || `collection-${Math.random()}`,
            title: c.title || c.name || "Untitled",
            description: c.description || "",
            coverImage: c.coverImage || c.posterUrl || "",
            movieCount: c.movieCount ?? movies.length ?? 0,
            isPublic: c.isPublic ?? c.public ?? true,
            createdAt: c.createdAt || c.created_at || "",
            updatedAt: c.updatedAt || c.updated_at || "",
            movies: movies,
            tags: c.tags || [],
          }
        })

        console.log("Mapped collections:", mapped)
        setCollections(mapped)
      } catch (error) {
        console.error("Failed to load collections:", error)
        setCollections([])
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) loadCollections()
  }, [userId])

  // Handle create collection
  const handleCreateCollection = async (newCollection: UserCollection) => {
    // Optimistic UI update
    setCollections(prev => [newCollection, ...prev])
    setShowCreateModal(false)
  }

  // Handle edit collection
  const handleEditCollection = async (updatedCollection: UserCollection) => {
    // Optimistic UI update
    setCollections(prev =>
      prev.map(c => (c.id === updatedCollection.id ? updatedCollection : c))
    )
    setEditingCollection(null)
  }

  // Handle delete collection
  const handleDeleteCollection = async (collectionId: string) => {
    // Optimistic UI update
    setCollections(prev => prev.filter(c => c.id !== collectionId))
    setDeletingCollectionId(null)
  }

  // Handle import collection
  const handleImportCollection = async (importedCollection: UserCollection) => {
    // Optimistic UI update
    setCollections(prev => [importedCollection, ...prev])
    setShowImportModal(false)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#A0A0A0] font-dm-sans">Loading collections...</p>
        </div>
      </div>
    )
  }

  if (collections.length === 0) {
    return (
      <>
        <EmptyState
          icon="📚"
          title="No Collections Yet"
          description="Create your first collection to organize your favorite movies"
          actionLabel="Create Your First Collection"
          onAction={() => setShowCreateModal(true)}
        />

        <AnimatePresence>
          {showCreateModal && (
            <CreateCollectionModalProfile
              onClose={() => setShowCreateModal(false)}
              onCreate={handleCreateCollection}
            />
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-inter font-bold text-[#E0E0E0]">
          My Collections
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#282828] border border-[#3A3A3A] text-[#E0E0E0] font-dm-sans font-medium rounded-lg hover:border-[#00BFFF] hover:text-[#00BFFF] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
          >
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Import Collection</span>
            <span className="sm:hidden">Import</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#00BFFF] text-white font-dm-sans font-medium rounded-lg hover:bg-[#00BFFF]/90 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Create Collection</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>
      </div>

      {/* Collections Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {collections.map(collection => (
            <motion.div
              key={collection.id}
              variants={itemVariants}
              layout
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            >
              <CollectionCardProfile
                collection={collection}
                onEdit={() => setEditingCollection(collection)}
                onDelete={() => setDeletingCollectionId(collection.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateCollectionModalProfile
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateCollection}
          />
        )}

        {showImportModal && (
          <ImportCollectionModal
            onClose={() => setShowImportModal(false)}
            onImport={handleImportCollection}
            userId={userId}
          />
        )}

        {editingCollection && (
          <EditCollectionModalProfile
            collection={editingCollection}
            onClose={() => setEditingCollection(null)}
            onSave={handleEditCollection}
          />
        )}

        {deletingCollectionId && (
          <DeleteCollectionDialog
            collectionId={deletingCollectionId}
            collectionTitle={
              collections.find(c => c.id === deletingCollectionId)?.title || ""
            }
            onClose={() => setDeletingCollectionId(null)}
            onConfirm={() => handleDeleteCollection(deletingCollectionId)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

