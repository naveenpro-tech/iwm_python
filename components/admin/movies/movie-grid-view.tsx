"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash, Eye, Star, Calendar, LinkIcon, Film } from "lucide-react"
import Image from "next/image"
import NextLink from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import type { Movie, MovieStatus } from "@/components/admin/movies/types"
import type { MovieFiltersState } from "@/app/admin/movies/page"

interface MovieGridViewProps {
  movies: Movie[]
  selectedMovies: string[] // Array of movie IDs
  onSelectMovie: (movieId: string, checked: boolean) => void // Updated signature
  isLoading: boolean
  searchQuery: string // Kept for potential direct use
  filters: MovieFiltersState // Kept for potential direct use
  onOpenManageStreamingLinksModal: (movieId: string) => void
  onOpenUpdateReleaseDateModal: (movieId: string) => void
  onDeleteMovie: (movieId: string) => void
}

export function MovieGridView({
  movies,
  selectedMovies,
  onSelectMovie,
  isLoading,
  searchQuery,
  filters,
  onOpenManageStreamingLinksModal,
  onOpenUpdateReleaseDateModal,
  onDeleteMovie,
}: MovieGridViewProps) {
  const getStatusColor = (status: MovieStatus) => {
    switch (status) {
      case "released":
        return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 border-green-500/50"
      case "upcoming":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 border-blue-500/50"
      case "archived":
        return "bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-400 border-gray-500/50"
      case "draft":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400 border-yellow-500/50"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <Card key={index} className="animate-pulse overflow-hidden">
            <div className="relative aspect-[2/3] bg-muted/50"></div>
            <CardContent className="p-3 space-y-2">
              <div className="h-5 bg-muted rounded-md w-3/4"></div>
              <div className="h-3 bg-muted rounded-md w-1/2"></div>
              <div className="flex gap-1">
                <div className="h-4 bg-muted rounded-full w-10"></div>
                <div className="h-4 bg-muted rounded-full w-12"></div>
              </div>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <div className="h-3 bg-muted rounded-md w-1/3"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-10 col-span-full">
        No movies found matching your criteria.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie, index) => (
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.03 }}
        >
          <Card className="group hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                <Image
                  src={movie.poster || "/placeholder.svg?height=450&width=300&query=movie+poster"}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {!movie.poster && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Film size={48} className="text-muted-foreground/50" />
                  </div>
                )}
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    id={`select-grid-${movie.id}`}
                    checked={selectedMovies.includes(movie.id)}
                    onCheckedChange={(checked) => onSelectMovie(movie.id, checked as boolean)}
                    className="bg-background/70 hover:bg-background border-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-5 w-5"
                    aria-labelledby={`movie-title-grid-${movie.id}`}
                  />
                </div>
                <div className="absolute top-2 right-2 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-background/70 backdrop-blur-sm hover:bg-background/90"
                      >
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <NextLink href={`/movies/${movie.id}`} target="_blank">
                          <Eye size={16} className="mr-2" />
                          View on Site
                        </NextLink>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <NextLink href={`/admin/movies/${movie.id}`}>
                          <Edit size={16} className="mr-2" />
                          Edit Movie
                        </NextLink>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onOpenManageStreamingLinksModal(movie.id)}>
                        <LinkIcon size={16} className="mr-2" />
                        Manage Streaming
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onOpenUpdateReleaseDateModal(movie.id)}>
                        <Calendar size={16} className="mr-2" />
                        Update Release Dates
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive-foreground focus:bg-destructive"
                        onClick={() => onDeleteMovie(movie.id)}
                      >
                        <Trash size={16} className="mr-2" />
                        Delete Movie
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <h3 className="font-semibold text-base mb-1 line-clamp-1" id={`movie-title-grid-${movie.id}`}>
                {movie.title}
              </h3>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1">
                  <Star size={13} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-medium">{movie.sidduScore?.toFixed(1) || "N/A"}</span>
                </div>
                <Badge className={`${getStatusColor(movie.status)} text-xs px-1.5 py-0.5`} variant="outline">
                  {movie.status.charAt(0).toUpperCase() + movie.status.slice(1)}
                </Badge>
              </div>
              <div className="flex gap-1 flex-wrap h-9 overflow-hidden">
                {" "}
                {/* Fixed height for genre badges */}
                {(movie.genres || []).slice(0, 2).map((g) => (
                  <Badge key={g} variant="secondary" className="text-xs px-1.5 py-0.5">
                    {g}
                  </Badge>
                ))}
                {(movie.genres || []).length > 2 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    +{(movie.genres || []).length - 2}
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <p className="text-xs text-muted-foreground">
                {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "N/A"}
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
