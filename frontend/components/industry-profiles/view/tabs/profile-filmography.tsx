"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Film, Search, Grid, List, Calendar, ExternalLink } from "lucide-react"
import Image from "next/image"
import type { IndustryProfessionalProfile } from "../../types"

interface ProfileFilmographyProps {
  profile: IndustryProfessionalProfile
}

export function ProfileFilmography({ profile }: ProfileFilmographyProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"year" | "title">("year")

  const filteredFilmography = profile.filmography
    ?.filter((film) => film.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "year") {
        return b.year - a.year
      }
      return a.title.localeCompare(b.title)
    })

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
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search filmography..."
              className="pl-10 bg-[#282828] border-[#3A3A3A] focus:border-[#00BFFF]"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy(sortBy === "year" ? "title" : "year")}
            className="border-[#3A3A3A] hover:bg-[#282828]"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Sort by {sortBy === "year" ? "Year" : "Title"}
          </Button>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`border-[#3A3A3A] ${viewMode === "grid" ? "bg-[#3A3A3A]" : "hover:bg-[#282828]"}`}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("list")}
              className={`border-[#3A3A3A] ${viewMode === "list" ? "bg-[#3A3A3A]" : "hover:bg-[#282828]"}`}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filmography Display */}
      {filteredFilmography && filteredFilmography.length > 0 ? (
        viewMode === "grid" ? (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {filteredFilmography.map((film) => (
              <motion.div key={film.id} variants={itemVariants}>
                <Card className="bg-[#282828] border-[#3A3A3A] overflow-hidden hover:border-[#00BFFF] transition-colors cursor-pointer">
                  <div className="relative aspect-[2/3] bg-[#1A1A1A]">
                    {film.posterUrl ? (
                      <Image
                        src={film.posterUrl || "/placeholder.svg"}
                        alt={film.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-12 h-12 text-gray-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-sm text-white/80">{film.role}</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-[#E0E0E0] line-clamp-1">{film.title}</h3>
                    <p className="text-sm text-[#A0A0A0]">{film.year}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div className="space-y-3" initial="hidden" animate="visible" variants={containerVariants}>
            {filteredFilmography.map((film) => (
              <motion.div key={film.id} variants={itemVariants}>
                <Card className="bg-[#282828] border-[#3A3A3A] hover:border-[#00BFFF] transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-28 bg-[#1A1A1A] rounded overflow-hidden flex-shrink-0">
                        {film.posterUrl ? (
                          <Image
                            src={film.posterUrl || "/placeholder.svg"}
                            alt={film.title}
                            width={80}
                            height={112}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Film className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-[#E0E0E0] text-lg">{film.title}</h3>
                            <p className="text-[#00BFFF]">{film.role}</p>
                            <p className="text-sm text-[#A0A0A0] mt-1">{film.year}</p>
                            {film.description && (
                              <p className="text-sm text-[#A0A0A0] mt-2 line-clamp-2">{film.description}</p>
                            )}
                          </div>
                          {film.linkedMovieId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#00BFFF] hover:text-[#00BFFF] hover:bg-[#3A3A3A]"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )
      ) : (
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Film className="w-12 h-12 text-gray-500 mb-4" />
            <p className="text-[#A0A0A0]">No projects found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
