"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { HelpCircle, Film, Award, TrendingUp, Users, BirdIcon as Cricket, Settings, HelpingHand } from "lucide-react"
import type { HelpCategory } from "./types"

export interface HelpCategoryCardProps {
  category: HelpCategory
}

export function HelpCategoryCard({ category }: HelpCategoryCardProps) {
  // Map category icon names to Lucide icons
  const getIcon = (iconName: string) => {
    const iconProps = { size: 24, className: "text-[#00BFFF]" }

    switch (iconName) {
      case "film":
        return <Film {...iconProps} />
      case "award":
        return <Award {...iconProps} />
      case "trending-up":
        return <TrendingUp {...iconProps} />
      case "users":
        return <Users {...iconProps} />
      case "cricket":
        return <Cricket {...iconProps} />
      case "settings":
        return <Settings {...iconProps} />
      case "helping-hand":
        return <HelpingHand {...iconProps} />
      default:
        return <HelpCircle {...iconProps} />
    }
  }

  return (
    <Link href={`/help/category/${category.id}`}>
      <motion.div
        whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.3)" }}
        className="bg-[#1A1A1A] border border-[#333] hover:border-[#00BFFF] rounded-xl p-6 h-full transition-colors"
      >
        <div className="flex items-center mb-4">
          <div className="bg-[#252525] p-3 rounded-lg mr-3">{getIcon(category.iconName)}</div>
          <h3 className="text-xl font-bold text-white">{category.name}</h3>
        </div>

        <p className="text-gray-300 mb-4 text-sm">{category.description}</p>

        <div className="text-[#00BFFF] text-sm font-medium">
          {category.topicCount} {category.topicCount === 1 ? "article" : "articles"}
        </div>
      </motion.div>
    </Link>
  )
}
