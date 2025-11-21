"use client"

import { useEffect, useState } from "react"
import { ProfilePage } from "@/components/talent-hub/profile/view/profile-page"
import type { TalentProfile } from "@/components/talent-hub/profile/types"

// Mock data for demonstration
const mockProfile: TalentProfile = {
  id: "p1",
  userId: "u1",
  fullName: "Alexander Johnson",
  professionalName: "Alex J. Thompson",
  email: "alex@example.com",
  phone: "+1 (555) 123-4567",
  location: {
    city: "Los Angeles",
    state: "California",
    country: "USA",
  },
  dateOfBirth: new Date("1990-05-15"),
  genderIdentity: "Male",
  pronouns: "he/him",
  primaryRole: "actor",
  secondaryRoles: ["Director", "Writer"],
  unionStatus: "sag-aftra",
  yearsOfExperience: 8,
  languages: [
    { language: "English", proficiency: "native" },
    { language: "Spanish", proficiency: "conversational" },
    { language: "French", proficiency: "basic" },
  ],
  professionalWebsite: "https://alexjthompson.com",
  actorDetails: {
    ageRange: { min: 25, max: 35 },
    height: "6'1\"",
    weight: "180 lbs",
    hairColor: "Brown",
    eyeColor: "Blue",
    ethnicity: "Caucasian",
    bodyType: "Athletic",
  },
  profilePhoto: "/user-avatar-1.png",
  coverPhoto: "/profile-cover-cinematic.png",
  additionalPhotos: [
    { id: "ph1", url: "/user-avatar-1.png", type: "headshot" },
    { id: "ph2", url: "/dark-blue-city-skyline.png", type: "production" },
    { id: "ph3", url: "/inception-scene-thumbnail.png", type: "production" },
    { id: "ph4", url: "/dramatic-oppenheimer.png", type: "production" },
    { id: "ph5", url: "/challengers-tennis-match.png", type: "behind-scenes" },
    { id: "ph6", url: "/vibrant-pink-dreamhouse.png", type: "production" },
  ],
  showreel: {
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    platform: "youtube",
    thumbnail: "/inception-scene-thumbnail.png",
    duration: 180,
  },
  portfolioLinks: [
    { platform: "IMDb", url: "https://www.imdb.com/name/example" },
    { platform: "Vimeo", url: "https://vimeo.com/example" },
    { platform: "Instagram", url: "https://instagram.com/example" },
  ],
  experience: [
    {
      id: "exp1",
      title: "The Dark Knight Returns",
      productionType: "film",
      role: "Detective Morris",
      company: "Warner Bros.",
      director: "Christopher Nolan",
      year: 2023,
      description: "Lead supporting role in this critically acclaimed thriller.",
      media: [{ type: "image", url: "/dark-knight-poster.png" }],
    },
    {
      id: "exp2",
      title: "Stranger Things",
      productionType: "tv",
      role: "Dr. Richards",
      company: "Netflix",
      year: 2022,
      description: "Recurring role in Season 4, appearing in 5 episodes.",
      media: [{ type: "image", url: "/sci-fi-movie-poster.png" }],
    },
    {
      id: "exp3",
      title: "Hamlet",
      productionType: "theater",
      role: "Laertes",
      company: "Los Angeles Theater Company",
      director: "Sarah Williams",
      year: 2021,
      description: "Six-month run at the Downtown Theater.",
    },
    {
      id: "exp4",
      title: "The Last Frontier",
      productionType: "film",
      role: "Captain Reynolds",
      company: "Paramount Pictures",
      director: "James Cameron",
      year: 2020,
      description: "Action-adventure film shot on location in Alaska.",
      media: [{ type: "image", url: "/action-movie-poster.png" }],
    },
    {
      id: "exp5",
      title: "Nike - Just Do It",
      productionType: "commercial",
      role: "Athlete",
      company: "Nike",
      year: 2019,
      description: "National campaign that aired during the Super Bowl.",
    },
  ],
  skills: [
    {
      category: "Performance",
      items: [
        { name: "Method Acting", proficiency: "expert", endorsements: 12, endorsers: ["Jane Doe", "John Smith"] },
        { name: "Improvisation", proficiency: "expert", endorsements: 8, endorsers: ["Jane Doe"] },
        { name: "Voice Acting", proficiency: "intermediate", endorsements: 5 },
      ],
    },
    {
      category: "Accents & Dialects",
      items: [
        { name: "British", proficiency: "expert", endorsements: 15 },
        { name: "Southern American", proficiency: "intermediate" },
        { name: "New York", proficiency: "expert", endorsements: 7 },
      ],
    },
    {
      category: "Physical",
      items: [
        { name: "Stage Combat", proficiency: "expert", endorsements: 10 },
        { name: "Horseback Riding", proficiency: "intermediate" },
        { name: "Swimming", proficiency: "expert" },
      ],
    },
    {
      category: "Musical",
      items: [
        { name: "Piano", proficiency: "intermediate" },
        { name: "Singing", proficiency: "beginner" },
      ],
    },
  ],
  biography:
    "Award-winning actor with over 8 years of experience in film, television, and theater. I'm passionate about bringing complex characters to life and collaborating with visionary directors and fellow actors.\n\nMy training at the Juilliard School provided me with a strong foundation in classical techniques, while my work with the Groundlings has honed my improvisational skills. I'm particularly drawn to roles that challenge conventional narratives and explore the human condition.\n\nWhen not on set or stage, I'm an avid rock climber and volunteer with youth theater programs in underserved communities. I believe in the transformative power of storytelling and strive to be part of projects that inspire and provoke thought.",
  resume: {
    url: "/example-resume.pdf",
    uploadedAt: new Date("2023-10-15"),
  },
  additionalDocuments: [
    { type: "certificate", name: "Juilliard School Diploma.pdf", url: "/example-certificate.pdf" },
    { type: "award", name: "Best Supporting Actor - LA Indie Film Festival.pdf", url: "/example-award.pdf" },
  ],
  privacySettings: {
    profileVisibility: "public",
    contactVisibility: "verified-only",
    searchEngineIndexing: true,
    sectionPrivacy: {
      email: "verified-only",
      phone: "verified-only",
      location: "public",
    },
  },
  isVerified: true,
  verificationLevel: "professional",
  profileCompleteness: 92,
  createdAt: new Date("2022-03-10"),
  updatedAt: new Date("2023-11-05"),
  lastViewedBy: [
    { name: "Sarah Director", role: "Casting Director", date: new Date("2023-11-20") },
    { name: "James Producer", role: "Executive Producer", date: new Date("2023-11-15") },
    { name: "Emily Talent", role: "Talent Agent", date: new Date("2023-11-10") },
  ],
  viewCount: 1250,
  monthlyViews: 320,
  followerCount: 178,
  following: ["user2", "user3", "user4"],
  applications: [
    {
      id: "app1",
      castingCallId: "cc1",
      castingCallTitle: "The Last Horizon",
      roleAppliedFor: "Captain Marcus",
      appliedDate: new Date("2023-11-01"),
      status: "shortlisted",
      lastUpdate: new Date("2023-11-10"),
      messages: [
        {
          from: "Jessica Casting",
          content:
            "We loved your audition tape! The director would like to schedule a callback for next week. Are you available on Tuesday at 2pm?",
          date: new Date("2023-11-10"),
        },
      ],
    },
    {
      id: "app2",
      castingCallId: "cc2",
      castingCallTitle: "City of Dreams",
      roleAppliedFor: "Detective Ryan",
      appliedDate: new Date("2023-10-15"),
      status: "under-review",
      lastUpdate: new Date("2023-10-20"),
    },
    {
      id: "app3",
      castingCallId: "cc3",
      castingCallTitle: "The Silent Echo",
      roleAppliedFor: "Dr. James Wilson",
      appliedDate: new Date("2023-09-28"),
      status: "rejected",
      lastUpdate: new Date("2023-10-05"),
      messages: [
        {
          from: "Michael Producer",
          content:
            "Thank you for your interest in our project. While we were impressed with your skills, we've decided to go in a different direction for this role. We'll keep your information for future opportunities.",
          date: new Date("2023-10-05"),
        },
      ],
    },
  ],
}

export default function ProfileViewPage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<TalentProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch the profile from an API
    // For now, we'll use the mock data
    setTimeout(() => {
      setProfile(mockProfile)
      setLoading(false)
    }, 1000)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00BFFF]"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-400">The profile you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  // For demo purposes, we'll assume this is the user's own profile if the ID is "me"
  const isOwnProfile = params.id === "me"
  // For demo purposes, we'll assume the viewer is a verified industry professional
  const isVerifiedIndustry = true

  return <ProfilePage profile={profile} isOwnProfile={isOwnProfile} isVerifiedIndustry={isVerifiedIndustry} />
}
