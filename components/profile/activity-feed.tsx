"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Film, Star, Plus, Clock, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ActivityItem {
  id: string
  type: "review" | "watchlist" | "watched" | "favorite" | "pulse"
  timestamp: string
  movie?: {
    id: string
    title: string
    posterUrl: string
    year: string
  }
  rating?: number
  content?: string
}

interface ActivityFeedProps {
  userId: string
}

export function ActivityFeed({ userId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch user activities
    const fetchActivities = async () => {
      setIsLoading(true)

      // Mock data - in a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockActivities: ActivityItem[] = [
        {
          id: "a1",
          type: "review",
          timestamp: "2 hours ago",
          movie: {
            id: "m1",
            title: "Dune: Part Two",
            posterUrl: "/dune-part-two-poster.png",
            year: "2024",
          },
          rating: 9,
          content:
            "Denis Villeneuve has outdone himself with this epic conclusion. The visual effects are breathtaking, and the performances are stellar across the board. A masterclass in sci-fi filmmaking.",
        },
        {
          id: "a2",
          type: "watchlist",
          timestamp: "Yesterday",
          movie: {
            id: "m2",
            title: "Challengers",
            posterUrl: "/challengers-poster.png",
            year: "2024",
          },
        },
        {
          id: "a3",
          type: "watched",
          timestamp: "3 days ago",
          movie: {
            id: "m3",
            title: "Oppenheimer",
            posterUrl: "/oppenheimer-inspired-poster.png",
            year: "2023",
          },
        },
        {
          id: "a4",
          type: "favorite",
          timestamp: "1 week ago",
          movie: {
            id: "m4",
            title: "Poor Things",
            posterUrl: "/poor-things-poster.png",
            year: "2023",
          },
        },
        {
          id: "a5",
          type: "pulse",
          timestamp: "1 week ago",
          content:
            "Just watched Barbie and Oppenheimer back to back. What a contrast! Both excellent in completely different ways. #Barbenheimer",
        },
      ]

      setActivities(mockActivities)
      setIsLoading(false)
    }

    fetchActivities()
  }, [userId])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "review":
        return <Star className="w-5 h-5 text-[#FFD700]" />
      case "watchlist":
        return <Plus className="w-5 h-5 text-[#00BFFF]" />
      case "watched":
        return <Clock className="w-5 h-5 text-[#A0A0A0]" />
      case "favorite":
        return <Heart className="w-5 h-5 text-[#FF4D6D]" />
      case "pulse":
        return <Film className="w-5 h-5 text-[#00BFFF]" />
      default:
        return <Film className="w-5 h-5 text-[#A0A0A0]" />
    }
  }

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case "review":
        return `reviewed ${activity.movie?.title}`
      case "watchlist":
        return `added ${activity.movie?.title} to watchlist`
      case "watched":
        return `watched ${activity.movie?.title}`
      case "favorite":
        return `added ${activity.movie?.title} to favorites`
      case "pulse":
        return `posted a pulse`
      default:
        return "did something"
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  if (isLoading) {
    return (
      <div className="bg-[#282828] rounded-lg p-6">
        <h2 className="text-xl font-inter font-medium text-[#E0E0E0] mb-4">Activity Feed</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#00BFFF] animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#282828] rounded-lg p-6">
      <h2 className="text-xl font-inter font-medium text-[#E0E0E0] mb-4">Activity Feed</h2>

      {activities.length === 0 ? (
        <p className="text-[#A0A0A0] font-dmsans text-center py-8">No activity yet</p>
      ) : (
        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
          {activities.map((activity) => (
            <motion.div key={activity.id} className="flex" variants={itemVariants}>
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 rounded-full bg-[#3A3A3A] flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center">
                  <p className="font-dmsans text-[#E0E0E0]">
                    <span className="font-medium">You</span> {getActivityText(activity)}
                  </p>
                  <span className="ml-2 text-[#A0A0A0] text-sm">{activity.timestamp}</span>
                </div>

                {activity.type === "review" && activity.content && (
                  <div className="mt-2 p-3 bg-[#1A1A1A] rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < (activity.rating || 0) ? "text-[#FFD700] fill-[#FFD700]" : "text-[#3A3A3A]"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[#E0E0E0] text-sm font-dmsans">{activity.content}</p>
                  </div>
                )}

                {activity.type === "pulse" && activity.content && (
                  <div className="mt-2 p-3 bg-[#1A1A1A] rounded-lg">
                    <p className="text-[#E0E0E0] text-sm font-dmsans">{activity.content}</p>
                  </div>
                )}

                {activity.movie && (
                  <div className="mt-2 flex">
                    <Link href={`/movies/${activity.movie.id}`} className="flex items-center">
                      <div className="w-12 h-16 rounded overflow-hidden mr-3">
                        <Image
                          src={activity.movie.posterUrl || "/placeholder.svg"}
                          alt={activity.movie.title}
                          width={48}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-[#E0E0E0] font-dmsans hover:text-[#00BFFF] transition-colors">
                          {activity.movie.title}
                        </p>
                        <p className="text-[#A0A0A0] text-sm">{activity.movie.year}</p>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
