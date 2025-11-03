"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Edit3, Search, AwardIcon, Filter, X, Trophy, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { AwardInfo } from "../types"
import { useToast } from "@/hooks/use-toast"
import {
  fetchAllAwardCeremonies,
  filterCeremonies,
  getUniqueCountries,
  getUniqueLanguages,
  getUniqueCategoryTypes,
  getPrestigeBadgeColor,
  getPrestigeBadgeLabel,
  type AwardCeremony,
} from "@/lib/api/award-ceremonies"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"

interface MovieAwardsFormProps {
  initialAwards: AwardInfo[]
  onAwardsChange: (awards: AwardInfo[]) => void
}

const emptyAward: Omit<AwardInfo, "id"> = {
  name: "",
  year: new Date().getFullYear(),
  category: "",
  status: "Nominee",
}

export function MovieAwardsFormEnhanced({ initialAwards, onAwardsChange }: MovieAwardsFormProps) {
  const [awards, setAwards] = useState<AwardInfo[]>(
    initialAwards.map((a) => ({ ...a, id: a.id || Date.now().toString() + Math.random() })),
  )
  const [editingAward, setEditingAward] = useState<(Partial<AwardInfo> & { id?: string }) | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  // Award ceremonies state
  const [ceremonies, setCeremonies] = useState<AwardCeremony[]>([])
  const [isLoadingCeremonies, setIsLoadingCeremonies] = useState(true)
  const [ceremonySearch, setCeremonySearch] = useState("")
  const [selectedCeremony, setSelectedCeremony] = useState<AwardCeremony | null>(null)
  const [ceremonyPopoverOpen, setCeremonyPopoverOpen] = useState(false)

  // Filter state
  const [countryFilter, setCountryFilter] = useState<string>("All")
  const [languageFilter, setLanguageFilter] = useState<string>("All")
  const [categoryTypeFilter, setCategoryTypeFilter] = useState<string>("All")
  const [showFilters, setShowFilters] = useState(false)

  // Load award ceremonies on mount
  useEffect(() => {
    loadCeremonies()
  }, [])

  const loadCeremonies = async () => {
    try {
      setIsLoadingCeremonies(true)
      const data = await fetchAllAwardCeremonies()
      setCeremonies(data)
    } catch (error) {
      console.error("Failed to load award ceremonies:", error)
      toast({
        title: "Error",
        description: "Failed to load award ceremonies. Using fallback data.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingCeremonies(false)
    }
  }

  // Get filter options
  const countries = ["All", ...getUniqueCountries(ceremonies)]
  const languages = ["All", ...getUniqueLanguages(ceremonies)]
  const categoryTypes = ["All", ...getUniqueCategoryTypes(ceremonies)]

  // Filter ceremonies based on selected filters
  const filteredCeremonies = filterCeremonies(ceremonies, {
    country: countryFilter,
    language: languageFilter,
    category_type: categoryTypeFilter,
    search: ceremonySearch,
  })

  const handleInputChange = (field: keyof AwardInfo, value: any) => {
    if (editingAward) {
      setEditingAward({ ...editingAward, [field]: value })
    }
  }

  const handleCeremonySelect = (ceremony: AwardCeremony) => {
    if (editingAward) {
      setEditingAward({
        ...editingAward,
        name: ceremony.name,
        ceremony_id: ceremony.external_id,
        country: ceremony.country || undefined,
        language: ceremony.language || undefined,
        prestige_level: ceremony.prestige_level || undefined,
      })
      setSelectedCeremony(ceremony)
      setCeremonyPopoverOpen(false)
      setCeremonySearch("")
    }
  }

  const handleSaveAward = () => {
    if (!editingAward || !editingAward.name || !editingAward.category || !editingAward.year) {
      toast({ title: "Error", description: "Award Name, Category, and Year are required.", variant: "destructive" })
      return
    }

    const year = Number(editingAward.year)
    const currentYear = new Date().getFullYear()

    if (isNaN(year) || year < 1900 || year > currentYear + 5) {
      toast({
        title: "Invalid Year",
        description: `Year must be between 1900 and ${currentYear + 5}.`,
        variant: "destructive",
      })
      return
    }

    const finalAward: AwardInfo = {
      id: editingAward.id || Date.now().toString(),
      name: editingAward.name!,
      year: year,
      category: editingAward.category!,
      status: editingAward.status || "Nominee",
      ceremony_id: editingAward.ceremony_id,
      country: editingAward.country,
      language: editingAward.language,
      organization: editingAward.organization,
      prestige_level: editingAward.prestige_level,
    }

    let newAwardsList
    if (editingAward.id && !isAdding) {
      newAwardsList = awards.map((a) => (a.id === editingAward!.id ? finalAward : a))
    } else {
      newAwardsList = [...awards, finalAward]
    }
    setAwards(newAwardsList)
    onAwardsChange(newAwardsList)
    setEditingAward(null)
    setIsAdding(false)
    setSelectedCeremony(null)
    setCeremonySearch("")
  }

  const handleDeleteAward = (id: string) => {
    const newAwardsList = awards.filter((a) => a.id !== id)
    setAwards(newAwardsList)
    onAwardsChange(newAwardsList)
  }

  const startEdit = (award: AwardInfo) => {
    setEditingAward({ ...award })
    setIsAdding(false)
    // Find and set the selected ceremony if ceremony_id exists
    if (award.ceremony_id) {
      const ceremony = ceremonies.find((c) => c.external_id === award.ceremony_id)
      setSelectedCeremony(ceremony || null)
    }
  }

  const startAdd = () => {
    setEditingAward({ ...emptyAward, id: Date.now().toString() })
    setIsAdding(true)
    setSelectedCeremony(null)
    setCeremonySearch("")
  }

  const clearFilters = () => {
    setCountryFilter("All")
    setLanguageFilter("All")
    setCategoryTypeFilter("All")
  }

  const renderAwardForm = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="p-4 border rounded-lg space-y-4 mb-4 bg-muted/30"
    >
      {/* Filters Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Award Ceremony Filters</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="h-8 gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-background/50 rounded-md border"
            >
              <div className="space-y-1">
                <Label htmlFor="country-filter" className="text-xs">Country</Label>
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger id="country-filter" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="language-filter" className="text-xs">Language</Label>
                <Select value={languageFilter} onValueChange={setLanguageFilter}>
                  <SelectTrigger id="language-filter" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="type-filter" className="text-xs">Category Type</Label>
                <Select value={categoryTypeFilter} onValueChange={setCategoryTypeFilter}>
                  <SelectTrigger id="type-filter" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(countryFilter !== "All" || languageFilter !== "All" || categoryTypeFilter !== "All") && (
                <div className="md:col-span-3 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 gap-2">
                    <X className="h-3 w-3" />
                    Clear Filters
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Award Ceremony Selector */}
      <div className="space-y-1">
        <Label htmlFor="award-ceremony">Award Ceremony</Label>
        <Popover open={ceremonyPopoverOpen} onOpenChange={setCeremonyPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={ceremonyPopoverOpen}
              className="w-full justify-between"
            >
              {selectedCeremony ? (
                <span className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  {selectedCeremony.name}
                </span>
              ) : (
                <span className="text-muted-foreground">Select award ceremony...</span>
              )}
              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search award ceremonies..."
                value={ceremonySearch}
                onValueChange={setCeremonySearch}
              />
              <CommandEmpty>No award ceremony found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[300px]">
                  {filteredCeremonies.map((ceremony) => (
                    <CommandItem
                      key={ceremony.id}
                      value={ceremony.name}
                      onSelect={() => handleCeremonySelect(ceremony)}
                      className="flex items-start gap-2 py-2"
                    >
                      <Trophy className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{ceremony.name}</div>
                        <div className="text-xs text-muted-foreground flex flex-wrap gap-1 mt-1">
                          {ceremony.country && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {ceremony.country}
                            </Badge>
                          )}
                          {ceremony.language && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {ceremony.language}
                            </Badge>
                          )}
                          {ceremony.prestige_level && (
                            <Badge className={`text-xs px-1 py-0 ${getPrestigeBadgeColor(ceremony.prestige_level)}`}>
                              {getPrestigeBadgeLabel(ceremony.prestige_level)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Display selected ceremony metadata */}
        {selectedCeremony && (
          <div className="mt-2 p-2 bg-background/50 rounded-md border text-sm space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="h-3 w-3" />
              <span className="text-xs">
                {selectedCeremony.description || "No description available"}
              </span>
            </div>
            {selectedCeremony.established_year && (
              <div className="text-xs text-muted-foreground">
                Established: {selectedCeremony.established_year}
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-1">
          Or type manually below if ceremony not found
        </p>
      </div>

      {/* Manual Award Name Input (fallback) */}
      <div className="space-y-1">
        <Label htmlFor="award-name-manual">Award Name (Manual Entry)</Label>
        <Input
          id="award-name-manual"
          value={editingAward?.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="e.g., Academy Awards, Filmfare Awards"
        />
      </div>

      {/* Category, Year, Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label htmlFor="award-category">Category *</Label>
          <Input
            id="award-category"
            value={editingAward?.category || ""}
            onChange={(e) => handleInputChange("category", e.target.value)}
            placeholder="e.g., Best Picture"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="award-year">Year *</Label>
          <Input
            id="award-year"
            type="number"
            min="1900"
            max={new Date().getFullYear() + 5}
            value={editingAward?.year || ""}
            onChange={(e) => handleInputChange("year", Number.parseInt(e.target.value) || new Date().getFullYear())}
            placeholder={new Date().getFullYear().toString()}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="award-status">Status *</Label>
          <Select
            value={editingAward?.status}
            onValueChange={(val: "Winner" | "Nominee") => handleInputChange("status", val)}
          >
            <SelectTrigger id="award-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Winner">Winner</SelectItem>
              <SelectItem value="Nominee">Nominee</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="ghost"
          onClick={() => {
            setEditingAward(null)
            setIsAdding(false)
            setSelectedCeremony(null)
            setCeremonySearch("")
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSaveAward}>Save Award</Button>
      </div>
    </motion.div>
  )

  // Group awards by country for better organization
  const groupedAwards = awards.reduce((acc, award) => {
    const country = award.country || "Other"
    if (!acc[country]) {
      acc[country] = []
    }
    acc[country].push(award)
    return acc
  }, {} as Record<string, AwardInfo[]>)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Awards & Nominations</CardTitle>
        <CardDescription>
          Manage awards and nominations received by the movie. Select from 33+ award ceremonies including Indian and
          international awards.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence>
            {(isAdding || editingAward) && !isAdding && editingAward && renderAwardForm()}
          </AnimatePresence>

          {/* Display awards grouped by country */}
          {Object.entries(groupedAwards).map(([country, countryAwards]) => (
            <div key={country} className="space-y-2">
              <div className="flex items-center gap-2 mt-4 mb-2">
                <Badge variant="outline" className="text-xs">
                  {country}
                </Badge>
                <div className="h-px flex-1 bg-border" />
              </div>

              {countryAwards.map((award) => (
                <motion.div
                  key={award.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3 border rounded-md bg-card flex items-center justify-between gap-2"
                >
                  {editingAward?.id === award.id && !isAdding ? (
                    renderAwardForm()
                  ) : (
                    <>
                      <div className="flex-grow flex items-center gap-3">
                        <AwardIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold">{award.name}</span>
                            <span className="text-muted-foreground">({award.year})</span>
                            {award.prestige_level && (
                              <Badge className={`text-xs ${getPrestigeBadgeColor(award.prestige_level)}`}>
                                {getPrestigeBadgeLabel(award.prestige_level)}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {award.category} -{" "}
                            <span className={award.status === "Winner" ? "text-green-500 font-medium" : ""}>
                              {award.status}
                            </span>
                          </p>
                          {award.language && (
                            <p className="text-xs text-muted-foreground mt-0.5">Language: {award.language}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(award)}>
                          <Edit3 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAward(award.id)}
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          ))}

          <AnimatePresence>{isAdding && editingAward && renderAwardForm()}</AnimatePresence>
        </div>

        {!editingAward && !isAdding && (
          <Button variant="outline" onClick={startAdd} className="mt-4 w-full gap-2">
            <Plus size={16} /> Add Award/Nomination
          </Button>
        )}

        {isLoadingCeremonies && (
          <p className="text-xs text-muted-foreground text-center mt-2">Loading award ceremonies...</p>
        )}
      </CardContent>
    </Card>
  )
}

