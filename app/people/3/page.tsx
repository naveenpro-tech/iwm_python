"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Award, Calendar, Flag, Heart, MapPin, Share2, Star, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FilmographySection } from "@/components/people/person-details/filmography-section"
import { BiographySection } from "@/components/people/person-details/biography-section"
import { AwardsSection } from "@/components/people/person-details/awards-section"
import { GallerySection } from "@/components/people/person-details/gallery-section"
import { RelatedPeopleSection } from "@/components/people/person-details/related-people-section"
import { KnownForSection } from "@/components/people/person-details/known-for-section"
import { SocialLinks } from "@/components/people/person-details/social-links"
import { CareerHighlights } from "@/components/people/person-details/career-highlights"
import { QuickFacts } from "@/components/people/person-details/quick-facts"

// Mock data for Cillian Murphy
const person = {
  id: 3,
  name: "Cillian Murphy",
  primaryRole: "Actor",
  roles: ["Actor", "Producer"],
  profileImage: "/cillian-murphy-portrait.png",
  birthDate: "May 25, 1976",
  birthPlace: "Douglas, Cork, Ireland",
  nationality: "Irish",
  isVerified: true,
  biography: {
    short:
      "Irish actor known for his intense performances and striking blue eyes. Murphy began his career in theater and independent films before gaining wider recognition for his roles in '28 Days Later' and 'Batman Begins'. He is a frequent collaborator with director Christopher Nolan.",
    full: "Cillian Murphy is an Irish actor born on May 25, 1976, in Douglas, Cork, Ireland. He initially pursued a career in law but dropped out to pursue music and later acting. Murphy began his career performing in plays and short films in the late 1990s.\n\nHis breakthrough came with Danny Boyle's post-apocalyptic film '28 Days Later' (2002), which brought him international attention. Murphy's collaboration with Christopher Nolan began with 'Batman Begins' (2005), where he played the villain Scarecrow, a role he reprised in 'The Dark Knight' (2008) and 'The Dark Knight Rises' (2012).\n\nMurphy has worked with Nolan on several other films, including 'Inception' (2010), 'Dunkirk' (2017), and most notably 'Oppenheimer' (2023), where his portrayal of J. Robert Oppenheimer earned him an Academy Award for Best Actor.\n\nFrom 2013 to 2022, Murphy starred as Tommy Shelby in the BBC period crime drama 'Peaky Blinders', a role that has become one of his most recognized performances. Throughout his career, Murphy has been praised for his versatility, intensity, and distinctive screen presence.\n\nDespite his success, Murphy is known for maintaining a low profile and focusing on his craft rather than celebrity. He lives in Dublin with his wife and two children, deliberately keeping his distance from Hollywood to maintain a normal family life.",
  },
  stats: {
    totalFilms: 38,
    totalAwards: 42,
    averageRating: 7.9,
    yearsActive: "1998 - Present",
  },
  industryProId: "cillian-murphy-pro",
}

export default function CillianMurphyPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.div
      className="min-h-screen bg-[#1A1A1A] text-white pb-16"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Hero Section */}
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00BFFF]/10 to-[#1A1A1A] z-0"></div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div className="flex flex-col md:flex-row items-center md:items-start gap-8" variants={itemVariants}>
            {/* Profile Image */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-[#00BFFF]/20">
              <Image
                src={person.profileImage || "/placeholder.svg"}
                alt={person.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 256px"
                priority
              />
              {person.isVerified && (
                <div className="absolute bottom-2 right-2 bg-[#00BFFF] rounded-full p-1">
                  <Award size={16} className="text-white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
                <h1 className="text-3xl md:text-4xl font-bold">{person.name}</h1>
                {person.isVerified && (
                  <Badge className="bg-[#00BFFF] text-white ml-0 md:ml-2">
                    <Award size={12} className="mr-1" />
                    Verified Professional
                  </Badge>
                )}
              </div>

              <p className="text-xl text-gray-300 mt-2">{person.primaryRole}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <div className="flex items-center text-gray-300">
                  <Calendar size={16} className="mr-2 text-[#00BFFF]" />
                  <span>{person.stats.yearsActive}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin size={16} className="mr-2 text-[#00BFFF]" />
                  <span>{person.birthPlace}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Flag size={16} className="mr-2 text-[#00BFFF]" />
                  <span>{person.nationality}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 max-w-md">
                <div className="bg-[#282828] rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-[#00BFFF]">{person.stats.totalFilms}</p>
                  <p className="text-xs text-gray-400">Films</p>
                </div>
                <div className="bg-[#282828] rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-[#00BFFF]">{person.stats.totalAwards}</p>
                  <p className="text-xs text-gray-400">Awards</p>
                </div>
                <div className="bg-[#282828] rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center">
                    <p className="text-2xl font-bold text-[#00BFFF]">{person.stats.averageRating}</p>
                    <Star size={14} className="text-[#00BFFF] ml-1" />
                  </div>
                  <p className="text-xs text-gray-400">Avg Rating</p>
                </div>
              </div>

              <div className="flex gap-2 mt-6 justify-center md:justify-start">
                <Button className="bg-[#00BFFF] hover:bg-[#00BFFF]/90">
                  <Heart size={16} className="mr-2" />
                  Follow
                </Button>
                <Button variant="outline" className="border-gray-700">
                  <Share2 size={16} className="mr-2" />
                  Share
                </Button>
                {person.industryProId && (
                  <Button variant="outline" className="border-[#00BFFF] text-[#00BFFF]">
                    <User size={16} className="mr-2" />
                    View Pro Profile
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container mx-auto px-4">
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-x-auto bg-[#282828] p-0 h-auto">
              <TabsTrigger
                value="overview"
                className="py-4 px-6 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="filmography"
                className="py-4 px-6 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
              >
                Filmography
              </TabsTrigger>
              <TabsTrigger
                value="biography"
                className="py-4 px-6 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
              >
                Biography
              </TabsTrigger>
              <TabsTrigger
                value="awards"
                className="py-4 px-6 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
              >
                Awards
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="py-4 px-6 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
              >
                Gallery
              </TabsTrigger>
              <TabsTrigger
                value="related"
                className="py-4 px-6 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
              >
                Related People
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <motion.div className="mb-8" variants={itemVariants}>
                    <h2 className="text-2xl font-bold mb-4">Biography</h2>
                    <p className="text-gray-300 leading-relaxed">{person.biography.short}</p>
                    <Button variant="link" className="text-[#00BFFF] p-0 h-auto mt-2">
                      Read full biography
                    </Button>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <KnownForSection personId={person.id} />
                  </motion.div>

                  <motion.div className="mt-8" variants={itemVariants}>
                    <CareerHighlights personId={person.id} />
                  </motion.div>
                </div>

                <div className="space-y-8">
                  <motion.div variants={itemVariants}>
                    <QuickFacts person={person} />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <SocialLinks personId={person.id} />
                  </motion.div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="filmography" className="mt-6">
              <FilmographySection personId={person.id} />
            </TabsContent>

            <TabsContent value="biography" className="mt-6">
              <BiographySection person={person} />
            </TabsContent>

            <TabsContent value="awards" className="mt-6">
              <AwardsSection personId={person.id} />
            </TabsContent>

            <TabsContent value="gallery" className="mt-6">
              <GallerySection personId={person.id} />
            </TabsContent>

            <TabsContent value="related" className="mt-6">
              <RelatedPeopleSection personId={person.id} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  )
}
