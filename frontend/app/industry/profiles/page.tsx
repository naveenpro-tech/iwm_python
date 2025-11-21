"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, Grid, List, CheckCircle, Film, Award, Users, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample data for demonstration
const mockProfiles = [
  {
    id: "prof_001",
    name: "Christopher Nolan",
    role: "Director",
    profilePhoto: "/christopher-nolan.png",
    coverPhoto: "/dramatic-film-set.png",
    isVerified: true,
    isOfficial: true,
    company: "Syncopy Films",
    location: "Los Angeles, CA",
    followers: 245000,
    projects: 12,
    awards: 24,
    recentProjects: ["Oppenheimer", "Tenet", "Dunkirk"],
  },
  {
    id: "prof_002",
    name: "Greta Gerwig",
    role: "Director, Writer, Actor",
    profilePhoto: "/woman-portrait.png",
    coverPhoto: "/film-set.png",
    isVerified: true,
    isOfficial: true,
    company: "Independent",
    location: "New York, NY",
    followers: 178000,
    projects: 8,
    awards: 15,
    recentProjects: ["Barbie", "Little Women", "Lady Bird"],
  },
  {
    id: "prof_003",
    name: "Denis Villeneuve",
    role: "Director, Writer",
    profilePhoto: "/thoughtful-man-portrait.png",
    coverPhoto: "/desert-dunes-cinematic.png",
    isVerified: true,
    isOfficial: false,
    company: "Independent",
    location: "Montreal, Canada",
    followers: 195000,
    projects: 10,
    awards: 18,
    recentProjects: ["Dune: Part Two", "Dune", "Blade Runner 2049"],
  },
  {
    id: "prof_004",
    name: "Roger Deakins",
    role: "Cinematographer",
    profilePhoto: "/older-cinematographer.png",
    coverPhoto: "/cinematic-lighting.png",
    isVerified: true,
    isOfficial: true,
    company: "Independent",
    location: "Devon, UK",
    followers: 120000,
    projects: 25,
    awards: 32,
    recentProjects: ["Empire of Light", "1917", "Blade Runner 2049"],
  },
  {
    id: "prof_005",
    name: "Ava DuVernay",
    role: "Director, Producer",
    profilePhoto: "/female-director-portrait.png",
    coverPhoto: "/film-production-set.png",
    isVerified: true,
    isOfficial: true,
    company: "ARRAY",
    location: "Los Angeles, CA",
    followers: 165000,
    projects: 9,
    awards: 14,
    recentProjects: ["Origin", "When They See Us", "Selma"],
  },
  {
    id: "prof_006",
    name: "Hans Zimmer",
    role: "Composer",
    profilePhoto: "/classical-composer.png",
    coverPhoto: "/orchestra-recording-session.png",
    isVerified: true,
    isOfficial: false,
    company: "Remote Control Productions",
    location: "Los Angeles, CA",
    followers: 210000,
    projects: 30,
    awards: 28,
    recentProjects: ["Dune: Part Two", "No Time to Die", "Wonder Woman 1984"],
  },
]

export default function IndustryProfilesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  // Filter profiles based on search query and category
  const filteredProfiles = mockProfiles.filter((profile) => {
    const matchesSearch =
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.company.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      categoryFilter === "all" ||
      (categoryFilter === "directors" && profile.role.toLowerCase().includes("director")) ||
      (categoryFilter === "actors" && profile.role.toLowerCase().includes("actor")) ||
      (categoryFilter === "writers" && profile.role.toLowerCase().includes("writer")) ||
      (categoryFilter === "cinematographers" && profile.role.toLowerCase().includes("cinematographer")) ||
      (categoryFilter === "composers" && profile.role.toLowerCase().includes("composer"))

    return matchesSearch && matchesCategory
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#E0E0E0] mb-2">Industry Professionals</h1>
          <p className="text-[#A0A0A0]">Connect with verified industry professionals from around the world</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search industry professionals..."
                className="pl-10 bg-[#282828] border-[#3A3A3A] focus:border-[#00BFFF]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
              >
                <Filter className="h-4 w-4 mr-1" />
                Filters
                {showFilters ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
              </Button>
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`border-[#3A3A3A] ${viewMode === "grid" ? "bg-[#3A3A3A]" : "hover:bg-[#282828]"}`}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`border-[#3A3A3A] ${viewMode === "list" ? "bg-[#3A3A3A]" : "hover:bg-[#282828]"}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Card className="bg-[#282828] border-[#3A3A3A]">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-[#E0E0E0] mb-2">Category</h4>
                      <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
                        <TabsList className="bg-[#1A1A1A] p-1 h-auto">
                          <TabsTrigger
                            value="all"
                            className={cn(
                              "px-3 py-1.5 text-xs rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
                              "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
                            )}
                          >
                            All
                          </TabsTrigger>
                          <TabsTrigger
                            value="directors"
                            className={cn(
                              "px-3 py-1.5 text-xs rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
                              "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
                            )}
                          >
                            Directors
                          </TabsTrigger>
                          <TabsTrigger
                            value="actors"
                            className={cn(
                              "px-3 py-1.5 text-xs rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
                              "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
                            )}
                          >
                            Actors
                          </TabsTrigger>
                          <TabsTrigger
                            value="writers"
                            className={cn(
                              "px-3 py-1.5 text-xs rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
                              "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
                            )}
                          >
                            Writers
                          </TabsTrigger>
                          <TabsTrigger
                            value="cinematographers"
                            className={cn(
                              "px-3 py-1.5 text-xs rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
                              "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
                            )}
                          >
                            Cinematographers
                          </TabsTrigger>
                          <TabsTrigger
                            value="composers"
                            className={cn(
                              "px-3 py-1.5 text-xs rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
                              "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
                            )}
                          >
                            Composers
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[#E0E0E0] mb-2">Verification Status</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-[#3A3A3A] hover:bg-[#4A4A4A] cursor-pointer">All</Badge>
                        <Badge className="bg-[#00BFFF] text-black hover:bg-[#0099CC] cursor-pointer">
                          Verified Only
                        </Badge>
                        <Badge className="bg-[#3A3A3A] hover:bg-[#4A4A4A] cursor-pointer">Official Accounts</Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[#E0E0E0] mb-2">Sort By</h4>
                      <select className="w-full bg-[#1A1A1A] border border-[#3A3A3A] text-[#E0E0E0] rounded-md px-3 py-2 text-sm">
                        <option value="relevance">Relevance</option>
                        <option value="followers">Most Followers</option>
                        <option value="projects">Most Projects</option>
                        <option value="awards">Most Awards</option>
                        <option value="recent">Recently Active</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Profiles Display */}
        {filteredProfiles.length > 0 ? (
          viewMode === "grid" ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {filteredProfiles.map((profile) => (
                <motion.div key={profile.id} variants={itemVariants}>
                  <Link href={`/industry/profile/${profile.id}`}>
                    <Card className="bg-[#282828] border-[#3A3A3A] overflow-hidden hover:border-[#00BFFF] transition-colors cursor-pointer h-full">
                      <div className="relative h-32">
                        <Image
                          src={profile.coverPhoto || "/placeholder.svg"}
                          alt={`${profile.name} cover`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#282828] to-transparent" />
                      </div>
                      <CardContent className="p-4 relative -mt-16">
                        <div className="flex items-end mb-3">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#282828] bg-[#1A1A1A] z-10">
                            <Image
                              src={profile.profilePhoto || "/placeholder.svg"}
                              alt={profile.name}
                              width={80}
                              height={80}
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-auto flex gap-1">
                            {profile.isVerified && (
                              <Badge className="bg-[#00BFFF] text-black">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            {profile.isOfficial && <Badge className="bg-[#FFD700] text-black">Official</Badge>}
                          </div>
                        </div>
                        <h3 className="font-bold text-[#E0E0E0] text-lg">{profile.name}</h3>
                        <p className="text-[#A0A0A0] text-sm">{profile.role}</p>
                        <p className="text-[#A0A0A0] text-xs mt-1">{profile.location}</p>

                        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                          <div>
                            <p className="text-[#E0E0E0] font-semibold">
                              {profile.followers >= 1000
                                ? `${(profile.followers / 1000).toFixed(1)}K`
                                : profile.followers}
                            </p>
                            <p className="text-[#A0A0A0] text-xs">Followers</p>
                          </div>
                          <div>
                            <p className="text-[#E0E0E0] font-semibold">{profile.projects}</p>
                            <p className="text-[  font-semibold">{profile.projects}</p>
                            <p className="text-[#A0A0A0] text-xs">Projects</p>
                          </div>
                          <div>
                            <p className="text-[#E0E0E0] font-semibold">{profile.awards}</p>
                            <p className="text-[#A0A0A0] text-xs">Awards</p>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[#3A3A3A]">
                          <p className="text-xs text-[#A0A0A0] mb-1">Recent Projects:</p>
                          <div className="flex flex-wrap gap-1">
                            {profile.recentProjects.map((project, index) => (
                              <Badge key={index} variant="outline" className="border-[#3A3A3A] text-[#A0A0A0]">
                                {project}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div className="space-y-4" initial="hidden" animate="visible" variants={containerVariants}>
              {filteredProfiles.map((profile) => (
                <motion.div key={profile.id} variants={itemVariants}>
                  <Link href={`/industry/profile/${profile.id}`}>
                    <Card className="bg-[#282828] border-[#3A3A3A] hover:border-[#00BFFF] transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={profile.profilePhoto || "/placeholder.svg"}
                              alt={profile.name}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center">
                                  <h3 className="font-bold text-[#E0E0E0]">{profile.name}</h3>
                                  {profile.isVerified && <CheckCircle className="h-3 w-3 ml-1 text-[#00BFFF]" />}
                                  {profile.isOfficial && (
                                    <Badge className="ml-2 bg-[#FFD700] text-black text-xs">Official</Badge>
                                  )}
                                </div>
                                <p className="text-[#A0A0A0] text-sm">{profile.role}</p>
                                <p className="text-[#A0A0A0] text-xs mt-1">{profile.location}</p>
                              </div>
                              <div className="flex items-center gap-4 text-center">
                                <div>
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 text-[#A0A0A0] mr-1" />
                                    <p className="text-[#E0E0E0] font-semibold">
                                      {profile.followers >= 1000
                                        ? `${(profile.followers / 1000).toFixed(1)}K`
                                        : profile.followers}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center">
                                    <Film className="h-4 w-4 text-[#A0A0A0] mr-1" />
                                    <p className="text-[#E0E0E0] font-semibold">{profile.projects}</p>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center">
                                    <Award className="h-4 w-4 text-[#A0A0A0] mr-1" />
                                    <p className="text-[#E0E0E0] font-semibold">{profile.awards}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1">
                                {profile.recentProjects.map((project, index) => (
                                  <Badge key={index} variant="outline" className="border-[#3A3A3A] text-[#A0A0A0]">
                                    {project}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-16 w-16 text-[#3A3A3A] mb-4" />
            <h3 className="text-xl font-medium text-[#E0E0E0]">No Professionals Found</h3>
            <p className="text-[#A0A0A0] mt-2 max-w-md">
              {searchQuery
                ? `No professionals matching "${searchQuery}"`
                : "Try adjusting your filters or search query to find industry professionals."}
            </p>
            {searchQuery && (
              <Button className="mt-4 bg-[#00BFFF] hover:bg-[#0099CC] text-black" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredProfiles.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
                Previous
              </Button>
              <Button variant="outline" size="sm" className="border-[#3A3A3A] bg-[#3A3A3A] text-[#E0E0E0]">
                1
              </Button>
              <Button variant="outline" size="sm" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
                2
              </Button>
              <Button variant="outline" size="sm" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
                3
              </Button>
              <span className="text-[#A0A0A0]">...</span>
              <Button variant="outline" size="sm" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
                10
              </Button>
              <Button variant="outline" size="sm" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
