"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, UserCheck, TrendingUp, FileText, ThumbsUp, Eye, DollarSign, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { apiGet } from "@/lib/api-client"

interface CriticAnalytics {
  total_critics: number
  verified_critics: number
  pending_applications: number
  total_reviews: number
  total_blog_posts: number
  total_recommendations: number
  total_affiliate_clicks: number
  total_brand_deals: number
  avg_follower_count: number
  avg_review_count: number
  growth_this_month: number
  engagement_rate: number
}

export default function CriticAnalyticsPage() {
  const { toast } = useToast()
  const [analytics, setAnalytics] = useState<CriticAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      // TODO: Create dedicated analytics endpoint
      // For now, fetch from multiple endpoints and aggregate
      const critics = await apiGet<any[]>("/api/v1/critics?limit=1000")
      const applications = await apiGet<any[]>("/api/v1/critic-verification/admin/applications")

      const verifiedCount = critics.filter((c) => c.is_verified).length
      const pendingCount = applications.filter((a) => a.status === "pending").length
      const totalFollowers = critics.reduce((sum, c) => sum + (c.follower_count || 0), 0)
      const totalReviews = critics.reduce((sum, c) => sum + (c.review_count || 0), 0)

      setAnalytics({
        total_critics: critics.length,
        verified_critics: verifiedCount,
        pending_applications: pendingCount,
        total_reviews: totalReviews,
        total_blog_posts: 0, // TODO: Fetch from blog endpoint
        total_recommendations: 0, // TODO: Fetch from recommendations endpoint
        total_affiliate_clicks: 0, // TODO: Fetch from affiliate endpoint
        total_brand_deals: 0, // TODO: Fetch from brand deals endpoint
        avg_follower_count: critics.length > 0 ? Math.round(totalFollowers / critics.length) : 0,
        avg_review_count: critics.length > 0 ? Math.round(totalReviews / critics.length) : 0,
        growth_this_month: 0, // TODO: Calculate from created_at dates
        engagement_rate: 0, // TODO: Calculate from likes/views
      })
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
      toast({
        title: "Error",
        description: "Failed to load analytics",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-[#E0E0E0] text-xl">Loading analytics...</div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-[#E0E0E0] text-xl">No analytics data available</div>
      </div>
    )
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold font-inter text-[#E0E0E0] mb-2">Critic Platform Analytics</h1>
          <p className="text-[#A0A0A0]">Comprehensive metrics and insights for the critic platform</p>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Critics"
            value={analytics.total_critics}
            color="#00BFFF"
            index={0}
          />
          <StatCard
            icon={UserCheck}
            label="Verified Critics"
            value={analytics.verified_critics}
            color="#00FF00"
            index={1}
          />
          <StatCard
            icon={FileText}
            label="Pending Applications"
            value={analytics.pending_applications}
            color="#FFD700"
            index={2}
          />
          <StatCard
            icon={TrendingUp}
            label="Growth This Month"
            value={`+${analytics.growth_this_month}`}
            color="#FF6B6B"
            index={3}
          />
        </div>

        {/* Content Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FileText}
            label="Total Reviews"
            value={analytics.total_reviews}
            color="#9B59B6"
            index={4}
          />
          <StatCard
            icon={FileText}
            label="Blog Posts"
            value={analytics.total_blog_posts}
            color="#3498DB"
            index={5}
          />
          <StatCard
            icon={ThumbsUp}
            label="Recommendations"
            value={analytics.total_recommendations}
            color="#E74C3C"
            index={6}
          />
          <StatCard
            icon={Award}
            label="Brand Deals"
            value={analytics.total_brand_deals}
            color="#F39C12"
            index={7}
          />
        </div>

        {/* Engagement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            label="Avg Followers"
            value={formatNumber(analytics.avg_follower_count)}
            color="#1ABC9C"
            index={8}
          />
          <StatCard
            icon={FileText}
            label="Avg Reviews"
            value={analytics.avg_review_count}
            color="#E67E22"
            index={9}
          />
          <StatCard
            icon={Eye}
            label="Affiliate Clicks"
            value={formatNumber(analytics.total_affiliate_clicks)}
            color="#95A5A6"
            index={10}
          />
          <StatCard
            icon={DollarSign}
            label="Engagement Rate"
            value={`${analytics.engagement_rate.toFixed(1)}%`}
            color="#34495E"
            index={11}
          />
        </div>

        {/* Placeholder for Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8"
        >
          <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="text-[#E0E0E0]">Detailed Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-20">
                <p className="text-xl text-[#A0A0A0] mb-4">Advanced charts and visualizations coming soon</p>
                <p className="text-sm text-[#606060]">
                  Growth trends, engagement metrics, revenue analytics, and more
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05, duration: 0.6 }}
    >
      <Card className="bg-[#1A1A1A] border-[#3A3A3A] hover:border-[#00BFFF] transition-all">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A0A0A0] mb-1">{label}</p>
              <p className="text-3xl font-bold text-[#E0E0E0]">{value}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

