'use client'

/**
 * Tag Search Button Component
 * Opens modal to search and tag movies/cricket matches
 */

import { useState } from 'react'
import { Hash, Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { TaggedItem } from '@/types/pulse'

interface TagSearchButtonProps {
  onTagAdd: (tag: TaggedItem) => void
  disabled?: boolean
}

// Mock search results
const MOCK_MOVIES = [
  { id: 'movie-1', title: 'The Shawshank Redemption', year: 1994, rating: 9.3, genre: 'Drama' },
  { id: 'movie-2', title: 'The Dark Knight', year: 2008, rating: 9.0, genre: 'Action' },
  { id: 'movie-3', title: 'Inception', year: 2010, rating: 8.8, genre: 'Sci-Fi' },
  { id: 'movie-4', title: 'Oppenheimer', year: 2023, rating: 8.5, genre: 'Biography' },
]

const MOCK_CRICKET = [
  { id: 'match-1', team1: 'India', team2: 'Australia', status: 'live' as const },
  { id: 'match-2', team1: 'England', team2: 'Pakistan', status: 'upcoming' as const },
]

export default function TagSearchButton({ onTagAdd, disabled = false }: TagSearchButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'movies' | 'cricket'>('movies')

  const filteredMovies = MOCK_MOVIES.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCricket = MOCK_CRICKET.filter((match) =>
    `${match.team1} ${match.team2}`.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleMovieSelect = (movie: typeof MOCK_MOVIES[0]) => {
    onTagAdd({
      type: 'movie',
      id: movie.id,
      title: movie.title,
      year: movie.year,
      poster_url: 'https://image.tmdb.org/t/p/w500/placeholder.jpg',
      rating: movie.rating,
      genre: movie.genre,
    })
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleCricketSelect = (match: typeof MOCK_CRICKET[0]) => {
    onTagAdd({
      type: 'cricket_match',
      id: match.id,
      team1: match.team1,
      team2: match.team2,
      status: match.status,
      venue: 'International Stadium',
      start_time: new Date().toISOString(),
    })
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <>
      <motion.button
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        className={`p-2 rounded-lg transition-colors ${
          disabled
            ? 'text-[#3A3A3A] cursor-not-allowed'
            : 'text-[#00BFFF] hover:bg-[#00BFFF]/10'
        }`}
        title="Tag movie or cricket match"
      >
        <Hash size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
              onClick={() => setIsOpen(false)}
            >
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#282828] border border-[#3A3A3A] rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#E0E0E0] font-['Inter']">
                    Tag Content
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-[#3A3A3A] rounded transition-colors"
                  >
                    <X size={20} className="text-[#A0A0A0]" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setActiveTab('movies')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      activeTab === 'movies'
                        ? 'bg-[#00BFFF] text-white'
                        : 'bg-[#3A3A3A] text-[#A0A0A0] hover:text-[#E0E0E0]'
                    }`}
                  >
                    Movies
                  </button>
                  <button
                    onClick={() => setActiveTab('cricket')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      activeTab === 'cricket'
                        ? 'bg-[#00BFFF] text-white'
                        : 'bg-[#3A3A3A] text-[#A0A0A0] hover:text-[#E0E0E0]'
                    }`}
                  >
                    Cricket
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative mb-4">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0A0]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${activeTab}...`}
                    className="w-full pl-10 pr-4 py-2 bg-[#3A3A3A] border border-[#3A3A3A] rounded-lg text-[#E0E0E0] placeholder:text-[#A0A0A0] outline-none focus:border-[#00BFFF] transition-colors"
                  />
                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto space-y-2">
                  {activeTab === 'movies' ? (
                    filteredMovies.map((movie) => (
                      <button
                        key={movie.id}
                        onClick={() => handleMovieSelect(movie)}
                        className="w-full p-3 bg-[#3A3A3A] hover:bg-[#4A4A4A] rounded-lg text-left transition-colors"
                      >
                        <div className="font-medium text-[#E0E0E0]">{movie.title}</div>
                        <div className="text-sm text-[#A0A0A0]">
                          ⭐ {movie.rating} • {movie.year} • {movie.genre}
                        </div>
                      </button>
                    ))
                  ) : (
                    filteredCricket.map((match) => (
                      <button
                        key={match.id}
                        onClick={() => handleCricketSelect(match)}
                        className="w-full p-3 bg-[#3A3A3A] hover:bg-[#4A4A4A] rounded-lg text-left transition-colors"
                      >
                        <div className="font-medium text-[#E0E0E0]">
                          {match.team1} vs {match.team2}
                        </div>
                        <div className="text-sm text-[#A0A0A0]">
                          {match.status === 'live' ? '🔴 Live' : '📅 Upcoming'}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

