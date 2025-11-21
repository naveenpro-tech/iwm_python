"use client"

import { Button } from "@/components/ui/button"
import type { TimelineCategory } from "./types"

interface TimelineFilterProps {
  activeCategory: TimelineCategory | null
  setActiveCategory: (category: TimelineCategory | null) => void
  categoryCounts: { [key in TimelineCategory]?: number } & { all?: number }
}

const categoriesConfig: Array<{ id: TimelineCategory | null; label: string; colorClass?: string }> = [
  { id: null, label: "All Events", colorClass: "bg-[#00BFFF] hover:bg-[#00BFFF]/90" },
  { id: "development", label: "Development", colorClass: "bg-purple-500 hover:bg-purple-500/90" },
  { id: "production", label: "Production", colorClass: "bg-blue-500 hover:bg-blue-500/90" },
  { id: "post-production", label: "Post-Production", colorClass: "bg-indigo-500 hover:bg-indigo-500/90" },
  { id: "marketing", label: "Marketing", colorClass: "bg-pink-500 hover:bg-pink-500/90" },
  { id: "release", label: "Release", colorClass: "bg-green-500 hover:bg-green-500/90" },
  { id: "reception", label: "Reception", colorClass: "bg-teal-500 hover:bg-teal-500/90" },
  { id: "award", label: "Awards", colorClass: "bg-yellow-500 hover:bg-yellow-500/90 text-black" },
]

export function TimelineFilter({ activeCategory, setActiveCategory, categoryCounts }: TimelineFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categoriesConfig.map((category) => {
        const count = category.id ? categoryCounts[category.id] : categoryCounts.all
        if (count === undefined || count === 0) return null // Don't show filter if no events for it

        return (
          <Button
            key={category.id || "all"}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className={
              activeCategory === category.id
                ? `${category.colorClass || "bg-[#00BFFF] hover:bg-[#00BFFF]/90"} text-black font-semibold shadow-md`
                : "border-[#3A3A3A] text-[#A0A0A0] hover:bg-[#2A2A2A] hover:text-white"
            }
          >
            {category.label} <span className="ml-1.5 text-xs opacity-80">({count})</span>
          </Button>
        )
      })}
    </div>
  )
}
