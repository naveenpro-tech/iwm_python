"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Filter,
  Search,
  ListFilter,
  Eye,
  EyeOff,
  ThumbsUp,
  CalendarDays,
  Users,
  CheckCircle,
  ShieldAlert,
  Lightbulb,
  Puzzle,
} from "lucide-react"
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation"
import { MovieDetailsNavigation } from "@/components/movie-details-navigation"
import { TriviaItem } from "@/components/trivia/trivia-item"
import { TriviaContributionForm } from "@/components/trivia/trivia-contribution-form"
import type { Trivia, NewTriviaData } from "@/components/trivia/types"
import { triviaCategoriesList } from "@/components/trivia/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import MovieTriviaPageSkeleton from "./loading" // Assuming you have this

// Enhanced Mock data for trivia items
const MOCK_TRIVIA_ITEMS_INITIAL: Trivia[] = [
  {
    id: "1",
    content:
      "The iconic spinning top at the end of the film was achieved practically, without the use of CGI. Christopher Nolan has stated that the ambiguity of the ending was deliberate, leaving it up to the audience to decide whether Cobb was still dreaming or had returned to reality. This single prop became a major discussion point among fans for years.",
    category: "production",
    source: "Director's Commentary, 'The Nolan Variations' by Tom Shone",
    submittedBy: "FilmBuff42",
    submittedDate: "2023-03-15T10:30:00Z",
    verified: true,
    spoiler: true,
    upvotes: 342,
    downvotes: 12,
    userVote: null,
    mediaUrl: "/inception-spinning-top.png",
    mediaType: "image",
    isFavorited: false,
    tags: ["ending", "practical-effects", "symbolism"],
  },
  {
    id: "2",
    content:
      "Leonardo DiCaprio was Christopher Nolan's first and only choice for the role of Dom Cobb. DiCaprio was so intrigued by the complex script that he flew to London specifically to meet with Nolan and discuss the character in depth before officially signing on.",
    category: "cast-crew",
    source: "Interview with Leonardo DiCaprio, Empire Magazine",
    submittedBy: "MovieExpert",
    submittedDate: "2023-01-08T14:00:00Z",
    verified: true,
    spoiler: false,
    upvotes: 287,
    downvotes: 5,
    userVote: "up",
    isFavorited: true,
    tags: ["casting", "leonardo-dicaprio"],
  },
  {
    id: "3",
    content:
      "The zero-gravity hallway fight scene, a standout sequence, took three weeks to film. It utilized a massive rotating corridor set, allowing actors like Joseph Gordon-Levitt to perform stunts that appeared weightless with minimal CGI enhancement.",
    category: "production",
    source: "https://www.youtube.com/watch?v=85oUaG6KkFA", // Example video link
    submittedBy: "CinematicWonder",
    submittedDate: "2023-02-22T09:15:00Z",
    verified: true,
    spoiler: false,
    upvotes: 412,
    downvotes: 8,
    userVote: null,
    mediaType: "video", // This would be a placeholder, real video needs iframe
    mediaUrl: "/inception-scene-thumbnail.png", // Thumbnail for video
    isFavorited: false,
    tags: ["stunts", "visual-effects", "hallway-fight"],
  },
  {
    id: "4",
    content:
      "The character of Mal, Cobb's deceased wife played by Marion Cotillard, is named after the French word 'mal' which translates to 'bad' or 'evil'. This subtly foreshadows her antagonistic and disruptive presence within Cobb's subconscious.",
    category: "plot-details",
    submittedBy: "FilmAnalyst",
    submittedDate: "2023-04-03T18:45:00Z",
    verified: false,
    spoiler: true,
    upvotes: 156,
    downvotes: 43,
    userVote: null,
    isFavorited: true,
    tags: ["character-names", "foreshadowing", "mal"],
  },
  {
    id: "5",
    content:
      "The distinctive 'BRAAAM' sound in Hans Zimmer's score, often associated with the film, was partly created by slowing down Édith Piaf's 'Non, Je Ne Regrette Rien'. This song is also used as the primary kick signal in the dream layers. Marion Cotillard, who plays Mal, won an Oscar for portraying Piaf in 'La Vie en Rose' (2007).",
    category: "soundtrack-music",
    source: "Interview with Hans Zimmer, SoundWorks Collection",
    submittedBy: "SoundtrackLover",
    submittedDate: "2023-05-17T11:00:00Z",
    verified: true,
    spoiler: false,
    upvotes: 298,
    downvotes: 7,
    userVote: "down",
    isFavorited: false,
    tags: ["hans-zimmer", "sound-design", "edith-piaf", "easter-egg"],
  },
]

export default function MovieTriviaPage({ params }: { params: { id: string } }) {
  const [triviaItems, setTriviaItems] = useState<Trivia[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingTrivia, setIsAddingTrivia] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"popular" | "recent">("popular")
  const [showSpoilers, setShowSpoilers] = useState(false)
  const { toast } = useToast()

  const movie = useMemo(() => ({ id: params.id, title: "Inception" }), [params.id]) // Mock movie title

  useEffect(() => {
    // Simulate fetching data
    setIsLoading(true)
    setTimeout(() => {
      setTriviaItems(MOCK_TRIVIA_ITEMS_INITIAL)
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const breadcrumbItems = useMemo(
    () => [
      { label: "Movies", href: "/movies" },
      { label: movie.title, href: `/movies/${movie.id}` },
      { label: "Trivia", href: `/movies/${movie.id}/trivia` },
    ],
    [movie],
  )

  const handleAddTrivia = useCallback(
    (newTriviaData: NewTriviaData) => {
      const newId = `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const tagsArray =
        newTriviaData.tagsInput
          ?.split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag) || []

      const triviaToAdd: Trivia = {
        id: newId,
        content: newTriviaData.content,
        category: newTriviaData.category,
        source: newTriviaData.source,
        submittedBy: "You (DemoUser)",
        submittedDate: newTriviaData.submittedDate,
        verified: false,
        spoiler: newTriviaData.isSpoiler,
        upvotes: 1,
        downvotes: 0,
        userVote: "up",
        isFavorited: false,
        // Mock media handling: if a file is "uploaded", assign a placeholder URL
        mediaUrl: newTriviaData.mediaFile
          ? `/placeholder.svg?height=200&width=400&query=trivia+media+${newTriviaData.mediaFile.name.split(".")[0]}`
          : undefined,
        mediaType: newTriviaData.mediaFile?.type.startsWith("image/")
          ? "image"
          : newTriviaData.mediaFile?.type.startsWith("video/")
            ? "video"
            : undefined,
        tags: tagsArray,
      }

      setTriviaItems((prevItems) => [triviaToAdd, ...prevItems])
      setIsAddingTrivia(false)

      toast({
        title: "Trivia Submitted!",
        description: "Thank you for your contribution. It will be reviewed by our team.",
        variant: "default",
        className: "bg-green-600 border-green-700 text-white",
      })
    },
    [toast],
  )

  const handleVote = useCallback((triviaId: string, voteType: "up" | "down") => {
    setTriviaItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === triviaId) {
          let newUpvotes = item.upvotes
          let newDownvotes = item.downvotes
          let newUserVote: "up" | "down" | null = item.userVote

          if (item.userVote === voteType) {
            newUserVote = null
            if (voteType === "up") newUpvotes--
            else newDownvotes--
          } else {
            if (item.userVote === "up") newUpvotes--
            if (item.userVote === "down") newDownvotes--
            newUserVote = voteType
            if (voteType === "up") newUpvotes++
            else newDownvotes++
          }
          return { ...item, upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote }
        }
        return item
      }),
    )
  }, [])

  const handleReport = useCallback(
    (triviaId: string) => {
      toast({
        title: "Trivia Reported",
        description: `Trivia ID: ${triviaId} has been reported for review.`,
        variant: "default",
        className: "bg-yellow-500 border-yellow-600 text-black",
      })
    },
    [toast],
  )

  const handleShare = useCallback(
    (triviaId: string, content: string) => {
      navigator.clipboard.writeText(
        `Check out this trivia about ${movie.title}: "${content.substring(0, 100)}..." (Trivia ID: ${triviaId})`,
      )
      toast({
        title: "Link Copied!",
        description: "Trivia link copied to clipboard.",
        className: "bg-blue-500 text-white border-blue-600",
      })
    },
    [toast, movie.title],
  )

  const handleFavoriteToggle = useCallback(
    (triviaId: string) => {
      setTriviaItems((prevItems) =>
        prevItems.map((item) => (item.id === triviaId ? { ...item, isFavorited: !item.isFavorited } : item)),
      )
      const item = triviaItems.find((t) => t.id === triviaId)
      if (item) {
        toast({
          title: item.isFavorited ? "Removed from Favorites" : "Added to Favorites",
          description: `Trivia has been ${item.isFavorited ? "removed from" : "added to"} your favorites.`,
          className: item.isFavorited ? "bg-gray-700 text-white" : "bg-pink-500 text-white border-pink-600",
        })
      }
    },
    [toast, triviaItems],
  )

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: triviaItems.length }
    triviaCategoriesList.forEach((cat) => {
      if (cat.value !== "all") {
        counts[cat.value] = triviaItems.filter((item) => item.category === cat.value).length
      }
    })
    return counts
  }, [triviaItems])

  const filteredAndSortedTrivia = useMemo(() => {
    let filtered = triviaItems

    if (activeCategory !== "all") {
      filtered = filtered.filter((trivia) => trivia.category === activeCategory)
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (trivia) =>
          trivia.content.toLowerCase().includes(lowerQuery) ||
          (trivia.source && trivia.source.toLowerCase().includes(lowerQuery)) ||
          trivia.submittedBy.toLowerCase().includes(lowerQuery) ||
          (trivia.tags && trivia.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))),
      )
    }

    if (!showSpoilers) {
      filtered = filtered.filter((trivia) => !trivia.spoiler)
    }

    return [...filtered].sort((a, b) => {
      if (sortOrder === "popular") {
        return (
          b.upvotes - b.downvotes - (a.upvotes - a.downvotes) ||
          new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
        )
      } else {
        return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
      }
    })
  }, [triviaItems, activeCategory, searchQuery, showSpoilers, sortOrder])

  const triviaStats = useMemo(
    () => ({
      total: triviaItems.length,
      verified: triviaItems.filter((t) => t.verified).length,
      spoilers: triviaItems.filter((t) => t.spoiler).length,
      contributors: new Set(triviaItems.map((t) => t.submittedBy)).size,
      categories: triviaItems.reduce((acc: Record<string, number>, trivia) => {
        acc[trivia.category] = (acc[trivia.category] || 0) + 1
        return acc
      }, {}),
    }),
    [triviaItems],
  )

  if (isLoading) {
    return <MovieTriviaPageSkeleton />
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#141414] text-gray-100">
        <MovieDetailsNavigation movieId={movie.id} movieTitle={movie.title} />

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation items={breadcrumbItems} />

          <motion.div
            className="my-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-bold text-white tracking-tight flex items-center">
              <Lightbulb className="w-10 h-10 mr-3 text-[#00BFFF]" />
              {movie.title}: <span className="text-[#00BFFF]">Trivia & Facts</span>
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              Explore fascinating details, behind-the-scenes secrets, and community-shared insights about {movie.title}.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3 xl:w-3/4">
              <div className="bg-[#1C1C1C] rounded-xl p-4 sm:p-6 mb-6 shadow-2xl border border-gray-700/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Search trivia, sources, users, tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-[#282828] border-gray-600 text-white pl-10 focus:border-[#00BFFF] focus:ring-[#00BFFF] w-full"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Select value={sortOrder} onValueChange={(value: "popular" | "recent") => setSortOrder(value)}>
                      <SelectTrigger className="bg-[#282828] border-gray-600 text-gray-300 hover:border-gray-500 min-w-[130px] h-10">
                        <ListFilter className="h-4 w-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Sort by..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[#282828] border-gray-600 text-gray-200">
                        <SelectItem value="popular" className="hover:bg-gray-700">
                          <ThumbsUp className="h-4 w-4 mr-2 inline-block text-green-400" /> Popular
                        </SelectItem>
                        <SelectItem value="recent" className="hover:bg-gray-700">
                          <CalendarDays className="h-4 w-4 mr-2 inline-block text-blue-400" /> Recent
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setShowSpoilers(!showSpoilers)}
                          className={`border-gray-600 ${
                            showSpoilers
                              ? "text-yellow-300 bg-yellow-900/30 hover:bg-yellow-900/40 border-yellow-700"
                              : "text-gray-300 bg-[#282828] hover:bg-gray-700"
                          } h-10 w-10`}
                          aria-label={showSpoilers ? "Hide Spoilers" : "Show Spoilers"}
                        >
                          {showSpoilers ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-black text-white border-gray-700">
                        <p>{showSpoilers ? "Hide Spoilers" : "Show Spoilers"}</p>
                      </TooltipContent>
                    </Tooltip>

                    <Button
                      onClick={() => setIsAddingTrivia((prev) => !prev)}
                      className="bg-[#00BFFF] hover:bg-[#00BFFF]/80 text-white h-10"
                      aria-expanded={isAddingTrivia}
                    >
                      <Plus className="h-5 w-5 mr-1.5" />
                      {isAddingTrivia ? "Close Form" : "Add Trivia"}
                    </Button>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-300">Filter by category:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {triviaCategoriesList.map((category) => (
                      <Badge
                        key={category.value}
                        variant={activeCategory === category.value ? "default" : "outline"}
                        className={`cursor-pointer transition-all duration-200 px-3 py-1.5 text-xs sm:text-sm rounded-full
                        ${
                          activeCategory === category.value
                            ? "bg-[#00BFFF] text-black border-[#00BFFF] hover:bg-[#33CFFF]"
                            : "bg-[#282828] text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
                        }`}
                        onClick={() => setActiveCategory(category.value)}
                      >
                        {category.label} ({categoryCounts[category.value] || 0})
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isAddingTrivia && (
                  <motion.div
                    key="contribution-form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <TriviaContributionForm
                      movieId={movie.id}
                      movieTitle={movie.title}
                      onClose={() => setIsAddingTrivia(false)}
                      onSubmit={handleAddTrivia}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedTrivia.length > 0 ? (
                    filteredAndSortedTrivia.map((trivia) => (
                      <motion.div
                        key={trivia.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <TriviaItem
                          trivia={trivia}
                          onVote={handleVote}
                          onReport={handleReport}
                          onShare={handleShare}
                          onFavoriteToggle={handleFavoriteToggle}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-[#1C1C1C] rounded-lg p-8 text-center border border-gray-700/50"
                    >
                      <Puzzle className="h-16 w-16 text-gray-600 mx-auto mb-6" />
                      <h3 className="text-2xl font-semibold text-white mb-3">No Trivia Found</h3>
                      <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        {activeCategory !== "all" || searchQuery
                          ? "Try adjusting your filters or search query. Perhaps the hidden gems are waiting for a different perspective!"
                          : "Be the first to share an interesting fact about this movie and enlighten the community!"}
                      </p>
                      <Button
                        onClick={() => setIsAddingTrivia(true)}
                        className="bg-[#00BFFF] hover:bg-[#00BFFF]/80 text-white"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Contribute First Trivia
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <aside className="w-full lg:w-1/3 xl:w-1/4">
              <div className="bg-[#1C1C1C] rounded-xl p-6 sticky top-24 shadow-2xl border border-gray-700/50">
                <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">Trivia Insights</h2>
                <div className="space-y-5 text-sm">
                  {[
                    { icon: ListFilter, label: "Total Trivia", value: triviaStats.total, color: "text-[#00BFFF]" },
                    {
                      icon: CheckCircle,
                      label: "Verified Facts",
                      value: triviaStats.verified,
                      color: "text-green-400",
                    },
                    {
                      icon: ShieldAlert,
                      label: "Spoilers Marked",
                      value: triviaStats.spoilers,
                      color: "text-yellow-400",
                    },
                    {
                      icon: Users,
                      label: "Unique Contributors",
                      value: triviaStats.contributors,
                      color: "text-purple-400",
                    },
                  ].map((stat) => (
                    <div key={stat.label} className="flex justify-between items-center">
                      <div className="flex items-center text-gray-300">
                        <stat.icon className={`h-4 w-4 mr-2.5 ${stat.color}`} />
                        {stat.label}
                      </div>
                      <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h2 className="text-lg font-semibold text-white mb-4">Top Categories</h2>
                  <div className="space-y-3 text-sm">
                    {Object.entries(triviaStats.categories)
                      .sort(([, aCount], [, bCount]) => bCount - aCount)
                      .slice(0, 5)
                      .map(([category, count]) => (
                        <div key={category} className="flex justify-between items-center">
                          <span className="text-gray-400 capitalize">{category.replace(/-/g, " ")}</span>
                          <Badge variant="secondary" className="bg-[#282828] text-gray-300 border-gray-600">
                            {count}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h2 className="text-lg font-semibold text-white mb-4">Contribution Guidelines</h2>
                  <ul className="space-y-2.5 text-xs text-gray-400 list-disc list-inside marker:text-[#00BFFF]">
                    <li>Share interesting, factual information.</li>
                    <li>Cite sources for faster verification.</li>
                    <li>Mark spoilers appropriately.</li>
                    <li>Be respectful and follow community rules.</li>
                    <li>Avoid speculation or personal opinions.</li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
