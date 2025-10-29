"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CollectionsHeader } from "./collections-header"
import { FeaturedCollections } from "./featured-collections"
import { PopularCollections } from "./popular-collections"
import { UserCollections } from "./user-collections"
import { CollectionsEmptyState } from "./collections-empty-state"
import { CollectionsSkeleton } from "./collections-skeleton"
import { getUserCollections } from "@/lib/api/collections"
import { getCurrentUser } from "@/lib/auth"

export function CollectionsContainer() {
  const [isLoading, setIsLoading] = useState(true)
  const [userCollections, setUserCollections] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const user = await getCurrentUser()
        if (!user || !user.id) {
          console.warn("No user found, showing empty collections")
          setUserCollections([])
          return
        }
        const data = await getUserCollections(user.id)
        const items = Array.isArray(data) ? data : data?.items || []
        setUserCollections(items)
      } catch (err) {
        console.error("Failed to load user collections:", err)
        // Don't fail silently - still show the page with empty state
        setUserCollections([])
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const handleCreateCollection = (collection: any) => {
    // TODO: Integrate createCollection API and refresh; keeping optimistic update for now
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
        <FeaturedCollections collections={[]} />
        <PopularCollections collections={[]} />

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
