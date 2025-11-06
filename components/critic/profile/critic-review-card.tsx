"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Heart, MessageCircle, Eye, Calendar, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import type { CriticReview } from "@/types/critic"

interface CriticReviewCardProps {
  review: CriticReview
}

// Helper function to get disclosure badge color
const getDisclosureBadgeColor = (type: string) => {
  switch (type) {
    case 'sponsored':
      return 'bg-[#F59E0B] text-[#1A1A1A]'
    case 'affiliate':
      return 'bg-[#8B5CF6] text-white'
    case 'gifted':
      return 'bg-[#EC4899] text-white'
    case 'partnership':
      return 'bg-[#10B981] text-white'
    default:
      return 'bg-[#A0A0A0] text-white'
  }
}

export default function CriticReviewCard({ review }: CriticReviewCardProps) {
  const [showFullContent, setShowFullContent] = useState(false)
  const contentPreview = review.content.substring(0, 200)
  const shouldTruncate = review.content.length > 200

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
    >
      <Card className="bg-[#282828] border-[#3A3A3A] hover:border-[#00BFFF] hover:shadow-glow transition-all overflow-hidden">
        <CardContent className="p-0">
          {/* Movie Poster */}
          <Link href={`/movies/${review.movie.id}`}>
            <div className="relative aspect-[2/3] overflow-hidden">
              <Image
                src={review.movie.poster_url || "/placeholder.svg"}
                alt={review.movie.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-110"
              />
              {/* Rating Badge */}
              <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                <span className="text-white font-bold text-sm">{review.rating}/10</span>
              </div>

              {/* Sponsor Disclosure Badge */}
              {review.disclosure && (
                <div className="absolute top-2 left-2">
                  <Badge className={`${getDisclosureBadgeColor(review.disclosure.disclosure_type)} font-semibold text-xs flex items-center gap-1`}>
                    <AlertCircle className="w-3 h-3" />
                    {review.disclosure.disclosure_type.toUpperCase()}
                  </Badge>
                </div>
              )}
            </div>
          </Link>

          {/* Review Content */}
          <div className="p-4">
            {/* Movie Title */}
            <Link href={`/movies/${review.movie.id}`}>
              <h3 className="text-lg font-bold text-[#E0E0E0] font-inter hover:text-[#00BFFF] transition-colors line-clamp-1">
                {review.movie.title}
              </h3>
            </Link>

            {/* Review Title */}
            <Link href={`/critic-reviews/${review.slug}`}>
              <h4 className="text-md font-semibold text-[#00BFFF] font-inter mt-2 hover:text-[#00A8E8] transition-colors line-clamp-2">
                {review.title}
              </h4>
            </Link>

            {/* Review Excerpt */}
            <p className="text-sm text-[#A0A0A0] font-dmsans mt-3 leading-relaxed">
              {shouldTruncate && !showFullContent ? `${contentPreview}...` : review.content}
            </p>

            {shouldTruncate && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-[#00BFFF] hover:text-[#00A8E8] font-dmsans text-sm mt-2 transition-colors"
              >
                {showFullContent ? "Show Less" : "Read More"}
              </button>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#3A3A3A]">
              <div className="flex items-center gap-1 text-[#A0A0A0]">
                <Heart className="w-4 h-4" />
                <span className="text-xs font-dmsans">{review.likes_count}</span>
              </div>
              <div className="flex items-center gap-1 text-[#A0A0A0]">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs font-dmsans">{review.comments_count}</span>
              </div>
              <div className="flex items-center gap-1 text-[#A0A0A0]">
                <Eye className="w-4 h-4" />
                <span className="text-xs font-dmsans">{review.views_count}</span>
              </div>
              <div className="flex items-center gap-1 text-[#A0A0A0] ml-auto">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-dmsans">
                  {new Date(review.published_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

