"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star, CheckCircle2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CriticReviewCardProps } from "@/types/review-page"

export default function CriticReviewCard({ review }: CriticReviewCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />)
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 text-[#FFD700] fill-[#FFD700] opacity-50" />)
    }
    const emptyStars = 10 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-[#3A3A3A]" />)
    }

    return stars
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-[#282828] rounded-lg border ${
        isHovered ? "border-[#00BFFF] shadow-[0_0_20px_rgba(0,191,255,0.3)]" : "border-[#3A3A3A]"
      } p-6 transition-all duration-200 hover:scale-[1.02] cursor-pointer h-full flex flex-col`}
      onClick={() => router.push(`/critic/${review.critic.username}/review/${review.slug}`)}
    >
      {/* Critic Info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={review.critic.avatar_url}
          alt={review.critic.display_name}
          className="w-16 h-16 rounded-full border-2 border-[#00BFFF]"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-[#E0E0E0] font-inter truncate">
              {review.critic.display_name}
            </h3>
            {review.critic.is_verified && (
              <CheckCircle2 className="w-4 h-4 text-[#00BFFF] flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-[#A0A0A0] truncate">@{review.critic.username}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
        <span className="text-xl font-bold text-[#00BFFF] font-inter">{review.rating.toFixed(1)}/10</span>
      </div>

      {/* Excerpt */}
      <p className="text-sm text-[#E0E0E0] leading-relaxed mb-4 flex-1 line-clamp-3">
        "{review.excerpt}"
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#3A3A3A]">
        <div className="flex items-center gap-1 text-xs text-[#A0A0A0]">
          <Calendar className="w-3 h-3" />
          {new Date(review.published_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#00BFFF] hover:text-[#00BFFF] hover:bg-[#00BFFF]/10 text-xs"
        >
          Read Full Review →
        </Button>
      </div>
    </div>
  )
}

