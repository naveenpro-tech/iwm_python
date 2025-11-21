{
  ;`'use client'

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Share2, Info, Film } from 'lucide-react'
import { MovieSearchInput } from "@/components/compare/movie-search-input"
import { ComparisonContainer } from "@/components/compare/comparison-container"
import { EmptyComparisonState } from "@/components/compare/empty-comparison-state"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"
import { parseMovieIds, stringifyMovieIds } from "@/lib/url-helpers"
import { useToast } from "@/hooks/use-toast"
import type { MovieComparisonData } from "@/components/compare/types"

// Enhanced Mock Data for demonstration
const MOCK_MOVIES_FULL_DATA: MovieComparisonData[] = [
  {
    id: "inception",
    title: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    runtime: 148,
    genres: ["Sci-Fi", "Action", "Thriller"],
    sidduScore: 92,
    criticScore: 87,
    audienceScore: 91,
    synopsis: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into a C.E.O.'s mind.",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    poster: "/inception-movie-poster.png",
    productionDetails: { budget: "$160 Million", studio: "Warner Bros. / Legendary", country: "USA / UK", language: "English" },
    boxOffice: { worldwide: "$836.8 Million", domestic: "$292.6 Million", openingWeekendUSA: "$62.8 Million" },
    awardsSummary: "Winner of 4 Oscars",
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    cinematographer: "Wally Pfister",
    composer: "Hans Zimmer",
    keyThemes: ["Dreams", "Reality", "Grief", "Heist"],
    visualStyle: "Sleek, Complex, Mind-bending",
    emotionalImpact: "Thrilling, Thought-provoking",
    targetAudience: "Mature Audiences, Sci-Fi Fans"
  },
  {
    id: "interstellar",
    title: "Interstellar",
    year: 2014,
    director: "Christopher Nolan",
    runtime: 169,
    genres: ["Sci-Fi", "Drama", "Adventure"],
    sidduScore: 94,
    criticScore: 74,
    audienceScore: 86,
    synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    poster: "/interstellar-poster.png",
    productionDetails: { budget: "$165 Million", studio: "Paramount / Warner Bros.", country: "USA / UK / Canada", language: "English" },
    boxOffice: { worldwide: "$701.7 Million", domestic: "$188.0 Million", openingWeekendUSA: "$47.5 Million" },
    awardsSummary: "Winner of 1 Oscar (Visual Effects)",
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    cinematographer: "Hoyte van Hoytema",
    composer: "Hans Zimmer",
    keyThemes: ["Love", "Sacrifice", "Time Dilation", "Survival"],
    visualStyle: "Epic, Cosmic, Grounded Sci-Fi",
    emotionalImpact: "Awe-inspiring, Emotional",
    targetAudience: "Sci-Fi Fans, Families (PG-13)"
  },
  {
    id: "the-dark-knight",
    title: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
    runtime: 152,
    genres: ["Action", "Crime", "Drama"],
    sidduScore: 96,
    criticScore: 84, // Adjusted to common critic score
    audienceScore: 94,
    synopsis: "When the menace known as the Joker wreaks havoc on Gotham, Batman must face one of his greatest psychological and physical tests.",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    poster: "/dark-knight-poster.png",
    productionDetails: { budget: "$185 Million", studio: "Warner Bros. / Legendary", country: "USA / UK", language: "English" },
    boxOffice: { worldwide: "$1.006 Billion", domestic: "$534.9 Million", openingWeekendUSA: "$158.4 Million" },
    awardsSummary: "Winner of 2 Oscars (Heath Ledger, Sound Editing)",
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    cinematographer: "Wally Pfister",
    composer: "Hans Zimmer & James Newton Howard",
    keyThemes: ["Order vs. Chaos", "Morality", "Sacrifice"],
    visualStyle: "Gritty, Realistic, Dark",
    emotionalImpact: "Intense, Gripping",
    targetAudience: "Action Fans, Comic Book Fans"
  },
  {
    id: "parasite",
    title: "Parasite",
    year: 2019,
    director: "Bong Joon Ho",
    runtime: 132,
    genres: ["Thriller", "Drama", "Comedy"],
    sidduScore: 95,
    criticScore: 96,
    audienceScore: 90,
    synopsis: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
    poster: "/parasite-movie-poster.png",
    productionDetails: { budget: "$11.4 Million", studio: "Barunson E&A", country: "South Korea", language: "Korean" },
    boxOffice: { worldwide: "$263.1 Million", domestic: "$53.4 Million", openingWeekendUSA: "$393,216 (Limited)" },
    awardsSummary: "Winner of 4 Oscars (Best Picture, Director, Int'l Film, Original Screenplay)",
    trailerUrl: "https://www.youtube.com/watch?v=5xH0HfJHsaY",
    cinematographer: "Hong Kyung-pyo",
    composer: "Jung Jae-il",
    keyThemes: ["Class Struggle", "Social Inequality", "Deception"],
    visualStyle: "Sharp, Symbolic, Claustrophobic",
    emotionalImpact: "Unsettling, Provocative",
    targetAudience: "Mature Audiences, Arthouse Fans"
  },
   {
    id: "oppenheimer",
    title: "Oppenheimer",
    year: 2023,
    director: "Christopher Nolan",
    runtime: 180,
    genres: ["Biography", "Drama", "History"],
    sidduScore: 93,
    criticScore: 88,
    audienceScore: 91,
    synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon"],
    poster: "/oppenheimer-inspired-poster.png",
    productionDetails: { budget: "$100 Million", studio: "Universal Pictures / Syncopy", country: "USA / UK", language: "English" },
    boxOffice: { worldwide: "$952 Million", domestic: "$326 Million", openingWeekendUSA: "$82.4 Million" },
    awardsSummary: "Winner of 7 Oscars (Best Picture, Director, Actor, etc.)",
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    cinematographer: "Hoyte van Hoytema",
    composer: "Ludwig Göransson",
    keyThemes: ["Ethics of Science", "Power", "Consequences", "History"],
    visualStyle: "Grand, Intense, Historical",
    emotionalImpact: "Powerful, Sobering",
    targetAudience: "History Buffs, Drama Enthusiasts"
  },
];


export default function CompareMoviesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const MAX_COMPARISON_MOVIES = 3;

  const initialMovieIds = parseMovieIds(searchParams.get("movies") || "")
  const [selectedMovieIds, setSelectedMovieIds] = useState<string[]>(initialMovieIds.slice(0, MAX_COMPARISON_MOVIES))
  const [isLoading, setIsLoading] = useState(initialMovieIds.length > 0)
  const [moviesToCompare, setMoviesToCompare] = useState<MovieComparisonData[]>([])

  useEffect(() => {
    const currentQueryIds = parseMovieIds(searchParams.get("movies") || "")
    if (JSON.stringify(selectedMovieIds.sort()) !== JSON.stringify(currentQueryIds.sort())) {
      const newParams = stringifyMovieIds(selectedMovieIds)
      if (newParams) {
        router.push(\`/compare?movies=\${newParams}\`, { scroll: false })
      } else {
        router.push("/compare", { scroll: false })
      }
    }

    if (selectedMovieIds.length > 0) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const fetchedMovies = selectedMovieIds
          .map((id) => MOCK_MOVIES_FULL_DATA.find((m) => m.id === id))
          .filter(Boolean) as MovieComparisonData[]
        setMoviesToCompare(fetchedMovies)
        setIsLoading(false)
      }, 500)
    } else {
      setMoviesToCompare([])
      setIsLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMovieIds]) // Removed router and searchParams to prevent loops

  const handleAddMovie = useCallback((movieId: string) => {
    if (selectedMovieIds.length >= MAX_COMPARISON_MOVIES) {
      toast({
        title: "Maximum movies reached",
        description: \`You can compare up to \${MAX_COMPARISON_MOVIES} movies at a time.\`,
        variant: "destructive",
      })
      return
    }

    if (!selectedMovieIds.includes(movieId)) {
      setSelectedMovieIds((prevIds) => [...prevIds, movieId])
    } else {
      toast({
        title: "Movie already added",
        description: "This movie is already in your comparison list.",
      })
    }
  }, [selectedMovieIds, toast])

  const handleRemoveMovie = useCallback((movieId: string) => {
    setSelectedMovieIds((prevIds) => prevIds.filter((id) => id !== movieId))
  }, [])

  const handleClearAll = useCallback(() => {
    setSelectedMovieIds([])
  }, [])

  const handleShare = useCallback(() => {
    if (selectedMovieIds.length === 0) {
      toast({
        title: "No movies to share",
        description: "Please add movies to compare before sharing.",
      })
      return
    }
    const url = \`\${window.location.origin}/compare?movies=\${stringifyMovieIds(selectedMovieIds)}\`
    navigator.clipboard.writeText(url)
    toast({
      title: "Link copied!",
      description: "Comparison link has been copied to your clipboard.",
      className: "bg-green-600 border-green-700 text-white"
    })
  }, [selectedMovieIds, toast])

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white pb-20">
      <motion.div
        className="container mx-auto px-4 py-8"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-siddu-electric-blue to-siddu-accent-yellow">
            Compare Movies
          </h1>
          <p className="text-gray-400">
            Side-by-side analysis of your favorite films. Add up to {MAX_COMPARISON_MOVIES} movies.
          </p>
        </header>

        <motion.div
          className="mb-8 p-4 bg-siddu-bg-card-dark rounded-lg shadow-lg border border-siddu-border-subtle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-2">
            <MovieSearchInput
              onSelectMovie={handleAddMovie}
              currentSelectionIds={selectedMovieIds}
              maxSelection={MAX_COMPARISON_MOVIES}
            />
            <div className="flex gap-2 flex-wrap">
              {selectedMovieIds.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearAll} className="text-gray-400 hover:text-white border-gray-600 hover:border-gray-500">
                  <X className="h-4 w-4 mr-1" />
                  Clear All ({selectedMovieIds.length})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                disabled={selectedMovieIds.length === 0}
                className="text-siddu-electric-blue hover:text-white border-siddu-electric-blue hover:bg-siddu-electric-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share Comparison
              </Button>
            </div>
          </div>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <Info className="h-3 w-3 mr-1" />
            <span>Select movies using the search bar to begin comparison.</span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedMovieIds.length > 0 ? (
            <ComparisonContainer
              movies={moviesToCompare}
              isLoading={isLoading}
              onRemoveMovie={handleRemoveMovie}
            />
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <EmptyComparisonState />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}`
}
