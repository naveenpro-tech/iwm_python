"use client"

import { motion } from "framer-motion"
import type { ReviewFeedType } from "./types"

interface NavigationTabsProps {
  activeTab: ReviewFeedType
  onTabChange: (tab: ReviewFeedType) => void
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const tabs: { id: ReviewFeedType; label: string }[] = [
    { id: "latest", label: "Latest Reviews" },
    { id: "top", label: "Top-Rated Reviews" },
    { id: "trending", label: "Trending Reviews" },
  ]

  return (
    <div className="mb-6 border-b border-siddu-border-subtle">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`relative px-4 py-3 text-sm md:text-base font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id ? "text-siddu-text-light" : "text-siddu-text-subtle hover:text-siddu-text-light"
            }`}
            onClick={() => onTabChange(tab.id)}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-siddu-electric-blue"
                layoutId="activeTab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
