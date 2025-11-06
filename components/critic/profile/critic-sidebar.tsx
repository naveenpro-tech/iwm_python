"use client"

import { motion } from "framer-motion"
import { Youtube, Twitter, Instagram, Globe, Calendar, TrendingUp, Star, Eye, Heart, FileText, Sparkles, Bookmark } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { CriticProfile, CriticAnalytics } from "@/types/critic"

interface CriticSidebarProps {
  profile: CriticProfile
  analytics: CriticAnalytics
}

const socialIcons: Record<string, any> = {
  YouTube: Youtube,
  Twitter: Twitter,
  Instagram: Instagram,
  Website: Globe,
}

export default function CriticSidebar({ profile, analytics }: CriticSidebarProps) {
  const joinedDate = new Date(profile?.joined_at || "").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  })

  return (
    <div className="space-y-6 sticky top-6">
      {/* Social Links */}
      {profile?.social_links && profile.social_links.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#E0E0E0] font-inter">Connect</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.social_links.map((link) => {
                  const Icon = socialIcons[link.platform] || Globe
                  return (
                    <Link key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-[#1A1A1A] border-[#3A3A3A] hover:border-[#00BFFF] hover:text-[#00BFFF]"
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {link.platform}
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Key Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#E0E0E0] font-inter">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#A0A0A0]">
                <FileText className="w-4 h-4" />
                <span className="text-sm">Total Reviews</span>
              </div>
              <span className="text-lg font-bold text-[#FFD700]">{(profile?.total_reviews ?? profile?.review_count ?? 0).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#A0A0A0]">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Blog Posts</span>
              </div>
              <span className="text-lg font-bold text-[#EC4899]">{(profile?.blog_count ?? 0).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#A0A0A0]">
                <Bookmark className="w-4 h-4" />
                <span className="text-sm">Recommendations</span>
              </div>
              <span className="text-lg font-bold text-[#8B5CF6]">{(profile?.recommendation_count ?? 0).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#A0A0A0]">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Followers</span>
              </div>
              <span className="text-lg font-bold text-[#00BFFF]">{(profile?.total_followers ?? profile?.follower_count ?? 0).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#A0A0A0]">
                <Star className="w-4 h-4" />
                <span className="text-sm">Avg Rating</span>
              </div>
              <span className="text-lg font-bold text-[#10B981]">{(profile?.avg_rating ?? 0).toFixed(1)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#A0A0A0]">
                <Eye className="w-4 h-4" />
                <span className="text-sm">Total Views</span>
              </div>
              <span className="text-lg font-bold text-[#F59E0B]">{(profile?.total_views ?? 0).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#3A3A3A]">
              <div className="flex items-center gap-2 text-[#A0A0A0]">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Member Since</span>
              </div>
              <span className="text-sm font-semibold text-[#E0E0E0]">{joinedDate}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Genres */}
      {analytics?.top_genres && analytics.top_genres.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#E0E0E0] font-inter">Top Genres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.top_genres.slice(0, 5).map((genre, index) => (
                <div key={genre.genre}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#E0E0E0]">{genre.genre}</span>
                    <span className="text-xs text-[#A0A0A0]">{genre.percentage}%</span>
                  </div>
                  <Progress
                    value={genre.percentage}
                    className="h-2 bg-[#1A1A1A]"
                    style={{
                      // @ts-ignore
                      "--progress-background": `hsl(${200 + index * 30}, 70%, 50%)`,
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Rating Distribution */}
      {analytics?.rating_distribution && analytics.rating_distribution.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#E0E0E0] font-inter">Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.rating_distribution
                  .filter((r) => r.count > 0)
                  .sort((a, b) => b.rating - a.rating)
                  .map((rating) => (
                    <div key={rating.rating} className="flex items-center gap-2">
                      <span className="text-sm text-[#A0A0A0] w-8">{rating.rating}★</span>
                      <div className="flex-1 bg-[#1A1A1A] rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FFD700] to-[#00BFFF]"
                          style={{ width: `${rating.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#A0A0A0] w-10 text-right">{rating.percentage}%</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Review Frequency */}
      {analytics?.review_frequency && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#E0E0E0] font-inter">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00BFFF] mb-1">{analytics.review_frequency.per_month}</div>
                <div className="text-sm text-[#A0A0A0]">reviews per month</div>
                <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1A1A1A] text-xs">
                  <TrendingUp className="w-3 h-3 text-[#10B981]" />
                  <span className="text-[#10B981] capitalize">{analytics.review_frequency.trend}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

