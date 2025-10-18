"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Music, Scissors, Sparkles } from "lucide-react"
import type { TechnicalFilters } from "../types"

interface TechnicalFiltersPanelProps {
  filters: TechnicalFilters
  onChange: (filters: TechnicalFilters) => void
}

export function TechnicalFiltersPanel({ filters, onChange }: TechnicalFiltersPanelProps) {
  const [searchResults, setSearchResults] = useState<Record<string, string[]>>({})

  const technicalRoles = [
    { key: "cinematographer" as const, label: "Cinematographer", icon: Camera },
    { key: "composer" as const, label: "Composer", icon: Music },
    { key: "editor" as const, label: "Editor", icon: Scissors },
    { key: "vfxSupervisor" as const, label: "VFX Supervisor", icon: Sparkles },
  ]

  // Mock search function
  const searchPeople = (role: string, query: string) => {
    if (query.length < 2) {
      setSearchResults({ ...searchResults, [role]: [] })
      return
    }

    // Mock results based on role
    const mockData: Record<string, string[]> = {
      cinematographer: ["Roger Deakins", "Emmanuel Lubezki", "Hoyte van Hoytema"],
      composer: ["Hans Zimmer", "John Williams", "Alexandre Desplat"],
      editor: ["Thelma Schoonmaker", "Walter Murch", "Michael Kahn"],
      vfxSupervisor: ["John Dykstra", "Dennis Muren", "Rob Legato"],
    }

    const results = mockData[role]?.filter((name) => name.toLowerCase().includes(query.toLowerCase())) || []

    setSearchResults({ ...searchResults, [role]: results })
  }

  return (
    <div className="space-y-4">
      {technicalRoles.map((role) => {
        const Icon = role.icon
        return (
          <div key={role.key}>
            <Label htmlFor={role.key} className="text-gray-300 flex items-center gap-2 mb-2">
              <Icon size={16} />
              {role.label}
            </Label>
            <Input
              id={role.key}
              value={filters[role.key] || ""}
              onChange={(e) => {
                onChange({ ...filters, [role.key]: e.target.value })
                searchPeople(role.key, e.target.value)
              }}
              placeholder={`Search for ${role.label.toLowerCase()}`}
              className="bg-[#333333] border-gray-600 text-white"
            />
            {searchResults[role.key]?.length > 0 && (
              <div className="mt-2 bg-[#333333] rounded-lg p-2 space-y-1">
                {searchResults[role.key].map((person) => (
                  <button
                    key={person}
                    onClick={() => {
                      onChange({ ...filters, [role.key]: person })
                      setSearchResults({ ...searchResults, [role.key]: [] })
                    }}
                    className="w-full text-left px-3 py-2 text-white hover:bg-[#404040] rounded transition-colors"
                  >
                    {person}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
