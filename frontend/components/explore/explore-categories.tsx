"use client"

import { motion } from "framer-motion"
import { Compass, TrendingUp, Star, Clock, Sparkles, Globe } from "lucide-react"

interface ExploreCategoriesProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function ExploreCategories({ activeCategory, onCategoryChange }: ExploreCategoriesProps) {
  const categories = [
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "top-rated", label: "Top Rated", icon: Star },
    { id: "new", label: "New", icon: Clock },
    { id: "visual-treats", label: "Visual Treats", icon: Sparkles },
    { id: "global", label: "Global", icon: Globe },
    { id: "discover", label: "Discover", icon: Compass },
  ]

  return (
    <motion.div
      className="overflow-x-auto scrollbar-hide mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex space-x-4">
          {categories.map((category) => {
            const isActive = activeCategory === category.id

            return (
              <motion.button
                key={category.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  isActive ? "bg-[#00BFFF] text-[#1A1A1A]" : "bg-[#282828] text-white hover:bg-[#3A3A3A]"
                }`}
                onClick={() => onCategoryChange(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
