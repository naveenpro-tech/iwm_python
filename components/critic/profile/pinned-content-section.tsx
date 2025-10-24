"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Pin, Star, FileText, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { PinnedContent } from "@/types/critic"
import { getBadgeLabel, getBadgeColor } from "@/lib/critic/mock-recommendations"

interface PinnedContentSectionProps {
  pinnedContent: PinnedContent[]
  criticUsername: string
}

export default function PinnedContentSection({ pinnedContent, criticUsername }: PinnedContentSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % pinnedContent.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + pinnedContent.length) % pinnedContent.length)
  }

  if (!pinnedContent || pinnedContent.length === 0) {
    return null
  }

  return (
    <div className="w-full py-8 bg-gradient-to-b from-[#1A1A1A] to-[#282828]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <Pin className="w-6 h-6 text-[#FFD700]" />
          <h2 className="text-2xl font-bold text-[#E0E0E0] font-inter">Pinned Content</h2>
        </motion.div>

        {/* Desktop: Horizontal Scrollable Grid */}
        <div className="hidden md:block">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {pinnedContent.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-[350px]"
              >
                <PinnedCard item={item} criticUsername={criticUsername} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: Swipeable Carousel */}
        <div className="md:hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <PinnedCard item={pinnedContent[currentIndex]} criticUsername={criticUsername} />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {pinnedContent.length > 1 && (
            <div className="flex justify-center gap-4 mt-4">
              <Button
                onClick={prevSlide}
                variant="outline"
                size="icon"
                className="bg-[#282828] border-[#3A3A3A] hover:bg-[#3A3A3A]"
              >
                <ChevronLeft className="w-5 h-5 text-[#E0E0E0]" />
              </Button>
              <div className="flex items-center gap-2">
                {pinnedContent.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? "bg-[#00BFFF] w-6" : "bg-[#3A3A3A]"
                    }`}
                  />
                ))}
              </div>
              <Button
                onClick={nextSlide}
                variant="outline"
                size="icon"
                className="bg-[#282828] border-[#3A3A3A] hover:bg-[#3A3A3A]"
              >
                <ChevronRight className="w-5 h-5 text-[#E0E0E0]" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PinnedCard({ item, criticUsername }: { item: PinnedContent; criticUsername: string }) {
  const [isHovered, setIsHovered] = useState(false)

  // Render based on content type
  if (item.content_type === "review" && item.review) {
    return (
      <Link href={`/critic/${criticUsername}/review/${item.review.slug}`}>
        <Card
          className="relative h-[200px] overflow-hidden bg-[#282828] border-[#3A3A3A] hover:border-[#00BFFF] transition-all cursor-pointer group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Image */}
          {item.review.movie.poster_url && (
            <Image
              src={item.review.movie.poster_url}
              alt={item.review.movie.title}
              fill
              className="object-cover opacity-30 group-hover:opacity-40 transition-opacity"
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />

          {/* Pinned Badge */}
          <div className="absolute top-3 right-3 bg-[#FFD700] text-[#1A1A1A] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Pin className="w-3 h-3" />
            PINNED
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[#00BFFF]" />
              <span className="text-xs text-[#A0A0A0] uppercase tracking-wide">Review</span>
            </div>
            <h3 className="text-lg font-bold text-[#E0E0E0] font-inter mb-2 line-clamp-2">
              {item.review.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                <span className="text-sm font-bold text-[#FFD700]">{item.review.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-[#A0A0A0]">•</span>
              <span className="text-xs text-[#A0A0A0]">{item.review.views_count.toLocaleString()} views</span>
            </div>
            <p className="text-sm text-[#A0A0A0] line-clamp-2">{item.review.content.substring(0, 100)}...</p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              className="mt-3"
            >
              <span className="text-sm text-[#00BFFF] font-semibold">Read Full Review →</span>
            </motion.div>
          </div>
        </Card>
      </Link>
    )
  }

  if (item.content_type === "blog_post" && item.blog_post) {
    return (
      <Link href={`/critic/${criticUsername}/blog/${item.blog_post.slug}`}>
        <Card
          className="relative h-[200px] overflow-hidden bg-[#282828] border-[#3A3A3A] hover:border-[#00BFFF] transition-all cursor-pointer group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Image */}
          {item.blog_post.featured_image_url && (
            <Image
              src={item.blog_post.featured_image_url}
              alt={item.blog_post.title}
              fill
              className="object-cover opacity-30 group-hover:opacity-40 transition-opacity"
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />

          {/* Pinned Badge */}
          <div className="absolute top-3 right-3 bg-[#FFD700] text-[#1A1A1A] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Pin className="w-3 h-3" />
            PINNED
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#FFD700]" />
              <span className="text-xs text-[#A0A0A0] uppercase tracking-wide">Blog Post</span>
            </div>
            <h3 className="text-lg font-bold text-[#E0E0E0] font-inter mb-2 line-clamp-2">
              {item.blog_post.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-[#A0A0A0]">{item.blog_post.read_time_minutes} min read</span>
              <span className="text-xs text-[#A0A0A0]">•</span>
              <span className="text-xs text-[#A0A0A0]">{item.blog_post.views_count.toLocaleString()} views</span>
            </div>
            <p className="text-sm text-[#A0A0A0] line-clamp-2">{item.blog_post.excerpt}</p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              className="mt-3"
            >
              <span className="text-sm text-[#00BFFF] font-semibold">Read Article →</span>
            </motion.div>
          </div>
        </Card>
      </Link>
    )
  }

  if (item.content_type === "recommendation" && item.recommendation) {
    const badgeColor = getBadgeColor(item.recommendation.badge_type)
    return (
      <Link href={`/movies/${item.recommendation.movie.id}`}>
        <Card
          className="relative h-[200px] overflow-hidden bg-[#282828] border-[#3A3A3A] hover:border-[#00BFFF] transition-all cursor-pointer group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Image */}
          {item.recommendation.movie.poster_url && (
            <Image
              src={item.recommendation.movie.poster_url}
              alt={item.recommendation.movie.title}
              fill
              className="object-cover opacity-40 group-hover:opacity-50 transition-opacity"
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />

          {/* Pinned Badge */}
          <div className="absolute top-3 right-3 bg-[#FFD700] text-[#1A1A1A] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Pin className="w-3 h-3" />
            PINNED
          </div>

          {/* Recommendation Badge */}
          <div
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: badgeColor, color: "#1A1A1A" }}
          >
            {getBadgeLabel(item.recommendation.badge_type)}
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-[#E0E0E0] font-inter mb-2">
              {item.recommendation.movie.title} ({item.recommendation.movie.year})
            </h3>
            <p className="text-sm text-[#A0A0A0] line-clamp-2 mb-2">{item.recommendation.recommendation_note}</p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              className="mt-3"
            >
              <span className="text-sm text-[#00BFFF] font-semibold">View Movie →</span>
            </motion.div>
          </div>
        </Card>
      </Link>
    )
  }

  return null
}

