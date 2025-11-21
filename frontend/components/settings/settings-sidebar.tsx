"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SettingsCategory {
  id: string
  label: string
  icon: LucideIcon
}

interface SettingsSidebarProps {
  categories: SettingsCategory[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function SettingsSidebar({ categories, activeCategory, onCategoryChange }: SettingsSidebarProps) {
  return (
    <div className="w-full lg:w-64 shrink-0">
      <div className="bg-[#282828] rounded-lg border border-gray-700 p-2">
        <nav className="space-y-1">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id

            return (
              <motion.div key={category.id} whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-left h-12 ${
                    isActive
                      ? "bg-[#00BFFF]/20 text-[#00BFFF] border border-[#00BFFF]/30"
                      : "text-gray-300 hover:text-white hover:bg-[#3A3A3A]"
                  }`}
                  onClick={() => onCategoryChange(category.id)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {category.label}
                </Button>
              </motion.div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
