"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Award, Trophy, Star, Calendar, Loader2 } from "lucide-react"
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation"
import { MovieDetailsNavigation } from "@/components/movie-details-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AwardItem {
  id: string
  name: string
  year: number
  category: string
  status: "Winner" | "Nominee"
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
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovieAwards = async () => {
      setLoading(true)
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
        const response = await fetch(`${apiBase}/api/v1/movies/${movieId}`)

        if (!response.ok) {
          console.warn(`Movie API returned ${response.status}`)
          setMovie(null)
          setLoading(false)
          return
        }

        const data = await response.json()
        setMovie({
          id: data.id || movieId,
          title: data.title || "Movie",
          awards: data.awards || [],
        })
      } catch (error) {
        console.error("Failed to fetch movie awards:", error)
        setMovie(null)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieAwards()
  }, [movieId])

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

  // Filter awards
  const filteredAwards = movie.awards.filter((award) => {
    if (selectedYear && award.year !== selectedYear) return false
    if (selectedStatus && award.status !== selectedStatus) return false
    return true
  })

  // Get unique years and sort descending
  const years = Array.from(new Set(movie.awards.map((a) => a.year))).sort((a, b) => b - a)

  // Count wins and nominations
  const wins = movie.awards.filter((a) => a.status === "Winner").length
  const nominations = movie.awards.filter((a) => a.status === "Nominee").length

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-[#1C1C1C] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Trophy className="w-4 h-4 mr-2 text-[#FFD700]" />
                Total Awards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{movie.awards.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1C1C1C] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Star className="w-4 h-4 mr-2 text-green-400" />
                Wins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{wins}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1C1C1C] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Award className="w-4 h-4 mr-2 text-blue-400" />
                Nominations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{nominations}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-[#1C1C1C] rounded-xl p-4 mb-6 border border-gray-700">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Filter by Year:</span>
              <button
                onClick={() => setSelectedYear(null)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedYear === null
                    ? "bg-[#00BFFF] text-black"
                    : "bg-[#282828] text-gray-300 hover:bg-gray-700"
                }`}
              >
                All
              </button>
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedYear === year
                      ? "bg-[#00BFFF] text-black"
                      : "bg-[#282828] text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-400">Status:</span>
              <button
                onClick={() => setSelectedStatus(null)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedStatus === null
                    ? "bg-[#00BFFF] text-black"
                    : "bg-[#282828] text-gray-300 hover:bg-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedStatus("Winner")}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedStatus === "Winner"
                    ? "bg-green-500 text-black"
                    : "bg-[#282828] text-gray-300 hover:bg-gray-700"
                }`}
              >
                Wins
              </button>
              <button
                onClick={() => setSelectedStatus("Nominee")}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedStatus === "Nominee"
                    ? "bg-blue-500 text-black"
                    : "bg-[#282828] text-gray-300 hover:bg-gray-700"
                }`}
              >
                Nominations
              </button>
            </div>
          </div>
        </div>

        {/* Awards List */}
        {filteredAwards.length === 0 ? (
          <Card className="bg-[#1C1C1C] border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Awards Found</h3>
                <p className="text-gray-400">
                  {selectedYear || selectedStatus
                    ? "Try adjusting your filters to see more awards."
                    : "No awards have been added for this movie yet."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAwards.map((award, index) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-[#1C1C1C] border-gray-700 hover:border-[#00BFFF] transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">{award.name}</h3>
                          <Badge
                            variant={award.status === "Winner" ? "default" : "secondary"}
                            className={
                              award.status === "Winner"
                                ? "bg-green-500 text-black hover:bg-green-600"
                                : "bg-blue-500 text-black hover:bg-blue-600"
                            }
                          >
                            {award.status}
                          </Badge>
                        </div>
                        <p className="text-gray-300 mb-2">{award.category}</p>
                        {award.recipient && (
                          <p className="text-sm text-gray-400">Recipient: {award.recipient}</p>
                        )}
                        {award.notes && <p className="text-sm text-gray-400 mt-2">{award.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-lg font-semibold">{award.year}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

