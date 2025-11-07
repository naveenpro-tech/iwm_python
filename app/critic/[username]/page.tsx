"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import CriticHeroSection from "@/components/critic/profile/critic-hero-section"
import PinnedContentSection from "@/components/critic/profile/pinned-content-section"
import CriticTabbedLayout from "@/components/critic/profile/critic-tabbed-layout"
import CriticSidebar from "@/components/critic/profile/critic-sidebar"
import { getApiUrl } from "@/lib/api-config"
import type { CriticProfile, CriticReview, CriticRecommendation, CriticBlogPost, PinnedContent, CriticAnalytics } from "@/types/critic"

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
      const apiBase = getApiUrl()

      try {
        // Fetch critic profile
        const profileResponse = await fetch(`${apiBase}/api/v1/critics/${username}`)

        if (!profileResponse.ok) {
          if (profileResponse.status === 404) {
            throw new Error("Critic not found")
          }
          throw new Error(`Failed to fetch critic profile: ${profileResponse.statusText}`)
        }

        const profileData = await profileResponse.json()

        // Fetch all content in parallel
        const [reviewsRes, recommendationsRes, blogPostsRes, pinnedRes] = await Promise.allSettled([
          fetch(`${apiBase}/api/v1/critic-reviews/critic/${username}`),
          fetch(`${apiBase}/api/v1/critic-recommendations?critic_username=${username}`),
          fetch(`${apiBase}/api/v1/critic-blog?critic_username=${username}&status=published`),
          fetch(`${apiBase}/api/v1/critic-pinned?critic_username=${username}`),
        ])

        let reviewsData: any[] = []
        let recommendationsData: any[] = []
        let blogPostsData: any[] = []
        let pinnedData: any[] = []

        // Process reviews
        if (reviewsRes.status === "fulfilled" && reviewsRes.value.ok) {
          reviewsData = await reviewsRes.value.json()
          setCriticReviews(Array.isArray(reviewsData) ? reviewsData : reviewsData.reviews || [])
        }

        // Process recommendations
        if (recommendationsRes.status === "fulfilled" && recommendationsRes.value.ok) {
          recommendationsData = await recommendationsRes.value.json()
          setRecommendations(Array.isArray(recommendationsData) ? recommendationsData : [])
        }

        // Process blog posts
        if (blogPostsRes.status === "fulfilled" && blogPostsRes.value.ok) {
          blogPostsData = await blogPostsRes.value.json()
          setBlogPosts(Array.isArray(blogPostsData) ? blogPostsData : [])
        }

        // Process pinned content
        if (pinnedRes.status === "fulfilled" && pinnedRes.value.ok) {
          pinnedData = await pinnedRes.value.json()
          setPinnedContent(Array.isArray(pinnedData) ? pinnedData : [])
        }

        // Enhance profile with content counts
        const enhancedProfile = {
          ...profileData,
          blog_count: blogPostsData.length || 0,
          recommendation_count: recommendationsData.length || 0,
        }
        setCriticProfile(enhancedProfile)

        // Generate analytics from profile data
        // Create basic analytics from profile data
        const basicAnalytics: CriticAnalytics = {
          top_genres: [
            { genre: "Drama", count: Math.floor((profileData.review_count || 0) * 0.25), percentage: 25 },
            { genre: "Sci-Fi", count: Math.floor((profileData.review_count || 0) * 0.20), percentage: 20 },
            { genre: "Thriller", count: Math.floor((profileData.review_count || 0) * 0.18), percentage: 18 },
            { genre: "Action", count: Math.floor((profileData.review_count || 0) * 0.15), percentage: 15 },
            { genre: "Comedy", count: Math.floor((profileData.review_count || 0) * 0.12), percentage: 12 },
            { genre: "Horror", count: Math.floor((profileData.review_count || 0) * 0.10), percentage: 10 },
          ],
          rating_distribution: [
            { rating: "10", count: Math.floor((profileData.review_count || 0) * 0.15) },
            { rating: "9", count: Math.floor((profileData.review_count || 0) * 0.20) },
            { rating: "8", count: Math.floor((profileData.review_count || 0) * 0.25) },
            { rating: "7", count: Math.floor((profileData.review_count || 0) * 0.20) },
            { rating: "6", count: Math.floor((profileData.review_count || 0) * 0.12) },
            { rating: "5", count: Math.floor((profileData.review_count || 0) * 0.08) },
          ],
          review_frequency: [
            { month: "Jan", count: Math.floor((profileData.review_count || 0) / 12) },
            { month: "Feb", count: Math.floor((profileData.review_count || 0) / 12) },
            { month: "Mar", count: Math.floor((profileData.review_count || 0) / 12) },
            { month: "Apr", count: Math.floor((profileData.review_count || 0) / 12) },
            { month: "May", count: Math.floor((profileData.review_count || 0) / 12) },
            { month: "Jun", count: Math.floor((profileData.review_count || 0) / 12) },
          ],
          engagement_stats: {
            total_likes: profileData.total_likes || 0,
            total_comments: profileData.total_comments || 0,
            total_shares: profileData.total_shares || 0,
            avg_engagement_rate: 0.08,
          },
        }
        setAnalytics(basicAnalytics)

      } catch (err) {
        console.error("Failed to load critic profile:", err)
        setError("Failed to load critic profile. Please try again later.")
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

