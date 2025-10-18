"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Film, Plus, X, Search, Calendar, User, Award, CheckCircle, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Mock data for search results
const mockMovies = [
  {
    id: "movie-1",
    title: "Inception",
    year: "2010",
    poster: "/inception-movie-poster.png",
    director: "Christopher Nolan",
  },
  {
    id: "movie-2",
    title: "The Dark Knight",
    year: "2008",
    poster: "/dark-knight-poster.png",
    director: "Christopher Nolan",
  },
  {
    id: "movie-3",
    title: "Interstellar",
    year: "2014",
    poster: "/interstellar-poster.png",
    director: "Christopher Nolan",
  },
  {
    id: "movie-4",
    title: "Oppenheimer",
    year: "2023",
    poster: "/oppenheimer-inspired-poster.png",
    director: "Christopher Nolan",
  },
  {
    id: "movie-5",
    title: "Dunkirk",
    year: "2017",
    poster: "/dunkirk-poster.png",
    director: "Christopher Nolan",
  },
  {
    id: "movie-6",
    title: "Barbie",
    year: "2023",
    poster: "/barbie-movie-poster.png",
    director: "Greta Gerwig",
  },
  {
    id: "movie-7",
    title: "Tenet",
    year: "2020",
    poster: "/generic-spy-thriller-poster.png",
    director: "Christopher Nolan",
  },
  {
    id: "movie-8",
    title: "Dune",
    year: "2021",
    poster: "/dune-part-two-poster.png",
    director: "Denis Villeneuve",
  },
]

interface FilmographyItem {
  id: string
  movieId: string
  movieTitle: string
  movieYear: string
  moviePoster: string
  role: string
  roleType: string
  description?: string
  awards?: string[]
  featured: boolean
  verified: boolean
}

interface FilmographySearchInputProps {
  onAdd: (item: FilmographyItem) => void
  onRemove: (id: string) => void
  onEdit: (item: FilmographyItem) => void
  onFeature: (id: string, featured: boolean) => void
  initialItems?: FilmographyItem[]
}

export default function FilmographySearchInput({
  onAdd,
  onRemove,
  onEdit,
  onFeature,
  initialItems = [],
}: FilmographySearchInputProps) {
  const [filmography, setFilmography] = useState<FilmographyItem[]>(initialItems)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSearchMode, setIsSearchMode] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof mockMovies>([])
  const [selectedMovie, setSelectedMovie] = useState<(typeof mockMovies)[0] | null>(null)
  const [editingItem, setEditingItem] = useState<FilmographyItem | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const [formData, setFormData] = useState({
    role: "",
    roleType: "actor",
    description: "",
    awards: [] as string[],
    featured: false,
  })

  const [newAward, setNewAward] = useState("")

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsSearching(true)

      // Simulate API call delay
      const timer = setTimeout(() => {
        // Filter mock data based on search query
        const results = mockMovies.filter(
          (movie) =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.director.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        setSearchResults(results)
        setIsSearching(false)
      }, 500)

      return () => clearTimeout(timer)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, roleType: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }))
  }

  const handleAddFilmography = () => {
    setIsDialogOpen(true)
    setIsSearchMode(true)
    setSearchQuery("")
    setSearchResults([])
    setSelectedMovie(null)
    setEditingItem(null)
    setFormData({
      role: "",
      roleType: "actor",
      description: "",
      awards: [],
      featured: false,
    })
    setNewAward("")
  }

  const handleEditFilmography = (item: FilmographyItem) => {
    setIsDialogOpen(true)
    setIsSearchMode(false)
    setEditingItem(item)
    setSelectedMovie({
      id: item.movieId,
      title: item.movieTitle,
      year: item.movieYear,
      poster: item.moviePoster,
      director: "", // We don't have this in the item
    })
    setFormData({
      role: item.role,
      roleType: item.roleType,
      description: item.description || "",
      awards: item.awards || [],
      featured: item.featured,
    })
    setNewAward("")
  }

  const handleSelectMovie = (movie: (typeof mockMovies)[0]) => {
    setSelectedMovie(movie)
    setIsSearchMode(false)
  }

  const handleAddAward = () => {
    if (newAward.trim()) {
      setFormData((prev) => ({
        ...prev,
        awards: [...prev.awards, newAward.trim()],
      }))
      setNewAward("")
    }
  }

  const handleRemoveAward = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = () => {
    if (!selectedMovie || !formData.role || !formData.roleType) return

    if (editingItem) {
      const updatedItem: FilmographyItem = {
        ...editingItem,
        role: formData.role,
        roleType: formData.roleType,
        description: formData.description,
        awards: formData.awards,
        featured: formData.featured,
      }

      setFilmography((prev) => prev.map((item) => (item.id === editingItem.id ? updatedItem : item)))

      onEdit(updatedItem)
    } else {
      const newItem: FilmographyItem = {
        id: `filmography-${Date.now()}`,
        movieId: selectedMovie.id,
        movieTitle: selectedMovie.title,
        movieYear: selectedMovie.year,
        moviePoster: selectedMovie.poster,
        role: formData.role,
        roleType: formData.roleType,
        description: formData.description,
        awards: formData.awards,
        featured: formData.featured,
        // Simulate verification for demo purposes
        verified: Math.random() > 0.3,
      }

      setFilmography((prev) => [...prev, newItem])
      onAdd(newItem)
    }

    setIsDialogOpen(false)
  }

  const handleRemoveFilmography = (id: string) => {
    setFilmography((prev) => prev.filter((item) => item.id !== id))
    onRemove(id)
  }

  const handleToggleFeature = (id: string, featured: boolean) => {
    setFilmography((prev) => prev.map((item) => (item.id === id ? { ...item, featured } : item)))
    onFeature(id, featured)
  }

  const roleTypeOptions = [
    { value: "actor", label: "Actor" },
    { value: "director", label: "Director" },
    { value: "producer", label: "Producer" },
    { value: "writer", label: "Writer" },
    { value: "cinematographer", label: "Cinematographer" },
    { value: "editor", label: "Editor" },
    { value: "composer", label: "Composer" },
    { value: "production_designer", label: "Production Designer" },
    { value: "costume_designer", label: "Costume Designer" },
    { value: "sound_designer", label: "Sound Designer" },
    { value: "visual_effects", label: "Visual Effects" },
    { value: "other", label: "Other" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base">Filmography</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddFilmography}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Credit
        </Button>
      </div>

      <AnimatePresence>
        {filmography.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center text-center"
          >
            <Film className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No filmography credits added yet. Add your roles in films and TV shows.
            </p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {filmography.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "bg-muted rounded-lg p-4 relative group",
                  item.featured ? "border-l-4 border-primary" : "",
                )}
              >
                <div className="flex gap-4">
                  <div className="w-16 h-24 flex-shrink-0 rounded overflow-hidden bg-background">
                    <Image
                      src={item.moviePoster || "/placeholder.svg?height=200&width=300&query=movie+poster"}
                      alt={item.movieTitle}
                      width={64}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{item.movieTitle}</h4>
                          {item.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{item.movieYear}</span>
                        </div>
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={cn("h-8 w-8", item.featured ? "text-primary" : "")}
                          onClick={() => handleToggleFeature(item.id, !item.featured)}
                          title={item.featured ? "Remove from featured" : "Add to featured"}
                        >
                          <Star className={cn("h-4 w-4", item.featured ? "fill-current" : "")} />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditFilmography(item)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-pencil"
                          >
                            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveFilmography(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {item.role}
                          <span className="text-muted-foreground">
                            {" "}
                            ({roleTypeOptions.find((option) => option.value === item.roleType)?.label})
                          </span>
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      )}

                      {item.awards && item.awards.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.awards.map((award, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Award className="h-3 w-3 mr-1" />
                              {award}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Filmography Credit" : "Add Filmography Credit"}</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {isSearchMode ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for a movie or TV show..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                    <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {searchResults.map((movie) => (
                      <div
                        key={movie.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => handleSelectMovie(movie)}
                      >
                        <div className="w-10 h-14 flex-shrink-0 rounded overflow-hidden bg-background">
                          <Image
                            src={movie.poster || "/placeholder.svg?height=200&width=300&query=movie+poster"}
                            alt={movie.title}
                            width={40}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{movie.title}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{movie.year}</span>
                            <span>Dir: {movie.director}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchQuery.length > 2 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No results found</p>
                    <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
                  </div>
                ) : searchQuery.length > 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">Type at least 3 characters to search</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Search for a movie or TV show</p>
                    <p className="text-sm text-muted-foreground mt-1">You can search by title or director name</p>
                  </div>
                )}

                <div className="text-center">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedMovie && (
                  <div className="flex items-center gap-4 p-3 bg-muted rounded-md">
                    <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden bg-background">
                      <Image
                        src={selectedMovie.poster || "/placeholder.svg?height=200&width=300&query=movie+poster"}
                        alt={selectedMovie.title}
                        width={48}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{selectedMovie.title}</h4>
                      <p className="text-sm text-muted-foreground">{selectedMovie.year}</p>
                    </div>

                    {!editingItem && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ml-auto"
                        onClick={() => {
                          setIsSearchMode(true)
                          setSelectedMovie(null)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Your Role/Position *</Label>
                      <Input
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        placeholder="e.g. John Smith, Director of Photography"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="roleType">Role Type *</Label>
                      <Select value={formData.roleType} onValueChange={handleSelectChange}>
                        <SelectTrigger id="roleType">
                          <SelectValue placeholder="Select role type" />
                        </SelectTrigger>
                        <SelectContent>
                          {roleTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your contribution or role in this project..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Awards & Recognition</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newAward}
                        onChange={(e) => setNewAward(e.target.value)}
                        placeholder="e.g. Oscar Nomination for Best Actor"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddAward()
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddAward} disabled={!newAward.trim()}>
                        Add
                      </Button>
                    </div>

                    {formData.awards.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.awards.map((award, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {award}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 p-0"
                              onClick={() => handleRemoveAward(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="featured" checked={formData.featured} onCheckedChange={handleCheckboxChange} />
                    <Label htmlFor="featured" className="text-sm font-normal">
                      Feature this credit on my profile
                    </Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!isSearchMode && (
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedMovie || !formData.role || !formData.roleType}
              >
                {editingItem ? "Save Changes" : "Add to Filmography"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
