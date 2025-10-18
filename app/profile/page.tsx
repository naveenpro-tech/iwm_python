"use client"

import { useState } from "react"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileNavigation } from "@/components/profile/profile-navigation"
import { ProfileOverview } from "@/components/profile/sections/profile-overview"
import { ProfileReviews } from "@/components/profile/sections/profile-reviews"
import { ProfileWatchlist } from "@/components/profile/sections/profile-watchlist"
import { ProfileFavorites } from "@/components/profile/sections/profile-favorites"
import { ProfileHistory } from "@/components/profile/sections/profile-history"
import { ProfileSettings } from "@/components/profile/sections/profile-settings"

// Mock user data
const userData = {
  id: "u1",
  username: "CinematicDreamer",
  displayName: "Alex Johnson",
  bio: "Film enthusiast with a passion for visual storytelling. I believe cinema is the most powerful art form that connects us across cultures and time.",
  avatarUrl: "/user-avatar-1.png",
  coverUrl: "/profile-cover-cinematic.png",
  location: "New York, USA",
  memberSince: "2021",
  isVerified: true,
  stats: {
    reviews: 127,
    watchlist: 43,
    favorites: 68,
    following: 215,
    followers: 189,
  },
}

type ProfileSection = "overview" | "reviews" | "watchlist" | "favorites" | "history" | "settings"

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<ProfileSection>("overview")

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <ProfileOverview userData={userData} />
      case "reviews":
        return <ProfileReviews userId={userData.id} />
      case "watchlist":
        return <ProfileWatchlist userId={userData.id} />
      case "favorites":
        return <ProfileFavorites userId={userData.id} />
      case "history":
        return <ProfileHistory userId={userData.id} />
      case "settings":
        return <ProfileSettings userData={userData} />
      default:
        return <ProfileOverview userData={userData} />
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] pt-14 md:pt-16">
      <ProfileHeader userData={userData} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <ProfileNavigation activeSection={activeSection} onSectionChange={setActiveSection} stats={userData.stats} />

        <div className="mt-6">{renderSection()}</div>
      </div>
    </div>
  )
}
