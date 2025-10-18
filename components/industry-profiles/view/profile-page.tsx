"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  CheckCircle,
  Share,
  Mail,
  Globe,
  Twitter,
  Instagram,
  Linkedin,
  Film,
  Award,
  Calendar,
  MapPin,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  Users,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  FileText,
  ImageIcon,
  FileArchive,
  Clock,
  ThumbsUp,
  MessageCircle,
  Eye,
  Phone,
  Upload,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { IndustryProfessionalProfile } from "../types"

// Sample profile data
const sampleProfile: IndustryProfessionalProfile = {
  id: "prof_001",
  name: "Christopher Nolan",
  role: "Director",
  verificationStatus: "verified",
  bio: "Christopher Nolan is a British-American film director, producer, and screenwriter known for his distinctive directorial style characterized by nonlinear storytelling, practical effects, and philosophical themes.",
  profilePhoto: "/christopher-nolan.png",
  coverPhoto: "/dramatic-film-set.png",
  location: "Los Angeles, California",
  company: "Syncopy Films",
  website: "https://www.syncopyfilms.com",
  socialMedia: {
    twitter: "@syncopyfilms",
    instagram: "syncopyfilms",
    linkedin: "christopher-nolan",
  },
  filmography: [
    {
      title: "Oppenheimer",
      year: 2023,
      role: "Director, Writer, Producer",
      image: "/oppenheimer-inspired-poster.png",
    },
    {
      title: "Tenet",
      year: 2020,
      role: "Director, Writer, Producer",
      image: "/generic-sci-fi-poster.png",
    },
    {
      title: "Dunkirk",
      year: 2017,
      role: "Director, Writer, Producer",
      image: "/dunkirk-poster.png",
    },
    {
      title: "Interstellar",
      year: 2014,
      role: "Director, Writer, Producer",
      image: "/interstellar-poster.png",
    },
    {
      title: "The Dark Knight Rises",
      year: 2012,
      role: "Director, Writer, Producer",
      image: "/dark-knight-rises-inspired-poster.png",
    },
    {
      title: "Inception",
      year: 2010,
      role: "Director, Writer, Producer",
      image: "/inception-movie-poster.png",
    },
  ],
  awards: [
    {
      name: "Academy Award for Best Director",
      year: 2023,
      project: "Oppenheimer",
    },
    {
      name: "BAFTA Award for Best Direction",
      year: 2023,
      project: "Oppenheimer",
    },
    {
      name: "Golden Globe Award for Best Director",
      year: 2023,
      project: "Oppenheimer",
    },
    {
      name: "Academy Award Nomination for Best Director",
      year: 2018,
      project: "Dunkirk",
    },
    {
      name: "Academy Award Nomination for Best Original Screenplay",
      year: 2011,
      project: "Inception",
    },
  ],
  pressKit: [
    {
      title: "Oppenheimer Press Kit",
      type: "pdf",
      url: "#",
      size: "2.4 MB",
    },
    {
      title: "Official Headshots",
      type: "zip",
      url: "#",
      size: "8.7 MB",
    },
    {
      title: "Biography",
      type: "pdf",
      url: "#",
      size: "1.2 MB",
    },
  ],
  pulses: [
    {
      id: "pulse_001",
      content:
        "Excited to announce that my next project will be starting production this summer. Can't wait to share more details soon!",
      timestamp: "2024-05-20T14:30:00Z",
      likes: 12453,
      comments: 843,
      views: 98765,
    },
    {
      id: "pulse_002",
      content:
        "Thank you to everyone who came out to the Oppenheimer screening last night. The Q&A session was incredibly insightful.",
      timestamp: "2024-05-15T09:45:00Z",
      likes: 8921,
      comments: 532,
      views: 76543,
      image: "/christopher-nolan-filmmaking.png",
    },
    {
      id: "pulse_003",
      content:
        "Honored to receive the Lifetime Achievement Award at the Film Directors Guild ceremony. Grateful for all the support throughout my career.",
      timestamp: "2024-05-10T18:20:00Z",
      likes: 15678,
      comments: 1243,
      views: 120987,
    },
  ],
  stats: {
    followers: 245000,
    projects: 12,
    awards: 24,
  },
  joinDate: "2022-06-15",
  privacySettings: {
    contactVisibility: "public",
  },
}

interface ProfilePageProps {
  profile?: IndustryProfessionalProfile
  isOwnProfile?: boolean
  isVerifiedIndustry?: boolean
}

export function ProfilePage({
  profile = sampleProfile,
  isOwnProfile = false,
  isVerifiedIndustry = false,
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isFollowing, setIsFollowing] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showAllFilmography, setShowAllFilmography] = useState(false)
  const [showAllAwards, setShowAllAwards] = useState(false)

  const displayedFilmography = showAllFilmography ? profile.filmography : profile.filmography?.slice(0, 3)
  const displayedAwards = showAllAwards ? profile.awards : profile.awards?.slice(0, 3)

  // Determine which tabs to show based on permissions
  const showContact = isOwnProfile || isVerifiedIndustry || profile.privacySettings?.contactVisibility === "public"

  return (
    <div className="space-y-6">
      {/* Cover Photo */}
      <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
        <Image
          src={profile.coverPhoto || "/placeholder.svg?height=600&width=1200&query=cinematic background"}
          alt={`${profile.name} cover`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="relative px-4 sm:px-6 -mt-24">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="z-10 relative">
            <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-[#1E1E1E] bg-[#1E1E1E]">
              <Image
                src={profile.profilePhoto || "/placeholder.svg?height=300&width=300&query=portrait"}
                alt={profile.name}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex-1 text-[#E0E0E0]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  {profile.verificationStatus === "verified" && (
                    <Badge className="bg-[#00BFFF] text-black">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-[#A0A0A0]">{profile.role}</p>
                {profile.location && (
                  <div className="flex items-center mt-1 text-sm text-[#A0A0A0]">
                    <MapPin className="h-4 w-4 mr-1" />
                    {profile.location}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {!isOwnProfile && (
                  <>
                    <Button
                      variant={isFollowing ? "default" : "outline"}
                      className={
                        isFollowing
                          ? "bg-[#00BFFF] hover:bg-[#0099CC] text-black"
                          : "border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
                      }
                      onClick={() => setIsFollowing(!isFollowing)}
                    >
                      {isFollowing ? (
                        <>
                          <Users className="h-4 w-4 mr-2" />
                          Following
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
                      onClick={() => setIsSaved(!isSaved)}
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="h-4 w-4 mr-2" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    {showContact && (
                      <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    )}
                  </>
                )}
                {isOwnProfile && (
                  <Button variant="default" className="bg-[#00BFFF] hover:bg-[#0099CC] text-black">
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A0A0A0]">Followers</p>
              <p className="text-2xl font-bold text-[#E0E0E0]">{profile.stats?.followers.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-[#00BFFF]" />
          </CardContent>
        </Card>
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A0A0A0]">Projects</p>
              <p className="text-2xl font-bold text-[#E0E0E0]">{profile.stats?.projects}</p>
            </div>
            <Film className="h-8 w-8 text-[#00BFFF]" />
          </CardContent>
        </Card>
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A0A0A0]">Awards</p>
              <p className="text-2xl font-bold text-[#E0E0E0]">{profile.stats?.awards}</p>
            </div>
            <Award className="h-8 w-8 text-[#00BFFF]" />
          </CardContent>
        </Card>
      </div>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#282828] p-1 h-auto">
          <TabsTrigger
            value="overview"
            className={cn(
              "px-4 py-2 rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
              "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
            )}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="filmography"
            className={cn(
              "px-4 py-2 rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
              "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
            )}
          >
            Filmography
          </TabsTrigger>
          <TabsTrigger
            value="awards"
            className={cn(
              "px-4 py-2 rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
              "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
            )}
          >
            Awards
          </TabsTrigger>
          <TabsTrigger
            value="press"
            className={cn(
              "px-4 py-2 rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
              "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
            )}
          >
            Press Kit
          </TabsTrigger>
          <TabsTrigger
            value="pulses"
            className={cn(
              "px-4 py-2 rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
              "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
            )}
          >
            Pulses
          </TabsTrigger>
          {showContact && (
            <TabsTrigger
              value="contact"
              className={cn(
                "px-4 py-2 rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
                "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
              )}
            >
              Contact
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Bio Section */}
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-[#E0E0E0] mb-3">About</h3>
              <p className="text-[#A0A0A0] whitespace-pre-wrap">{profile.bio}</p>

              {/* Contact & Social */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-[#E0E0E0] mb-2">Contact & Links</h4>
                  <div className="space-y-2">
                    {profile.company && (
                      <div className="flex items-center text-sm">
                        <Film className="h-4 w-4 mr-2 text-[#A0A0A0]" />
                        <span className="text-[#E0E0E0]">{profile.company}</span>
                      </div>
                    )}
                    {profile.website && (
                      <div className="flex items-center text-sm">
                        <Globe className="h-4 w-4 mr-2 text-[#A0A0A0]" />
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00BFFF] hover:underline flex items-center"
                        >
                          {profile.website.replace(/^https?:\/\//, "")}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                    {showContact && (
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-[#A0A0A0]" />
                        <a href="#" className="text-[#00BFFF] hover:underline">
                          Contact via Siddu
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#E0E0E0] mb-2">Social Media</h4>
                  <div className="space-y-2">
                    {profile.socialMedia?.twitter && (
                      <div className="flex items-center text-sm">
                        <Twitter className="h-4 w-4 mr-2 text-[#A0A0A0]" />
                        <a
                          href={`https://twitter.com/${profile.socialMedia.twitter.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00BFFF] hover:underline flex items-center"
                        >
                          {profile.socialMedia.twitter}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                    {profile.socialMedia?.instagram && (
                      <div className="flex items-center text-sm">
                        <Instagram className="h-4 w-4 mr-2 text-[#A0A0A0]" />
                        <a
                          href={`https://instagram.com/${profile.socialMedia.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00BFFF] hover:underline flex items-center"
                        >
                          @{profile.socialMedia.instagram}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                    {profile.socialMedia?.linkedin && (
                      <div className="flex items-center text-sm">
                        <Linkedin className="h-4 w-4 mr-2 text-[#A0A0A0]" />
                        <a
                          href={`https://linkedin.com/in/${profile.socialMedia.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00BFFF] hover:underline flex items-center"
                        >
                          LinkedIn
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Filmography */}
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-[#E0E0E0]">Recent Filmography</h3>
                <Button
                  variant="ghost"
                  className="text-[#A0A0A0] hover:text-[#00BFFF]"
                  onClick={() => setActiveTab("filmography")}
                >
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayedFilmography?.map((film, index) => (
                  <motion.div
                    key={`${film.title}-${film.year}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="group relative rounded-lg overflow-hidden">
                      <div className="aspect-[2/3] relative">
                        <Image
                          src={film.image || "/placeholder.svg?height=450&width=300&query=movie poster"}
                          alt={film.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                        <h4 className="font-medium text-[#E0E0E0] truncate">{film.title}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#A0A0A0]">{film.year}</span>
                          <span className="text-xs text-[#A0A0A0]">{film.role}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {profile.filmography && profile.filmography.length > 3 && (
                <Button
                  variant="ghost"
                  className="w-full mt-4 text-[#A0A0A0] hover:text-[#00BFFF]"
                  onClick={() => setShowAllFilmography(!showAllFilmography)}
                >
                  {showAllFilmography ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Show More ({profile.filmography.length - 3} more)
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Recent Awards */}
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-[#E0E0E0]">Recent Awards</h3>
                <Button
                  variant="ghost"
                  className="text-[#A0A0A0] hover:text-[#00BFFF]"
                  onClick={() => setActiveTab("awards")}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {displayedAwards?.map((award, index) => (
                  <motion.div
                    key={`${award.name}-${award.year}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-start p-3 rounded-lg hover:bg-[#3A3A3A] transition-colors">
                      <Award className="h-5 w-5 text-[#00BFFF] mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-[#E0E0E0]">{award.name}</h4>
                        <div className="flex items-center text-sm text-[#A0A0A0]">
                          <Calendar className="h-3 w-3 mr-1" />
                          {award.year}
                          {award.project && (
                            <>
                              <span className="mx-1">•</span>
                              <Film className="h-3 w-3 mr-1" />
                              {award.project}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {profile.awards && profile.awards.length > 3 && (
                <Button
                  variant="ghost"
                  className="w-full mt-4 text-[#A0A0A0] hover:text-[#00BFFF]"
                  onClick={() => setShowAllAwards(!showAllAwards)}
                >
                  {showAllAwards ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Show More ({profile.awards.length - 3} more)
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filmography" className="space-y-6 mt-6">
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-[#E0E0E0]">Complete Filmography</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                  <select className="bg-[#2A2A2A] border border-[#3A3A3A] text-[#E0E0E0] rounded-md px-3 py-1 text-sm">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {profile.filmography?.map((film, index) => (
                  <motion.div
                    key={`${film.title}-${film.year}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="group relative rounded-lg overflow-hidden">
                      <div className="aspect-[2/3] relative">
                        <Image
                          src={film.image || "/placeholder.svg?height=450&width=300&query=movie poster"}
                          alt={film.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                        <h4 className="font-medium text-[#E0E0E0] text-lg">{film.title}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-[#A0A0A0]">{film.year}</span>
                          <span className="text-xs text-[#A0A0A0]">{film.role}</span>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 p-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="awards" className="space-y-6 mt-6">
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-[#E0E0E0]">Awards & Recognition</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                  <select className="bg-[#2A2A2A] border border-[#3A3A3A] text-[#E0E0E0] rounded-md px-3 py-1 text-sm">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                {profile.awards?.map((award, index) => (
                  <motion.div
                    key={`${award.name}-${award.year}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex items-start p-4 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors">
                      <Award className="h-6 w-6 text-[#00BFFF] mt-0.5 mr-4 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-[#E0E0E0] text-lg">{award.name}</h4>
                        <div className="flex items-center text-sm text-[#A0A0A0] mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {award.year}
                          {award.project && (
                            <>
                              <span className="mx-2">•</span>
                              <Film className="h-4 w-4 mr-1" />
                              {award.project}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="press" className="space-y-6 mt-6">
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-[#E0E0E0]">Press Kit Materials</h3>
                {isOwnProfile && (
                  <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
                    <Upload className="h-4 w-4 mr-1" />
                    Upload New
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                {profile.pressKit?.map((item, index) => (
                  <motion.div
                    key={`${item.title}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between p-4 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors">
                      <div className="flex items-center">
                        {item.type === "pdf" && <FileText className="h-6 w-6 text-red-400 mr-3" />}
                        {item.type === "zip" && <FileArchive className="h-6 w-6 text-yellow-400 mr-3" />}
                        {item.type === "image" && <ImageIcon className="h-6 w-6 text-blue-400 mr-3" />}
                        <div>
                          <h4 className="font-medium text-[#E0E0E0]">{item.title}</h4>
                          <div className="flex items-center text-xs text-[#A0A0A0] mt-1">
                            <span className="uppercase">{item.type}</span>
                            <span className="mx-1">•</span>
                            <span>{item.size}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
              {(!profile.pressKit || profile.pressKit.length === 0) && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-[#3A3A3A] mb-3" />
                  <h4 className="text-lg font-medium text-[#E0E0E0]">No Press Kit Available</h4>
                  <p className="text-[#A0A0A0] mt-1 max-w-md">
                    {isOwnProfile
                      ? "Upload press materials to make them available to industry professionals and fans."
                      : "This professional hasn't uploaded any press materials yet."}
                  </p>
                  {isOwnProfile && (
                    <Button className="mt-4 bg-[#00BFFF] hover:bg-[#0099CC] text-black">
                      <Upload className="h-4 w-4 mr-1" />
                      Upload Press Materials
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-[#E0E0E0]">Recent Press Coverage</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start p-4 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors">
                  <div className="w-24 h-16 rounded overflow-hidden mr-4 flex-shrink-0">
                    <Image
                      src="/christopher-nolan-interview.png"
                      alt="Christopher Nolan Interview"
                      width={96}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[#E0E0E0]">Christopher Nolan on the Making of Oppenheimer</h4>
                    <p className="text-sm text-[#A0A0A0] mt-1 line-clamp-2">
                      An in-depth interview with Christopher Nolan about the challenges and triumphs of bringing
                      Oppenheimer to the big screen.
                    </p>
                    <div className="flex items-center text-xs text-[#A0A0A0] mt-2">
                      <span>Variety</span>
                      <span className="mx-1">•</span>
                      <span>May 10, 2024</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#A0A0A0] hover:text-[#00BFFF] hover:bg-[#3A3A3A]"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-start p-4 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors">
                  <div className="w-24 h-16 rounded overflow-hidden mr-4 flex-shrink-0">
                    <Image
                      src="/oppenheimer-movie-review.png"
                      alt="Oppenheimer Review"
                      width={96}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[#E0E0E0]">
                      'Oppenheimer' Review: Nolan's Masterpiece Defies Expectations
                    </h4>
                    <p className="text-sm text-[#A0A0A0] mt-1 line-clamp-2">
                      Christopher Nolan's latest film is a tour de force of filmmaking, combining stunning visuals with
                      powerful performances.
                    </p>
                    <div className="flex items-center text-xs text-[#A0A0A0] mt-2">
                      <span>The New York Times</span>
                      <span className="mx-1">•</span>
                      <span>April 28, 2024</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#A0A0A0] hover:text-[#00BFFF] hover:bg-[#3A3A3A]"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-start p-4 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors">
                  <div className="w-24 h-16 rounded overflow-hidden mr-4 flex-shrink-0">
                    <Image
                      src="/christopher-nolan-filmmaking.png"
                      alt="Christopher Nolan Filmmaking"
                      width={96}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[#E0E0E0]">
                      The Evolution of Christopher Nolan's Filmmaking Style
                    </h4>
                    <p className="text-sm text-[#A0A0A0] mt-1 line-clamp-2">
                      A retrospective look at how Christopher Nolan's distinctive visual style and narrative techniques
                      have evolved throughout his career.
                    </p>
                    <div className="flex items-center text-xs text-[#A0A0A0] mt-2">
                      <span>Film Comment</span>
                      <span className="mx-1">•</span>
                      <span>March 15, 2024</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#A0A0A0] hover:text-[#00BFFF] hover:bg-[#3A3A3A]"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pulses" className="space-y-6 mt-6">
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-[#E0E0E0]">Recent Pulses</h3>
                {isOwnProfile && <Button className="bg-[#00BFFF] hover:bg-[#0099CC] text-black">Create Pulse</Button>}
              </div>
              <div className="space-y-6">
                {profile.pulses?.map((pulse, index) => (
                  <motion.div
                    key={pulse.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="p-4 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <Image
                            src={profile.profilePhoto || "/placeholder.svg?height=100&width=100&query=portrait"}
                            alt={profile.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium text-[#E0E0E0]">{profile.name}</h4>
                            {profile.verificationStatus === "verified" && (
                              <CheckCircle className="h-3 w-3 ml-1 text-[#00BFFF]" />
                            )}
                          </div>
                          <div className="flex items-center text-xs text-[#A0A0A0]">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(pulse.timestamp).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                      <p className="text-[#E0E0E0] mb-3">{pulse.content}</p>
                      {pulse.image && (
                        <div className="mb-3 rounded-lg overflow-hidden">
                          <Image
                            src={pulse.image || "/placeholder.svg"}
                            alt="Pulse image"
                            width={600}
                            height={400}
                            className="w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm text-[#A0A0A0]">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {pulse.likes.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {pulse.comments.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {pulse.views.toLocaleString()}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#A0A0A0] hover:text-[#00BFFF] hover:bg-[#3A3A3A]"
                        >
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {(!profile.pulses || profile.pulses.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <MessageCircle className="h-12 w-12 text-[#3A3A3A] mb-3" />
                    <h4 className="text-lg font-medium text-[#E0E0E0]">No Pulses Yet</h4>
                    <p className="text-[#A0A0A0] mt-1 max-w-md">
                      {isOwnProfile
                        ? "Share updates, thoughts, and announcements with your followers."
                        : "This professional hasn't posted any pulses yet."}
                    </p>
                    {isOwnProfile && (
                      <Button className="mt-4 bg-[#00BFFF] hover:bg-[#0099CC] text-black">
                        Create Your First Pulse
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {showContact && (
          <TabsContent value="contact" className="space-y-6 mt-6">
            <Card className="bg-[#282828] border-[#3A3A3A]">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-[#E0E0E0] mb-4">Contact Information</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-[#E0E0E0] mb-2">Professional Contact</h4>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-2 text-[#A0A0A0]" />
                            <span className="text-[#E0E0E0]">contact@syncopyfilms.com</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Globe className="h-4 w-4 mr-2 text-[#A0A0A0]" />
                            <a
                              href={profile.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#00BFFF] hover:underline flex items-center"
                            >
                              {profile.website?.replace(/^https?:\/\//, "")}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-[#E0E0E0] mb-2">Representation</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="text-[#E0E0E0]">William Morris Endeavor (WME)</div>
                            <div className="text-sm text-[#A0A0A0]">Talent Agency</div>
                            <div className="flex items-center text-sm text-[#00BFFF] mt-1">
                              <Mail className="h-3 w-3 mr-1" />
                              <a href="#" className="hover:underline">
                                Contact Agent
                              </a>
                            </div>
                          </div>
                          <div>
                            <div className="text-[#E0E0E0]">Syncopy Films</div>
                            <div className="text-sm text-[#A0A0A0]">Production Company</div>
                            <div className="flex items-center text-sm text-[#00BFFF] mt-1">
                              <Mail className="h-3 w-3 mr-1" />
                              <a href="#" className="hover:underline">
                                Contact Company
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-[#E0E0E0] mb-2">Social Media</h4>
                        <div className="space-y-3">
                          {profile.socialMedia?.twitter && (
                            <div className="flex items-center text-sm">
                              <Twitter className="h-4 w-4 mr-2 text-[#A0A0A0]" />
                              <a
                                href={`https://twitter.com/${profile.socialMedia.twitter.replace("@", "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#00BFFF] hover:underline flex items-center"
                              >
                                {profile.socialMedia.twitter}
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          )}
                          {profile.socialMedia?.instagram && (
                            <div className="flex items-center text-sm">
                              <Instagram className="h-4 w-4 mr-2 text-[#A0A0A0]" />
                              <a
                                href={`https://instagram.com/${profile.socialMedia.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#00BFFF] hover:underline flex items-center"
                              >
                                @{profile.socialMedia.instagram}
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          )}
                          {profile.socialMedia?.linkedin && (
                            <div className="flex items-center text-sm">
                              <Linkedin className="h-4 w-4 mr-2 text-[#A0A0A0]" />
                              <a
                                href={`https://linkedin.com/in/${profile.socialMedia.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#00BFFF] hover:underline flex items-center"
                              >
                                LinkedIn
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-[#E0E0E0] mb-2">Direct Message</h4>
                        <div className="p-4 rounded-lg bg-[#2A2A2A]">
                          <p className="text-sm text-[#A0A0A0] mb-3">
                            Send a direct message to {profile.name} through Siddu's secure messaging system.
                          </p>
                          <Button className="w-full bg-[#00BFFF] hover:bg-[#0099CC] text-black">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isVerifiedIndustry && (
                    <div className="p-4 rounded-lg bg-[#2A2A2A] mt-6">
                      <h4 className="text-sm font-medium text-[#E0E0E0] mb-2">Industry Professional Access</h4>
                      <p className="text-sm text-[#A0A0A0] mb-3">
                        As a verified industry professional, you have access to additional contact information.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-[#A0A0A0]" />
                          <span className="text-[#E0E0E0]">christopher.nolan@private-email.com</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-[#A0A0A0]" />
                          <span className="text-[#E0E0E0]">+1 (310) XXX-XXXX</span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-[#A0A0A0]">
                        This information is provided for legitimate professional purposes only. Please respect privacy
                        and professional boundaries.
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
