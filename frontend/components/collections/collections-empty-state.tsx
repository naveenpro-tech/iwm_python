"use client"

import { motion } from "framer-motion"
import { Plus, Film } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CollectionsEmptyState() {
  return (
    <motion.div
      className="text-center py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md mx-auto">
        <div className="relative mb-6">
          <div className="w-20 h-20 mx-auto bg-[#2A2A2A] rounded-full flex items-center justify-center">
            <Film className="h-8 w-8 text-[#6e4bbd]" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#6e4bbd] rounded-full flex items-center justify-center">
            <Plus className="h-4 w-4 text-white" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">Create Your First Collection</h3>
        <p className="text-[#A0A0A0] mb-6">
          Organize your favorite movies into personalized collections and share them with the community.
        </p>

        <Button className="bg-[#6e4bbd] hover:bg-[#5d3ba9] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Collection
        </Button>
      </div>
    </motion.div>
  )
}
