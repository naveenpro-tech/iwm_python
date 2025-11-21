"use client"

import { motion } from "framer-motion"
import type { HelpCategory } from "./types"
import { ChevronRight } from "lucide-react"

interface HelpNavigationProps {
  categories: HelpCategory[]
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

export default function HelpNavigation({ categories, activeCategory, onCategoryChange }: HelpNavigationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#282828] rounded-lg border border-gray-700 p-4"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>

      <nav className="space-y-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
              activeCategory === category.id
                ? "bg-[#00BFFF]/10 text-[#00BFFF]"
                : "text-gray-300 hover:bg-[#333333] hover:text-white"
            }`}
          >
            <div className="flex items-center">
              <span className="mr-3">{category.icon}</span>
              <span>{category.name}</span>
            </div>
            {activeCategory === category.id && <ChevronRight size={16} />}
          </button>
        ))}
      </nav>
    </motion.div>
  )
}
