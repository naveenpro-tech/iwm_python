"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Star, Pin, Link as LinkIcon, Briefcase, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"
import { apiGet } from "@/lib/api-client"

interface DashboardStats {
  blog_posts: { total: number; published: number; drafts: number }
  recommendations: { total: number }
  pinned_content: { total: number }
  affiliate_links: { total: number; active: number }
  brand_deals: { total: number; active: number }
}

export default function StudioDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch stats from various endpoints
        const [blogPosts, recommendations, pinnedContent, affiliateLinks, brandDeals] = await Promise.all([
          apiGet("/api/v1/critic-blog/critic/me").catch(() => ({ items: [] })),
          apiGet("/api/v1/critic-recommendations/critic/me").catch(() => ({ items: [] })),
          apiGet("/api/v1/critic-pinned/critic/me").catch(() => ({ items: [] })),
          apiGet("/api/v1/critic-affiliate/critic/me").catch(() => ({ items: [] })),
          apiGet("/api/v1/critic-brand-deals/critic/me").catch(() => ({ items: [] })),
        ])

        const blogItems = blogPosts.items || []
        const stats: DashboardStats = {
          blog_posts: {
            total: blogItems.length,
            published: blogItems.filter((p: any) => p.status === "published").length,
            drafts: blogItems.filter((p: any) => p.status === "draft").length,
          },
          recommendations: {
            total: recommendations.items?.length || 0,
          },
          pinned_content: {
            total: pinnedContent.items?.length || 0,
          },
          affiliate_links: {
            total: affiliateLinks.items?.length || 0,
            active: affiliateLinks.items?.filter((l: any) => l.is_active).length || 0,
          },
          brand_deals: {
            total: brandDeals.items?.length || 0,
            active: brandDeals.items?.filter((d: any) => d.status === "accepted").length || 0,
          },
        }

        setStats(stats)
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your critic content and track performance</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/studio/blog/new">
          <Button className="w-full h-20 text-lg">
            <Plus className="mr-2 h-5 w-5" />
            New Blog Post
          </Button>
        </Link>
        <Link href="/studio/recommendations">
          <Button variant="outline" className="w-full h-20 text-lg">
            <Star className="mr-2 h-5 w-5" />
            Add Recommendation
          </Button>
        </Link>
        <Link href="/studio/affiliate">
          <Button variant="outline" className="w-full h-20 text-lg">
            <LinkIcon className="mr-2 h-5 w-5" />
            Create Affiliate Link
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Blog Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.blog_posts.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.blog_posts.published || 0} published, {stats?.blog_posts.drafts || 0} drafts
            </p>
            <Link href="/studio/blog">
              <Button variant="link" className="px-0 mt-2">
                Manage posts →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.recommendations.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Movie recommendations</p>
            <Link href="/studio/recommendations">
              <Button variant="link" className="px-0 mt-2">
                View all →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Pinned Content */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pinned Content</CardTitle>
            <Pin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pinned_content.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Max 5 items</p>
            <Link href="/studio/pinned">
              <Button variant="link" className="px-0 mt-2">
                Manage pins →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Affiliate Links */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affiliate Links</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.affiliate_links.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.affiliate_links.active || 0} active
            </p>
            <Link href="/studio/affiliate">
              <Button variant="link" className="px-0 mt-2">
                Manage links →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Brand Deals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brand Deals</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.brand_deals.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.brand_deals.active || 0} active
            </p>
            <Link href="/studio/deals">
              <Button variant="link" className="px-0 mt-2">
                View deals →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Coming Soon</div>
            <p className="text-xs text-muted-foreground mt-1">Track your performance</p>
            <Link href="/studio/analytics">
              <Button variant="link" className="px-0 mt-2">
                View analytics →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest content updates</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activity to display</p>
        </CardContent>
      </Card>
    </div>
  )
}

