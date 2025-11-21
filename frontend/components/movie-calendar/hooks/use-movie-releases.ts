"use client"

import { useState, useEffect } from "react"
import type { MovieRelease, FilterOptions } from "@/components/movie-calendar/types"

// Mock data for movie releases
const MOCK_RELEASES: MovieRelease[] = [
  {
    id: "movie1",
    title: "Dune: Part Two",
    posterUrl: "/dune-part-two-poster.png",
    releaseDate: "2024-05-01",
    releaseType: "theatrical",
    languages: ["English"],
    genres: ["Sci-Fi", "Adventure"],
    country: "USA",
    sidduScore: 9.1,
  },
  {
    id: "movie2",
    title: "Challengers",
    posterUrl: "/challengers-poster.png",
    releaseDate: "2024-05-03",
    releaseType: "theatrical",
    languages: ["English"],
    genres: ["Drama", "Sport"],
    country: "USA",
    sidduScore: 8.7,
  },
  {
    id: "movie3",
    title: "The Fall Guy",
    posterUrl: "/action-movie-poster.png",
    releaseDate: "2024-05-03",
    releaseType: "theatrical",
    languages: ["English"],
    genres: ["Action", "Comedy"],
    country: "USA",
    sidduScore: 7.9,
  },
  {
    id: "movie4",
    title: "Kingdom of the Planet of the Apes",
    posterUrl: "/sci-fi-movie-poster.png",
    releaseDate: "2024-05-10",
    releaseType: "theatrical",
    languages: ["English"],
    genres: ["Sci-Fi", "Action"],
    country: "USA",
    sidduScore: 8.3,
  },
  {
    id: "movie5",
    title: "IF",
    posterUrl: "/family-movie-poster.png",
    releaseDate: "2024-05-17",
    releaseType: "theatrical",
    languages: ["English"],
    genres: ["Comedy", "Family"],
    country: "USA",
    sidduScore: 7.5,
  },
  {
    id: "movie6",
    title: "Furiosa: A Mad Max Saga",
    posterUrl: "/action-movie-poster.png",
    releaseDate: "2024-05-24",
    releaseType: "theatrical",
    languages: ["English"],
    genres: ["Action", "Adventure"],
    country: "Australia",
    sidduScore: 8.8,
  },
  {
    id: "movie7",
    title: "The Garfield Movie",
    posterUrl: "/animated-movie-poster.png",
    releaseDate: "2024-05-24",
    releaseType: "theatrical",
    languages: ["English"],
    genres: ["Animation", "Comedy"],
    country: "USA",
    sidduScore: 7.2,
  },
  {
    id: "movie8",
    title: "Bridgerton Season 3",
    posterUrl: "/period-drama-poster.png",
    releaseDate: "2024-05-16",
    releaseType: "ott",
    languages: ["English"],
    genres: ["Drama", "Romance"],
    country: "UK",
    sidduScore: 8.5,
  },
  {
    id: "movie9",
    title: "The Idea of You",
    posterUrl: "/romance-movie-poster.png",
    releaseDate: "2024-05-02",
    releaseType: "ott",
    languages: ["English"],
    genres: ["Romance", "Drama"],
    country: "USA",
    sidduScore: 7.8,
  },
  {
    id: "movie10",
    title: "Gangs of Godavari",
    posterUrl: "/placeholder-ffhh8.png",
    releaseDate: "2024-05-31",
    releaseType: "theatrical",
    languages: ["Telugu"],
    genres: ["Action", "Crime"],
    country: "India",
    sidduScore: 8.1,
  },
  {
    id: "movie11",
    title: "Mr. & Mrs. Mahi",
    posterUrl: "/bollywood-movie-poster.png",
    releaseDate: "2024-05-31",
    releaseType: "theatrical",
    languages: ["Hindi"],
    genres: ["Drama", "Sport"],
    country: "India",
    sidduScore: 7.6,
  },
  {
    id: "movie12",
    title: "Citadel: Honey Bunny",
    posterUrl: "/spy-thriller-poster.png",
    releaseDate: "2024-05-10",
    releaseType: "ott",
    languages: ["Hindi", "English"],
    genres: ["Action", "Thriller"],
    country: "India",
    sidduScore: 8.2,
  },
]

export function useMovieReleases(currentDate: Date, selectedDate: Date | null, filters: FilterOptions) {
  const [releases, setReleases] = useState<MovieRelease[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch releases for the current month
  useEffect(() => {
    const fetchReleases = async () => {
      setIsLoading(true)

      // In a real app, this would be an API call
      // For now, we'll simulate a delay and filter the mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Filter releases for the current month
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()

      const filteredReleases = MOCK_RELEASES.filter((release) => {
        const releaseDate = new Date(release.releaseDate)
        return releaseDate.getMonth() === month && releaseDate.getFullYear() === year
      })

      setReleases(filteredReleases)
      setIsLoading(false)
    }

    fetchReleases()
  }, [currentDate])

  // Apply filters to releases
  const filteredReleases = releases.filter((release) => {
    // Filter by release type
    if (filters.releaseType !== "all" && release.releaseType !== filters.releaseType) {
      return false
    }

    // Filter by languages
    if (filters.languages.length > 0 && !release.languages.some((lang) => filters.languages.includes(lang))) {
      return false
    }

    // Filter by genres
    if (filters.genres.length > 0 && !release.genres.some((genre) => filters.genres.includes(genre))) {
      return false
    }

    // Filter by country
    if (filters.countries.length > 0 && !filters.countries.includes(release.country)) {
      return false
    }

    return true
  })

  // Get releases for selected date
  const releasesForDate = selectedDate
    ? filteredReleases.filter((release) => {
        const releaseDate = new Date(release.releaseDate)
        return (
          releaseDate.getDate() === selectedDate.getDate() &&
          releaseDate.getMonth() === selectedDate.getMonth() &&
          releaseDate.getFullYear() === selectedDate.getFullYear()
        )
      })
    : []

  return {
    releases,
    isLoading,
    filteredReleases,
    releasesForDate,
  }
}
