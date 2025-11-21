"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Trophy } from "lucide-react"

interface Category {
  name: string
  winner: string
  nominees: string[]
}

export interface AwardCategoriesProps {
  categories: Category[]
}

export function AwardCategories({ categories }: AwardCategoriesProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const toggleCategory = (categoryName: string) => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(categoryName)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Trophy className="text-[#FFD700] mr-2" />
        Award Categories
      </h2>

      <div className="space-y-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
            className="border border-[#333] rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleCategory(category.name)}
              className="w-full flex justify-between items-center p-4 bg-[#252525] hover:bg-[#333] transition-colors"
            >
              <h3 className="text-lg font-medium text-white">{category.name}</h3>
              {expandedCategory === category.name ? (
                <ChevronUp size={20} className="text-gray-400" />
              ) : (
                <ChevronDown size={20} className="text-gray-400" />
              )}
            </button>

            <AnimatePresence>
              {expandedCategory === category.name && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-[#1A1A1A]">
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-1">Winner:</p>
                      <p className="text-[#FFD700] font-bold">{category.winner}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-2">Nominees:</p>
                      <ul className="space-y-2">
                        {category.nominees.map((nominee, i) => (
                          <li
                            key={i}
                            className={`text-sm ${
                              nominee === category.winner ? "text-[#FFD700] font-medium" : "text-gray-300"
                            }`}
                          >
                            {nominee}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
