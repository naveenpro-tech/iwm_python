'use client'

/**
 * Feed Tabs Component
 * Sticky tabs with slide animation
 */

import { motion } from 'framer-motion'
import { FeedTab } from '@/types/pulse'

interface FeedTabsProps {
  activeTab: FeedTab
  onTabChange: (tab: FeedTab) => void
}

const TABS: { id: FeedTab; label: string }[] = [
  { id: 'for_you', label: 'For You' },
  { id: 'following', label: 'Following' },
  { id: 'movies', label: 'Movies' },
  { id: 'cricket', label: 'Cricket' },
]

export default function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  const activeIndex = TABS.findIndex((tab) => tab.id === activeTab)

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-[#282828] border border-[#3A3A3A] rounded-xl p-2"
    >
      <div className="relative flex gap-2">
        {/* Sliding Indicator */}
        <motion.div
          className="absolute bottom-0 h-0.5 bg-[#00BFFF]"
          initial={false}
          animate={{
            left: `${activeIndex * 25}%`,
            width: '25%',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />

        {/* Tabs */}
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold font-['Inter'] transition-all ${
              activeTab === tab.id
                ? 'text-[#00BFFF]'
                : 'text-[#A0A0A0] hover:text-[#E0E0E0] hover:bg-[#3A3A3A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

