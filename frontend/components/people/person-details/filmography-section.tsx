"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Award, Filter, Grid, List, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilmographySectionProps {
  personId: string | number
}

export function FilmographySection({ personId }: FilmographySectionProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("year-desc")
  const [filterRole, setFilterRole] = useState("all")

  // Mock filmography data
  const filmography = [
    {
      id: 1,
      title: "Oppenheimer",
      year: 2023,
      role: "Director",
      poster: "/placeholder.svg?height=600&width=400&query=oppenheimer%20movie%20poster",
      rating: 8.5,
      awards: ["Oscar Winner", "Golden Globe Winner"],
      plot: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    },
    {
      id: 2,
      title: "Tenet",
      year: 2020,
      role: "Director",
      poster: "/placeholder.svg?height=600&width=400&query=tenet%20movie%20poster",
      rating: 7.4,
      awards: [],
      plot: "Armed with only one word, Tenet, and fighting for the survival of the entire world, a Protagonist journeys through a twilight world of international espionage on a mission that will unfold in something beyond real time.",
    },
    {
      id: 3,
      title: "Dunkirk",
      year: 2017,
      role: "Director",
      poster: "/dunkirk-poster.png",
      rating: 7.8,
      awards: ["Oscar Winner"],
      plot: "Allied soldiers from Belgium, the British Commonwealth and Empire, and France are surrounded by the German Army and evacuated during a fierce battle in World War II.",
    },
    {
      id: 4,
      title: "Interstellar",
      year: 2014,
      role: "Director",
      poster: "/placeholder.svg?height=600&width=400&query=interstellar%20movie%20poster",
      rating: 8.6,
      awards: ["Oscar Winner"],
      plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    },
    {
      id: 5,
      title: "The Dark Knight Rises",
      year: 2012,
      role: "Director",
      poster: "/dark-knight-rises-inspired-poster.png",
      rating: 8.4,
      awards: [],
      plot: "Eight years after the Joker's reign of anarchy, Batman, with the help of the enigmatic Catwoman, is forced from his exile to save Gotham City from the brutal guerrilla terrorist Bane.",
    },
    {
      id: 6,
      title: "Inception",
      year: 2010,
      role: "Director",
      poster: "/inception-movie-poster.png",
      rating: 8.8,
      awards: ["Oscar Winner", "BAFTA Winner"],
      plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    },
    {
      id: 7,
      title: "The Dark Knight",
      year: 2008,
      role: "Director",
      poster: "/dark-knight-poster.png",
      rating: 9.0,
      awards: ["Oscar Winner", "BAFTA Winner", "Golden Globe Winner"],
      plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    },
    {
      id: 8,
      title: "The Prestige",
      year: 2006,
      role: "Director",
      poster: "/prestige-poster.png",
      rating: 8.5,
      awards: [],
      plot: "After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.",
    },
  ]

  // Filter and sort the filmography
  const filteredFilmography = filmography
    .filter((film) => {
      // Apply role filter
      if (filterRole !== "all" && film.role !== filterRole) {
        return false
      }

      // Apply search filter
      if (searchQuery && !film.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case "year-desc":
          return b.year - a.year
        case "year-asc":
          return a.year - b.year
        case "rating-desc":
          return b.rating - a.rating
        case "rating-asc":
          return a.rating - b.rating
        case "title-asc":
          return a.title.localeCompare(b.title)
        case "title-desc":
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

  // Group films by decade for the decade view
  const filmsByDecade = filteredFilmography.reduce(
    (acc, film) => {
      const decade = Math.floor(film.year / 10) * 10
      if (!acc[decade]) {
        acc[decade] = []
      }
      acc[decade].push(film)
      return acc
    },
    {} as Record<number, typeof filmography>,
  )

  // Group films by role for the role view
  const filmsByRole = filteredFilmography.reduce(
    (acc, film) => {
      if (!acc[film.role]) {
        acc[film.role] = []
      }
      acc[film.role].push(film)
      return acc
    },
    {} as Record<string, typeof filmography>,
  )

  // Animation variants
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
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search filmography..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#282828] border-gray-700 focus:border-[#00BFFF] focus:ring-[#00BFFF]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px] bg-[#282828] border-gray-700">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Director">Director</SelectItem>
              <SelectItem value="Writer">Writer</SelectItem>
              <SelectItem value="Producer">Producer</SelectItem>
              <SelectItem value="Actor">Actor</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-[#282828] border-gray-700">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year-desc">Newest First</SelectItem>
              <SelectItem value="year-asc">Oldest First</SelectItem>
              <SelectItem value="rating-desc">Highest Rated</SelectItem>
              <SelectItem value="rating-asc">Lowest Rated</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>

          <div className="border border-gray-700 rounded-md flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={`rounded-r-none ${viewMode === "grid" ? "bg-[#282828]" : ""}`}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <Grid size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={`rounded-l-none ${viewMode === "list" ? "bg-[#282828]" : ""}`}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <List size={18} />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="chronological" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto bg-[#282828] p-0 h-auto mb-6">
          <TabsTrigger
            value="chronological"
            className="py-2 px-4 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
          >
            Chronological
          </TabsTrigger>
          <TabsTrigger
            value="by-decade"
            className="py-2 px-4 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
          >
            By Decade
          </TabsTrigger>
          <TabsTrigger
            value="by-role"
            className="py-2 px-4 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
          >
            By Role
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chronological">
          {viewMode === "grid" ? (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredFilmography.map((film) => (
                <FilmCard key={film.id} film={film} variants={itemVariants} />
              ))}
            </motion.div>
          ) : (
            <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
              {filteredFilmography.map((film) => (
                <FilmListItem key={film.id} film={film} variants={itemVariants} />
              ))}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="by-decade">
          <div className="space-y-8">
            {Object.entries(filmsByDecade)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([decade, films]) => (
                <div key={decade}>
                  <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">{decade}s</h3>
                  {viewMode === "grid" ? (
                    <motion.div
                      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {films.map((film) => (
                        <FilmCard key={film.id} film={film} variants={itemVariants} />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                      {films.map((film) => (
                        <FilmListItem key={film.id} film={film} variants={itemVariants} />
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="by-role">
          <div className="space-y-8">
            {Object.entries(filmsByRole).map(([role, films]) => (
              <div key={role}>
                <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">As {role}</h3>
                {viewMode === "grid" ? (
                  <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {films.map((film) => (
                      <FilmCard key={film.id} film={film} variants={itemVariants} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                    {films.map((film) => (
                      <FilmListItem key={film.id} film={film} variants={itemVariants} />
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredFilmography.length === 0 && (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No films match your filters</h3>
          <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setFilterRole("all")
              setSortBy("year-desc")
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  )
}

interface FilmCardProps {
  film: {
    id: number
    title: string
    year: number
    role: string
    poster: string
    rating: number
    awards: string[]
  }
  variants: any
}

function FilmCard({ film, variants }: FilmCardProps) {
  return (
    <motion.div
      variants={variants}
      className="bg-[#282828] rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors"
    >
      <Link href={`/movies/${film.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={film.poster || "/placeholder.svg"}
            alt={film.title}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
          {film.awards.length > 0 && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-[#FFD700] text-black">
                <Award size={12} className="mr-1" />
                Award Winner
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-lg line-clamp-1">{film.title}</h3>
            <span className="text-gray-400 text-sm">{film.year}</span>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">{film.role}</p>
            <div className="flex items-center">
              <Star size={14} className="text-[#00BFFF] mr-1" />
              <span className="text-sm font-medium">{film.rating}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

interface FilmListItemProps {
  film: {
    id: number
    title: string
    year: number
    role: string
    poster: string
    rating: number
    awards: string[]
    plot: string
  }
  variants: any
}

function FilmListItem({ film, variants }: FilmListItemProps) {
  return (
    <motion.div
      variants={variants}
      className="bg-[#282828] rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors"
    >
      <Link href={`/movies/${film.id}`} className="flex">
        <div className="relative w-24 sm:w-36 shrink-0">
          <Image
            src={film.poster || "/placeholder.svg"}
            alt={film.title}
            width={144}
            height={216}
            className="object-cover h-full"
          />
        </div>

        <div className="p-4 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h3 className="font-semibold text-lg">{film.title}</h3>
                <span className="text-gray-400 text-sm ml-2">({film.year})</span>
              </div>
              <p className="text-sm text-gray-400">{film.role}</p>
            </div>

            <div className="flex items-center bg-[#1A1A1A] px-2 py-1 rounded">
              <Star size={14} className="text-[#00BFFF] mr-1" />
              <span className="text-sm font-medium">{film.rating}</span>
            </div>
          </div>

          <p className="text-sm text-gray-300 mt-2 line-clamp-2">{film.plot}</p>

          {film.awards.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {film.awards.map((award, index) => (
                <Badge key={index} variant="outline" className="text-xs border-[#FFD700] text-[#FFD700]">
                  <Award size={10} className="mr-1" />
                  {award}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
