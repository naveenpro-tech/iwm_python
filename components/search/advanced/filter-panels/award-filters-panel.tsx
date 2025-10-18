"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Trophy } from "lucide-react"
import type { AwardFilters } from "../types"

interface AwardFiltersPanelProps {
  filters: AwardFilters
  onChange: (filters: AwardFilters) => void
}

export function AwardFiltersPanel({ filters, onChange }: AwardFiltersPanelProps) {
  const [specificAward, setSpecificAward] = useState("")

  const majorAwards = [
    { key: "hasOscar" as const, label: "Academy Awards (Oscar)", icon: "🏆" },
    { key: "hasCannes" as const, label: "Cannes Film Festival", icon: "🌴" },
    { key: "hasGoldenGlobe" as const, label: "Golden Globe", icon: "🌍" },
  ]

  const addSpecificAward = () => {
    if (specificAward.trim()) {
      onChange({
        ...filters,
        specificAwards: [...(filters.specificAwards || []), specificAward.trim()],
      })
      setSpecificAward("")
    }
  }

  const removeSpecificAward = (award: string) => {
    onChange({
      ...filters,
      specificAwards: filters.specificAwards?.filter((a) => a !== award),
    })
  }

  return (
    <div className="space-y-4">
      {/* Major Awards */}
      <div className="space-y-3">
        {majorAwards.map((award) => (
          <div key={award.key} className="flex items-center space-x-3">
            <Checkbox
              id={award.key}
              checked={filters[award.key] || false}
              onCheckedChange={(checked) => onChange({ ...filters, [award.key]: checked as boolean })}
              className="border-gray-600 data-[state=checked]:bg-[#00BFFF]"
            />
            <Label htmlFor={award.key} className="text-gray-300 cursor-pointer flex items-center gap-2">
              <span className="text-xl">{award.icon}</span>
              {award.label}
            </Label>
          </div>
        ))}
      </div>

      {/* Specific Awards */}
      <div>
        <Label className="text-gray-300 flex items-center gap-2 mb-2">
          <Trophy size={16} />
          Specific Awards
        </Label>
        <div className="flex gap-2">
          <Input
            value={specificAward}
            onChange={(e) => setSpecificAward(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addSpecificAward()}
            placeholder="e.g., BAFTA, SAG Award"
            className="bg-[#333333] border-gray-600 text-white"
          />
          <button
            onClick={addSpecificAward}
            className="px-4 py-2 bg-[#00BFFF] hover:bg-[#0099CC] rounded text-white transition-colors"
          >
            Add
          </button>
        </div>
        {filters.specificAwards && filters.specificAwards.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.specificAwards.map((award) => (
              <Badge key={award} variant="secondary" className="bg-[#333333]">
                {award}
                <button onClick={() => removeSpecificAward(award)} className="ml-2 hover:text-red-400">
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
