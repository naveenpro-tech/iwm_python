"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreateCollectionModal } from "./create-collection-modal"

interface CollectionsHeaderProps {
  onCreateCollection: (collection: any) => void
}

export function CollectionsHeader({ onCreateCollection }: CollectionsHeaderProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <>
      <div className="relative bg-gradient-to-b from-[#20124d] to-[#121212] py-12 px-4">
        <div className="absolute inset-0 bg-[url('/abstract-pattern-purple.png')] opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Collections & Lists</h1>
            <p className="text-lg text-[#B0B0B0] mb-8 max-w-xl mx-auto">
              Discover curated movie collections by Siddu and create your own personalized lists to organize and share
              your favorite films.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0A0]" />
                <Input
                  placeholder="Search collections..."
                  className="pl-10 bg-[#1E1E1E]/80 border-[#333333] text-white placeholder:text-[#808080]"
                />
              </div>
              <Button onClick={() => setShowCreateModal(true)} className="bg-[#6e4bbd] hover:bg-[#5d3ba9] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Collection
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {showCreateModal && (
        <CreateCollectionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateCollection={onCreateCollection}
        />
      )}
    </>
  )
}
