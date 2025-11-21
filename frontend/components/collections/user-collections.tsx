"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CollectionCard } from "./collection-card"
import { EditCollectionModal } from "./edit-collection-modal"
import type { Collection } from "./types"

interface UserCollectionsProps {
  collections: Collection[]
  onDeleteCollection: (id: string) => void
}

export function UserCollections({ collections, onDeleteCollection }: UserCollectionsProps) {
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [localCollections, setLocalCollections] = useState(collections)

  // Update local state when props change
  useEffect(() => {
    setLocalCollections(collections)
  }, [collections])

  const handleUpdateCollection = (updated: any) => {
    setLocalCollections((prev) =>
      prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
    )
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">My Collections</h2>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {localCollections.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            variant="user"
            onDelete={() => onDeleteCollection(collection.id)}
            onEdit={(col) => setEditingCollection(col)}
          />
        ))}
      </motion.div>

      <EditCollectionModal
        isOpen={!!editingCollection}
        onClose={() => setEditingCollection(null)}
        collection={editingCollection}
        onUpdate={handleUpdateCollection}
      />
    </section>
  )
}
