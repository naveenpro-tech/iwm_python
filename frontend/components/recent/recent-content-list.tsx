"use client"

import { motion, AnimatePresence } from "framer-motion"
import { RecentContentItem } from "./recent-content-item"
import type { RecentItem } from "./types"

interface RecentContentListProps {
  items: RecentItem[]
  onRemoveItem: (itemId: string) => void
}

export function RecentContentList({ items, onRemoveItem }: RecentContentListProps) {
  // Group items by date
  const groupedItems = items.reduce(
    (groups, item) => {
      const date = new Date(item.timestamp)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let groupKey: string
      if (date.toDateString() === today.toDateString()) {
        groupKey = "Today"
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = "Yesterday"
      } else if (date > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
        groupKey = "This Week"
      } else if (date > new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)) {
        groupKey = "This Month"
      } else {
        groupKey = "Older"
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(item)
      return groups
    },
    {} as Record<string, RecentItem[]>,
  )

  const groupOrder = ["Today", "Yesterday", "This Week", "This Month", "Older"]
  const sortedGroups = groupOrder.filter((key) => groupedItems[key])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
      <AnimatePresence mode="sync">
        {sortedGroups.map((groupKey, groupIndex) => (
          <motion.div
            key={groupKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-[#E0E0E0] font-inter mb-4">{groupKey}</h2>
            <div className="space-y-3">
              <AnimatePresence>
                {groupedItems[groupKey].map((item, index) => (
                  <RecentContentItem
                    key={item.id}
                    item={item}
                    onRemove={() => onRemoveItem(item.id)}
                    delay={index * 0.05}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
