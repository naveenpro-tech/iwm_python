"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Award, Trophy, Star, Calendar, Loader2, Search, SortAsc, SortDesc } from "lucide-react"
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation"
import { MovieDetailsNavigation } from "@/components/movie-details-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AwardCard } from "@/components/movies/award-card"
import { AwardsStatisticsCards } from "@/components/movies/awards-statistics-cards"
import { AwardsFilterSidebar, type AwardsFilters } from "@/components/movies/awards-filter-sidebar"
import { fetchAllAwardCeremonies, type AwardCeremony } from "@/lib/api/award-ceremonies"

import { getApiUrl } from "@/lib/api-config"

interface AwardItem {
  id: string
  name: string
  year: number
  category: string
  status: "Winner" | "Nominee"
  ceremony_id?: string
  country?: string
  language?: string
  prestige_level?: string
  recipient?: string
  notes?: string
}

interface Movie {
  id: string
  title: string
  awards: AwardItem[]
}

export default function MovieAwardsPage() {
  const params = useParams()
  const movieId = params.id as string

  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [ceremonies, setCeremonies] = useState<AwardCeremony[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<string>("year-desc")
  const [isMobile, setIsMobile] = useState(false)

  // Filters state
  const [filters, setFilters] = useState<AwardsFilters>({
    country: "All",
    ceremonies: [],
    language: "All",
    categoryType: "All",
    yearRange: [1900, new Date().getFullYear()],
    status: "All",
  })

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Fetch movie awards and ceremonies
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const apiBase = getApiUrl()

        // Fetch movie data
        const movieResponse = await fetch(`${apiBase}/api/v1/movies/${movieId}`)
        if (!movieResponse.ok) {
          console.warn(`Movie API returned ${movieResponse.status}`)
          setMovie(null)
          setLoading(false)
          return
        }

        const movieData = await movieResponse.json()
        const awards = movieData.awards || []

        // Set initial year range based on awards
        if (awards.length > 0) {
          const years = awards.map((a: AwardItem) => a.year)
          const minYear = Math.min(...years)
          const maxYear = Math.max(...years)
          setFilters((prev) => ({ ...prev, yearRange: [minYear, maxYear] }))
        }

        setMovie({
          id: movieData.id || movieId,
          title: movieData.title || "Movie",
          awards,
        })

        // Fetch award ceremonies for logos
        try {
          const ceremoniesData = await fetchAllAwardCeremonies()
          setCeremonies(ceremoniesData)
        } catch (error) {
          console.error("Failed to fetch ceremonies:", error)
        }
      } catch (error) {
        console.error("Failed to fetch movie awards:", error)
        setMovie(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [movieId])

  // Filter and sort awards
  const filteredAndSortedAwards = useMemo(() => {
    if (!movie) return []

    let filtered = movie.awards.filter((award) => {
      // Country filter
      if (filters.country !== "All" && award.country !== filters.country) return false

      // Ceremonies filter
      if (filters.ceremonies.length > 0 && !filters.ceremonies.includes(award.name)) return false

      // Language filter
      if (filters.language !== "All" && award.language !== filters.language) return false

      // Year range filter
      if (award.year < filters.yearRange[0] || award.year > filters.yearRange[1]) return false

      // Status filter
      if (filters.status !== "All" && award.status !== filters.status) return false

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const nameMatch = award.name.toLowerCase().includes(query)
        const categoryMatch = award.category.toLowerCase().includes(query)
        if (!nameMatch && !categoryMatch) return false
      }

      return true
    })

    // Sort awards
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "year-desc":
          return b.year - a.year
        case "year-asc":
          return a.year - b.year
        case "prestige":
          const prestigeOrder = { national: 0, international: 1, industry: 2, state: 3 }
          const aPrestige = prestigeOrder[a.prestige_level as keyof typeof prestigeOrder] ?? 4
          const bPrestige = prestigeOrder[b.prestige_level as keyof typeof prestigeOrder] ?? 4
          return aPrestige - bPrestige
        case "country":
          return (a.country || "").localeCompare(b.country || "")
        case "status-winner":
          if (a.status === "Winner" && b.status !== "Winner") return -1
          if (a.status !== "Winner" && b.status === "Winner") return 1
          return b.year - a.year
        default:
          return b.year - a.year
      }
    })

    return filtered
  }, [movie, filters, searchQuery, sortBy])

  // Group awards by ceremony
  const groupedAwards = useMemo(() => {
    const groups: Record<string, AwardItem[]> = {}
    filteredAndSortedAwards.forEach((award) => {
      if (!groups[award.name]) {
        groups[award.name] = []
      }
      groups[award.name].push(award)
    })
    return groups
  }, [filteredAndSortedAwards])

  // Get ceremony logo
  const getCeremonyLogo = (ceremonyId?: string): string | null => {
    if (!ceremonyId) return null
    const ceremony = ceremonies.find((c) => c.external_id === ceremonyId)
    return ceremony?.logo_url || null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#00BFFF] animate-spin" />
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#141414] text-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-400">Movie not found</p>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: "Movies", href: "/movies" },
    { label: movie.title, href: `/movies/${movie.id}` },
    { label: "Awards", href: `/movies/${movie.id}/awards` },
  ]

  return (
    <div className="min-h-screen bg-[#141414] text-gray-100">
      <MovieDetailsNavigation movieId={movie.id} movieTitle={movie.title} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbNavigation items={breadcrumbItems} />

        <motion.div
          className="my-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-white tracking-tight flex items-center">
            <Trophy className="w-10 h-10 mr-3 text-[#FFD700]" />
            {movie.title}: <span className="text-[#FFD700] ml-2">Awards & Honors</span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Recognition and accolades received by {movie.title}
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <AwardsStatisticsCards awards={movie.awards} />

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            {isMobile ? (
              <AwardsFilterSidebar
                awards={movie.awards}
                filters={filters}
                onFiltersChange={setFilters}
                isMobile={true}
              />
            ) : (
              <AwardsFilterSidebar
                awards={movie.awards}
                filters={filters}
                onFiltersChange={setFilters}
                isMobile={false}
              />
            )}
          </div>

          {/* Awards List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Sort Bar */}
            <div className="bg-[#1C1C1C] rounded-xl p-4 border border-gray-700">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search awards by ceremony or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[#282828] border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 sm:w-auto w-full">
                  <SortAsc className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-[#282828] border-gray-700 text-white sm:w-[200px] w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="year-desc">Year (Newest First)</SelectItem>
                      <SelectItem value="year-asc">Year (Oldest First)</SelectItem>
                      <SelectItem value="prestige">Prestige Level</SelectItem>
                      <SelectItem value="country">Country</SelectItem>
                      <SelectItem value="status-winner">Winners First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-3 text-sm text-gray-400">
                Showing {filteredAndSortedAwards.length} of {movie.awards.length} awards
              </div>
            </div>

            {/* Awards Display */}
            {filteredAndSortedAwards.length === 0 ? (
              <Card className="bg-[#1C1C1C] border-gray-700">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Awards Found</h3>
                    <p className="text-gray-400">
                      {searchQuery || filters.country !== "All" || filters.ceremonies.length > 0
                        ? "Try adjusting your filters or search query to see more awards."
                        : "No awards have been added for this movie yet."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Group by ceremony */}
                {Object.entries(groupedAwards).map(([ceremonyName, ceremonyAwards]) => (
                  <div key={ceremonyName} className="space-y-3">
                    {/* Ceremony Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-[#FFD700]" />
                        {ceremonyName}
                        <span className="text-sm text-gray-400 font-normal">
                          ({ceremonyAwards.length} {ceremonyAwards.length === 1 ? "award" : "awards"})
                        </span>
                      </h2>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                    </div>

                    {/* Awards in this ceremony */}
                    <div className="space-y-3">
                      {ceremonyAwards.map((award, index) => (
                        <AwardCard
                          key={award.id}
                          award={award}
                          ceremonyLogo={getCeremonyLogo(award.ceremony_id)}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

