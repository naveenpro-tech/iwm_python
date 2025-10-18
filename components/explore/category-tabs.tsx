"use client"

import { motion } from "framer-motion"
import { TrendingUp, Star, Clock, Sparkles, Globe } from "lucide-react"
import type { CategoryType } from "./types"

interface CategoryTabsProps {
  activeCategory: CategoryType
  onCategoryChange: (category: CategoryType) => void
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  const categories = [
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "topRated", label: "Top Rated", icon: Star },
    { id: "newReleases", label: "New Releases", icon: Clock },
    { id: "visualTreats", label: "Visual Treats", icon: Sparkles },
    { id: "globalCinema", label: "Global Cinema", icon: Globe },
  ]

  return (
    <div className="relative">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2">
          {categories.map((category) => {
            const isActive = activeCategory === category.id
            const Icon = category.icon

            return (
              <motion.button
                key={category.id}
                className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 ${
                  isActive ? "bg-[#00BFFF] text-black" : "bg-[#282828] text-[#E0E0E0] hover:bg-[#3A3A3A]"
                }`}
                onClick={() => onCategoryChange(category.id as CategoryType)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#3A3A3A]"></div>
    </div>
  )
}
