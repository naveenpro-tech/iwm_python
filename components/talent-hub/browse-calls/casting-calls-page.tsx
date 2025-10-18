"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Grid3X3, List, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { mockCastingCalls } from "../mock-data"
import CastingCallCard from "./casting-call-card"
import CastingCallListItem from "./casting-call-list-item"
import { cn } from "@/lib/utils"

export default function CastingCallsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [roleType, setRoleType] = useState<"all" | "acting" | "crew">("all")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [expandedFilter, setExpandedFilter] = useState<string | null>("projectType")
  const [sortBy, setSortBy] = useState("newest")

  // Filter states
  const [projectTypeFilters, setProjectTypeFilters] = useState<string[]>([])
  const [locationFilter, setLocationFilter] = useState("")
  const [compensationFilters, setCompensationFilters] = useState<string[]>([])
  const [experienceLevelFilters, setExperienceLevelFilters] = useState<string[]>([])
  const [ageRange, setAgeRange] = useState([18, 65])

  const toggleFilter = (section: string) => {
    setExpandedFilter(expandedFilter === section ? null : section)
  }

  const toggleProjectTypeFilter = (type: string) => {
    setProjectTypeFilters((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const toggleCompensationFilter = (type: string) => {
    setCompensationFilters((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const toggleExperienceLevelFilter = (level: string) => {
    setExperienceLevelFilters((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  const clearAllFilters = () => {
    setProjectTypeFilters([])
    setLocationFilter("")
    setCompensationFilters([])
    setExperienceLevelFilters([])
    setAgeRange([18, 65])
  }

  // Filter the casting calls
  const filteredCalls = mockCastingCalls.filter((call) => {
    // Filter by search query
    if (
      searchQuery &&
      !call.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !call.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by role type
    if (roleType !== "all") {
      const hasMatchingRole = call.roles.some((role) => role.type === roleType)
      if (!hasMatchingRole) return false
    }

    // Filter by project type
    if (projectTypeFilters.length > 0 && !projectTypeFilters.includes(call.projectType)) {
      return false
    }

    // Filter by location
    if (
      locationFilter &&
      !`${call.location.city} ${call.location.state} ${call.location.country}`
        .toLowerCase()
        .includes(locationFilter.toLowerCase())
    ) {
      return false
    }

    // Filter by compensation
    if (compensationFilters.length > 0) {
      const hasMatchingCompensation = call.roles.some((role) => compensationFilters.includes(role.compensation))
      if (!hasMatchingCompensation) return false
    }

    // Filter by experience level
    if (experienceLevelFilters.length > 0) {
      const hasMatchingExperience = call.roles.some((role) =>
        experienceLevelFilters.includes(role.requirements.experienceLevel),
      )
      if (!hasMatchingExperience) return false
    }

    // Filter by age range
    const hasMatchingAgeRange = call.roles.some((role) => {
      if (!role.requirements.ageRange) return true
      return role.requirements.ageRange.min <= ageRange[1] && role.requirements.ageRange.max >= ageRange[0]
    })
    if (!hasMatchingAgeRange) return false

    return true
  })

  // Sort the filtered calls
  const sortedCalls = [...filteredCalls].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      case "deadline":
        return new Date(a.submissionDeadline).getTime() - new Date(b.submissionDeadline).getTime()
      case "alphabetical":
        return a.projectTitle.localeCompare(b.projectTitle)
      default:
        return 0
    }
  })

  const FilterSection = ({
    title,
    section,
    children,
  }: {
    title: string
    section: string
    children: React.ReactNode
  }) => (
    <div className="border-b border-[#3A3A3A] last:border-0">
      <button
        onClick={() => toggleFilter(section)}
        className="flex items-center justify-between w-full py-3 px-4 hover:bg-[#3A3A3A] transition-colors"
      >
        <h3 className="font-medium">{title}</h3>
        {expandedFilter === section ? (
          <ChevronUp className="w-4 h-4 text-[#A0A0A0]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#A0A0A0]" />
        )}
      </button>
      <AnimatePresence>
        {expandedFilter === section && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-4 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="bg-[#1A1A1A] border-b border-[#282828] sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-inter">Casting & Crew Calls</h1>
              <p className="text-[#A0A0A0] mt-1">Find your next opportunity in film, TV, and media</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="md:hidden border-[#282828]"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button className="bg-[#00BFFF] hover:bg-[#0099CC] text-black">Post a Casting Call</Button>
            </div>
          </div>

          {/* Tabs & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
            <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={(v) => setRoleType(v as any)}>
              <TabsList className="bg-[#282828] w-full md:w-auto">
                <TabsTrigger
                  value="all"
                  className="flex-1 md:flex-none data-[state=active]:bg-[#00BFFF] data-[state=active]:text-black"
                >
                  All Opportunities
                </TabsTrigger>
                <TabsTrigger
                  value="acting"
                  className="flex-1 md:flex-none data-[state=active]:bg-[#00BFFF] data-[state=active]:text-black"
                >
                  Acting Roles
                </TabsTrigger>
                <TabsTrigger
                  value="crew"
                  className="flex-1 md:flex-none data-[state=active]:bg-[#00BFFF] data-[state=active]:text-black"
                >
                  Crew Positions
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] w-4 h-4" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#282828] border-[#3A3A3A] focus:border-[#00BFFF]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center border border-[#3A3A3A] rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "rounded-none rounded-l-md",
                    viewMode === "grid" ? "bg-[#282828] text-[#00BFFF]" : "text-[#A0A0A0]",
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "rounded-none rounded-r-md",
                    viewMode === "list" ? "bg-[#282828] text-[#00BFFF]" : "text-[#A0A0A0]",
                  )}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(filtersOpen || !filtersOpen) && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{
                  width: "auto",
                  opacity: 1,
                  display: filtersOpen || !filtersOpen ? "block" : "none",
                }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "bg-[#282828] rounded-lg overflow-hidden",
                  filtersOpen ? "fixed inset-0 z-50 m-4 md:relative md:inset-auto md:m-0" : "hidden md:block",
                )}
                style={{ maxWidth: filtersOpen ? "calc(100% - 2rem)" : 280 }}
              >
                <div className="flex items-center justify-between p-4 border-b border-[#3A3A3A]">
                  <h2 className="font-semibold">Filters</h2>
                  {filtersOpen && (
                    <Button variant="ghost" size="sm" onClick={() => setFiltersOpen(false)} className="md:hidden">
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
                  <FilterSection title="Project Type" section="projectType">
                    <div className="space-y-2">
                      {["feature", "short", "tv-series", "web-series", "commercial", "documentary"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type}`}
                            checked={projectTypeFilters.includes(type)}
                            onCheckedChange={() => toggleProjectTypeFilter(type)}
                          />
                          <Label htmlFor={`type-${type}`} className="font-normal cursor-pointer capitalize">
                            {type.replace("-", " ")}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </FilterSection>

                  <FilterSection title="Location" section="location">
                    <Input
                      placeholder="City, State, or Country"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
                    />
                  </FilterSection>

                  <FilterSection title="Compensation" section="compensation">
                    <div className="space-y-2">
                      {["paid", "unpaid", "deferred", "credit-only"].map((comp) => (
                        <div key={comp} className="flex items-center space-x-2">
                          <Checkbox
                            id={`comp-${comp}`}
                            checked={compensationFilters.includes(comp)}
                            onCheckedChange={() => toggleCompensationFilter(comp)}
                          />
                          <Label htmlFor={`comp-${comp}`} className="font-normal cursor-pointer capitalize">
                            {comp.replace("-", " ")}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </FilterSection>

                  <FilterSection title="Experience Level" section="experience">
                    <div className="space-y-2">
                      {["beginner", "intermediate", "professional"].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={`exp-${level}`}
                            checked={experienceLevelFilters.includes(level)}
                            onCheckedChange={() => toggleExperienceLevelFilter(level)}
                          />
                          <Label htmlFor={`exp-${level}`} className="font-normal cursor-pointer capitalize">
                            {level}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </FilterSection>

                  <FilterSection title="Age Range" section="age">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>{ageRange[0]}</span>
                        <span>{ageRange[1]}</span>
                      </div>
                      <Slider
                        defaultValue={ageRange}
                        min={1}
                        max={100}
                        step={1}
                        value={ageRange}
                        onValueChange={setAgeRange}
                        className="[&_[role=slider]]:bg-[#00BFFF]"
                      />
                    </div>
                  </FilterSection>
                </div>

                <div className="p-4 border-t border-[#3A3A3A] flex justify-between">
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                  <Badge variant="outline" className="bg-[#00BFFF] text-black border-0">
                    {filteredCalls.length} Results
                  </Badge>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-[#A0A0A0]">
                Showing <span className="text-white font-medium">{sortedCalls.length}</span> opportunities
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#A0A0A0] hidden md:inline">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] bg-[#282828] border-[#3A3A3A]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {sortedCalls.length === 0 ? (
              <Card className="p-8 bg-[#282828] border-[#3A3A3A] text-center">
                <h3 className="text-xl font-semibold mb-2">No matching opportunities found</h3>
                <p className="text-[#A0A0A0] mb-4">Try adjusting your filters or search query</p>
                <Button variant="outline" onClick={clearAllFilters} className="border-[#3A3A3A]">
                  Clear All Filters
                </Button>
              </Card>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCalls.map((call) => (
                  <CastingCallCard key={call.id} call={call} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedCalls.map((call) => (
                  <CastingCallListItem key={call.id} call={call} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
