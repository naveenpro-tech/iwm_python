"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Film, Users, TrendingUp, History, Zap, ShieldCheck, Newspaper } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useDebounce } from "@/hooks/use-debounce" // Assuming you have this hook

// Mock search results - replace with actual API calls and types
const mockRecentSearches = ["Inception", "Cricket World Cup 2024", "Christopher Nolan", "Best Action Movies"]
const mockTrendingSearches = [
  "Upcoming Marvel Movies",
  "Top Rated Sci-Fi 2024",
  "India Cricket Team",
  "Oscars 2025 Predictions",
]

interface SearchResultMovie {
  id: string
  title: string
  year: string
  posterUrl?: string
  type: "movie" | "tv"
  slug: string
}
interface SearchResultPerson {
  id: string
  name: string
  imageUrl?: string
  profession: string
  slug: string
}
interface SearchResultPulse {
  id: string
  text: string
  user: string
  userAvatar?: string
  timestamp: string
  slug: string
}
interface SearchResultCricket {
  id: string
  title: string
  type: "match" | "player" | "series"
  date?: string
  teams?: string
  slug: string
}

// Enhanced Mock Search Results
const mockApiSearchResults = (query: string) => {
  if (!query) return { movies: [], people: [], pulse: [], cricket: [] }
  const lowerQuery = query.toLowerCase()
  return {
    movies: [
      {
        id: "1",
        title: "Inception",
        year: "2010",
        posterUrl: "/inception-movie-poster.png",
        type: "movie" as const,
        slug: "inception",
      },
      {
        id: "2",
        title: "The Dark Knight",
        year: "2008",
        posterUrl: "/dark-knight-poster.png",
        type: "movie" as const,
        slug: "the-dark-knight",
      },
      {
        id: "3",
        title: "Stranger Things",
        year: "2016-",
        posterUrl: "/placeholder.svg?width=40&height=60&text=ST",
        type: "tv" as const,
        slug: "stranger-things",
      },
    ].filter((m) => m.title.toLowerCase().includes(lowerQuery)),
    people: [
      {
        id: "p1",
        name: "Christopher Nolan",
        imageUrl: "/christopher-nolan.png",
        profession: "Director",
        slug: "christopher-nolan",
      },
      {
        id: "p2",
        name: "Cillian Murphy",
        imageUrl: "/cillian-murphy-portrait.png",
        profession: "Actor",
        slug: "cillian-murphy",
      },
    ].filter((p) => p.name.toLowerCase().includes(lowerQuery)),
    pulse: [
      {
        id: "pulse1",
        text: `Excited for the new Dune movie! What are your thoughts on ${query}?`,
        user: "MovieFan123",
        userAvatar: "/user-avatar-1.png",
        timestamp: "2h ago",
        slug: "pulse-dune-thoughts",
      },
    ].filter((p) => p.text.toLowerCase().includes(lowerQuery)),
    cricket: [
      {
        id: "c1",
        title: "India vs Australia - T20 World Cup Final",
        type: "match" as const,
        date: "Tomorrow",
        teams: "IND vs AUS",
        slug: "ind-aus-final",
      },
      { id: "c2", title: "Virat Kohli", type: "player" as const, teams: "India", slug: "virat-kohli" },
    ].filter((c) => c.title.toLowerCase().includes(lowerQuery)),
  }
}

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

type ActiveTab = "all" | "movies" | "tv" | "people" | "pulse" | "cricket"

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<ActiveTab>("all")
  const [searchResults, setSearchResults] = useState<ReturnType<typeof mockApiSearchResults>>({
    movies: [],
    people: [],
    pulse: [],
    cricket: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      inputRef.current?.focus()
      setSearchTerm("") // Clear search term when opening
      setActiveTab("all")
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setSearchResults(mockApiSearchResults(debouncedSearchTerm))
        setIsLoading(false)
      }, 500)
    } else {
      setSearchResults({ movies: [], people: [], pulse: [], cricket: [] })
    }
  }, [debouncedSearchTerm])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Can navigate to a full search results page if needed
    if (searchTerm.trim()) {
      onClose() // Close overlay
      // router.push(`/search?q=${encodeURIComponent(searchTerm)}`); // Example navigation
    }
  }

  const resultsAvailable =
    !isLoading &&
    debouncedSearchTerm.trim() !== "" &&
    (searchResults.movies.length > 0 ||
      searchResults.people.length > 0 ||
      searchResults.pulse.length > 0 ||
      searchResults.cricket.length > 0)

  const NoResultsDisplay = () => (
    <div className="text-center py-10">
      <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
      <p className="text-gray-400 text-lg">No results found for "{debouncedSearchTerm}"</p>
      <p className="text-gray-500 text-sm mt-1">Try a different search term or check your spelling.</p>
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex flex-col items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-3xl bg-[#181818] text-white shadow-2xl rounded-b-xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 md:p-5 border-b border-gray-700">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
                <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <Input
                  ref={inputRef}
                  type="search"
                  placeholder="Search Siddu Universe..."
                  className="flex-grow bg-transparent border-0 text-base md:text-lg placeholder-gray-500 focus:ring-0 focus:border-0 focus-visible:ring-offset-0 focus-visible:ring-0 p-0 h-auto"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white rounded-full"
                >
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </Button>
              </form>
            </div>

            <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
              <div className="px-4 md:px-6 py-4 md:py-5">
                {!debouncedSearchTerm.trim() && (
                  <>
                    <SearchSection title="Recent Searches" icon={<History className="h-4 w-4 mr-2 text-primary" />}>
                      {mockRecentSearches.map((term) => (
                        <SearchSuggestionItem key={term} term={term} onClick={() => setSearchTerm(term)} />
                      ))}
                    </SearchSection>
                    <SearchSection
                      title="Trending Searches"
                      icon={<TrendingUp className="h-4 w-4 mr-2 text-primary" />}
                    >
                      {mockTrendingSearches.map((term) => (
                        <SearchSuggestionItem key={term} term={term} onClick={() => setSearchTerm(term)} />
                      ))}
                    </SearchSection>
                  </>
                )}

                {debouncedSearchTerm.trim() && isLoading && (
                  <div className="text-center py-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                    >
                      <Search className="h-10 w-10 text-primary mx-auto" />
                    </motion.div>
                    <p className="text-gray-400 mt-3">Searching...</p>
                  </div>
                )}

                {debouncedSearchTerm.trim() && !isLoading && !resultsAvailable && <NoResultsDisplay />}

                {resultsAvailable && (
                  <>
                    <div className="flex border-b border-gray-700 mb-4 sticky top-0 bg-[#181818] z-10 -mx-4 md:-mx-6 px-4 md:px-6">
                      {(["all", "movies", "tv", "people", "pulse", "cricket"] as ActiveTab[]).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-3 py-2.5 text-xs sm:text-sm font-medium transition-colors focus:outline-none
                        ${activeTab === tab ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-white"}`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>

                    {/* Movies & TV Results */}
                    {(activeTab === "all" || activeTab === "movies" || activeTab === "tv") &&
                      searchResults.movies.length > 0 && (
                        <SearchSection title="Movies & TV Shows" icon={<Film className="h-4 w-4 mr-2 text-primary" />}>
                          {searchResults.movies
                            .filter(
                              (movie) =>
                                activeTab === "all" ||
                                (activeTab === "movies" && movie.type === "movie") ||
                                (activeTab === "tv" && movie.type === "tv"),
                            )
                            .map((movie) => (
                              <Link
                                key={movie.id}
                                href={`/${movie.type === "tv" ? "tv-shows" : "movies"}/${movie.slug}`}
                                passHref
                                legacyBehavior
                              >
                                <a
                                  onClick={onClose}
                                  className="flex items-center p-2.5 hover:bg-gray-700/40 rounded-lg transition-colors"
                                >
                                  <Image
                                    src={
                                      movie.posterUrl ||
                                      `/placeholder.svg?width=48&height=72&text=${movie.title.charAt(0)}`
                                    }
                                    alt={movie.title}
                                    width={48}
                                    height={72}
                                    className="rounded object-cover mr-3.5 shadow-md"
                                  />
                                  <div>
                                    <p className="font-medium text-sm text-gray-100">{movie.title}</p>
                                    <p className="text-xs text-gray-400">
                                      {movie.year} <span className="mx-1">&bull;</span>{" "}
                                      {movie.type === "tv" ? "TV Series" : "Movie"}
                                    </p>
                                  </div>
                                </a>
                              </Link>
                            ))}
                        </SearchSection>
                      )}

                    {/* People Results */}
                    {(activeTab === "all" || activeTab === "people") && searchResults.people.length > 0 && (
                      <SearchSection
                        title="Talent & Professionals"
                        icon={<Users className="h-4 w-4 mr-2 text-primary" />}
                      >
                        {searchResults.people.map((person) => (
                          <Link key={person.id} href={`/people/${person.slug}`} passHref legacyBehavior>
                            <a
                              onClick={onClose}
                              className="flex items-center p-2.5 hover:bg-gray-700/40 rounded-lg transition-colors"
                            >
                              <Image
                                src={
                                  person.imageUrl || `/placeholder.svg?width=48&height=48&text=${person.name.charAt(0)}`
                                }
                                alt={person.name}
                                width={48}
                                height={48}
                                className="rounded-full object-cover mr-3.5 shadow-md"
                              />
                              <div>
                                <p className="font-medium text-sm text-gray-100">{person.name}</p>
                                <p className="text-xs text-gray-400">{person.profession}</p>
                              </div>
                            </a>
                          </Link>
                        ))}
                      </SearchSection>
                    )}

                    {/* Pulse Results */}
                    {(activeTab === "all" || activeTab === "pulse") && searchResults.pulse.length > 0 && (
                      <SearchSection title="Pulse Discussions" icon={<Zap className="h-4 w-4 mr-2 text-primary" />}>
                        {searchResults.pulse.map((item) => (
                          <Link key={item.id} href={`/pulse/${item.slug}`} passHref legacyBehavior>
                            <a
                              onClick={onClose}
                              className="block p-2.5 hover:bg-gray-700/40 rounded-lg transition-colors"
                            >
                              <div className="flex items-start">
                                <Image
                                  src={
                                    item.userAvatar || `/placeholder.svg?width=36&height=36&text=${item.user.charAt(0)}`
                                  }
                                  alt={item.user}
                                  width={36}
                                  height={36}
                                  className="rounded-full object-cover mr-3 mt-0.5 shadow-md"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="font-medium text-xs text-gray-300">{item.user}</p>
                                    <p className="text-xs text-gray-500">{item.timestamp}</p>
                                  </div>
                                  <p className="text-sm text-gray-200 mt-0.5 line-clamp-2">{item.text}</p>
                                </div>
                              </div>
                            </a>
                          </Link>
                        ))}
                      </SearchSection>
                    )}
                    {/* Cricket Results */}
                    {(activeTab === "all" || activeTab === "cricket") && searchResults.cricket.length > 0 && (
                      <SearchSection title="Cricket Zone" icon={<ShieldCheck className="h-4 w-4 mr-2 text-primary" />}>
                        {" "}
                        {/* Placeholder icon */}
                        {searchResults.cricket.map((item) => (
                          <Link
                            key={item.id}
                            href={`/cricket/${item.type === "player" ? "players" : "matches"}/${item.slug}`}
                            passHref
                            legacyBehavior
                          >
                            <a
                              onClick={onClose}
                              className="flex items-center p-2.5 hover:bg-gray-700/40 rounded-lg transition-colors"
                            >
                              {/* Add appropriate icon or image for cricket items */}
                              <Newspaper className="w-8 h-8 text-gray-500 mr-3.5" />
                              <div>
                                <p className="font-medium text-sm text-gray-100">{item.title}</p>
                                <p className="text-xs text-gray-400">
                                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                  {item.date ? ` - ${item.date}` : ""}
                                </p>
                              </div>
                            </a>
                          </Link>
                        ))}
                      </SearchSection>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const SearchSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  title,
  icon,
  children,
}) => (
  <div className="mb-5 last:mb-0">
    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center">
      {icon}
      {title}
    </h3>
    <div className="space-y-1.5">{children}</div>
  </div>
)

const SearchSuggestionItem: React.FC<{ term: string; onClick: () => void }> = ({ term, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left p-2.5 hover:bg-gray-700/40 rounded-lg transition-colors text-sm text-gray-200 flex items-center group"
  >
    <History className="h-3.5 w-3.5 mr-2.5 text-gray-500 group-hover:text-gray-300 transition-colors" />
    {term}
  </button>
)
