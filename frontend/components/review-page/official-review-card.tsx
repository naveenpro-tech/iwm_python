"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Clock, Calendar, Share2, Twitter, Facebook, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { OfficialReviewCardProps } from "@/types/review-page"

export default function OfficialReviewCard({ review }: OfficialReviewCardProps) {
  const { toast } = useToast()
  const [showShareMenu, setShowShareMenu] = useState(false)

  const handleShare = (platform: "twitter" | "facebook" | "copy") => {
    const url = window.location.href
    const text = `Check out this review of ${review.content.split("\n")[0]}`

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank")
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
        break
      case "copy":
        navigator.clipboard.writeText(url)
        toast({ title: "Link copied!", description: "Review link copied to clipboard" })
        break
    }
    setShowShareMenu(false)
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />)
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-5 h-5 text-[#FFD700] fill-[#FFD700] opacity-50" />)
    }
    const emptyStars = 10 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-[#3A3A3A]" />)
    }

    return stars
  }

  return (
    <div className="bg-[#282828] rounded-lg border border-[#3A3A3A] overflow-hidden">
      {/* Author Info Bar */}
      <div className="flex items-center justify-between p-6 border-b border-[#3A3A3A]">
        <div className="flex items-center gap-4">
          <img
            src={review.author.avatar_url}
            alt={review.author.name}
            className="w-16 h-16 rounded-full border-2 border-[#00BFFF]"
          />
          <div>
            <h3 className="text-lg font-semibold text-[#E0E0E0] font-inter">{review.author.name}</h3>
            <p className="text-sm text-[#A0A0A0]">{review.author.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-[#A0A0A0]">
            <Calendar className="w-4 h-4" />
            {new Date(review.published_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="flex items-center gap-1 text-sm text-[#A0A0A0]">
            <Clock className="w-4 h-4" />
            {review.read_time_minutes} min read
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-center gap-4 p-6 bg-[#1A1A1A]">
        <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
        <span className="text-3xl font-bold text-[#00BFFF] font-inter">
          {review.rating.toFixed(1)}/10
        </span>
      </div>

      {/* Featured Image */}
      {review.featured_image_url && (
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src={review.featured_image_url}
            alt="Featured"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <div
          className="prose prose-invert max-w-none text-[#E0E0E0] font-dmsans"
          dangerouslySetInnerHTML={{
            __html: review.content
              .split("\n")
              .map((line) => {
                if (line.startsWith("## ")) {
                  return `<h2 class="text-2xl font-bold text-[#E0E0E0] font-inter mt-6 mb-3">${line.slice(3)}</h2>`
                } else if (line.startsWith("### ")) {
                  return `<h3 class="text-xl font-semibold text-[#E0E0E0] font-inter mt-4 mb-2">${line.slice(4)}</h3>`
                } else if (line.startsWith("*") && line.endsWith("*")) {
                  return `<p class="italic text-[#A0A0A0] my-2">${line.slice(1, -1)}</p>`
                } else if (line.startsWith("**") && line.endsWith("**")) {
                  return `<p class="font-bold text-[#E0E0E0] my-2">${line.slice(2, -2)}</p>`
                } else if (line.trim()) {
                  return `<p class="my-3 leading-relaxed">${line}</p>`
                } else {
                  return ""
                }
              })
              .join(""),
          }}
        />

        {/* Embedded Media */}
        {review.embedded_media && review.embedded_media.length > 0 && (
          <div className="mt-6 space-y-4">
            {review.embedded_media.map((media, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                {media.type === "image" && (
                  <div>
                    <img src={media.url} alt={media.caption || ""} className="w-full" />
                    {media.caption && (
                      <p className="text-sm text-[#A0A0A0] text-center mt-2 italic">{media.caption}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Buttons */}
      <div className="flex items-center justify-between p-6 border-t border-[#3A3A3A]">
        <div className="text-sm text-[#A0A0A0]">Share this review:</div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("twitter")}
            className="border-[#3A3A3A] bg-[#1A1A1A] text-[#E0E0E0] hover:bg-[#3A3A3A] hover:border-[#00BFFF]"
          >
            <Twitter className="w-4 h-4 mr-2" />
            Twitter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("facebook")}
            className="border-[#3A3A3A] bg-[#1A1A1A] text-[#E0E0E0] hover:bg-[#3A3A3A] hover:border-[#00BFFF]"
          >
            <Facebook className="w-4 h-4 mr-2" />
            Facebook
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("copy")}
            className="border-[#3A3A3A] bg-[#1A1A1A] text-[#E0E0E0] hover:bg-[#3A3A3A] hover:border-[#00BFFF]"
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </div>
    </div>
  )
}

