"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, UserPlus, UserCheck, TrendingUp, Award, Filter } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Critic {
  username: string
  name: string
  avatar: string
  verified: boolean
  followers: number
  reviewCount: number
  bio: string
  userIsFollowing?: boolean
}

export default function CriticsDirectoryPage() {
  const [critics, setCritics] = useState<Critic[]>([])
  const [filteredCritics, setFilteredCritics] = useState<Critic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"followers" | "reviews" | "newest" | "name">("followers")

  useEffect(() => {
    const fetchCritics = async () => {
      try {
        // Always fetch from backend - no mock data fallback
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/v1/critics?is_verified=true&limit=100`)

        if (!response.ok) {
          throw new Error(`Failed to fetch critics: ${response.statusText}`)
        }

        const data = await response.json()

        // Map backend response to frontend Critic interface
        const mappedCritics: Critic[] = data.map((critic: any) => ({
          username: critic.username,
          name: critic.display_name,
          avatar: critic.logo_url || "/default-avatar.png",
          verified: critic.is_verified,
          followers: critic.follower_count || 0,
          reviewCount: critic.total_reviews || 0,
          bio: critic.bio || "",
          userIsFollowing: false, // TODO: Implement follow status check
        }))

        setCritics(mappedCritics)
        setFilteredCritics(mappedCritics)
      } catch (err) {
        console.error("Failed to fetch critics:", err)
        // Show error state instead of mock data
        setCritics([])
        setFilteredCritics([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCritics()
  }, [])

  useEffect(() => {
    let filtered = [...critics]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "followers":
          return b.followers - a.followers
        case "reviews":
          return b.reviewCount - a.reviewCount
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
          return 0 // Would use joinedDate in real implementation
        default:
          return 0
      }
    })

    setFilteredCritics(filtered)
  }, [searchQuery, sortBy, critics])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-[#282828] rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold font-inter mb-4 bg-gradient-to-r from-[#00BFFF] to-[#FFD700] bg-clip-text text-transparent">
            Verified Critics
          </h1>
          <p className="text-xl text-[#A0A0A0]">
            Discover expert film critics and their reviews
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0A0A0]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search critics by name..."
              className="pl-10 bg-[#282828] border-[#3A3A3A] text-[#E0E0E0] placeholder:text-[#A0A0A0]"
            />
          </div>
          <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
            <SelectTrigger className="w-full md:w-48 bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="followers">Most Followers</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="name">A-Z</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Critics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCritics.map((critic, index) => (
            <CriticCard key={critic.username} critic={critic} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {filteredCritics.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-xl text-[#E0E0E0] mb-2">
              {searchQuery ? "No critics found matching your search." : "No verified critics yet."}
            </p>
            <p className="text-[#A0A0A0]">
              {searchQuery ? "Try a different search term." : "Be the first to become a verified critic!"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function CriticCard({ critic, index }: { critic: Critic; index: number }) {
  const [isFollowing, setIsFollowing] = useState(critic.userIsFollowing || false)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    // API call would go here
  }

  const formatNumber = (num: number | undefined) => {
    if (!num && num !== 0) return "0"
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
      className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-[#3A3A3A] rounded-xl p-6 hover:border-[#00BFFF] transition-all group"
    >
      <Link href={`/critic/${critic.username}`} className="block">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-[#00BFFF] group-hover:border-[#FFD700] transition-colors"
              style={{ backgroundImage: `url(${critic.avatar})` }}
            />
            {critic.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#00BFFF] rounded-full border-2 border-[#1A1A1A] flex items-center justify-center">
                <svg className="w-3 h-3 text-[#1A1A1A]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#E0E0E0] group-hover:text-[#00BFFF] transition-colors">
              {critic.name}
            </h3>
            <p className="text-sm text-[#A0A0A0]">@{critic.username}</p>
          </div>
        </div>

        <p className="text-sm text-[#A0A0A0] mb-4 line-clamp-2">{critic.bio}</p>

        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1 text-[#00BFFF]">
            <TrendingUp className="w-4 h-4" />
            <span>{formatNumber(critic.followers)} followers</span>
          </div>
          <div className="flex items-center gap-1 text-[#FFD700]">
            <Award className="w-4 h-4" />
            <span>{critic.reviewCount} reviews</span>
          </div>
        </div>
      </Link>

      <Button
        onClick={handleFollow}
        className={`w-full ${
          isFollowing
            ? "bg-[#282828] hover:bg-[#3A3A3A] text-[#E0E0E0] border border-[#3A3A3A]"
            : "bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A]"
        }`}
      >
        {isFollowing ? (
          <>
            <UserCheck className="w-4 h-4 mr-2" />
            Following
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4 mr-2" />
            Follow
          </>
        )}
      </Button>
    </motion.div>
  )
}

