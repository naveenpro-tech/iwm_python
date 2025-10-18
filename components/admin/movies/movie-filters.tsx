"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { ALL_GENRES, ALL_STATUSES } from "@/components/admin/movies/types"
import type { MovieFiltersState, MovieGenre, MovieStatus } from "@/components/admin/movies/types" // Updated import

interface MovieFiltersProps {
  filters: MovieFiltersState
  onFiltersChange: (filters: MovieFiltersState) => void
}

export function MovieFilters({ filters, onFiltersChange }: MovieFiltersProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString())

  const handleReset = () => {
    onFiltersChange({
      genre: "all",
      status: "all",
      year: "all",
    })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg">Filters</h3>
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1">
            <X size={16} />
            Reset Filters
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="genre-filter">Genre</Label>
            <Select
              value={filters.genre}
              onValueChange={(value) => onFiltersChange({ ...filters, genre: value as MovieGenre | "all" })}
            >
              <SelectTrigger id="genre-filter">
                <SelectValue placeholder="All genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All genres</SelectItem>
                {ALL_GENRES.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => onFiltersChange({ ...filters, status: value as MovieStatus | "all" })}
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {ALL_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year-filter">Release Year</Label>
            <Select value={filters.year} onValueChange={(value) => onFiltersChange({ ...filters, year: value })}>
              <SelectTrigger id="year-filter">
                <SelectValue placeholder="All years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
