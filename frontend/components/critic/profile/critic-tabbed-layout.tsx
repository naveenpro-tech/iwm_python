"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Sparkles, Star, BarChart3, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CriticReviewShowcase from "./critic-review-showcase"
import RecommendationsTab from "./recommendations-tab"
import BlogTab from "./blog-tab"
import CriticFilmographyHeatmap from "./critic-filmography-heatmap"
import CriticBioSection from "./critic-bio-section"
import CriticAMASection from "./critic-ama-section"
import CriticBadgesSection from "./critic-badges-section"
import type { CriticProfile, CriticReview, CriticRecommendation, CriticBlogPost } from "@/types/critic"

interface CriticTabbedLayoutProps {
  profile: CriticProfile
  reviews: CriticReview[]
  recommendations: CriticRecommendation[]
  blogPosts: CriticBlogPost[]
}

export default function CriticTabbedLayout({
  profile,
  reviews,
  recommendations,
  blogPosts,
}: CriticTabbedLayoutProps) {
  const [activeTab, setActiveTab] = useState("reviews")
  const [isSticky, setIsSticky] = useState(false)

  // Handle sticky tab bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsSticky(scrollPosition > 600)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const tabs = [
    {
      id: "reviews",
      label: "Reviews",
      icon: FileText,
      count: reviews.length,
      color: "#FFD700",
    },
    {
      id: "recommendations",
      label: "Recommendations",
      icon: Star,
      count: recommendations.length,
      color: "#00BFFF",
    },
    {
      id: "blog",
      label: "Critic's Log",
      icon: Sparkles,
      count: blogPosts.length,
      color: "#EC4899",
    },
    {
      id: "filmography",
      label: "Filmography",
      icon: BarChart3,
      count: null,
      color: "#8B5CF6",
    },
    {
      id: "about",
      label: "About",
      icon: User,
      count: null,
      color: "#10B981",
    },
  ]

  return (
    <div className="relative">
      {/* Tab Bar */}
      <motion.div
        className={`${
          isSticky ? "fixed top-0 left-0 right-0 z-40 bg-[#1A1A1A]/95 backdrop-blur-lg shadow-lg" : "relative"
        } transition-all duration-300`}
        initial={false}
        animate={{
          y: isSticky ? 0 : 0,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b border-[#3A3A3A] rounded-none h-auto p-0 overflow-x-auto scrollbar-hide">
              {tabs.map((tab, index) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`
                      relative px-6 py-4 rounded-none border-b-2 border-transparent
                      data-[state=active]:border-[#00BFFF] data-[state=active]:text-[#00BFFF]
                      text-[#A0A0A0] hover:text-[#E0E0E0] transition-all
                      flex items-center gap-2 whitespace-nowrap
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-semibold">{tab.label}</span>
                    {tab.count !== null && (
                      <span className="ml-1 px-2 py-0.5 rounded-full bg-[#282828] text-xs">
                        {tab.count}
                      </span>
                    )}

                    {/* Active indicator glow */}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00BFFF]"
                        style={{
                          boxShadow: "0 0 10px #00BFFF",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </div>
      </motion.div>

      {/* Spacer when sticky */}
      {isSticky && <div className="h-16" />}

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <AnimatePresence mode="wait">
            <TabsContent value="reviews" className="mt-0">
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CriticReviewShowcase reviews={reviews} criticUsername={profile?.username || "critic"} />
              </motion.div>
            </TabsContent>

            <TabsContent value="recommendations" className="mt-0">
              <motion.div
                key="recommendations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RecommendationsTab recommendations={recommendations} />
              </motion.div>
            </TabsContent>

            <TabsContent value="blog" className="mt-0">
              <motion.div
                key="blog"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <BlogTab blogPosts={blogPosts} criticUsername={profile?.username || "critic"} />
              </motion.div>
            </TabsContent>

            <TabsContent value="filmography" className="mt-0">
              <motion.div
                key="filmography"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CriticFilmographyHeatmap reviews={reviews} />
              </motion.div>
            </TabsContent>

            <TabsContent value="about" className="mt-0">
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Bio Section */}
                <CriticBioSection profile={profile} />

                {/* AMA Section */}
                <CriticAMASection username={profile?.username || "critic"} />

                {/* Badges Section */}
                <CriticBadgesSection profile={profile} />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}

