"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Eye, Heart, Users, TrendingUp, Edit, Trash2, FileText, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { checkApplicationStatus } from "@/lib/api/critic-verification"
import { getCriticDashboardStats, listMyReviews, type CriticReviewResponse, type DashboardStats } from "@/lib/api/critic-reviews"

interface DraftReview {
  id: number | string
  title: string
  movie: string
  lastSaved: string
  progress: number
}

export default function CriticDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [drafts, setDrafts] = useState<DraftReview[]>([])
  const [recentReviews, setRecentReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "approved" | "not_applied" | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, try to fetch critic profile directly
        // This will fail if user doesn't have a critic profile yet
        try {
          const dashboardStats = await getCriticDashboardStats()
          setStats(dashboardStats)
          setVerificationStatus("approved")
        } catch (statsError: any) {
          // If 404, user doesn't have critic profile yet
          if (statsError.message?.includes("404") || statsError.message?.includes("not have a critic profile")) {
            // Check application status
            const appStatus = await checkApplicationStatus()
            setVerificationStatus(appStatus.status || "not_applied")

            // If approved but no profile, there's an issue - redirect to application status
            if (appStatus.status === "approved") {
              console.error("Application approved but critic profile not found. Please contact support.")
              router.push("/critic/application-status?error=profile_not_created")
              return
            }

            // If not approved, redirect to application status
            router.push("/critic/application-status")
            return
          }

          // Other errors - rethrow
          throw statsError
        }

        // Fetch reviews
        try {
          const myReviews = await listMyReviews()
          const draftReviews = myReviews.filter((r) => r.is_draft)
          const publishedReviews = myReviews.filter((r) => !r.is_draft)

          // Convert to DraftReview format for display
          setDrafts(
            draftReviews.map((r) => ({
              id: r.id,
              title: r.title,
              movie: r.title,
              lastSaved: r.updated_at,
              progress: 75,
            }))
          )

          setRecentReviews(publishedReviews.slice(0, 5))
        } catch (err) {
          console.error("Failed to fetch reviews:", err)
          // Don't fail the whole page if reviews fail
          setDrafts([])
          setRecentReviews([])
        }
      } catch (error) {
        console.error("Error loading critic dashboard:", error)
        // If error, redirect to application status
        router.push("/critic/application-status")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-[#E0E0E0]">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold font-inter text-[#E0E0E0] mb-2">Critic Dashboard</h1>
            <p className="text-[#A0A0A0]">Manage your reviews and track your performance</p>
          </div>
          <Link href="/critic/dashboard/create-review">
            <Button className="bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A] gap-2">
              <Plus className="w-5 h-5" />
              Create New Review
            </Button>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard icon={FileText} label="Total Reviews" value={formatNumber(stats.totalReviews)} color="#00BFFF" delay={0.1} />
          <StatsCard icon={Eye} label="Total Views" value={formatNumber(stats.totalViews)} color="#FFD700" delay={0.2} />
          <StatsCard icon={Heart} label="Total Likes" value={formatNumber(stats.totalLikes)} color="#FF6B6B" delay={0.3} />
          <StatsCard icon={Users} label="Followers" value={formatNumber(stats.totalFollowers)} color="#00BFFF" delay={0.4} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-[#E0E0E0]">Views Over Time (30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={stats.viewsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
                    <XAxis dataKey="date" stroke="#A0A0A0" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#A0A0A0" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#282828", border: "1px solid #3A3A3A", borderRadius: "8px" }}
                      labelStyle={{ color: "#E0E0E0" }}
                    />
                    <Line type="monotone" dataKey="views" stroke="#00BFFF" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-[#E0E0E0]">Engagement Rate (30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stats.engagementRate}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
                    <XAxis dataKey="date" stroke="#A0A0A0" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#A0A0A0" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#282828", border: "1px solid #3A3A3A", borderRadius: "8px" }}
                      labelStyle={{ color: "#E0E0E0" }}
                    />
                    <Bar dataKey="rate" fill="#FFD700" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Drafts Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold font-inter text-[#E0E0E0] mb-4">Drafts ({drafts.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map((draft, index) => (
              <DraftCard key={draft.id} draft={draft} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Recent Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold font-inter text-[#E0E0E0] mb-4">Recent Reviews</h2>
          <div className="space-y-4">
            {recentReviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function StatsCard({ icon: Icon, label, value, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border-[#3A3A3A] hover:border-[#00BFFF] transition-all">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <div>
              <p className="text-sm text-[#A0A0A0]">{label}</p>
              <p className="text-2xl font-bold text-[#E0E0E0]">{value}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function DraftCard({ draft, index }: { draft: DraftReview; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
    >
      <Card className="bg-[#1A1A1A] border-[#3A3A3A] hover:border-[#00BFFF] transition-all">
        <CardContent className="pt-6">
          <div
            className="w-full h-32 bg-cover bg-center rounded-lg mb-4"
            style={{ backgroundImage: `url(${draft.moviePoster})` }}
          />
          <h3 className="text-lg font-bold text-[#E0E0E0] mb-1">{draft.movieTitle}</h3>
          <p className="text-sm text-[#A0A0A0] mb-3">{draft.movieYear}</p>
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-[#A0A0A0] mb-1">
              <span>Progress</span>
              <span>{draft.progress}%</span>
            </div>
            <div className="w-full h-2 bg-[#282828] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00BFFF] transition-all"
                style={{ width: `${draft.progress}%` }}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/critic/dashboard/edit-review/${draft.id}`} className="flex-1">
              <Button variant="outline" className="w-full border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#282828]">
                <Edit className="w-4 h-4 mr-2" />
                Continue
              </Button>
            </Link>
            <Button variant="outline" className="border-[#3A3A3A] text-red-500 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ReviewCard({ review, index }: { review: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
    >
      <Card className="bg-[#1A1A1A] border-[#3A3A3A] hover:border-[#00BFFF] transition-all">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div
              className="w-20 h-28 bg-cover bg-center rounded-lg flex-shrink-0"
              style={{ backgroundImage: `url(${review.moviePoster})` }}
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#E0E0E0] mb-1">{review.movieTitle}</h3>
              <p className="text-sm text-[#A0A0A0] mb-2">{review.movieYear}</p>
              <div className="flex items-center gap-4 text-sm mb-3">
                <div className="flex items-center gap-1 text-[#00BFFF]">
                  <Eye className="w-4 h-4" />
                  <span>{review.viewCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-red-500">
                  <Heart className="w-4 h-4" />
                  <span>{review.likes.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/critic/dashboard/edit-review/${review.id}`}>
                  <Button variant="outline" size="sm" className="border-[#3A3A3A] text-[#E0E0E0]">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="border-[#3A3A3A] text-red-500">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

