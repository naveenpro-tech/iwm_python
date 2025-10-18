"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { GenreHero } from "@/components/genres/genre-hero"
import { GenreFilters } from "@/components/genres/genre-filters"
import { GenreMovieGrid } from "@/components/genres/genre-movie-grid"
import { GenreStatistics } from "@/components/genres/genre-statistics"
import { GenreAdditionalContent } from "@/components/genres/genre-additional-content"
import { getGenreDetails, getMoviesByGenre } from "@/lib/api"
import type { MovieFilters, GenreDetails as GenreDetailsType } from "@/lib/api"
import { GenreSkeleton } from "@/components/genres/genre-skeleton"
import type { Movie } from "@/components/movies/types"

interface GenrePageProps {
  params: {
    genre: string
  }
}

export default function GenrePage({ params }: GenrePageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<GenreSkeleton />}>
        <GenreContent genreSlug={params.genre} />
      </Suspense>
    </div>
  )
}

// These async functions are fine outside component if they don't depend on component state/props directly
async function fetchGenreData(genreSlug: string) {
  return getGenreDetails(genreSlug)
}

async function fetchMovies(genreSlug: string, filters: MovieFilters) {
  return getMoviesByGenre(genreSlug, filters)
}

function GenreContent({ genreSlug }: { genreSlug: string }) {
  const [genreDetails, setGenreDetails] = useState<GenreDetailsType | null>(null)
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoadingMovies, setIsLoadingMovies] = useState(true)
  const [isLoadingDetails, setIsLoadingDetails] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMoreMovies, setHasMoreMovies] = useState(true)

  const [filters, setFilters] = useState<MovieFilters>({
    page: 1,
    limit: 12, // Adjusted limit for better grid display
    sortBy: "popularity",
    yearRange: [1900, new Date().getFullYear()],
    ratingRange: [0, 10],
    countries: [],
    languages: [],
    subgenre: "all",
  })

  const handleFiltersChange = useCallback((newFilters: Partial<MovieFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
    setMovies([]) // Clear movies on filter change to show loading state for new set
    setHasMoreMovies(true) // Reset hasMore flag
  }, [])

  useEffect(() => {
    async function loadDetails() {
      setIsLoadingDetails(true)
      setError(null)
      try {
        const details = await fetchGenreData(genreSlug)
        if (!details) {
          setError(`Genre "${genreSlug}" not found or data is unavailable.`)
          setGenreDetails(null)
        } else {
          setGenreDetails(details)
          // Set initial year range from data if available, or a sensible default
          if (details.statistics.peakDecade) {
            const currentYear = new Date().getFullYear()
            const decadeStart = Number.parseInt(details.statistics.peakDecade.substring(0, 3) + "0")
            // setFilters(prev => ({...prev, yearRange: [decadeStart > 1900 ? decadeStart : 1900, currentYear]}));
          } else {
            // setFilters(prev => ({...prev, yearRange: [1900, new Date().getFullYear()]}));
          }
        }
      } catch (e) {
        setError("Failed to load genre details. Please try again later.")
        console.error(e)
      } finally {
        setIsLoadingDetails(false)
      }
    }
    loadDetails()
  }, [genreSlug])

  useEffect(() => {
    if (!genreDetails && !isLoadingDetails && !error) return
    if (error && !genreDetails) return

    async function loadMovies() {
      setIsLoadingMovies(true)
      try {
        const newMovies = await fetchMovies(genreSlug, filters)
        if (filters.page === 1) {
          setMovies(newMovies)
        } else {
          setMovies((prev) => [...prev, ...newMovies])
        }
        setHasMoreMovies(newMovies.length === filters.limit)
      } catch (e) {
        console.error("Failed to load movies:", e)
        // Optionally set a movie-specific error, or rely on the main error state
      } finally {
        setIsLoadingMovies(false)
      }
    }
    if (genreDetails) {
      // Only load movies if genreDetails are successfully fetched
      loadMovies()
    }
  }, [genreSlug, filters, genreDetails, isLoadingDetails, error]) // Added genreDetails to dependency array

  const loadMoreMoviesCallback = useCallback(() => {
    if (!isLoadingMovies && hasMoreMovies) {
      setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))
    }
  }, [isLoadingMovies, hasMoreMovies])

  if (isLoadingDetails) {
    return <GenreSkeleton />
  }

  if (error && !genreDetails) {
    // If details failed to load, show error and stop.
    return (
      <div className="container mx-auto px-4 py-16 text-center text-xl text-red-400 bg-red-900/20 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2>
        <p>{error}</p>
        <p className="mt-4 text-sm">Please try refreshing the page or check back later.</p>
      </div>
    )
  }

  if (!genreDetails) {
    // This case should ideally be covered by the error state if data is truly unavailable after loading.
    // If it's reached, it means loading finished but details are still null without an error being set.
    return <div className="container mx-auto px-4 py-8 text-center text-xl">Genre data is currently unavailable.</div>
  }

  return (
    <>
      <GenreHero
        title={genreDetails.name}
        description={genreDetails.description}
        backgroundImage={genreDetails.backgroundImage}
        topMovies={genreDetails.statistics.top3MoviesBySidduScoreInGenre}
      />

      <div className="container mx-auto px-4 py-8">
        <GenreFilters
          subgenres={genreDetails.subgenres}
          genre={genreDetails.name}
          currentFilters={filters}
          onFiltersChange={handleFiltersChange}
          availableCountries={genreDetails.statistics.availableCountries}
          availableLanguages={genreDetails.statistics.availableLanguages}
        />

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 mt-8">
          {" "}
          {/* Changed to 7 columns for 5+2 or 4+3 */}
          <div className="lg:col-span-5">
            {" "}
            {/* Main content takes 5 columns */}
            <GenreMovieGrid
              initialMovies={movies}
              genre={genreSlug}
              isLoading={isLoadingMovies && filters.page === 1}
              isLoadingMore={isLoadingMovies && (filters.page || 1) > 1}
              loadMoreMovies={loadMoreMoviesCallback}
              hasMore={hasMoreMovies}
              filters={filters}
            />
          </div>
          <aside className="lg:col-span-2 space-y-8">
            {" "}
            {/* Sidebar takes 2 columns */}
            <GenreStatistics statistics={genreDetails.statistics} genreName={genreDetails.name} />
            <GenreAdditionalContent
              relatedGenres={genreDetails.relatedGenres}
              curatedCollections={genreDetails.curatedCollections}
              notableFigures={genreDetails.notableFigures}
              evolutionTimeline={genreDetails.evolutionTimeline}
              genreName={genreDetails.name}
            />
          </aside>
        </div>
      </div>
    </>
  )
}
