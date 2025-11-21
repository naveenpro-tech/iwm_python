"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import PageHeader from "./page-header"
import SearchFilterBar from "./search-filter-bar"
import ActiveFilters from "./active-filters"
import ViewControls from "./view-controls"
import SceneGrid from "./scene-grid"
import SceneList from "./scene-list"
import SceneModal from "./scene-modal"
import EmptyState from "./empty-state"
import { mockScenes } from "./mock-data"
import type { Scene, SceneFilter, SortOption, ViewMode } from "./types"

export default function SceneExplorerContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [scenes, setScenes] = useState<Scene[]>(mockScenes)
  const [filteredScenes, setFilteredScenes] = useState<Scene[]>(mockScenes)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortOption, setSortOption] = useState<SortOption>("popular")
  const [activeFilters, setActiveFilters] = useState<SceneFilter[]>([])
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Effect to handle URL params for filters and sorting
  useEffect(() => {
    // This would parse URL params and set initial filters/sort
    const view = searchParams.get("view") as ViewMode
    if (view && (view === "grid" || view === "list")) {
      setViewMode(view)
    }

    const sort = searchParams.get("sort") as SortOption
    if (sort) {
      setSortOption(sort)
    }

    // Check for movie filter in URL
    const movieId = searchParams.get("movie")
    if (movieId) {
      const movieFilter = {
        type: "movie" as const,
        value: movieId,
        label: scenes.find((scene) => scene.movieId === movieId)?.movieTitle || "Movie",
      }

      if (!activeFilters.some((filter) => filter.type === "movie" && filter.value === movieId)) {
        setActiveFilters((prev) => [...prev, movieFilter])
      }
    }

    // Check for scene ID in URL
    const sceneId = searchParams.get("scene")
    if (sceneId) {
      const scene = scenes.find((s) => s.id === sceneId)
      if (scene) {
        setSelectedScene(scene)
        setIsModalOpen(true)
      }
    }
  }, [searchParams, scenes])

  // Effect to apply filters and sorting
  useEffect(() => {
    setIsLoading(true)

    // Apply filters
    let results = [...scenes]

    if (activeFilters.length > 0) {
      activeFilters.forEach((filter) => {
        switch (filter.type) {
          case "movie":
            results = results.filter((scene) => scene.movieId === filter.value)
            break
          case "genre":
            results = results.filter((scene) => scene.genres.includes(filter.value))
            break
          case "director":
            results = results.filter((scene) => scene.director === filter.value)
            break
          case "cinematographer":
            results = results.filter((scene) => scene.cinematographer === filter.value)
            break
          case "sceneType":
            results = results.filter((scene) => scene.sceneType === filter.value)
            break
        }
      })
    }

    // Apply sorting
    switch (sortOption) {
      case "popular":
        results.sort((a, b) => b.viewCount - a.viewCount)
        break
      case "latest":
        results.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
        break
      case "discussed":
        results.sort((a, b) => b.commentCount - a.commentCount)
        break
      case "releaseNewest":
        results.sort((a, b) => b.releaseYear - a.releaseYear)
        break
      case "releaseOldest":
        results.sort((a, b) => a.releaseYear - b.releaseYear)
        break
    }

    // Simulate network delay
    setTimeout(() => {
      setFilteredScenes(results)
      setIsLoading(false)
    }, 500)
  }, [scenes, activeFilters, sortOption])

  // Update URL when filters or sort changes
  useEffect(() => {
    const params = new URLSearchParams()

    params.set("view", viewMode)
    params.set("sort", sortOption)

    // Add filter params
    activeFilters.forEach((filter, index) => {
      params.set(`filter_${filter.type}_${index}`, filter.value)
    })

    // Update URL without refreshing page
    router.push(`/scene-explorer?${params.toString()}`, { scroll: false })
  }, [viewMode, sortOption, activeFilters, router])

  const handleFilterChange = (filters: SceneFilter[]) => {
    setActiveFilters(filters)
  }

  const handleFilterRemove = (filterToRemove: SceneFilter) => {
    setActiveFilters(
      activeFilters.filter((filter) => !(filter.type === filterToRemove.type && filter.value === filterToRemove.value)),
    )
  }

  const handleClearFilters = () => {
    setActiveFilters([])
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
  }

  const handleSortChange = (option: SortOption) => {
    setSortOption(option)
  }

  const handleSceneSelect = (scene: Scene) => {
    setSelectedScene(scene)
    setIsModalOpen(true)

    // Update URL with scene ID
    const params = new URLSearchParams(searchParams.toString())
    params.set("scene", scene.id)
    router.push(`/scene-explorer?${params.toString()}`, { scroll: false })
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)

    // Remove scene ID from URL
    const params = new URLSearchParams(searchParams.toString())
    params.delete("scene")
    router.push(`/scene-explorer?${params.toString()}`, { scroll: false })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      className="container mx-auto px-4 pb-16"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <PageHeader />

      <SearchFilterBar onFilterChange={handleFilterChange} activeFilters={activeFilters} />

      {activeFilters.length > 0 && (
        <ActiveFilters filters={activeFilters} onRemove={handleFilterRemove} onClearAll={handleClearFilters} />
      )}

      <ViewControls
        viewMode={viewMode}
        sortOption={sortOption}
        onViewModeChange={handleViewModeChange}
        onSortChange={handleSortChange}
      />

      {filteredScenes.length === 0 ? (
        <EmptyState onClearFilters={handleClearFilters} />
      ) : viewMode === "grid" ? (
        <SceneGrid scenes={filteredScenes} onSceneSelect={handleSceneSelect} isLoading={isLoading} />
      ) : (
        <SceneList scenes={filteredScenes} onSceneSelect={handleSceneSelect} isLoading={isLoading} />
      )}

      {selectedScene && <SceneModal scene={selectedScene} isOpen={isModalOpen} onClose={handleCloseModal} />}
    </motion.div>
  )
}
