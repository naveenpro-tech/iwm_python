'use client'

/**
 * Trending Movies Component
 * Top 5 trending movies
 */

import { TrendingMovie } from '@/types/pulse'
import { Film, Star } from 'lucide-react'

interface TrendingMoviesProps {
  movies: TrendingMovie[]
}

export default function TrendingMovies({ movies }: TrendingMoviesProps) {
  return (
    <div className="bg-[#282828] border border-[#3A3A3A] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Film size={18} className="text-[#FFD700]" />
        <h3 className="font-bold text-[#E0E0E0] font-['Inter']">Trending Movies</h3>
      </div>

      <div className="space-y-3">
        {movies.map((movie) => (
          <a
            key={movie.id}
            href={`/movies/${movie.id}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#3A3A3A] transition-colors group"
          >
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-12 h-18 object-cover rounded flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#E0E0E0] truncate group-hover:text-[#00BFFF] transition-colors">
                {movie.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-[#A0A0A0] mt-1">
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-[#FFD700]" fill="#FFD700" />
                  <span>{movie.rating}</span>
                </div>
                <span>•</span>
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.genre}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

