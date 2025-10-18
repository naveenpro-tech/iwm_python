"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Film, Search, Filter, Grid3X3, List, Users, BadgeCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import type { IndustryProfessionalProfile } from "../types"

// Mock data for industry professionals
const mockProfessionals: IndustryProfessionalProfile[] = [
  {
    id: "prof-1",
    userId: "user-1",
    name: "Christopher Nolan",
    officialTitle: "Film Director & Producer",
    companyAffiliation: ["Warner Bros. Pictures", "Syncopy Films"],
    bio: "Christopher Nolan is a British-American film director, producer, and screenwriter known for his distinctive directorial style and complex, nonlinear storytelling.",
    profilePhoto: "/christopher-nolan.png",
    coverPhoto: "/dark-blue-city-skyline.png",
    verificationStatus: "verified",
    verificationDocuments: [],
    verificationDate: new Date("2023-01-15"),
    isOfficial: true,
    filmography: [
      {
        id: "film-1",
        title: "Oppenheimer",
        role: "Director",
        year: 2023,
        posterUrl: "/oppenheimer-inspired-poster.png",
      },
      {
        id: "film-2",
        title: "Tenet",
        role: "Director",
        year: 2020,
      },
      {
        id: "film-3",
        title: "Dunkirk",
        role: "Director",
        year: 2017,
        posterUrl: "/dunkirk-poster.png",
      },
    ],
    awards: [
      {
        id: "award-1",
        name: "Academy Award",
        category: "Best Director",
        year: 2023,
        project: "Oppenheimer",
        isNomination: false,
      },
    ],
    pressKit: [
      {
        id: "press-1",
        type: "interview",
        title: "The Mind Behind Oppenheimer",
        source: "Film Quarterly",
        url: "https://example.com/nolan-interview",
        date: new Date("2023-07-20"),
        thumbnail: "/christopher-nolan-interview.png",
      },
    ],
    socialMedia: [
      {
        platform: "twitter",
        url: "https://twitter.com/example",
        handle: "@ChristopherNolan",
      },
    ],
    privacySettings: {
      profileVisibility: "public",
      contactVisibility: "industry-only",
      filmographyVisibility: "public",
      awardsVisibility: "public",
      pressKitVisibility: "public",
      socialMediaVisibility: "public",
      allowMessages: "industry-only",
      allowQuestions: true,
    },
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-08-15"),
    followerCount: 250000,
    viewCount: 1200000,
    monthlyViews: 85000,
  },
  {
    id: "prof-2",
    userId: "user-2",
    name: "Greta Gerwig",
    officialTitle: "Film Director & Screenwriter",
    companyAffiliation: ["Warner Bros. Pictures"],
    bio: "Greta Gerwig is an American actress, screenwriter, and director known for her work on Lady Bird and Barbie.",
    profilePhoto: "/woman-director-portrait.png",
    coverPhoto: "/colorful-film-set.png",
    verificationStatus: "verified",
    verificationDocuments: [],
    verificationDate: new Date("2023-02-20"),
    isOfficial: true,
    filmography: [
      {
        id: "film-1",
        title: "Barbie",
        role: "Director",
        year: 2023,
        posterUrl: "/barbie-movie-poster.png",
      },
    ],
    awards: [],
    pressKit: [],
    socialMedia: [],
    privacySettings: {
      profileVisibility: "public",
      contactVisibility: "industry-only",
      filmographyVisibility: "public",
      awardsVisibility: "public",
      pressKitVisibility: "public",
      socialMediaVisibility: "public",
      allowMessages: "industry-only",
      allowQuestions: true,
    },
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2023-08-10"),
    followerCount: 180000,
    viewCount: 900000,
    monthlyViews: 70000,
  },
  {
    id: "prof-3",
    userId: "user-3",
    name: "Roger Deakins",
    officialTitle: "Cinematographer",
    companyAffiliation: [],
    bio: "Roger Deakins is an English cinematographer, best known for his work on the films of the Coen brothers, Sam Mendes, and Denis Villeneuve.",
    profilePhoto: "/older-cinematographer.png",
    coverPhoto: "/film-camera-equipment.png",
    verificationStatus: "verified",
    verificationDocuments: [],
    verificationDate: new Date("2023-03-10"),
    isOfficial: false,
    filmography: [
      {
        id: "film-1",
        title: "1917",
        role: "Cinematographer",
        year: 2019,
      },
    ],
    awards: [],
    pressKit: [],
    socialMedia: [],
    privacySettings: {
      profileVisibility: "public",
      contactVisibility: "industry-only",
      filmographyVisibility: "public",
      awardsVisibility: "public",
      pressKitVisibility: "public",
      socialMediaVisibility: "public",
      allowMessages: "industry-only",
      allowQuestions: false,
    },
    createdAt: new Date("2023-03-01"),
    updatedAt: new Date("2023-07-15"),
    followerCount: 120000,
    viewCount: 600000,
    monthlyViews: 45000,
  },
  {
    id: "prof-4",
    userId: "user-4",
    name: "Cillian Murphy",
    officialTitle: "Actor",
    companyAffiliation: [],
    bio: "Cillian Murphy is an Irish actor known for his roles in 28 Days Later, Inception, Peaky Blinders, and Oppenheimer.",
    profilePhoto: "/cillian-murphy-portrait.png",
    coverPhoto: "/dramatic-actor-background.png",
    verificationStatus: "verified",
    verificationDocuments: [],
    verificationDate: new Date("2023-04-05"),
    isOfficial: true,
    filmography: [
      {
        id: "film-1",
        title: "Oppenheimer",
        role: "Lead Actor (J. Robert Oppenheimer)",
        year: 2023,
        posterUrl: "/oppenheimer-inspired-poster.png",
      },
    ],
    awards: [],
    pressKit: [],
    socialMedia: [],
    privacySettings: {
      profileVisibility: "public",
      contactVisibility: "industry-only",
      filmographyVisibility: "public",
      awardsVisibility: "public",
      pressKitVisibility: "public",
      socialMediaVisibility: "public",
      allowMessages: "industry-only",
      allowQuestions: true,
    },
    createdAt: new Date("2023-04-01"),
    updatedAt: new Date("2023-08-01"),
    followerCount: 320000,
    viewCount: 1500000,
    monthlyViews: 95000,
  },
  {
    id: "prof-5",
    userId: "user-5",
    name: "Denis Villeneuve",
    officialTitle: "Film Director",
    companyAffiliation: ["Legendary Pictures"],
    bio: "Denis Villeneuve is a Canadian filmmaker known for his work on Arrival, Blade Runner 2049, and Dune.",
    profilePhoto: "/serious-director.png",
    coverPhoto: "/desert-dunes-cinematic.png",
    verificationStatus: "verified",
    verificationDocuments: [],
    verificationDate: new Date("2023-05-12"),
    isOfficial: false,
    filmography: [
      {
        id: "film-1",
        title: "Dune",
        role: "Director",
        year: 2021,
        posterUrl: "/dune-part-two-poster.png",
      },
    ],
    awards: [],
    pressKit: [],
    socialMedia: [],
    privacySettings: {
      profileVisibility: "public",
      contactVisibility: "industry-only",
      filmographyVisibility: "public",
      awardsVisibility: "public",
      pressKitVisibility: "public",
      socialMediaVisibility: "public",
      allowMessages: "industry-only",
      allowQuestions: false,
    },
    createdAt: new Date("2023-05-01"),
    updatedAt: new Date("2023-07-20"),
    followerCount: 180000,
    viewCount: 850000,
    monthlyViews: 60000,
  },
  {
    id: "prof-6",
    userId: "user-6",
    name: "Margot Robbie",
    officialTitle: "Actor & Producer",
    companyAffiliation: ["LuckyChap Entertainment"],
    bio: "Margot Robbie is an Australian actress and producer known for her roles in The Wolf of Wall Street, I, Tonya, and Barbie.",
    profilePhoto: "/placeholder.svg?height=400&width=400&query=blonde+actress+portrait",
    coverPhoto: "/placeholder.svg?height=400&width=1200&query=pink+barbie+aesthetic",
    verificationStatus: "verified",
    verificationDocuments: [],
    verificationDate: new Date("2023-06-08"),
    isOfficial: true,
    filmography: [
      {
        id: "film-1",
        title: "Barbie",
        role: "Lead Actor (Barbie)",
        year: 2023,
        posterUrl: "/barbie-movie-poster.png",
      },
    ],
    awards: [],
    pressKit: [],
    socialMedia: [],
    privacySettings: {
      profileVisibility: "public",
      contactVisibility: "industry-only",
      filmographyVisibility: "public",
      awardsVisibility: "public",
      pressKitVisibility: "public",
      socialMediaVisibility: "public",
      allowMessages: "industry-only",
      allowQuestions: true,
    },
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2023-08-05"),
    followerCount: 420000,
    viewCount: 1800000,
    monthlyViews: 120000,
  },
]

interface IndustryProfessionalsGridProps {
  initialProfessionals?: IndustryProfessionalProfile[]
}

export default function IndustryProfessionalsGrid({ initialProfessionals }: IndustryProfessionalsGridProps) {
  const [professionals, setProfessionals] = useState<IndustryProfessionalProfile[]>(
    initialProfessionals || mockProfessionals,
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [verificationFilter, setVerificationFilter] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // In a real app, this would be an API call with filters
    setIsLoading(true)

    // Simulate API call delay
    const timer = setTimeout(() => {
      let filtered = mockProfessionals

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(
          (prof) =>
            prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prof.officialTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prof.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prof.companyAffiliation.some((company) => company.toLowerCase().includes(searchQuery.toLowerCase())),
        )
      }

      // Apply role filter
      if (roleFilter !== "all") {
        filtered = filtered.filter((prof) => prof.officialTitle.toLowerCase().includes(roleFilter.toLowerCase()))
      }

      // Apply verification filter
      if (verificationFilter !== "all") {
        if (verificationFilter === "verified") {
          filtered = filtered.filter((prof) => prof.verificationStatus === "verified")
        } else if (verificationFilter === "official") {
          filtered = filtered.filter((prof) => prof.isOfficial)
        }
      }

      // Apply tab filter
      if (activeTab !== "all") {
        if (activeTab === "directors") {
          filtered = filtered.filter((prof) => prof.officialTitle.toLowerCase().includes("director"))
        } else if (activeTab === "cinematographers") {
          filtered = filtered.filter((prof) => prof.officialTitle.toLowerCase().includes("cinematographer"))
        } else if (activeTab === "producers") {
          filtered = filtered.filter((prof) => prof.officialTitle.toLowerCase().includes("producer"))
        } else if (activeTab === "writers") {
          filtered = filtered.filter(
            (prof) =>
              prof.officialTitle.toLowerCase().includes("writer") ||
              prof.officialTitle.toLowerCase().includes("screenwriter"),
          )
        }
      }

      // Apply sorting
      if (sortBy === "popular") {
        filtered = [...filtered].sort((a, b) => b.followerCount - a.followerCount)
      } else if (sortBy === "recent") {
        filtered = [...filtered].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      } else if (sortBy === "name") {
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
      }

      setProfessionals(filtered)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, roleFilter, verificationFilter, sortBy, activeTab, initialProfessionals])

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "director", label: "Directors" },
    { value: "producer", label: "Producers" },
    { value: "cinematographer", label: "Cinematographers" },
    { value: "writer", label: "Writers" },
    { value: "actor", label: "Actors" },
  ]

  const verificationOptions = [
    { value: "all", label: "All Professionals" },
    { value: "verified", label: "Verified Only" },
    { value: "official", label: "Official Accounts" },
  ]

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "recent", label: "Recently Joined" },
    { value: "name", label: "Alphabetical" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Industry Professionals</h1>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search professionals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className={isFilterOpen ? "bg-muted" : ""}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4" />
          </Button>
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className={viewMode === "grid" ? "bg-muted" : ""}
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={viewMode === "list" ? "bg-muted" : ""}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <label className="text-sm font-medium mb-1 block">Role</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Verification</label>
              <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by verification" />
                </SelectTrigger>
                <SelectContent>
                  {verificationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="all" className="flex-1 md:flex-none">
            All
          </TabsTrigger>
          <TabsTrigger value="directors" className="flex-1 md:flex-none">
            Directors
          </TabsTrigger>
          <TabsTrigger value="cinematographers" className="flex-1 md:flex-none">
            Cinematographers
          </TabsTrigger>
          <TabsTrigger value="producers" className="flex-1 md:flex-none">
            Producers
          </TabsTrigger>
          <TabsTrigger value="writers" className="flex-1 md:flex-none">
            Writers
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden h-full">
                  <div className="relative h-32 bg-muted animate-pulse"></div>
                  <CardContent className="pt-0">
                    <div className="relative -mt-12 flex flex-col items-center">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-background bg-muted animate-pulse"></div>
                      <div className="mt-2 text-center">
                        <div className="h-5 bg-muted animate-pulse rounded w-32 mx-auto mb-2"></div>
                        <div className="h-4 bg-muted animate-pulse rounded w-24 mx-auto"></div>
                        <div className="flex flex-wrap justify-center gap-1 mt-2">
                          <div className="h-6 bg-muted animate-pulse rounded w-16"></div>
                          <div className="h-6 bg-muted animate-pulse rounded w-20"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
                        <div className="h-4 bg-muted animate-pulse rounded w-12"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : professionals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center py-12"
            >
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No professionals found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your filters or search query</p>
              {(searchQuery || roleFilter !== "all" || verificationFilter !== "all" || activeTab !== "all") && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("")
                    setRoleFilter("all")
                    setVerificationFilter("all")
                    setActiveTab("all")
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </motion.div>
          ) : viewMode === "grid" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {professionals.map((professional) => (
                <Link href={`/industry/profile/${professional.id}`} key={professional.id}>
                  <Card className="overflow-hidden h-full hover:border-primary transition-colors cursor-pointer">
                    <div className="relative h-32 bg-muted">
                      <Image
                        src={
                          professional.coverPhoto || "/placeholder.svg?height=400&width=1200&query=cinematic+background"
                        }
                        alt={`${professional.name} cover`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                    <CardContent className="pt-0">
                      <div className="relative -mt-12 flex flex-col items-center">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-background">
                          <Image
                            src={professional.profilePhoto || "/placeholder.svg?height=200&width=200&query=portrait"}
                            alt={professional.name}
                            fill
                            className="object-cover"
                          />
                          {professional.isOfficial && (
                            <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1">
                              <BadgeCheck className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <h3 className="font-semibold">{professional.name}</h3>
                            {professional.verificationStatus === "verified" && (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{professional.officialTitle}</p>
                          <div className="flex flex-wrap justify-center gap-1 mt-2">
                            {professional.companyAffiliation?.slice(0, 2).map((company, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {company}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{professional.followerCount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Film className="h-3 w-3" />
                            <span>{professional.filmography?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {professionals.map((professional) => (
                <Link href={`/industry/profile/${professional.id}`} key={professional.id}>
                  <Card className="hover:border-primary transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={professional.profilePhoto || "/placeholder.svg?height=200&width=200&query=portrait"}
                            alt={professional.name}
                            fill
                            className="object-cover"
                          />
                          {professional.isOfficial && (
                            <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-0.5">
                              <BadgeCheck className="h-3 w-3" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <h3 className="font-semibold">{professional.name}</h3>
                            {professional.verificationStatus === "verified" && (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{professional.officialTitle}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {professional.companyAffiliation?.slice(0, 2).map((company, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {company}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{professional.followerCount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Film className="h-3 w-3" />
                            <span>{professional.filmography?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </motion.div>
          )}
        </TabsContent>

        {/* Other tabs would have similar content but filtered by role */}
        <TabsContent value="directors" className="mt-6">
          {/* Similar content but filtered for directors */}
        </TabsContent>
        <TabsContent value="cinematographers" className="mt-6">
          {/* Similar content but filtered for cinematographers */}
        </TabsContent>
        <TabsContent value="producers" className="mt-6">
          {/* Similar content but filtered for producers */}
        </TabsContent>
        <TabsContent value="writers" className="mt-6">
          {/* Similar content but filtered for writers */}
        </TabsContent>
      </Tabs>

      {!isLoading && professionals.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button variant="outline">Load More</Button>
        </div>
      )}
    </div>
  )
}
