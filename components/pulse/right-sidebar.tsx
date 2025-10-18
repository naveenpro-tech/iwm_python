"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserPlus, TrendingUp, Calendar, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function RightSidebar() {
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([])
  const [dismissedMovies, setDismissedMovies] = useState<string[]>([])
  const [dismissedEvents, setDismissedEvents] = useState<string[]>([])

  const suggestedUsers = [
    {
      id: "user1",
      name: "Christopher Nolan",
      username: "cnolan",
      avatar: "/christopher-nolan.png",
      isVerified: true,
      verificationLevel: "celebrity",
      reason: "Director you might know",
    },
    {
      id: "user2",
      name: "Cillian Murphy",
      username: "cmurphy",
      avatar: "/cillian-murphy-portrait.png",
      isVerified: true,
      verificationLevel: "celebrity",
      reason: "Actor from Oppenheimer",
    },
    {
      id: "user3",
      name: "Zendaya",
      username: "zendaya",
      avatar: "/actress-portrait.png",
      isVerified: true,
      verificationLevel: "celebrity",
      reason: "Actress from Challengers",
    },
    {
      id: "user4",
      name: "Denis Villeneuve",
      username: "dvilleneuve",
      avatar: "/serious-director.png",
      isVerified: true,
      verificationLevel: "celebrity",
      reason: "Director of Dune",
    },
  ].filter((user) => !dismissedSuggestions.includes(user.id))

  const trendingMovies = [
    {
      id: "movie1",
      title: "Dune: Part Two",
      poster: "/dune-part-two-poster.png",
      pulseCount: 12453,
      releaseStatus: "Now Playing",
    },
    {
      id: "movie2",
      title: "Civil War",
      poster: "/civil-war-movie-poster.png",
      pulseCount: 8976,
      releaseStatus: "Now Playing",
    },
    {
      id: "movie3",
      title: "Challengers",
      poster: "/challengers-poster.png",
      pulseCount: 7654,
      releaseStatus: "Now Playing",
    },
    {
      id: "movie4",
      title: "The Fall Guy",
      poster: "/action-movie-poster.png",
      pulseCount: 6543,
      releaseStatus: "Coming Soon",
    },
  ].filter((movie) => !dismissedMovies.includes(movie.id))

  const upcomingEvents = [
    {
      id: "event1",
      title: "Cannes Film Festival",
      date: "May 14-25, 2024",
      image: "/award-ceremony.png",
      type: "festival",
    },
    {
      id: "event2",
      title: "IPL 2024 Finals",
      date: "May 26, 2024",
      image: "/cricket/ipl-logo.png",
      type: "cricket",
    },
    {
      id: "event3",
      title: "Academy Awards Nominations",
      date: "January 17, 2025",
      image: "/oscar-trophy.png",
      type: "awards",
    },
  ].filter((event) => !dismissedEvents.includes(event.id))

  const dismissUser = (userId: string) => {
    setDismissedSuggestions((prev) => [...prev, userId])
  }

  const dismissMovie = (movieId: string) => {
    setDismissedMovies((prev) => [...prev, movieId])
  }

  const dismissEvent = (eventId: string) => {
    setDismissedEvents((prev) => [...prev, eventId])
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
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  }

  // Get verification badge color
  const getVerificationColor = (level?: string) => {
    switch (level) {
      case "industry":
        return "text-[#FFD700]"
      case "celebrity":
        return "text-[#FF4D4D]"
      default:
        return "text-[#00BFFF]"
    }
  }

  // Get event type badge
  const getEventBadge = (type: string) => {
    switch (type) {
      case "festival":
        return <Badge className="bg-[#FFD700] text-black">Festival</Badge>
      case "cricket":
        return <Badge className="bg-[#4DFF77] text-black">Cricket</Badge>
      case "awards":
        return <Badge className="bg-[#FF4D4D] text-black">Awards</Badge>
      default:
        return <Badge className="bg-[#00BFFF] text-black">Event</Badge>
    }
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Suggested Users */}
      {suggestedUsers.length > 0 && (
        <motion.div className="bg-[#282828] rounded-lg overflow-hidden border border-[#3A3A3A]" variants={itemVariants}>
          <div className="p-4 border-b border-[#3A3A3A]">
            <h3 className="font-semibold">Who to follow</h3>
          </div>

          <div className="divide-y divide-[#3A3A3A]">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="p-4 hover:bg-[#3A3A3A] transition-colors relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6 text-[#A0A0A0] opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => dismissUser(user.id)}
                >
                  <X className="h-3 w-3" />
                </Button>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{user.name}</span>
                        {user.isVerified && (
                          <svg
                            className={`w-4 h-4 ${getVerificationColor(user.verificationLevel)}`}
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04L2 8.001l.382.019c.406.02.816.05 1.228.089 3.007.289 5.958 1.424 8.39 3.358 2.432-1.934 5.383-3.069 8.39-3.358.412-.04.822-.069 1.228-.089L22 8.001l-.382-.017z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="text-sm text-[#A0A0A0]">@{user.username}</div>
                      <div className="text-xs text-[#A0A0A0] mt-1">{user.reason}</div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Follow
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-[#3A3A3A]">
            <Button variant="ghost" className="w-full text-[#00BFFF] hover:bg-[#00BFFF]/10">
              Show more
            </Button>
          </div>
        </motion.div>
      )}

      {/* Trending Movies */}
      {trendingMovies.length > 0 && (
        <motion.div className="bg-[#282828] rounded-lg overflow-hidden border border-[#3A3A3A]" variants={itemVariants}>
          <div className="p-4 border-b border-[#3A3A3A] flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#00BFFF]" />
            <h3 className="font-semibold">Trending Movies</h3>
          </div>

          <div className="divide-y divide-[#3A3A3A]">
            {trendingMovies.map((movie) => (
              <div key={movie.id} className="p-4 hover:bg-[#3A3A3A] transition-colors cursor-pointer relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6 text-[#A0A0A0] opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    dismissMovie(movie.id)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>

                <div className="flex gap-3">
                  <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium">{movie.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        className={`${
                          movie.releaseStatus === "Now Playing" ? "bg-green-500" : "bg-blue-500"
                        } text-black text-xs`}
                      >
                        {movie.releaseStatus}
                      </Badge>
                    </div>
                    <div className="text-sm text-[#A0A0A0] mt-1">
                      {movie.pulseCount > 1000 ? `${(movie.pulseCount / 1000).toFixed(1)}K` : movie.pulseCount} pulses
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-[#3A3A3A]">
            <Button variant="ghost" className="w-full text-[#00BFFF] hover:bg-[#00BFFF]/10">
              View all trending
            </Button>
          </div>
        </motion.div>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <motion.div className="bg-[#282828] rounded-lg overflow-hidden border border-[#3A3A3A]" variants={itemVariants}>
          <div className="p-4 border-b border-[#3A3A3A] flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#00BFFF]" />
            <h3 className="font-semibold">Upcoming Events</h3>
          </div>

          <div className="divide-y divide-[#3A3A3A]">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-4 hover:bg-[#3A3A3A] transition-colors cursor-pointer relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6 text-[#A0A0A0] opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    dismissEvent(event.id)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>

                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="text-sm text-[#A0A0A0] mt-1">{event.date}</div>
                    <div className="mt-1">{getEventBadge(event.type)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-[#3A3A3A]">
            <Button variant="ghost" className="w-full text-[#00BFFF] hover:bg-[#00BFFF]/10">
              View calendar
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
