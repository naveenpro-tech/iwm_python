"use client"

import { useState } from "react"
import { ProfileHeader } from "@/components/industry-profiles/view/profile-header"
import { ProfileNavigation } from "@/components/industry-profiles/view/profile-navigation"
import { ProfileOverview } from "@/components/industry-profiles/view/tabs/profile-overview"
import { ProfileFilmography } from "@/components/industry-profiles/view/tabs/profile-filmography"
import { ProfileAwards } from "@/components/industry-profiles/view/tabs/profile-awards"
import { ProfilePress } from "@/components/industry-profiles/view/tabs/profile-press"
import { ProfilePulses } from "@/components/industry-profiles/view/tabs/profile-pulses"
import { ProfileContact } from "@/components/industry-profiles/view/tabs/profile-contact"
import type { IndustryProfessionalProfile } from "@/components/industry-profiles/types"

// Sample mock data for demonstration
const mockProfile: IndustryProfessionalProfile = {
  id: "prof_001",
  userId: "user_001",
  name: "Christopher Nolan",
  officialTitle: "Director, Writer, Producer",
  companyAffiliation: ["Syncopy Films", "Warner Bros."],
  bio: "Christopher Nolan is a British-American film director, producer, and screenwriter known for his distinctive directorial style characterized by nonlinear storytelling, practical effects, and philosophical themes.\n\nHis films have grossed more than $5 billion worldwide and have garnered 11 Academy Awards from 36 nominations. Having received many accolades throughout his career, he has been nominated for five Academy Awards, five BAFTA Awards and six Golden Globe Awards.\n\nNolan's most notable works include The Dark Knight Trilogy, Inception, Interstellar, Dunkirk, and Oppenheimer.",
  profilePhoto: "/christopher-nolan.png",
  coverPhoto: "/dramatic-film-set.png",
  verificationStatus: "verified",
  verificationDocuments: [],
  isOfficial: true,
  filmography: [
    {
      id: "film_001",
      title: "Oppenheimer",
      role: "Director, Writer, Producer",
      year: 2023,
      posterUrl: "/oppenheimer-inspired-poster.png",
      verified: true,
      featured: true,
    },
    {
      id: "film_002",
      title: "Tenet",
      role: "Director, Writer, Producer",
      year: 2020,
      posterUrl: "/generic-sci-fi-poster.png",
      verified: true,
    },
    {
      id: "film_003",
      title: "Dunkirk",
      role: "Director, Writer, Producer",
      year: 2017,
      posterUrl: "/dunkirk-poster.png",
      verified: true,
    },
    {
      id: "film_004",
      title: "Interstellar",
      role: "Director, Writer, Producer",
      year: 2014,
      posterUrl: "/interstellar-poster.png",
      verified: true,
    },
    {
      id: "film_005",
      title: "The Dark Knight Rises",
      role: "Director, Writer, Producer",
      year: 2012,
      posterUrl: "/dark-knight-rises-inspired-poster.png",
      verified: true,
    },
    {
      id: "film_006",
      title: "Inception",
      role: "Director, Writer, Producer",
      year: 2010,
      posterUrl: "/inception-movie-poster.png",
      verified: true,
      featured: true,
    },
  ],
  awards: [
    {
      id: "award_001",
      name: "Academy Award for Best Director",
      category: "Best Director",
      year: 2023,
      project: "Oppenheimer",
      isNomination: false,
    },
    {
      id: "award_002",
      name: "BAFTA Award for Best Direction",
      category: "Best Direction",
      year: 2023,
      project: "Oppenheimer",
      isNomination: false,
    },
    {
      id: "award_003",
      name: "Golden Globe Award for Best Director",
      category: "Best Director",
      year: 2023,
      project: "Oppenheimer",
      isNomination: false,
    },
    {
      id: "award_004",
      name: "Academy Award",
      category: "Best Director",
      year: 2018,
      project: "Dunkirk",
      isNomination: true,
    },
    {
      id: "award_005",
      name: "Academy Award",
      category: "Best Original Screenplay",
      year: 2011,
      project: "Inception",
      isNomination: true,
    },
  ],
  pressKit: [
    {
      id: "press_001",
      type: "interview",
      title: "Christopher Nolan on the Making of Oppenheimer",
      source: "Variety",
      url: "https://example.com/nolan-interview",
      date: new Date("2024-05-10"),
      thumbnail: "/christopher-nolan-interview.png",
    },
    {
      id: "press_002",
      type: "review",
      title: "'Oppenheimer' Review: Nolan's Masterpiece Defies Expectations",
      source: "The New York Times",
      url: "https://example.com/oppenheimer-review",
      date: new Date("2024-04-28"),
      thumbnail: "/oppenheimer-movie-review.png",
    },
    {
      id: "press_003",
      type: "article",
      title: "The Evolution of Christopher Nolan's Filmmaking Style",
      source: "Film Comment",
      url: "https://example.com/nolan-evolution",
      date: new Date("2024-03-15"),
      thumbnail: "/christopher-nolan-filmmaking.png",
    },
  ],
  socialMedia: [
    { platform: "twitter", url: "https://twitter.com/syncopyfilms", handle: "@syncopyfilms" },
    { platform: "instagram", url: "https://instagram.com/syncopyfilms", handle: "syncopyfilms" },
    { platform: "linkedin", url: "https://linkedin.com/in/christopher-nolan", handle: "christopher-nolan" },
  ],
  privacySettings: {
    profileVisibility: "public",
    contactVisibility: "public",
    filmographyVisibility: "public",
    awardsVisibility: "public",
    pressKitVisibility: "public",
    socialMediaVisibility: "public",
    allowMessages: "public",
    allowQuestions: true,
  },
  createdAt: new Date("2022-06-15"),
  updatedAt: new Date("2024-05-01"),
  followerCount: 245000,
  viewCount: 1250000,
  monthlyViews: 75000,
  lastViewedBy: [
    { name: "Jane Smith", role: "Casting Director", date: "2024-05-25" },
    { name: "Michael Johnson", role: "Producer", date: "2024-05-24" },
    { name: "Sarah Williams", role: "Film Student", date: "2024-05-23" },
  ],
}

export default function IndustryProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const profile = mockProfile // In a real app, fetch profile based on params.id
  const isOwnProfile = false // In a real app, determine if the current user owns this profile
  const isVerifiedIndustry = false // In a real app, determine if the current user is a verified industry professional

  // Determine which tabs to show based on permissions
  const showContact = isOwnProfile || isVerifiedIndustry || profile.privacySettings.contactVisibility === "public"

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} isVerifiedIndustry={isVerifiedIndustry} />

        <div className="mt-6">
          <ProfileNavigation activeTab={activeTab} onTabChange={setActiveTab} showContact={showContact} />
        </div>

        <div className="mt-6">
          {activeTab === "overview" && <ProfileOverview profile={profile} isOwnProfile={isOwnProfile} />}

          {activeTab === "filmography" && <ProfileFilmography profile={profile} />}

          {activeTab === "awards" && <ProfileAwards profile={profile} />}

          {activeTab === "press" && <ProfilePress profile={profile} isOwnProfile={isOwnProfile} />}

          {activeTab === "pulses" && <ProfilePulses profile={profile} isOwnProfile={isOwnProfile} />}

          {activeTab === "contact" && showContact && <ProfileContact profile={profile} />}
        </div>
      </div>
    </div>
  )
}
