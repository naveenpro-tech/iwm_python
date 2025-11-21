"use client"

import { useState } from "react"
import { EnhancedPulseComposer, type PulsePostData } from "@/components/pulse/enhanced-pulse-composer"
import { EnhancedPulseCard } from "@/components/pulse/enhanced-pulse-card"
import { motion, AnimatePresence } from "framer-motion"
import { Separator } from "@/components/ui/separator"

// Mock user for composer
const currentUser = {
  avatarUrl: "/user-avatar-1.png", // Replace with actual user avatar if available
}

// Mock initial posts
const initialPosts = [
  {
    id: "post1",
    author: {
      id: "user2",
      name: "CinemaFanatic",
      username: "cinemafan22",
      avatarUrl: "/user-avatar-2.png",
      isVerified: true,
    },
    content:
      "Just watched Oppenheimer again. Nolan's direction is simply breathtaking. The sound design alone deserves all the awards! What are your thoughts? #Oppenheimer #Nolan #Masterpiece",
    movieTags: [{ id: "m4", title: "Oppenheimer", posterUrl: "/oppenheimer-inspired-poster.png" }],
    tags: ["Oppenheimer", "Nolan", "Masterpiece"],
    mood: "Impressed",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    likes: 125,
    comments: 12,
    shares: 5,
    isLikedByCurrentUser: false,
    isBookmarkedByCurrentUser: true,
    mediaUrls: [{ type: "image" as const, url: "/oppenheimer-movie-review.png" }],
  },
  {
    id: "post2",
    author: { id: "user3", name: "IndieFilmLover", username: "indiequeen", avatarUrl: "/user-avatar-3.png" },
    content:
      "Exploring some hidden gems today. Any recommendations for lesser-known sci-fi movies? Preferably something with a unique visual style. $Blade Runner 2049 was amazing, looking for similar vibes.",
    movieTags: [{ id: "m_br2049", title: "Blade Runner 2049", posterUrl: "/blade-runner-2049-poster.png" }],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    likes: 78,
    comments: 23,
    shares: 2,
    isLikedByCurrentUser: true,
    isBookmarkedByCurrentUser: false,
  },
  {
    id: "post3",
    author: {
      id: "user4",
      name: "CricketCrazy",
      username: "boundaryking",
      avatarUrl: "/user-avatar-4.png",
      isVerified: true,
    },
    content:
      "Can't wait for the next India vs Australia match! It's always a thriller. #Cricket #INDvsAUS Who do you think will win?",
    tags: ["Cricket", "INDvsAUS"],
    mood: "Excited",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    likes: 210,
    comments: 45,
    shares: 15,
    isLikedByCurrentUser: false,
    isBookmarkedByCurrentUser: false,
    mediaUrls: [
      { type: "image" as const, url: "/cricket/ind-aus-series.png" },
      { type: "image" as const, url: "/cricket/world-cup-logo.png" },
    ],
  },
]

export default function EnhancedPulsePage() {
  const [posts, setPosts] = useState(initialPosts)

  const handleNewPost = (data: PulsePostData) => {
    const newPost = {
      id: `post${Date.now()}`, // Simple unique ID
      author: {
        id: "currentUser",
        name: "You (Alex Johnson)",
        username: "alexj",
        avatarUrl: currentUser.avatarUrl,
        isVerified: true,
      },
      content: data.content,
      mediaUrls:
        data.media?.map((file) => ({
          type: file.type.startsWith("image") ? "image" : ("video" as "image" | "video"),
          url: URL.createObjectURL(file),
        })) || [],
      tags: data.tags,
      movieTags: data.movieTags,
      mood: data.mood,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLikedByCurrentUser: false,
      isBookmarkedByCurrentUser: false,
    }
    setPosts((prevPosts) => [newPost, ...prevPosts])

    // TODO: Revoke object URLs for media when component unmounts or media is no longer needed
  }

  return (
    <div className="min-h-screen bg-[#101010] text-siddu-text-light py-6 md:py-10">
      <div className="container max-w-2xl mx-auto px-2 sm:px-4">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-siddu-purple-primary via-pink-500 to-siddu-accent-yellow"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Siddu Pulse ✨
        </motion.h1>

        <EnhancedPulseComposer
          onSubmit={handleNewPost}
          userAvatarUrl={currentUser.avatarUrl}
          className="mb-6 md:mb-8"
          autoFocus={false}
        />

        <Separator className="bg-siddu-border-subtle my-6 md:my-8" />

        <div className="space-y-4 md:space-y-6">
          <AnimatePresence initial={false}>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                layout // Enables smooth reordering if posts are added/removed
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <EnhancedPulseCard post={post} />
              </motion.div>
            ))}
          </AnimatePresence>
          {posts.length === 0 && (
            <p className="text-center text-siddu-text-subtle py-10">
              No pulses yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
