{
  ;`'use client'

import { useState, useEffect, useCallback } from "react"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, Search, Film } from 'lucide-react'
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { MovieSearchSelectItem, MovieComparisonData } from "./types"
import { useToast } from "@/hooks/use-toast"

// Extended MOCK_MOVIES for search (should ideally come from a shared lib/api or context)
const MOCK_SEARCH_MOVIES: MovieSearchSelectItem[] = [
  { id: "inception", title: "Inception", year: 2010, poster: "/inception-movie-poster.png" },
  { id: "interstellar", title: "Interstellar", year: 2014, poster: "/interstellar-poster.png" },
  { id: "the-dark-knight", title: "The Dark Knight", year: 2008, poster: "/dark-knight-poster.png" },
  { id: "parasite", title: "Parasite", year: 2019, poster: "/parasite-movie-poster.png" },
  { id: "pulp-fiction", title: "Pulp Fiction", year: 1994, poster: "/pulp-fiction-poster.png" },
  { id: "the-matrix", title: "The Matrix", year: 1999, poster: "/matrix-poster.png" },
  { id: "fight-club", title: "Fight Club", year: 1999, poster: "/fight-club-poster.png" },
  { id: "the-prestige", title: "The Prestige", year: 2006, poster: "/prestige-poster.png" },
  { id: "oppenheimer", title: "Oppenheimer", year: 2023, poster: "/oppenheimer-inspired-poster.png" },
  { id: "dune-part-two", title: "Dune: Part Two", year: 2024, poster: "/dune-part-two-poster.png" },
  { id: "blade-runner-2049", title: "Blade Runner 2049", year: 2017, poster: "/blade-runner-2049-poster.png" },
  { id: "mad-max-fury-road", title: "Mad Max: Fury Road", year: 2015, poster: "/mad-max-fury-road-poster.png" },
];


interface MovieSearchInputProps {
  onSelectMovie: (movieId: string) => void
  currentSelectionIds: string[]
  maxSelection?: number
}

export function MovieSearchInput({
  onSelectMovie,
  currentSelectionIds,
  maxSelection = 3,
}: MovieSearchInputProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [filteredMovies, setFilteredMovies] = useState<MovieSearchSelectItem[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (searchValue.length > 1) {
      const lowerSearchValue = searchValue.toLowerCase()
      setFilteredMovies(
        MOCK_SEARCH_MOVIES.filter(
          (movie) =>
            movie.title.toLowerCase().includes(lowerSearchValue) &&
            !currentSelectionIds.includes(movie.id)
        )
      )
    } else {
      setFilteredMovies([])
    }
  }, [searchValue, currentSelectionIds])

  const handleSelect = useCallback((movieId: string) => {
    if (currentSelectionIds.length >= maxSelection) {
      toast({
        title: "Maximum movies reached",
        description: \`You can compare up to \${maxSelection} movies at a time.\`,
        variant: "destructive",
      })
      setOpen(false)
      return
    }
    onSelectMovie(movieId)
    setSearchValue("")
    setOpen(false)
  }, [onSelectMovie, currentSelectionIds.length, maxSelection, toast])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full md:w-[300px] justify-between bg-[#282828] border-gray-700 hover:bg-gray-700 text-gray-300 hover:text-white"
          disabled={currentSelectionIds.length >= maxSelection}
        >
          {currentSelectionIds.length >= maxSelection ? "Max movies selected" : "Add a movie to compare..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] md:w-[350px] p-0 bg-[#1C1C1C] border-gray-700 text-white">
        <Command>
          <div className="flex items-center border-b border-gray-700 px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search for a movie..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 border-0 focus:ring-0"
            />
          </div>
          <CommandList>
            {filteredMovies.length === 0 && searchValue.length > 1 && (
              <CommandEmpty className="py-6 text-center text-sm text-gray-400">No movie found.</CommandEmpty>
            )}
            {filteredMovies.length > 0 && (
              <CommandGroup>
                {filteredMovies.map((movie) => (
                  <CommandItem
                    key={movie.id}
                    value={movie.title}
                    onSelect={() => handleSelect(movie.id)}
                    className="hover:bg-gray-700 cursor-pointer flex items-center py-2 px-3"
                  >
                    {movie.poster ? (
                       <Image
                        src={movie.poster || "/placeholder.svg"}
                        alt={movie.title}
                        width={32}
                        height={48}
                        className="mr-3 rounded object-cover"
                      />
                    ) : (
                      <Film className="mr-3 h-8 w-8 text-gray-500" />
                    )}
                    <div className="flex-1">
                      <span className="block text-sm font-medium text-gray-100">{movie.title}</span>
                      <span className="block text-xs text-gray-400">{movie.year}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentSelectionIds.includes(movie.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
             {searchValue.length <= 1 && (
                <div className="p-4 text-sm text-gray-500 text-center">
                  Type at least 2 characters to search.
                </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}`
}
