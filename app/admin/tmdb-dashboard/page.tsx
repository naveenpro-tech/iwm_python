'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { getAuthHeaders } from '@/lib/auth'
import Image from 'next/image'

interface TMDBMovie {
  tmdb_id: number
  title: string
  release_date?: string
  poster_url?: string
  backdrop_url?: string
  overview?: string
  vote_average?: number
  already_imported: boolean
  our_movie_id?: number
}

interface SearchResponse {
  movies: TMDBMovie[]
  total_results: number
  total_pages: number
  current_page: number
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function TMDBDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [activeTab, setActiveTab] = useState('new-releases')
  const [category, setCategory] = useState('now_playing')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchYear, setSearchYear] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [movies, setMovies] = useState<TMDBMovie[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [importingIds, setImportingIds] = useState<Set<number>>(new Set())

  // Fetch new releases
  const fetchNewReleases = async (page: number = 1) => {
    setLoading(true)
    try {
      const authHeaders = getAuthHeaders()
      const res = await fetch(
        `${API_BASE}/api/v1/admin/tmdb/new-releases?category=${category}&page=${page}`,
        { headers: authHeaders }
      )
      
      if (!res.ok) {
        if (res.status === 401) {
          toast({ variant: 'destructive', title: 'Authentication required' })
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch movies')
      }
      
      const data: SearchResponse = await res.json()
      setMovies(data.movies)
      setTotalPages(data.total_pages)
      setCurrentPage(page)
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message })
    } finally {
      setLoading(false)
    }
  }

  // Search movies
  const handleSearch = async (page: number = 1) => {
    if (!searchQuery.trim()) {
      toast({ variant: 'destructive', title: 'Please enter a search query' })
      return
    }
    
    setLoading(true)
    try {
      const authHeaders = getAuthHeaders()
      const params = new URLSearchParams({
        query: searchQuery,
        page: page.toString(),
      })
      if (searchYear) params.append('year', searchYear)
      
      const res = await fetch(
        `${API_BASE}/api/v1/admin/tmdb/search?${params}`,
        { headers: authHeaders }
      )
      
      if (!res.ok) throw new Error('Search failed')
      
      const data: SearchResponse = await res.json()
      setMovies(data.movies)
      setTotalPages(data.total_pages)
      setCurrentPage(page)
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Search Error', description: error.message })
    } finally {
      setLoading(false)
    }
  }

  // Import movie
  const handleImport = async (tmdbId: number, title: string) => {
    setImportingIds(prev => new Set(prev).add(tmdbId))
    try {
      const authHeaders = getAuthHeaders()
      const res = await fetch(
        `${API_BASE}/api/v1/admin/tmdb/import/${tmdbId}`,
        { method: 'POST', headers: authHeaders }
      )
      
      if (res.status === 409) {
        toast({ title: 'Already Imported', description: `"${title}" is already in the database` })
        // Update UI to show as imported
        setMovies(prev => prev.map(m => 
          m.tmdb_id === tmdbId ? { ...m, already_imported: true } : m
        ))
        return
      }
      
      if (!res.ok) throw new Error('Import failed')
      
      const data = await res.json()
      toast({ title: 'Success', description: `"${title}" imported successfully!` })
      
      // Update UI
      setMovies(prev => prev.map(m => 
        m.tmdb_id === tmdbId ? { ...m, already_imported: true, our_movie_id: data.id } : m
      ))
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Import Error', description: error.message })
    } finally {
      setImportingIds(prev => {
        const next = new Set(prev)
        next.delete(tmdbId)
        return next
      })
    }
  }

  // Load initial data
  useEffect(() => {
    if (activeTab === 'new-releases') {
      fetchNewReleases(1)
    }
  }, [activeTab, category])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">TMDB Movie Dashboard</h1>
          <p className="text-sm md:text-base text-slate-300">Browse and import movies from The Movie Database</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 md:mb-8">
            <TabsTrigger value="new-releases" className="text-sm md:text-base">New Releases</TabsTrigger>
            <TabsTrigger value="search" className="text-sm md:text-base">Search</TabsTrigger>
          </TabsList>

          {/* New Releases Tab */}
          <TabsContent value="new-releases" className="space-y-6">
            <div className="flex gap-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
              >
                <option value="now_playing">Now Playing</option>
                <option value="upcoming">Upcoming</option>
                <option value="popular">Popular</option>
                <option value="top_rated">Top Rated</option>
              </select>
            </div>

            <MovieGrid
              movies={movies}
              loading={loading}
              importingIds={importingIds}
              onImport={handleImport}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => fetchNewReleases(page)}
            />
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <div className="flex gap-4">
              <Input
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
                className="flex-1 bg-slate-700 text-white border-slate-600"
              />
              <Input
                placeholder="Year (optional)"
                type="number"
                value={searchYear}
                onChange={(e) => setSearchYear(e.target.value)}
                className="w-32 bg-slate-700 text-white border-slate-600"
              />
              <Button
                onClick={() => handleSearch(1)}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {searchQuery && (
              <MovieGrid
                movies={movies}
                loading={loading}
                importingIds={importingIds}
                onImport={handleImport}
              />
            )}

            {searchQuery && !loading && movies.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No movies found for "{searchQuery}"</p>
              </div>
            )}

            {searchQuery && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => handleSearch(page)}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function MovieGrid({
  movies,
  loading,
  importingIds,
  onImport,
}: {
  movies: TMDBMovie[]
  loading: boolean
  importingIds: Set<number>
  onImport: (tmdbId: number, title: string) => void
}) {
  if (loading && movies.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-slate-700 rounded-lg h-96 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <Card key={movie.tmdb_id} className="bg-slate-700 border-slate-600 overflow-hidden hover:shadow-lg transition-shadow">
          {/* Poster */}
          <div className="relative h-64 bg-slate-800">
            {movie.poster_url ? (
              <Image
                src={movie.poster_url}
                alt={movie.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                No Image
              </div>
            )}
            <Badge className="absolute top-2 right-2 bg-blue-600">
              ID: {movie.tmdb_id}
            </Badge>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-bold text-white truncate">{movie.title}</h3>
              <p className="text-sm text-slate-400">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
              </p>
            </div>

            {movie.vote_average && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-300">★ {movie.vote_average.toFixed(1)}</span>
              </div>
            )}

            {movie.overview && (
              <p className="text-sm text-slate-300 line-clamp-2">{movie.overview}</p>
            )}

            {/* Action Button */}
            {movie.already_imported ? (
              <Badge className="w-full justify-center bg-green-600">
                Already Imported
              </Badge>
            ) : (
              <Button
                onClick={() => onImport(movie.tmdb_id, movie.title)}
                disabled={importingIds.has(movie.tmdb_id)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {importingIds.has(movie.tmdb_id) ? 'Importing...' : 'Import'}
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-4">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
      >
        Previous
      </Button>
      <span className="text-white">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
      >
        Next
      </Button>
    </div>
  )
}

