"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import { MoreHorizontal, Edit, Trash, Eye, Star, Calendar, LinkIcon, ArrowUpDown, Loader2 } from "lucide-react"
import Image from "next/image"
import NextLink from "next/link" // Renamed to avoid conflict with Lucide icon
import type { Movie, MovieStatus } from "@/components/admin/movies/types"
import type { MovieFiltersState } from "@/app/admin/movies/page"

interface MovieManagementTableProps {
  movies: Movie[]
  searchQuery: string // Kept for potential direct use, though filtering is parent-side
  filters: MovieFiltersState // Kept for potential direct use
  onSort: (key: keyof Movie) => void
  sortConfig: {
    key: keyof Movie
    direction: "asc" | "desc"
  } | null
  selectedMovies: string[] // Array of movie IDs
  onSelectMovie: (movieId: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  isLoading: boolean
  onOpenManageStreamingLinksModal: (movieId: string) => void
  onOpenUpdateReleaseDateModal: (movieId: string) => void
  onDeleteMovie: (movieId: string) => void
}

export function MovieManagementTable({
  movies,
  searchQuery,
  filters,
  onSort,
  sortConfig,
  selectedMovies,
  onSelectMovie,
  onSelectAll,
  isLoading,
  onOpenManageStreamingLinksModal,
  onOpenUpdateReleaseDateModal,
  onDeleteMovie,
}: MovieManagementTableProps) {
  const handleSort = (key: keyof Movie) => {
    onSort(key)
  }

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

  const renderSortArrow = (key: keyof Movie) => {
    if (sortConfig?.key === key) {
      return (
        <ArrowUpDown
          size={14}
          className={`ml-1 transition-transform duration-200 ${sortConfig.direction === "asc" ? "" : "rotate-180"}`}
        />
      )
    }
    return <ArrowUpDown size={14} className="ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />
  }

  if (isLoading) {
    return (
      <div className="border rounded-lg overflow-hidden p-10 flex justify-center items-center min-h-[300px]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="border rounded-lg overflow-hidden p-10 text-center text-muted-foreground min-h-[300px] flex items-center justify-center">
        No movies found matching your criteria.
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="border rounded-lg overflow-x-auto"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 px-3">
              <Checkbox
                checked={selectedMovies.length === movies.length && movies.length > 0}
                onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                aria-label="Select all movies on current page"
              />
            </TableHead>
            <TableHead className="w-20 px-3">Poster</TableHead>
            <TableHead className="min-w-[200px] px-3 group">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 p-0 h-auto font-semibold hover:bg-transparent"
                onClick={() => handleSort("title")}
              >
                Title {renderSortArrow("title")}
              </Button>
            </TableHead>
            <TableHead className="px-3 group">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 p-0 h-auto font-semibold hover:bg-transparent"
                onClick={() => handleSort("sidduScore")}
              >
                SidduScore {renderSortArrow("sidduScore")}
              </Button>
            </TableHead>
            <TableHead className="px-3 group">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 p-0 h-auto font-semibold hover:bg-transparent"
                onClick={() => handleSort("releaseDate")}
              >
                Release Date {renderSortArrow("releaseDate")}
              </Button>
            </TableHead>
            <TableHead className="px-3 group">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 p-0 h-auto font-semibold hover:bg-transparent"
                onClick={() => handleSort("status")}
              >
                Status {renderSortArrow("status")}
              </Button>
            </TableHead>
            <TableHead className="min-w-[150px] px-3">Genre</TableHead>
            <TableHead className="text-right px-3">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movies.map((movie, index) => (
            <motion.tr
              key={movie.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="group hover:bg-muted/50"
            >
              <TableCell className="px-3">
                <Checkbox
                  checked={selectedMovies.includes(movie.id)}
                  onCheckedChange={(checked) => onSelectMovie(movie.id, checked as boolean)}
                  aria-labelledby={`movie-title-${movie.id}`}
                />
              </TableCell>
              <TableCell className="px-3 py-2">
                <div className="relative w-12 h-[72px] rounded overflow-hidden bg-muted">
                  <Image
                    src={movie.poster || "/placeholder.svg?height=72&width=48&query=movie+poster"}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium px-3" id={`movie-title-${movie.id}`}>
                {movie.title}
              </TableCell>
              <TableCell className="px-3">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span>{movie.sidduScore?.toFixed(1) || "N/A"}</span>
                </div>
              </TableCell>
              <TableCell className="px-3">
                {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : "N/A"}
              </TableCell>
              <TableCell className="px-3">
                <Badge className={`${getStatusColor(movie.status)} text-xs`} variant="outline">
                  {movie.status.charAt(0).toUpperCase() + movie.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="px-3">
                <div className="flex gap-1 flex-wrap max-w-[200px]">
                  {(movie.genres || []).slice(0, 2).map((g) => (
                    <Badge key={g} variant="secondary" className="text-xs">
                      {g}
                    </Badge>
                  ))}
                  {(movie.genres || []).length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{(movie.genres || []).length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right px-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-50 group-hover:opacity-100 transition-opacity data-[state=open]:opacity-100 h-8 w-8"
                    >
                      <MoreHorizontal size={18} />
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
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  )
}
