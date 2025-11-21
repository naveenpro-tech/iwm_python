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
import { getUserWatchlist, removeFromWatchlist, updateWatchlistItem } from "@/lib/api/watchlist"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
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
  const { toast } = useToast()

  useEffect(() => {
    async function fetchWatchlist() {
      try {
        const user = await getCurrentUser()
        if (!user) {
          setIsLoading(false)
          return
        }

        const response = await getUserWatchlist(user.id)
        const watchlistData = response.items || response || []

        // Transform API data to match WatchlistItem type
        const transformedItems: WatchlistItem[] = watchlistData.map((item: any) => ({
          id: item.id || item.external_id,
          movieId: item.movieId || item.movie_id,
          title: item.title || item.movie?.title || "Unknown Title",
          releaseDate: item.releaseDate || item.movie?.release_date || item.movie?.releaseDate || "Unknown",
          posterUrl: item.posterUrl || item.movie?.poster_url || item.movie?.posterUrl || "/placeholder.svg",
          rating: item.rating || item.movie?.vote_average || item.movie?.rating || 0,
          status: item.status as WatchStatus,
          priority: item.priority as "high" | "medium" | "low",
          progress: item.progress || 0,
          dateAdded: item.dateAdded || item.date_added || new Date().toISOString(),
        }))

        setItems(transformedItems)
        setFilteredItems(transformedItems)
      } catch (error) {
        console.error("Error fetching watchlist:", error)
        toast({
          title: "Error",
          description: "Failed to load watchlist. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWatchlist()
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

  const handleUpdateStatus = async (itemId: string, newStatus: WatchStatus) => {
    try {
      await updateWatchlistItem(itemId, { status: newStatus })
      setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item)))
      toast({
        title: "Status Updated",
        description: `Status changed to ${newStatus.replace("-", " ")}`,
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdatePriority = async (itemId: string, newPriority: "high" | "medium" | "low") => {
    try {
      await updateWatchlistItem(itemId, { priority: newPriority })
      setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, priority: newPriority } : item)))
      toast({
        title: "Priority Updated",
        description: `Priority changed to ${newPriority}`,
      })
    } catch (error) {
      console.error("Error updating priority:", error)
      toast({
        title: "Error",
        description: "Failed to update priority. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateProgress = async (itemId: string, newProgress: number) => {
    try {
      await updateWatchlistItem(itemId, { progress: newProgress })
      setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, progress: newProgress } : item)))
    } catch (error) {
      console.error("Error updating progress:", error)
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromWatchlist(itemId)
      setItems((prev) => prev.filter((item) => item.id !== itemId))
      setSelectedItems((prev) => prev.filter((id) => id !== itemId))
      toast({
        title: "Removed from Watchlist",
        description: "Movie has been removed from your watchlist.",
      })
    } catch (error) {
      console.error("Error removing from watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove from watchlist. Please try again.",
        variant: "destructive",
      })
    }
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

  const handleBatchUpdateStatus = async (newStatus: WatchStatus) => {
    try {
      await Promise.all(selectedItems.map((itemId) => updateWatchlistItem(itemId, { status: newStatus })))
      setItems((prev) => prev.map((item) => (selectedItems.includes(item.id) ? { ...item, status: newStatus } : item)))
      setSelectedItems([])
      setIsBatchMode(false)
      toast({
        title: "Batch Update Complete",
        description: `Updated ${selectedItems.length} items to ${newStatus.replace("-", " ")}`,
      })
    } catch (error) {
      console.error("Error batch updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update some items. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBatchUpdatePriority = async (newPriority: "high" | "medium" | "low") => {
    try {
      await Promise.all(selectedItems.map((itemId) => updateWatchlistItem(itemId, { priority: newPriority })))
      setItems((prev) =>
        prev.map((item) => (selectedItems.includes(item.id) ? { ...item, priority: newPriority } : item)),
      )
      setSelectedItems([])
      setIsBatchMode(false)
      toast({
        title: "Batch Update Complete",
        description: `Updated ${selectedItems.length} items to ${newPriority} priority`,
      })
    } catch (error) {
      console.error("Error batch updating priority:", error)
      toast({
        title: "Error",
        description: "Failed to update some items. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBatchRemove = async () => {
    try {
      await Promise.all(selectedItems.map((itemId) => removeFromWatchlist(itemId)))
      setItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)))
      setSelectedItems([])
      setIsBatchMode(false)
      toast({
        title: "Batch Remove Complete",
        description: `Removed ${selectedItems.length} items from watchlist`,
      })
    } catch (error) {
      console.error("Error batch removing items:", error)
      toast({
        title: "Error",
        description: "Failed to remove some items. Please try again.",
        variant: "destructive",
      })
    }
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
