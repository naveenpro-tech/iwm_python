"use client"

import { useState, useEffect } from "react"
import { WatchlistHeader } from "./watchlist-header"
import { WatchlistGrid } from "./watchlist-grid"
import { WatchlistList } from "./watchlist-list"
import { WatchlistEmptyState } from "./watchlist-empty-state"
import { WatchlistSkeleton } from "./watchlist-skeleton"
import { WatchlistToolbar } from "./watchlist-toolbar"
import { WatchlistStatistics } from "./watchlist-statistics"
import { BatchActionsBar } from "./batch-actions-bar"
import { mockWatchlistItems } from "./mock-data"
import type { WatchlistItem, WatchStatus, SortOption, GroupByOption } from "./types"

export function WatchlistContainer() {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [filteredItems, setFilteredItems] = useState<WatchlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeStatus, setActiveStatus] = useState<WatchStatus | "all">("all")
  const [sortBy, setSortBy] = useState<SortOption>("dateAdded")
  const [groupBy, setGroupBy] = useState<GroupByOption | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isBatchMode, setIsBatchMode] = useState(false)

  useEffect(() => {
    // Simulate API fetch with delay
    const timer = setTimeout(() => {
      setItems(mockWatchlistItems)
      setFilteredItems(mockWatchlistItems)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (items.length > 0) {
      // Apply status filter
      let filtered = [...items]

      if (activeStatus !== "all") {
        filtered = filtered.filter((item) => item.status === activeStatus)
      }

      // Apply sorting
      filtered.sort((a, b) => {
        if (sortBy === "dateAdded") {
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        } else if (sortBy === "title") {
          return a.title.localeCompare(b.title)
        } else if (sortBy === "releaseDate") {
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        } else if (sortBy === "rating") {
          return b.rating - a.rating
        } else if (sortBy === "priority") {
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return (
            priorityOrder[a.priority as keyof typeof priorityOrder] -
            priorityOrder[b.priority as keyof typeof priorityOrder]
          )
        }
        return 0
      })

      setFilteredItems(filtered)
    }
  }, [items, activeStatus, sortBy])

  const handleStatusChange = (status: WatchStatus | "all") => {
    setActiveStatus(status)
  }

  const handleSortChange = (option: SortOption) => {
    setSortBy(option)
  }

  const handleGroupByChange = (option: GroupByOption | null) => {
    setGroupBy(option)
  }

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode)
  }

  const handleUpdateStatus = (itemId: string, newStatus: WatchStatus) => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item)))
  }

  const handleUpdatePriority = (itemId: string, newPriority: "high" | "medium" | "low") => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, priority: newPriority } : item)))
  }

  const handleUpdateProgress = (itemId: string, newProgress: number) => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, progress: newProgress } : item)))
  }

  const handleRemoveItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
    setSelectedItems((prev) => prev.filter((id) => id !== itemId))
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const toggleBatchMode = () => {
    setIsBatchMode((prev) => !prev)
    if (isBatchMode) {
      setSelectedItems([])
    }
  }

  const selectAllItems = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map((item) => item.id))
    }
  }

  const handleBatchUpdateStatus = (newStatus: WatchStatus) => {
    setItems((prev) => prev.map((item) => (selectedItems.includes(item.id) ? { ...item, status: newStatus } : item)))
    setSelectedItems([])
    setIsBatchMode(false)
  }

  const handleBatchUpdatePriority = (newPriority: "high" | "medium" | "low") => {
    setItems((prev) =>
      prev.map((item) => (selectedItems.includes(item.id) ? { ...item, priority: newPriority } : item)),
    )
    setSelectedItems([])
    setIsBatchMode(false)
  }

  const handleBatchRemove = () => {
    setItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)))
    setSelectedItems([])
    setIsBatchMode(false)
  }

  if (isLoading) {
    return <WatchlistSkeleton />
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#E0E0E0] pb-20">
      <WatchlistHeader activeStatus={activeStatus} onStatusChange={handleStatusChange} />

      {items.length === 0 ? (
        <WatchlistEmptyState activeStatus={activeStatus} />
      ) : filteredItems.length === 0 ? (
        <WatchlistEmptyState activeStatus={activeStatus} isFiltered />
      ) : (
        <div className="container mx-auto px-4 py-6">
          <WatchlistStatistics items={items} />

          <WatchlistToolbar
            totalItems={filteredItems.length}
            viewMode={viewMode}
            sortBy={sortBy}
            groupBy={groupBy}
            isBatchMode={isBatchMode}
            onViewModeChange={handleViewModeChange}
            onSortChange={handleSortChange}
            onGroupByChange={handleGroupByChange}
            onToggleBatchMode={toggleBatchMode}
            onSelectAll={selectAllItems}
            selectedCount={selectedItems.length}
          />

          {viewMode === "grid" ? (
            <WatchlistGrid
              items={filteredItems}
              groupBy={groupBy}
              isBatchMode={isBatchMode}
              selectedItems={selectedItems}
              onUpdateStatus={handleUpdateStatus}
              onUpdatePriority={handleUpdatePriority}
              onUpdateProgress={handleUpdateProgress}
              onRemoveItem={handleRemoveItem}
              onToggleSelection={toggleItemSelection}
            />
          ) : (
            <WatchlistList
              items={filteredItems}
              groupBy={groupBy}
              isBatchMode={isBatchMode}
              selectedItems={selectedItems}
              onUpdateStatus={handleUpdateStatus}
              onUpdatePriority={handleUpdatePriority}
              onUpdateProgress={handleUpdateProgress}
              onRemoveItem={handleRemoveItem}
              onToggleSelection={toggleItemSelection}
            />
          )}

          {isBatchMode && selectedItems.length > 0 && (
            <BatchActionsBar
              selectedCount={selectedItems.length}
              onUpdateStatus={handleBatchUpdateStatus}
              onUpdatePriority={handleBatchUpdatePriority}
              onRemove={handleBatchRemove}
              onCancel={() => {
                setSelectedItems([])
                setIsBatchMode(false)
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}
