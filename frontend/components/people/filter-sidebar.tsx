"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface FilterSidebarProps {
  onFilterChange?: (filters: string[]) => void
  activeFilters?: string[]
}

export function FilterSidebar({ onFilterChange, activeFilters = [] }: FilterSidebarProps) {
  const [activeYears, setActiveYears] = useState([1950, 2023])
  const [expandedSections, setExpandedSections] = useState({
    role: true,
    country: true,
    decade: true,
    awards: false,
  })
  const [localFilters, setLocalFilters] = useState<string[]>(activeFilters)

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  const handleFilterChange = (filter: string, checked: boolean) => {
    let newFilters: string[]

    if (checked) {
      newFilters = [...localFilters, filter]
    } else {
      newFilters = localFilters.filter((f) => f !== filter)
    }

    setLocalFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleReset = () => {
    setLocalFilters([])
    setActiveYears([1950, 2023])
    onFilterChange?.([])
  }

  const handleApply = () => {
    // In a real app, this might do more processing
    onFilterChange?.(localFilters)
  }

  return (
    <motion.div
      className="bg-[#282828] rounded-lg overflow-hidden border border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-semibold text-lg">Filters</h3>
      </div>

      <div className="divide-y divide-gray-700">
        <FilterSection title="Role" expanded={expandedSections.role} onToggle={() => toggleSection("role")}>
          <div className="px-2 py-2 space-y-2">
            {["Actor", "Actress", "Director", "Writer", "Producer", "Cinematographer", "Composer", "Editor"].map(
              (role) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role}`}
                    checked={localFilters.includes(`role:${role}`)}
                    onCheckedChange={(checked) => handleFilterChange(`role:${role}`, checked as boolean)}
                  />
                  <Label htmlFor={`role-${role}`} className="text-sm cursor-pointer">
                    {role}
                  </Label>
                </div>
              ),
            )}
          </div>
        </FilterSection>

        <FilterSection title="Country" expanded={expandedSections.country} onToggle={() => toggleSection("country")}>
          <div className="px-2 py-2 space-y-2">
            {[
              "United States",
              "United Kingdom",
              "India",
              "France",
              "Japan",
              "South Korea",
              "Italy",
              "Germany",
              "Spain",
              "Canada",
            ].map((country) => (
              <div key={country} className="flex items-center space-x-2">
                <Checkbox
                  id={`country-${country}`}
                  checked={localFilters.includes(`country:${country}`)}
                  onCheckedChange={(checked) => handleFilterChange(`country:${country}`, checked as boolean)}
                />
                <Label htmlFor={`country-${country}`} className="text-sm cursor-pointer">
                  {country}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Active Years" expanded={expandedSections.decade} onToggle={() => toggleSection("decade")}>
          <div className="px-2 py-4">
            <Slider
              value={activeYears}
              min={1900}
              max={2023}
              step={1}
              onValueChange={(value) => {
                setActiveYears(value)
                handleFilterChange(`years:${value[0]}-${value[1]}`, true)
              }}
              className="my-6"
            />
            <div className="flex justify-between text-sm">
              <span>{activeYears[0]}</span>
              <span>{activeYears[1]}</span>
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Awards" expanded={expandedSections.awards} onToggle={() => toggleSection("awards")}>
          <div className="px-2 py-2 space-y-2">
            {[
              "Oscar Winner",
              "Oscar Nominee",
              "Golden Globe Winner",
              "BAFTA Winner",
              "Emmy Winner",
              "Cannes Winner",
            ].map((award) => (
              <div key={award} className="flex items-center space-x-2">
                <Checkbox
                  id={`award-${award}`}
                  checked={localFilters.includes(`award:${award}`)}
                  onCheckedChange={(checked) => handleFilterChange(`award:${award}`, checked as boolean)}
                />
                <Label htmlFor={`award-${award}`} className="text-sm cursor-pointer">
                  {award}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
      </div>

      <div className="p-4 flex space-x-2">
        <Button variant="outline" size="sm" className="flex-1 border-gray-700" onClick={handleReset}>
          Reset
        </Button>
        <Button size="sm" className="flex-1 bg-[#00BFFF] hover:bg-[#00BFFF]/90" onClick={handleApply}>
          Apply
        </Button>
      </div>
    </motion.div>
  )
}

interface FilterSectionProps {
  title: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function FilterSection({ title, expanded, onToggle, children }: FilterSectionProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex justify-between items-center hover:bg-[#333333] transition-colors"
        aria-expanded={expanded}
      >
        <span className="font-medium">{title}</span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}
