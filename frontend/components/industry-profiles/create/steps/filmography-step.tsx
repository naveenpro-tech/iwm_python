"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Film, Trash2, Upload, MoveVertical } from "lucide-react"
import Image from "next/image"
import type { ProfileFormData, FilmographyEntry } from "../../types"

interface FilmographyStepProps {
  data: ProfileFormData
  updateData: (updates: Partial<ProfileFormData>) => void
}

export function FilmographyStep({ data, updateData }: FilmographyStepProps) {
  const [title, setTitle] = useState("")
  const [role, setRole] = useState("")
  const [year, setYear] = useState<number | "">("")
  const [description, setDescription] = useState("")
  const [posterUrl, setPosterUrl] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Mock search results
  const searchResults = [
    { id: "m1", title: "Oppenheimer", year: 2023, posterUrl: "/oppenheimer-inspired-poster.png" },
    { id: "m2", title: "Inception", year: 2010, posterUrl: "/inception-movie-poster.png" },
    { id: "m3", title: "Interstellar", year: 2014, posterUrl: "/interstellar-poster.png" },
    { id: "m4", title: "The Dark Knight", year: 2008, posterUrl: "/dark-knight-poster.png" },
  ]

  const handleAddFilm = () => {
    if (title && role && year) {
      const newFilm: FilmographyEntry = {
        id: `film-${Date.now()}`,
        title,
        role,
        year: Number(year),
        description: description || undefined,
        posterUrl: posterUrl || undefined,
      }

      updateData({
        filmography: [...(data.filmography || []), newFilm],
      })

      // Reset form
      setTitle("")
      setRole("")
      setYear("")
      setDescription("")
      setPosterUrl("")
    }
  }

  const handleRemoveFilm = (id: string) => {
    updateData({
      filmography: data.filmography?.filter((film) => film.id !== id),
    })
  }

  const handleSelectSearchResult = (result: any) => {
    setTitle(result.title)
    setYear(result.year)
    setPosterUrl(result.posterUrl)
    setShowSearchResults(false)
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowSearchResults(true)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Search Existing Movies</CardTitle>
          <CardDescription>Find and add movies from the Siddu database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF] rounded-r-none"
                placeholder="Search for a movie title..."
              />
              <Button onClick={handleSearch} className="rounded-l-none bg-[#00BFFF] hover:bg-[#0099CC] text-black">
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {showSearchResults && (
              <div className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg overflow-hidden">
                <div className="p-2 border-b border-[#3A3A3A] bg-[#282828]">
                  <p className="text-sm">Search results for "{searchQuery}"</p>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="p-3 border-b border-[#3A3A3A] last:border-0 flex items-center hover:bg-[#282828] cursor-pointer"
                      onClick={() => handleSelectSearchResult(result)}
                    >
                      <div className="w-10 h-14 bg-[#3A3A3A] rounded overflow-hidden mr-3 flex-shrink-0">
                        {result.posterUrl ? (
                          <Image
                            src={result.posterUrl || "/placeholder.svg"}
                            alt={result.title}
                            width={40}
                            height={56}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Film className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{result.title}</p>
                        <p className="text-sm text-gray-400">{result.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
          <CardDescription>Manually add a project to your filmography</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
                placeholder="e.g. Inception"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
                placeholder="e.g. Director, Writer, Producer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value ? Number.parseInt(e.target.value) : "")}
                className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
                placeholder="e.g. 2010"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="posterUpload">Poster Image (Optional)</Label>
              <div className="flex">
                <Input
                  id="posterUrl"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF] rounded-r-none"
                  placeholder="Poster URL or upload"
                  disabled
                />
                <Button
                  variant="outline"
                  className="rounded-l-none border-[#3A3A3A] hover:bg-[#3A3A3A]"
                  onClick={() => setPosterUrl("/placeholder.svg?height=300&width=200&query=movie+poster")}
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
              placeholder="Brief description of the project..."
            />
          </div>

          <Button
            onClick={handleAddFilm}
            disabled={!title || !role || !year}
            className="w-full bg-[#00BFFF] hover:bg-[#0099CC] text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Filmography
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Filmography</CardTitle>
            <CardDescription>Manage your film and TV projects</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="border-[#3A3A3A] hover:bg-[#3A3A3A]">
            <MoveVertical className="w-4 h-4 mr-2" />
            Reorder
          </Button>
        </CardHeader>
        <CardContent>
          {data.filmography && data.filmography.length > 0 ? (
            <div className="space-y-3">
              {data.filmography
                .sort((a, b) => b.year - a.year)
                .map((film) => (
                  <div key={film.id} className="bg-[#1A1A1A] rounded-lg p-4 flex items-start">
                    <div className="w-16 h-24 bg-[#3A3A3A] rounded overflow-hidden mr-4 flex-shrink-0">
                      {film.posterUrl ? (
                        <Image
                          src={film.posterUrl || "/placeholder.svg"}
                          alt={film.title}
                          width={64}
                          height={96}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{film.title}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFilm(film.id)}
                          className="text-gray-400 hover:text-white hover:bg-[#3A3A3A] h-6 w-6 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-400">{film.role}</p>
                      <p className="text-sm text-gray-400">{film.year}</p>
                      {film.description && (
                        <p className="text-sm text-gray-400 mt-2 line-clamp-2">{film.description}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Film className="w-12 h-12 mx-auto mb-3 text-gray-500" />
              <p>No projects added yet</p>
              <p className="text-sm">Add your film and TV projects to showcase your work</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
