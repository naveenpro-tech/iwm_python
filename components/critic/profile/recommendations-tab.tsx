"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CriticRecommendation } from "@/types/critic"
import { getBadgeLabel, getBadgeColor } from "@/lib/critic/mock-recommendations"

interface RecommendationsTabProps {
  recommendations: CriticRecommendation[]
}

export default function RecommendationsTab({ recommendations }: RecommendationsTabProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  // Extract unique genres
  const allGenres = useMemo(() => {
    const genreSet = new Set<string>()
    recommendations.forEach((rec) => {
      rec.movie.genre.forEach((g) => genreSet.add(g))
    })
    return Array.from(genreSet).sort()
  }, [recommendations])

  // Filter recommendations by genre
  const filteredRecommendations = useMemo(() => {
    if (selectedGenre === "all") return recommendations
    return recommendations.filter((rec) => rec.movie.genre.includes(selectedGenre))
  }, [recommendations, selectedGenre])

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-[#A0A0A0]">This critic hasn't added any recommendations yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#E0E0E0] font-inter">Movies I Recommend</h2>
          <p className="text-sm text-[#A0A0A0] mt-1">
            {filteredRecommendations.length} recommendation{filteredRecommendations.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Genre Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#A0A0A0]" />
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-[180px] bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
              <SelectValue placeholder="Filter by Genre" />
            </SelectTrigger>
            <SelectContent className="bg-[#282828] border-[#3A3A3A]">
              <SelectItem value="all" className="text-[#E0E0E0]">
                All Genres
              </SelectItem>
              {allGenres.map((genre) => (
                <SelectItem key={genre} value={genre} className="text-[#E0E0E0]">
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <AnimatePresence mode="wait">
          {filteredRecommendations.map((recommendation, index) => (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <RecommendationCard
                recommendation={recommendation}
                isHovered={hoveredId === recommendation.id}
                onHover={() => setHoveredId(recommendation.id)}
                onLeave={() => setHoveredId(null)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredRecommendations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#A0A0A0]">No recommendations found for this genre.</p>
        </div>
      )}
    </div>
  )
}

function RecommendationCard({
  recommendation,
  isHovered,
  onHover,
  onLeave,
}: {
  recommendation: CriticRecommendation
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}) {
  const badgeColor = getBadgeColor(recommendation.badge_type)

  return (
    <Link href={`/movies/${recommendation.movie.id}`}>
      <Card
        className="relative aspect-[2/3] overflow-hidden bg-[#282828] border-[#3A3A3A] hover:border-[#00BFFF] transition-all cursor-pointer group"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        {/* Movie Poster */}
        {recommendation.movie.poster_url && (
          <Image
            src={recommendation.movie.poster_url}
            alt={recommendation.movie.title}
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-80" />

        {/* Badge */}
        <div
          className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold"
          style={{ backgroundColor: badgeColor, color: "#1A1A1A" }}
        >
          {getBadgeLabel(recommendation.badge_type)}
        </div>

        {/* IMDB Rating */}
        {recommendation.movie.imdb_rating && (
          <div className="absolute top-2 right-2 bg-[#1A1A1A]/80 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1">
            <Star className="w-3 h-3 text-[#FFD700] fill-[#FFD700]" />
            <span className="text-xs font-bold text-[#E0E0E0]">{recommendation.movie.imdb_rating}</span>
          </div>
        )}

        {/* Movie Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-bold text-[#E0E0E0] font-inter line-clamp-2 mb-1">
            {recommendation.movie.title}
          </h3>
          <p className="text-xs text-[#A0A0A0] mb-2">{recommendation.movie.year}</p>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {recommendation.movie.genre.slice(0, 2).map((genre) => (
              <span key={genre} className="text-[10px] bg-[#3A3A3A] text-[#A0A0A0] px-2 py-0.5 rounded">
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Critic's Note Overlay (on hover) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-[#1A1A1A]/95 backdrop-blur-sm p-4 flex flex-col justify-center"
        >
          <div className="mb-2">
            <div
              className="inline-block px-2 py-1 rounded text-xs font-bold mb-2"
              style={{ backgroundColor: badgeColor, color: "#1A1A1A" }}
            >
              {getBadgeLabel(recommendation.badge_type)}
            </div>
          </div>
          <h3 className="text-base font-bold text-[#E0E0E0] font-inter mb-2">{recommendation.movie.title}</h3>
          <p className="text-sm text-[#A0A0A0] line-clamp-4 mb-3">{recommendation.recommendation_note}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#00BFFF] font-semibold">View Movie →</span>
          </div>
        </motion.div>
      </Card>
    </Link>
  )
}

