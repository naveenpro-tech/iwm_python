"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Globe, Filter, Search } from "lucide-react"
import { FestivalsHero } from "@/components/festivals/festivals-hero"
import { FestivalMap } from "@/components/festivals/festival-map"
import { FeaturedFestivals } from "@/components/festivals/featured-festivals"
import { FestivalCalendar } from "@/components/festivals/festival-calendar"
import { FestivalCategories } from "@/components/festivals/festival-categories"
import { FestivalNewsFeed } from "@/components/festivals/festival-news-feed"
import { FestivalsPageSkeleton } from "@/components/festivals/festivals-page-skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FestivalsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [viewMode, setViewMode] = useState<"map" | "calendar" | "list">("map")

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <FestivalsPageSkeleton />
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <FestivalsHero />

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search festivals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#282828] border-gray-700 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                onClick={() => setViewMode("map")}
                className="gap-2"
              >
                <Globe className="h-4 w-4" />
                Map View
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                onClick={() => setViewMode("calendar")}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Calendar
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                List View
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-[#282828] border border-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="news">Festival News</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-12">
            {viewMode === "map" && <FestivalMap />}
            {viewMode === "calendar" && <FestivalCalendar />}
            {viewMode === "list" && <FeaturedFestivals viewMode="list" />}
          </TabsContent>

          <TabsContent value="upcoming">
            <FestivalCalendar showOnlyUpcoming />
          </TabsContent>

          <TabsContent value="categories">
            <FestivalCategories />
          </TabsContent>

          <TabsContent value="news">
            <FestivalNewsFeed />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
