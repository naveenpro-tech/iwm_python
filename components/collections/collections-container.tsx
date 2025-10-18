"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CollectionsHeader } from "./collections-header"
import { FeaturedCollections } from "./featured-collections"
import { PopularCollections } from "./popular-collections"
import { UserCollections } from "./user-collections"
import { CollectionsEmptyState } from "./collections-empty-state"
import { CollectionsSkeleton } from "./collections-skeleton"
import { mockFeaturedCollections, mockPopularCollections, mockUserCollections } from "./mock-data"

export function CollectionsContainer() {
  const [isLoading, setIsLoading] = useState(true)
  const [userCollections, setUserCollections] = useState(mockUserCollections)

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleCreateCollection = (collection: any) => {
    // In a real app, this would make an API call to create the collection
    setUserCollections((prev) => [...prev, collection])
  }

  if (isLoading) {
    return <CollectionsSkeleton />
  }

  return (
    <motion.div
      className="min-h-screen bg-[#121212] text-[#E0E0E0]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <CollectionsHeader onCreateCollection={handleCreateCollection} />

      <div className="container mx-auto px-4 py-8 space-y-12">
        <FeaturedCollections collections={mockFeaturedCollections} />
        <PopularCollections collections={mockPopularCollections} />

        {userCollections.length > 0 ? (
          <UserCollections
            collections={userCollections}
            onDeleteCollection={(id) => setUserCollections(userCollections.filter((c) => c.id !== id))}
          />
        ) : (
          <CollectionsEmptyState />
        )}
      </div>
    </motion.div>
  )
}
