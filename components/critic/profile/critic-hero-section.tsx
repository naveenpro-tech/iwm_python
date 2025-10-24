"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { BadgeCheck, Pause, Play } from "lucide-react"
import Image from "next/image"
import FollowButton from "./follow-button"
import type { CriticProfile } from "@/types/critic"
import { generateTrendData } from "@/lib/critic/mock-analytics"

interface CriticHeroSectionProps {
  profile: CriticProfile
}

export default function CriticHeroSection({ profile }: CriticHeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVideoPaused, setIsVideoPaused] = useState(false)
  const [hoveredStat, setHoveredStat] = useState<string | null>(null)

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6])

  // Stats constellation data with safe property access
  const stats = [
    {
      id: "followers",
      label: "Followers",
      value: (profile?.total_followers ?? 0).toLocaleString(),
      color: "#00BFFF",
      position: { x: "20%", y: "30%" },
    },
    {
      id: "reviews",
      label: "Reviews",
      value: (profile?.total_reviews ?? 0).toLocaleString(),
      color: "#FFD700",
      position: { x: "50%", y: "20%" },
    },
    {
      id: "rating",
      label: "Avg Rating",
      value: (profile?.avg_rating ?? 0).toFixed(1),
      color: "#8B5CF6",
      position: { x: "80%", y: "30%" },
    },
    {
      id: "likes",
      label: "Total Likes",
      value: (profile?.total_likes ?? 0).toLocaleString(),
      color: "#EC4899",
      position: { x: "35%", y: "70%" },
    },
    {
      id: "views",
      label: "Total Views",
      value: (profile?.total_views ?? 0).toLocaleString(),
      color: "#10B981",
      position: { x: "65%", y: "70%" },
    },
  ]

  const toggleVideo = () => {
    const video = document.querySelector("video")
    if (video) {
      if (isVideoPaused) {
        video.play()
      } else {
        video.pause()
      }
      setIsVideoPaused(!isVideoPaused)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* Banner (Video or Image) with Parallax */}
      <motion.div
        className="relative h-[600px] md:h-[500px] sm:h-[400px]"
        style={{ y: parallaxY, opacity }}
      >
        {profile.banner_video_url ? (
          <>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              poster={profile.banner_image_url || undefined}
            >
              <source src={profile.banner_video_url} type="video/mp4" />
            </video>

            {/* Pause/Play Button */}
            <button
              onClick={toggleVideo}
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-all z-10"
              aria-label={isVideoPaused ? "Play video" : "Pause video"}
            >
              {isVideoPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
          </>
        ) : (
          <Image
            src={profile?.banner_image_url || "/placeholder.svg"}
            alt={`${profile?.display_name || "Critic"} banner`}
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1A1A1A]/50 to-[#1A1A1A]" />
      </motion.div>

      {/* Profile Info */}
      <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative"
            >
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#00BFFF] shadow-glow">
                <Image
                  src={profile?.avatar_url || "/placeholder.svg"}
                  alt={profile?.display_name || "Critic"}
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Name and Follow Button */}
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-4xl md:text-5xl font-bold text-[#E0E0E0] font-inter">
                    {profile?.display_name || "Critic"}
                  </h1>
                  {profile?.is_verified && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.9 }}
                    >
                      <BadgeCheck className="w-8 h-8 text-[#00BFFF]" />
                    </motion.div>
                  )}
                </div>
                <p className="text-lg text-[#A0A0A0] font-dmsans mb-4">@{profile?.username || "critic"}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <FollowButton
                  criticUsername={profile?.username || "critic"}
                  initialFollowing={false}
                  initialFollowerCount={profile?.total_followers ?? 0}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Constellation */}
      <div className="relative h-64 mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          {/* Connection Lines */}
          {stats.map((stat, index) => {
            const nextStat = stats[(index + 1) % stats.length]
            return (
              <motion.line
                key={`line-${stat.id}`}
                x1={stat.position.x}
                y1={stat.position.y}
                x2={nextStat.position.x}
                y2={nextStat.position.y}
                stroke="url(#gradient)"
                strokeWidth="1"
                opacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
              />
            )
          })}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00BFFF" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
        </svg>

        {/* Stat Nodes */}
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            className="absolute"
            style={{
              left: stat.position.x,
              top: stat.position.y,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
            onMouseEnter={() => setHoveredStat(stat.id)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-full blur-xl"
              style={{ backgroundColor: stat.color }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Node */}
            <motion.div
              className="relative bg-[#282828] rounded-full p-6 border-2 cursor-pointer"
              style={{ borderColor: stat.color }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold font-inter" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs text-[#A0A0A0] font-dmsans mt-1">{stat.label}</div>
              </div>

              {/* Trend Graph on Hover */}
              {hoveredStat === stat.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-[#282828] border border-[#3A3A3A] rounded-lg p-3 w-48 z-10"
                >
                  <p className="text-xs text-[#A0A0A0] mb-2">Last 7 days</p>
                  <div className="h-16 flex items-end justify-between gap-1">
                    {generateTrendData(stat.id).map((point, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full rounded-t"
                          style={{
                            height: `${(point.value / Math.max(...generateTrendData(stat.id).map((p) => p.value))) * 100}%`,
                            backgroundColor: stat.color,
                          }}
                        />
                        <span className="text-[10px] text-[#A0A0A0] mt-1">{point.day}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

