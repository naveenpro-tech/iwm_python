"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { MapPin, Search, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Location {
  city: string
  state: string
  country: string
  coordinates?: {
    lat: number
    lng: number
  }
}

interface LocationPickerProps {
  value: Location
  onChange: (location: Location) => void
  label?: string
  required?: boolean
  className?: string
}

// Mock location suggestions - in production, this would use a geocoding API
const mockLocationSuggestions = [
  { city: "Mumbai", state: "Maharashtra", country: "India", coordinates: { lat: 19.076, lng: 72.8777 } },
  { city: "Delhi", state: "Delhi", country: "India", coordinates: { lat: 28.6139, lng: 77.209 } },
  { city: "Bangalore", state: "Karnataka", country: "India", coordinates: { lat: 12.9716, lng: 77.5946 } },
  { city: "Chennai", state: "Tamil Nadu", country: "India", coordinates: { lat: 13.0827, lng: 80.2707 } },
  { city: "Kolkata", state: "West Bengal", country: "India", coordinates: { lat: 22.5726, lng: 88.3639 } },
  { city: "Hyderabad", state: "Telangana", country: "India", coordinates: { lat: 17.385, lng: 78.4867 } },
  { city: "Pune", state: "Maharashtra", country: "India", coordinates: { lat: 18.5204, lng: 73.8567 } },
  { city: "Ahmedabad", state: "Gujarat", country: "India", coordinates: { lat: 23.0225, lng: 72.5714 } },
  { city: "Los Angeles", state: "California", country: "USA", coordinates: { lat: 34.0522, lng: -118.2437 } },
  { city: "New York", state: "New York", country: "USA", coordinates: { lat: 40.7128, lng: -74.006 } },
]

export function LocationPicker({
  value,
  onChange,
  label = "Location",
  required = false,
  className,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Location[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate location search
  const searchLocations = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const filtered = mockLocationSuggestions.filter(
      (loc) =>
        loc.city.toLowerCase().includes(query.toLowerCase()) ||
        loc.state.toLowerCase().includes(query.toLowerCase()) ||
        loc.country.toLowerCase().includes(query.toLowerCase()),
    )

    setSuggestions(filtered)
    setIsLoading(false)
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchLocations(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, searchLocations])

  const handleSelectLocation = (location: Location) => {
    onChange(location)
    setSearchQuery("")
    setShowSuggestions(false)
    setIsSearching(false)
  }

  const handleClearLocation = () => {
    onChange({ city: "", state: "", country: "" })
    setSearchQuery("")
  }

  const formatLocationDisplay = (location: Location) => {
    const parts = [location.city, location.state, location.country].filter(Boolean)
    return parts.join(", ")
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      {!isSearching && value.city ? (
        // Display selected location
        <div className="flex items-center gap-2 p-3 bg-[#1A1A1A] border border-[#3A3A3A] rounded-md">
          <MapPin className="w-4 h-4 text-[#00BFFF]" />
          <span className="flex-1">{formatLocationDisplay(value)}</span>
          <Button type="button" variant="ghost" size="sm" onClick={() => setIsSearching(true)} className="h-7 px-2">
            Change
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearLocation}
            className="h-7 px-2 text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        // Search interface
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              className="pl-10 pr-10 bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
            )}
            {!isSearching && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsSearching(false)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-2"
              >
                Cancel
              </Button>
            )}
          </div>

          {/* Suggestions dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-1 bg-[#282828] border border-[#3A3A3A] rounded-md shadow-lg overflow-hidden"
              >
                <div className="max-h-60 overflow-y-auto">
                  {suggestions.map((location, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectLocation(location)}
                      className="w-full px-4 py-3 text-left hover:bg-[#3A3A3A] transition-colors flex items-center gap-3"
                    >
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium">{location.city}</div>
                        <div className="text-sm text-gray-400">
                          {location.state}, {location.country}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* No results message */}
          {showSuggestions && searchQuery && suggestions.length === 0 && !isLoading && (
            <div className="absolute z-50 w-full mt-1 bg-[#282828] border border-[#3A3A3A] rounded-md p-4 text-center text-gray-400">
              No locations found matching "{searchQuery}"
            </div>
          )}
        </div>
      )}

      {/* Manual input fallback */}
      {isSearching && (
        <div className="mt-4 p-4 bg-[#1A1A1A] rounded-md border border-[#3A3A3A]">
          <p className="text-sm text-gray-400 mb-3">Or enter location manually:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="City"
              value={value.city}
              onChange={(e) => onChange({ ...value, city: e.target.value })}
              className="bg-[#282828] border-[#3A3A3A]"
            />
            <Input
              placeholder="State/Province"
              value={value.state}
              onChange={(e) => onChange({ ...value, state: e.target.value })}
              className="bg-[#282828] border-[#3A3A3A]"
            />
            <Input
              placeholder="Country"
              value={value.country}
              onChange={(e) => onChange({ ...value, country: e.target.value })}
              className="bg-[#282828] border-[#3A3A3A]"
            />
          </div>
        </div>
      )}
    </div>
  )
}
