"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Search } from "lucide-react"
import type { PeopleFilters } from "../types"

interface PeopleFiltersPanelProps {
  filters: PeopleFilters
  onChange: (filters: PeopleFilters) => void
}

export function PeopleFiltersPanel({ filters, onChange }: PeopleFiltersPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<keyof PeopleFilters>("actors")

  const categories: { key: keyof PeopleFilters; label: string }[] = [
    { key: "actors", label: "Actors" },
    { key: "directors", label: "Directors" },
    { key: "writers", label: "Writers" },
    { key: "producers", label: "Producers" },
  ]

  const addPerson = (category: keyof PeopleFilters, person: string) => {
    onChange({
      ...filters,
      [category]: [...(filters[category] || []), person],
    })
    setSearchTerm("")
  }

  const removePerson = (category: keyof PeopleFilters, person: string) => {
    onChange({
      ...filters,
      [category]: filters[category]?.filter((p) => p !== person),
    })
  }

  // Mock search results
  const mockSearchResults =
    searchTerm.length > 2
      ? ["Christopher Nolan", "Leonardo DiCaprio", "Meryl Streep", "Steven Spielberg", "Quentin Tarantino"].filter(
          (name) => name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : []

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex gap-2">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.key)}
            className={`px-3 py-1 rounded transition-colors ${
              activeCategory === category.key
                ? "bg-[#00BFFF] text-white"
                : "bg-[#333333] text-gray-300 hover:bg-[#404040]"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search for ${categories.find((c) => c.key === activeCategory)?.label.toLowerCase()}...`}
          className="pl-10 bg-[#333333] border-gray-600 text-white"
        />
      </div>

      {/* Search Results */}
      {mockSearchResults.length > 0 && (
        <div className="bg-[#333333] rounded-lg p-2 space-y-1">
          {mockSearchResults.map((person) => (
            <button
              key={person}
              onClick={() => addPerson(activeCategory, person)}
              className="w-full text-left px-3 py-2 text-white hover:bg-[#404040] rounded transition-colors"
            >
              {person}
            </button>
          ))}
        </div>
      )}

      {/* Selected People */}
      {categories.map((category) => {
        const people = filters[category.key]
        if (!people || people.length === 0) return null

        return (
          <div key={category.key}>
            <Label className="text-gray-300 text-sm">{category.label}</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {people.map((person) => (
                <Badge key={person} variant="secondary" className="bg-[#333333]">
                  {person}
                  <button onClick={() => removePerson(category.key, person)} className="ml-2 hover:text-red-400">
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
