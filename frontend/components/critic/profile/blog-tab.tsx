"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, Eye, Tag, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CriticBlogPost } from "@/types/critic"

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

interface BlogTabProps {
  blogPosts: CriticBlogPost[]
  criticUsername: string
}

export default function BlogTab({ blogPosts, criticUsername }: BlogTabProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    blogPosts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [blogPosts])

  // Filter posts by tag
  const filteredPosts = useMemo(() => {
    if (!selectedTag) return blogPosts
    return blogPosts.filter((post) => post.tags.includes(selectedTag))
  }, [blogPosts, selectedTag])

  if (blogPosts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-[#A0A0A0]">This critic hasn't published any blog posts yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#E0E0E0] font-inter">The Critic's Log</h2>
        <p className="text-sm text-[#A0A0A0] mt-1">
          {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              selectedTag === null
                ? "bg-[#00BFFF] text-[#1A1A1A]"
                : "bg-[#282828] text-[#A0A0A0] hover:bg-[#3A3A3A]"
            }`}
          >
            All Posts
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedTag === tag
                  ? "bg-[#00BFFF] text-[#1A1A1A]"
                  : "bg-[#282828] text-[#A0A0A0] hover:bg-[#3A3A3A]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Blog Posts List */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <BlogPostCard post={post} criticUsername={criticUsername} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#A0A0A0]">No posts found with this tag.</p>
        </div>
      )}
    </div>
  )
}

function BlogPostCard({ post, criticUsername }: { post: CriticBlogPost; criticUsername: string }) {
  const [isHovered, setIsHovered] = useState(false)

  const formattedDate = new Date(post.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <Link href={`/critic/${criticUsername}/blog/${post.slug}`}>
      <Card
        className="overflow-hidden bg-[#282828] border-[#3A3A3A] hover:border-[#00BFFF] transition-all cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0">
              <Image
                src={post.featured_image_url}
                alt={post.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#282828]/50 md:block hidden" />

              {/* Sponsor Disclosure Badge */}
              {post.disclosure && (
                <div className="absolute top-2 left-2">
                  <Badge className={`${getDisclosureBadgeColor(post.disclosure.disclosure_type)} font-semibold text-xs flex items-center gap-1`}>
                    <AlertCircle className="w-3 h-3" />
                    {post.disclosure.disclosure_type.toUpperCase()}
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 p-6">
            {/* Sponsor Disclosure (if no image) */}
            {!post.featured_image_url && post.disclosure && (
              <div className="mb-3">
                <Badge className={`${getDisclosureBadgeColor(post.disclosure.disclosure_type)} font-semibold text-xs flex items-center gap-1 w-fit`}>
                  <AlertCircle className="w-3 h-3" />
                  {post.disclosure.disclosure_type.toUpperCase()}
                </Badge>
              </div>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-[#A0A0A0]">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.read_time_minutes} min read</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views_count.toLocaleString()} views</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold text-[#E0E0E0] font-inter mb-3 group-hover:text-[#00BFFF] transition-colors">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-[#A0A0A0] mb-4 line-clamp-3">{post.excerpt}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-[#1A1A1A] border-[#3A3A3A] text-[#A0A0A0] hover:border-[#00BFFF] hover:text-[#00BFFF]"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Read More CTA */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-[#00BFFF] font-semibold">Read Full Article →</span>
            </motion.div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

