"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import CriticHeroSection from "@/components/critic/profile/critic-hero-section"
import PinnedContentSection from "@/components/critic/profile/pinned-content-section"
import CriticTabbedLayout from "@/components/critic/profile/critic-tabbed-layout"
import CriticSidebar from "@/components/critic/profile/critic-sidebar"
import type { CriticProfile, CriticReview, CriticRecommendation, CriticBlogPost, PinnedContent, CriticAnalytics } from "@/types/critic"
import { generateMockCriticProfile, generateMockCriticReviews } from "@/lib/critic/mock-critic-profiles"
import { generateMockRecommendations } from "@/lib/critic/mock-recommendations"
import { generateMockBlogPosts } from "@/lib/critic/mock-blog-posts"
import { generateMockPinnedContent } from "@/lib/critic/mock-pinned-content"
import { generateCriticAnalytics } from "@/lib/critic/mock-critic-analytics"

export default function CriticProfilePage() {
  const params = useParams()
  const username = params.username as string

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [criticProfile, setCriticProfile] = useState<CriticProfile | null>(null)
  const [criticReviews, setCriticReviews] = useState<CriticReview[]>([])
  const [recommendations, setRecommendations] = useState<CriticRecommendation[]>([])
  const [blogPosts, setBlogPosts] = useState<CriticBlogPost[]>([])
  const [pinnedContent, setPinnedContent] = useState<PinnedContent[]>([])
  const [analytics, setAnalytics] = useState<CriticAnalytics | null>(null)

  useEffect(() => {
    const fetchCriticData = async () => {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL
      const useBackend = process.env.NEXT_PUBLIC_ENABLE_BACKEND === "true" && !!apiBase

      try {
        if (useBackend && apiBase) {
          // Try backend first
          const [profileResponse, reviewsResponse] = await Promise.all([
            fetch(`${apiBase}/api/v1/critics/${username}`),
            fetch(`${apiBase}/api/v1/critic-reviews/critic/${username}`),
          ])

          if (!profileResponse.ok) {
            if (profileResponse.status === 404) {
              throw new Error("Critic not found")
            }
            throw new Error(`Failed to fetch critic profile: ${profileResponse.statusText}`)
          }

          if (!reviewsResponse.ok) {
          throw new Error(`Failed to fetch reviews: ${reviewsResponse.statusText}`)
        }

          const profileData = await profileResponse.json()
          const reviewsData = await reviewsResponse.json()

          setCriticProfile(profileData)
          setCriticReviews(reviewsData.reviews || reviewsData || [])
        } else {
          throw new Error("Backend not configured")
        }
      } catch (err) {
        console.warn("Backend fetch failed, using mock data:", err)
        // Use mock data as fallback
        const mockProfile = generateMockCriticProfile(username)
        const mockReviews = generateMockCriticReviews(username)
        const mockRecommendations = generateMockRecommendations(username)
        const mockBlogPosts = generateMockBlogPosts(username)
        const mockPinnedContent = generateMockPinnedContent(username)
        const mockAnalytics = generateCriticAnalytics(username, mockProfile.total_reviews)

        setCriticProfile(mockProfile)
        setCriticReviews(mockReviews)
        setRecommendations(mockRecommendations)
        setBlogPosts(mockBlogPosts)
        setPinnedContent(mockPinnedContent)
        setAnalytics(mockAnalytics)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCriticData()
  }, [username])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#282828] border-t-[#00BFFF] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#E0E0E0] font-dmsans">Loading critic profile...</p>
        </div>
      </div>
    )
  }

  // Error state (only if no profile data at all)
  if (!criticProfile) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-4xl font-bold text-[#E0E0E0] mb-4 font-inter">404</h1>
          <p className="text-[#A0A0A0] font-dmsans mb-6">Critic not found</p>
          <a
            href="/critics"
            className="inline-block px-6 py-3 bg-[#00BFFF] text-[#1A1A1A] rounded-full font-inter font-medium hover:bg-[#00A8E8] transition-colors"
          >
            Browse All Critics
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Hero Section */}
      <CriticHeroSection profile={criticProfile} />

      {/* Pinned Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <PinnedContentSection pinnedContent={pinnedContent} criticUsername={username} />
        </motion.div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Left Column: Tabbed Content */}
          <div className="min-w-0">
            <CriticTabbedLayout
              profile={criticProfile}
              reviews={criticReviews}
              recommendations={recommendations}
              blogPosts={blogPosts}
            />
          </div>

          {/* Right Column: Sidebar (Desktop Only) */}
          <div className="hidden lg:block">
            {analytics && <CriticSidebar profile={criticProfile} analytics={analytics} />}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar (Accordion - Below Tabs) */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.8 }}
        >
          {analytics && <CriticSidebar profile={criticProfile} analytics={analytics} />}
        </motion.div>
      </div>
    </div>
  )
}

