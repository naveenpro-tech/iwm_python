"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Film, Tv, Theater, ShoppingBag, Briefcase, Calendar, ArrowUpDown, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import type { TalentProfile, ProjectExperience } from "../../types"

interface ProfileExperienceProps {
  profile: TalentProfile
}

export function ProfileExperience({ profile }: ProfileExperienceProps) {
  const [viewType, setViewType] = useState<"timeline" | "grid">("timeline")
  const [filterType, setFilterType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")

  // Filter and sort experience
  const filteredExperience = profile.experience
    .filter((exp) => filterType === "all" || exp.productionType === filterType)
    .sort((a, b) => (sortBy === "newest" ? b.year - a.year : a.year - b.year))

  const getProductionTypeIcon = (type: string) => {
    switch (type) {
      case "film":
        return <Film className="w-5 h-5" />
      case "tv":
        return <Tv className="w-5 h-5" />
      case "theater":
        return <Theater className="w-5 h-5" />
      case "commercial":
        return <ShoppingBag className="w-5 h-5" />
      default:
        return <Briefcase className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Experience & Filmography</CardTitle>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
                  <Filter className="w-4 h-4 mr-2" />
                  {filterType === "all" ? "All Types" : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#282828] border-[#3A3A3A] text-white">
                <DropdownMenuItem onClick={() => setFilterType("all")} className="hover:bg-[#3A3A3A] cursor-pointer">
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("film")} className="hover:bg-[#3A3A3A] cursor-pointer">
                  <Film className="w-4 h-4 mr-2" />
                  Film
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("tv")} className="hover:bg-[#3A3A3A] cursor-pointer">
                  <Tv className="w-4 h-4 mr-2" />
                  TV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterType("theater")}
                  className="hover:bg-[#3A3A3A] cursor-pointer"
                >
                  <Theater className="w-4 h-4 mr-2" />
                  Theater
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterType("commercial")}
                  className="hover:bg-[#3A3A3A] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Commercial
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("other")} className="hover:bg-[#3A3A3A] cursor-pointer">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Other
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  {sortBy === "newest" ? "Newest First" : "Oldest First"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#282828] border-[#3A3A3A] text-white">
                <DropdownMenuItem onClick={() => setSortBy("newest")} className="hover:bg-[#3A3A3A] cursor-pointer">
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("oldest")} className="hover:bg-[#3A3A3A] cursor-pointer">
                  Oldest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex bg-[#1A1A1A] rounded-md">
              <Button
                variant={viewType === "timeline" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("timeline")}
                className={viewType === "timeline" ? "bg-[#00BFFF] text-black" : "text-gray-400"}
              >
                <Calendar className="w-4 h-4" />
              </Button>
              <Button
                variant={viewType === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("grid")}
                className={viewType === "grid" ? "bg-[#00BFFF] text-black" : "text-gray-400"}
              >
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                </div>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredExperience.length > 0 ? (
            viewType === "timeline" ? (
              <TimelineView experience={filteredExperience} />
            ) : (
              <GridView experience={filteredExperience} />
            )
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No experience added yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function TimelineView({ experience }: { experience: ProjectExperience[] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  }

  // Group by year
  const experienceByYear: Record<number, ProjectExperience[]> = {}
  experience.forEach((exp) => {
    if (!experienceByYear[exp.year]) {
      experienceByYear[exp.year] = []
    }
    experienceByYear[exp.year].push(exp)
  })

  // Sort years in descending order
  const sortedYears = Object.keys(experienceByYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <motion.div
      className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-0 before:h-full before:w-0.5 before:bg-[#3A3A3A]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {sortedYears.map((year) => (
        <div key={year} className="mb-8">
          <div className="absolute left-0 w-6 h-6 rounded-full bg-[#00BFFF] text-black flex items-center justify-center text-xs font-bold">
            {year.toString().substring(2)}
          </div>
          <div className="text-lg font-bold mb-4">{year}</div>

          <div className="space-y-4">
            {experienceByYear[year].map((exp) => (
              <motion.div key={exp.id} className="bg-[#1A1A1A] p-4 rounded-lg" variants={itemVariants}>
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-[#3A3A3A] rounded-lg flex items-center justify-center">
                      {exp.media && exp.media[0] ? (
                        <Image
                          src={exp.media[0].url || "/placeholder.svg"}
                          alt={exp.title}
                          width={64}
                          height={64}
                          className="object-cover rounded-lg w-full h-full"
                        />
                      ) : (
                        getProductionTypeIcon(exp.productionType)
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <h3 className="text-lg font-medium">{exp.title}</h3>
                      <Badge className="bg-[#3A3A3A] text-white self-start md:self-auto mt-1 md:mt-0">
                        {exp.productionType.charAt(0).toUpperCase() + exp.productionType.slice(1)}
                      </Badge>
                    </div>

                    <p className="text-[#00BFFF] mt-1">{exp.role}</p>

                    {exp.company && (
                      <p className="text-sm text-gray-400 mt-1">
                        {exp.director ? `Dir: ${exp.director}` : ""}
                        {exp.director && exp.company ? " • " : ""}
                        {exp.company}
                      </p>
                    )}

                    {exp.description && <p className="mt-3 text-sm text-gray-300">{exp.description}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  )
}

function GridView({ experience }: { experience: ProjectExperience[] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {experience.map((exp) => (
        <motion.div
          key={exp.id}
          className="bg-[#1A1A1A] rounded-lg overflow-hidden"
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="h-32 bg-[#3A3A3A] relative">
            {exp.media && exp.media[0] ? (
              <Image src={exp.media[0].url || "/placeholder.svg"} alt={exp.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {getProductionTypeIcon(exp.productionType)}
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Badge className="bg-[#00BFFF] text-black">{exp.year}</Badge>
            </div>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-medium line-clamp-1">{exp.title}</h3>
              <Badge variant="outline" className="border-[#3A3A3A] text-gray-400 text-xs">
                {exp.productionType.charAt(0).toUpperCase() + exp.productionType.slice(1)}
              </Badge>
            </div>

            <p className="text-[#00BFFF] text-sm mt-1">{exp.role}</p>

            {exp.company && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{exp.company}</p>}

            {exp.description && <p className="mt-2 text-xs text-gray-300 line-clamp-2">{exp.description}</p>}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

function getProductionTypeIcon(type: string) {
  switch (type) {
    case "film":
      return <Film className="w-8 h-8 text-gray-500" />
    case "tv":
      return <Tv className="w-8 h-8 text-gray-500" />
    case "theater":
      return <Theater className="w-8 h-8 text-gray-500" />
    case "commercial":
      return <ShoppingBag className="w-8 h-8 text-gray-500" />
    default:
      return <Briefcase className="w-8 h-8 text-gray-500" />
  }
}
