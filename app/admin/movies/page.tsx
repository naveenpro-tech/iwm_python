"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { MovieManagementTable } from "@/components/admin/movies/movie-management-table"
import { MovieGridView } from "@/components/admin/movies/movie-grid-view"
import { MovieListingHeader } from "@/components/admin/movies/movie-listing-header"
import { MovieFilters } from "@/components/admin/movies/movie-filters"
import { motion } from "framer-motion"
import { PaginationControls } from "@/components/shared/pagination-controls"
import { MovieBatchActionsToolbar } from "@/components/admin/movies/movie-batch-actions-toolbar"
import {
  mockMoviesData, // This will be our initial data source
  getMockMovieById,
  updateMockMovie,
  deleteMockMovie,
  addMockMovie, // Assuming addMockMovie is also exported
} from "@/components/admin/movies/mock-movie-data"
import type {
  Movie,
  MovieStatus,
  MovieGenre,
  StreamingPlatformLink,
  ReleaseDateInfo,
  MovieFiltersState,
} from "@/components/admin/movies/types"
import { useToast } from "@/hooks/use-toast" // Corrected path
import { ManageStreamingLinksModal } from "@/components/admin/movies/modals/manage-streaming-links-modal"
import { UpdateReleaseDateModal } from "@/components/admin/movies/modals/update-release-date-modal"
import { ConfirmationModal } from "@/components/shared/confirmation-modal"
import { ApiImportModal } from "@/components/admin/movies/modals/api-import-modal"
import { Button } from "@/components/ui/button"

type SortConfig = {
  key: keyof Movie
  direction: "asc" | "desc"
}

export default function MovieManagementPage() {
  const [movies, setMovies] = useState<Movie[]>([]) // Initialize empty, then load
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<MovieFiltersState>({
    genre: "all",
    status: "all",
    year: "all",
  })
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: "releaseDate", direction: "desc" })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10) // For table view, grid might show more or adapt
  const [selectedMovieIds, setSelectedMovieIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Modals State
  const [isManageLinksModalOpen, setIsManageLinksModalOpen] = useState(false)
  const [isUpdateDateModalOpen, setIsUpdateDateModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [isApiImportModalOpen, setIsApiImportModalOpen] = useState(false)
  const [isJsonImportModalOpen, setIsJsonImportModalOpen] = useState(false)
  const [isJsonExportModalOpen, setIsJsonExportModalOpen] = useState(false)

  const [currentMovieForModal, setCurrentMovieForModal] = useState<Movie | null>(null)
  const [confirmationAction, setConfirmationAction] = useState<{
    action: () => Promise<void>
    title: string
    description: string
    confirmText?: string
    variant?: "destructive" | "warning" | "primary"
  } | null>(null)

  useEffect(() => {
    // Simulate fetching initial data
    setIsLoading(true)
    // In a real app, this would be an API call
    // For now, we use the mockMoviesData directly after a short delay
    setTimeout(() => {
      setMovies(mockMoviesData)
      setIsLoading(false)
    }, 500)
  }, [])

  const handleSelectMovie = useCallback((movieId: string, checked: boolean) => {
    setSelectedMovieIds((prevSelected) =>
      checked ? [...prevSelected, movieId] : prevSelected.filter((id) => id !== movieId),
    )
  }, [])

  const filteredMovies = useMemo(() => {
    let tempFiltered = [...movies]

    if (searchQuery) {
      tempFiltered = tempFiltered.filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (filters.genre && filters.genre !== "all") {
      tempFiltered = tempFiltered.filter((movie) => movie.genres.includes(filters.genre as MovieGenre))
    }
    if (filters.status && filters.status !== "all") {
      tempFiltered = tempFiltered.filter((movie) => movie.status === filters.status)
    }
    if (filters.year && filters.year !== "all") {
      tempFiltered = tempFiltered.filter(
        (movie) => movie.releaseDate && movie.releaseDate.startsWith(filters.year as string),
      )
    }
    return tempFiltered
  }, [movies, searchQuery, filters])

  const sortedMovies = useMemo(() => {
    if (!sortConfig) return filteredMovies

    const { key, direction } = sortConfig

    return [...filteredMovies].sort((a, b) => {
      let aValue = a[key]
      let bValue = b[key]

      if (key === "sidduScore" || key === "runtime" || key === "budget" || key === "boxOffice") {
        aValue = Number(aValue) || 0
        bValue = Number(bValue) || 0
      } else if (key === "releaseDate" || key === "createdAt" || key === "updatedAt") {
        return direction === "asc"
          ? new Date(aValue as string).getTime() - new Date(bValue as string).getTime()
          : new Date(bValue as string).getTime() - new Date(aValue as string).getTime()
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1
      if (aValue > bValue) return direction === "asc" ? 1 : -1
      return 0
    })
  }, [filteredMovies, sortConfig])

  const totalItems = sortedMovies.length
  const totalPages = Math.ceil(totalItems / pageSize)

  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedMovies.slice(startIndex, startIndex + pageSize)
  }, [sortedMovies, currentPage, pageSize])

  const handleSort = useCallback((key: keyof Movie) => {
    setSortConfig((prevConfig) => {
      const direction = prevConfig?.key === key && prevConfig.direction === "asc" ? "desc" : "asc"
      return { key, direction }
    })
    setCurrentPage(1)
  }, [])

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedMovieIds(paginatedMovies.map((movie) => movie.id))
      } else {
        setSelectedMovieIds([])
      }
    },
    [paginatedMovies],
  )

  const clearSelection = () => setSelectedMovieIds([])

  const openManageStreamingLinksModal = async (movieId: string) => {
    const movie = await getMockMovieById(movieId)
    if (movie) {
      setCurrentMovieForModal(movie)
      setIsManageLinksModalOpen(true)
    }
  }

  const openUpdateReleaseDateModal = async (movieId: string) => {
    const movie = await getMockMovieById(movieId)
    if (movie) {
      setCurrentMovieForModal(movie)
      setIsUpdateDateModalOpen(true)
    }
  }

  const openApiImportModal = () => {
    setIsApiImportModalOpen(true)
  }

  const openJsonImportModal = () => {
    // Logic to open JSON import modal, potentially set current data or options
    setIsJsonImportModalOpen(true)
    toast({ title: "JSON Import", description: "JSON Import Modal Opened (Placeholder)" })
  }

  const openJsonExportModal = () => {
    // Logic to open JSON export modal, potentially pass current filters/selection
    setIsJsonExportModalOpen(true)
    toast({ title: "JSON Export", description: "JSON Export Modal Opened (Placeholder)" })
  }

  const openConfirmationModal = (
    title: string,
    description: string,
    action: () => Promise<void>,
    confirmText?: string,
    variant?: "destructive" | "warning" | "primary",
  ) => {
    setConfirmationAction({ action, title, description, confirmText, variant })
    setIsConfirmationModalOpen(true)
  }

  const updateMovieStates = (ids: string[], updates: Partial<Movie>): Movie[] => {
    return movies.map((movie) =>
      ids.includes(movie.id) ? { ...movie, ...updates, updatedAt: new Date().toISOString() } : movie,
    )
  }

  const handlePublishSelected = () => {
    openConfirmationModal(
      "Publish Movies?",
      `Are you sure you want to publish ${selectedMovieIds.length} selected movie(s)? Their status will be set to 'Released'.`,
      async () => {
        setIsLoading(true)
        const updatedMovies = updateMovieStates(selectedMovieIds, { status: "released", isPublished: true })
        for (const id of selectedMovieIds) {
          const movieToUpdate = updatedMovies.find((m) => m.id === id)
          if (movieToUpdate) await updateMockMovie(movieToUpdate)
        }
        setMovies(updatedMovies)
        toast({ title: `${selectedMovieIds.length} Movie(s) Published`, description: "Status set to 'Released'." })
        clearSelection()
        setIsLoading(false)
      },
      "Publish Selected",
      "primary",
    )
  }

  const handleUnpublishSelected = () => {
    openConfirmationModal(
      "Unpublish Movies?",
      `Are you sure you want to unpublish ${selectedMovieIds.length} selected movie(s)? Their status will be set to 'Draft'.`,
      async () => {
        setIsLoading(true)
        const updatedMovies = updateMovieStates(selectedMovieIds, { status: "draft", isPublished: false })
        for (const id of selectedMovieIds) {
          const movieToUpdate = updatedMovies.find((m) => m.id === id)
          if (movieToUpdate) await updateMockMovie(movieToUpdate)
        }
        setMovies(updatedMovies)
        toast({ title: `${selectedMovieIds.length} Movie(s) Unpublished`, description: "Status set to 'Draft'." })
        clearSelection()
        setIsLoading(false)
      },
      "Unpublish Selected",
      "warning",
    )
  }

  const handleArchiveSelected = () => {
    openConfirmationModal(
      "Archive Movies?",
      `Are you sure you want to archive ${selectedMovieIds.length} selected movie(s)? Their status will be set to 'Archived'.`,
      async () => {
        setIsLoading(true)
        const updatedMovies = updateMovieStates(selectedMovieIds, {
          status: "archived",
          isArchived: true,
          isPublished: false,
        })
        for (const id of selectedMovieIds) {
          const movieToUpdate = updatedMovies.find((m) => m.id === id)
          if (movieToUpdate) await updateMockMovie(movieToUpdate)
        }
        setMovies(updatedMovies)
        toast({ title: `${selectedMovieIds.length} Movie(s) Archived`, description: "Status set to 'Archived'." })
        clearSelection()
        setIsLoading(false)
      },
      "Archive Selected",
      "warning",
    )
  }

  const handleDeleteSelected = () => {
    openConfirmationModal(
      "Delete Selected Movies?",
      `Are you sure you want to permanently delete ${selectedMovieIds.length} selected movie(s)? This action cannot be undone.`,
      async () => {
        setIsLoading(true)
        for (const id of selectedMovieIds) {
          await deleteMockMovie(id)
        }
        setMovies((prev) => prev.filter((movie) => !selectedMovieIds.includes(movie.id)))
        toast({ title: `${selectedMovieIds.length} Movie(s) Deleted`, variant: "destructive" })
        clearSelection()
        setCurrentPage(1)
        setIsLoading(false)
      },
      "Delete Selected Permanently",
      "destructive",
    )
  }

  const handleDeleteSingleMovie = (movieId: string) => {
    const movieToDelete = movies.find((m) => m.id === movieId)
    openConfirmationModal(
      `Delete "${movieToDelete?.title || "Movie"}"?`,
      `Are you sure you want to permanently delete this movie? This action cannot be undone.`,
      async () => {
        setIsLoading(true)
        await deleteMockMovie(movieId)
        setMovies((prev) => prev.filter((m) => m.id !== movieId))
        toast({ title: `"${movieToDelete?.title || "Movie"}" Deleted`, variant: "destructive" })
        if (paginatedMovies.length === 1 && currentPage > 1 && totalPages > 1) {
          setCurrentPage(currentPage - 1)
        } else if (paginatedMovies.length === 1 && totalPages <= 1) {
          setCurrentPage(1)
        }
        setIsLoading(false)
      },
      "Delete Permanently",
      "destructive",
    )
  }

  const handleSaveStreamingLinks = async (movieId: string, updatedLinks: StreamingPlatformLink[]) => {
    setIsLoading(true)
    const movieToUpdate = await getMockMovieById(movieId)
    if (movieToUpdate) {
      const updatedMovieData = { ...movieToUpdate, streamingLinks: updatedLinks, updatedAt: new Date().toISOString() }
      await updateMockMovie(updatedMovieData)
      setMovies((prev) => prev.map((m) => (m.id === movieId ? updatedMovieData : m)))
      toast({ title: "Streaming Links Updated", description: `Links for "${updatedMovieData.title}" saved.` })
    }
    setIsLoading(false)
    setIsManageLinksModalOpen(false)
  }

  const handleSaveReleaseDates = async (movieId: string, updatedDates: ReleaseDateInfo[]) => {
    setIsLoading(true)
    const movieToUpdate = await getMockMovieById(movieId)
    if (movieToUpdate) {
      const updatedMovieData = { ...movieToUpdate, releaseDates: updatedDates, updatedAt: new Date().toISOString() }
      await updateMockMovie(updatedMovieData)
      setMovies((prev) => prev.map((m) => (m.id === movieId ? updatedMovieData : m)))
      toast({ title: "Release Dates Updated", description: `Dates for "${updatedMovieData.title}" saved.` })
    }
    setIsLoading(false)
    setIsUpdateDateModalOpen(false)
  }

  const handleApiImportComplete = async (importedApiMovies: any[]) => {
    setIsLoading(true)
    const newMoviesFromImport = await Promise.all(
      importedApiMovies.map(async (imported) => {
        const newMovieData: Omit<Movie, "id" | "createdAt" | "updatedAt"> = {
          // Omit fields that addMockMovie will generate
          title: imported.title,
          originalTitle: imported.title,
          poster: imported.posterUrl || "/abstract-movie-poster.png",
          backdrop: "/movie-backdrop.png",
          sidduScore: 0,
          releaseDate: imported.year ? `${imported.year}-01-01` : new Date().toISOString().split("T")[0],
          status: "draft" as MovieStatus,
          genres: [] as MovieGenre[],
          synopsis: "Imported from " + imported.source,
          runtime: 120,
          languages: ["English"],
          certification: "Unrated",
          cast: [],
          crew: [],
          galleryImages: [],
          trailerUrl: "",
          trailerEmbed: "",
          streamingLinks: [],
          releaseDates: [
            {
              region: "US",
              date: imported.year ? `${imported.year}-01-01` : new Date().toISOString().split("T")[0],
              type: "Theatrical",
            },
          ],
          awards: [],
          isPublished: false,
          isArchived: false,
          importedFrom: imported.source,
          // Optional fields with defaults
          budget: undefined,
          boxOffice: undefined,
          productionCompanies: [],
          countriesOfOrigin: [],
          tagline: "",
          keywords: [],
          aspectRatio: "",
          soundMix: [],
          camera: "",
        }
        return addMockMovie(newMovieData) // addMockMovie should return the full Movie object with ID
      }),
    )

    setMovies((prev) => [...prev, ...newMoviesFromImport])
    toast({ title: `${newMoviesFromImport.length} movies imported and added as drafts.` })
    setIsApiImportModalOpen(false)
    setIsLoading(false)
  }

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [searchQuery, filters, totalPages, currentPage]) // Added totalPages to dependency array

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold">Movie Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage your movie database, import content, and configure streaming availability.
        </p>
      </motion.div>

      {selectedMovieIds.length > 0 && (
        <MovieBatchActionsToolbar
          selectedCount={selectedMovieIds.length}
          onPublish={handlePublishSelected}
          onUnpublish={handleUnpublishSelected}
          onArchive={handleArchiveSelected}
          onDelete={handleDeleteSelected}
          onClearSelection={clearSelection}
        />
      )}

      <MovieListingHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onOpenApiImportModal={openApiImportModal}
        onOpenJsonImportModal={openJsonImportModal} // Add this
        onOpenJsonExportModal={openJsonExportModal} // Add this
      />

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MovieFilters filters={filters} onFiltersChange={setFilters} />
        </motion.div>
      )}

      {viewMode === "table" ? (
        <MovieManagementTable
          movies={paginatedMovies}
          searchQuery={searchQuery}
          filters={filters}
          onSort={handleSort}
          sortConfig={sortConfig}
          selectedMovies={selectedMovieIds}
          onSelectMovie={handleSelectMovie}
          onSelectAll={handleSelectAll}
          isLoading={isLoading}
          onOpenManageStreamingLinksModal={openManageStreamingLinksModal}
          onOpenUpdateReleaseDateModal={openUpdateReleaseDateModal}
          onDeleteMovie={handleDeleteSingleMovie}
        />
      ) : (
        <MovieGridView
          movies={paginatedMovies}
          searchQuery={searchQuery}
          filters={filters}
          selectedMovies={selectedMovieIds}
          onSelectMovie={handleSelectMovie}
          isLoading={isLoading}
          onOpenManageStreamingLinksModal={openManageStreamingLinksModal}
          onOpenUpdateReleaseDateModal={openUpdateReleaseDateModal}
          onDeleteMovie={handleDeleteSingleMovie}
        />
      )}

      {totalPages > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={pageSize}
          totalItems={totalItems}
        />
      )}

      {currentMovieForModal && (
        <>
          <ManageStreamingLinksModal
            isOpen={isManageLinksModalOpen}
            onClose={() => setIsManageLinksModalOpen(false)}
            movieId={currentMovieForModal.id}
            initialLinks={currentMovieForModal.streamingLinks || []}
            onSave={handleSaveStreamingLinks}
          />
          <UpdateReleaseDateModal
            isOpen={isUpdateDateModalOpen}
            onClose={() => setIsUpdateDateModalOpen(false)}
            movieId={currentMovieForModal.id}
            initialDates={currentMovieForModal.releaseDates || []}
            onSave={handleSaveReleaseDates}
          />
        </>
      )}
      {confirmationAction && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={async () => {
            if (confirmationAction) {
              // Check if not null
              await confirmationAction.action()
            }
            setIsConfirmationModalOpen(false)
          }}
          title={confirmationAction.title}
          description={confirmationAction.description}
          confirmText={confirmationAction.confirmText}
          variant={confirmationAction.variant}
        />
      )}
      <ApiImportModal
        isOpen={isApiImportModalOpen}
        onClose={() => setIsApiImportModalOpen(false)}
        onImportComplete={handleApiImportComplete}
      />
      {/* Placeholder for JSON Import Modal */}
      {isJsonImportModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Import Movies from JSON</h2>
            <p className="mb-4">JSON import functionality will be implemented here.</p>
            <Button onClick={() => setIsJsonImportModalOpen(false)}>Close</Button>
          </div>
        </div>
      )}

      {/* Placeholder for JSON Export Modal */}
      {isJsonExportModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Export Movies to JSON</h2>
            <p className="mb-4">JSON export functionality will be implemented here.</p>
            <Button onClick={() => setIsJsonExportModalOpen(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  )
}
