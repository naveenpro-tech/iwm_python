"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DateFilters } from "../types"

interface DateFiltersPanelProps {
  filters: DateFilters
  onChange: (filters: DateFilters) => void
}

export function DateFiltersPanel({ filters, onChange }: DateFiltersPanelProps) {
  const decades = ["2020s", "2010s", "2000s", "1990s", "1980s", "1970s", "1960s", "1950s", "1940s", "1930s"]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year-from" className="text-gray-300">
            From Year
          </Label>
          <Input
            id="year-from"
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={filters.yearFrom || ""}
            onChange={(e) => onChange({ ...filters, yearFrom: Number.parseInt(e.target.value) || undefined })}
            placeholder="e.g., 2000"
            className="bg-[#333333] border-gray-600 text-white"
          />
        </div>
        <div>
          <Label htmlFor="year-to" className="text-gray-300">
            To Year
          </Label>
          <Input
            id="year-to"
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={filters.yearTo || ""}
            onChange={(e) => onChange({ ...filters, yearTo: Number.parseInt(e.target.value) || undefined })}
            placeholder="e.g., 2023"
            className="bg-[#333333] border-gray-600 text-white"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="decade" className="text-gray-300">
          Decade
        </Label>
        <Select
          value={filters.decade || ""}
          onValueChange={(value) => onChange({ ...filters, decade: value || undefined })}
        >
          <SelectTrigger id="decade" className="bg-[#333333] border-gray-600 text-white">
            <SelectValue placeholder="Select a decade" />
          </SelectTrigger>
          <SelectContent className="bg-[#333333] border-gray-600">
            <SelectItem value="any">Any decade</SelectItem>
            {decades.map((decade) => (
              <SelectItem key={decade} value={decade} className="text-white">
                {decade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="specific-year" className="text-gray-300">
          Specific Year
        </Label>
        <Input
          id="specific-year"
          type="number"
          min="1900"
          max={new Date().getFullYear()}
          value={filters.specificYear || ""}
          onChange={(e) => onChange({ ...filters, specificYear: Number.parseInt(e.target.value) || undefined })}
          placeholder="e.g., 2023"
          className="bg-[#333333] border-gray-600 text-white"
        />
      </div>
    </div>
  )
}
