"use client"

import { motion } from "framer-motion"
import { WatchlistListItem } from "./watchlist-list-item"
import type { WatchlistItem, WatchStatus, GroupByOption } from "./types"

interface WatchlistListProps {
  items: WatchlistItem[]
  groupBy: GroupByOption | null
  isBatchMode: boolean
  selectedItems: string[]
  onUpdateStatus: (itemId: string, newStatus: WatchStatus) => void
  onUpdatePriority: (itemId: string, newPriority: "high" | "medium" | "low") => void
  onUpdateProgress: (itemId: string, newProgress: number) => void
  onRemoveItem: (itemId: string) => void
  onToggleSelection: (itemId: string) => void
}

export function WatchlistList({
  items,
  groupBy,
  isBatchMode,
  selectedItems,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateProgress,
  onRemoveItem,
  onToggleSelection,
}: WatchlistListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  // Group items if groupBy is specified
  const getGroupedItems = () => {
    if (!groupBy) return { "": items }

    return items.reduce(
      (acc, item) => {
        let groupKey = ""

        if (groupBy === "status") {
          const statusLabels = {
            "want-to-watch": "Want to Watch",
            watching: "Watching",
            watched: "Watched",
          }
          groupKey = statusLabels[item.status as keyof typeof statusLabels]
        } else if (groupBy === "priority") {
          groupKey = item.priority.charAt(0).toUpperCase() + item.priority.slice(1)
        } else if (groupBy === "genre") {
          // For simplicity, we'll just use the first genre
          groupKey = item.genres[0] || "Uncategorized"
        } else if (groupBy === "year") {
          groupKey = new Date(item.releaseDate).getFullYear().toString()
        }

        if (!acc[groupKey]) {
          acc[groupKey] = []
        }
        acc[groupKey].push(item)
        return acc
      },
      {} as Record<string, WatchlistItem[]>,
    )
  }

  const groupedItems = getGroupedItems()
  const groups = Object.keys(groupedItems).sort()

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group} className="space-y-4">
          {group && <h2 className="text-xl font-semibold text-[#E0E0E0] border-b border-[#3A3A3A] pb-2">{group}</h2>}

          <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
            {groupedItems[group].map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <WatchlistListItem
                  item={item}
                  isBatchMode={isBatchMode}
                  isSelected={selectedItems.includes(item.id)}
                  onUpdateStatus={onUpdateStatus}
                  onUpdatePriority={onUpdatePriority}
                  onUpdateProgress={onUpdateProgress}
                  onRemoveItem={onRemoveItem}
                  onToggleSelection={onToggleSelection}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  )
}
