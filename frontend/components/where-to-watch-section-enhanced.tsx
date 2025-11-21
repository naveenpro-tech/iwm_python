"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import {
  Globe,
  Info,
  Check,
  MapPin,
  Search,
  X,
  ChevronDown,
  Star,
  ExternalLink,
  CheckIcon as CheckboxIcon,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface StreamingOption {
  id: string
  provider: string
  logoUrl: string
  type: "subscription" | "rent" | "buy" | "free"
  price?: string
  quality: "SD" | "HD" | "4K" | "8K"
  url: string
  verified: boolean
  rating?: number
  userHasSubscription?: boolean
}

interface StreamingServiceCardProps {
  provider: string
  logoUrl: string
  url: string
  type: "subscription" | "rent" | "buy" | "free"
  quality: string
  verified: boolean
  rating?: number
  userHasSubscription?: boolean
  isSelected?: boolean
  onToggleSelect?: () => void
}

interface PurchaseOptionCardProps {
  provider: string
  logoUrl: string
  options: StreamingOption[]
  verified: boolean
  isExpanded: boolean
  onToggleExpand: () => void
  onToggleSelect: (optionId: string) => void
  selectedOptions: string[]
}

interface WhereToWatchSectionEnhancedProps {
  movieId: string
  movieTitle: string
  streamingOptions: {
    [region: string]: StreamingOption[]
  }
  userRegion?: string
}

// Mock data for demonstration
const mockStreamingOptions = {
  US: [
    {
      id: "netflix-us",
      provider: "Netflix",
      logoUrl: "/netflix-inspired-logo.png",
      type: "subscription" as const,
      quality: "4K" as const,
      url: "https://netflix.com",
      verified: true,
      rating: 4.5,
      userHasSubscription: true,
    },
    {
      id: "amazon-rent-us",
      provider: "Amazon Prime Video",
      logoUrl: "/amazon-prime-video-logo.png",
      type: "rent" as const,
      price: "$3.99",
      quality: "HD" as const,
      url: "https://amazon.com",
      verified: true,
      rating: 4.2,
    },
    {
      id: "amazon-buy-us",
      provider: "Amazon Prime Video",
      logoUrl: "/amazon-prime-video-logo.png",
      type: "buy" as const,
      price: "$9.99",
      quality: "4K" as const,
      url: "https://amazon.com",
      verified: true,
      rating: 4.2,
    },
    {
      id: "apple-rent-us",
      provider: "Apple TV+",
      logoUrl: "/apple-tv-plus-logo.png",
      type: "rent" as const,
      price: "$4.99",
      quality: "4K" as const,
      url: "https://tv.apple.com",
      verified: true,
      rating: 4.3,
    },
    {
      id: "youtube-free-us",
      provider: "YouTube",
      logoUrl: "/youtube-logo.png",
      type: "free" as const,
      quality: "HD" as const,
      url: "https://youtube.com",
      verified: true,
      rating: 3.8,
    },
  ],
  UK: [
    {
      id: "netflix-uk",
      provider: "Netflix",
      logoUrl: "/netflix-inspired-logo.png",
      type: "subscription" as const,
      quality: "4K" as const,
      url: "https://netflix.com",
      verified: true,
      rating: 4.5,
      userHasSubscription: false,
    },
    {
      id: "amazon-uk",
      provider: "Amazon Prime Video",
      logoUrl: "/amazon-prime-video-logo.png",
      type: "subscription" as const,
      quality: "HD" as const,
      url: "https://amazon.co.uk",
      verified: true,
      rating: 4.2,
      userHasSubscription: true,
    },
  ],
}

function StreamingServiceCard({
  provider,
  logoUrl,
  url,
  type,
  quality,
  verified,
  rating,
  userHasSubscription,
  isSelected,
  onToggleSelect,
}: StreamingServiceCardProps) {
  return (
    <motion.div
      className={cn(
        "relative bg-[#282828] rounded-lg p-4 cursor-pointer transition-all duration-200",
        "hover:bg-[#3A3A3A] hover:scale-105",
        isSelected && "ring-2 ring-[#00BFFF]",
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => window.open(url, "_blank")}
    >
      {onToggleSelect && (
        <div
          className="absolute top-2 right-2 z-10"
          onClick={(e) => {
            e.stopPropagation()
            onToggleSelect()
          }}
        >
          <div
            className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center",
              isSelected ? "bg-[#00BFFF] border-[#00BFFF]" : "border-[#A0A0A0]",
            )}
          >
            {isSelected && <CheckboxIcon className="w-3 h-3 text-white" />}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        <div className="relative w-16 h-16 mb-3">
          <Image
            src={logoUrl || "/placeholder.svg?height=64&width=64&query=streaming service logo"}
            alt={provider}
            fill
            className="object-contain"
          />
        </div>

        <h4 className="font-medium text-[#E0E0E0] mb-2">{provider}</h4>

        <div className="flex flex-col items-center gap-1 mb-3">
          <Badge variant="outline" className="text-xs">
            {quality}
          </Badge>
          <Badge variant={type === "subscription" ? "default" : "secondary"} className="capitalize text-xs">
            {type}
          </Badge>
        </div>

        {userHasSubscription && <Badge className="bg-green-600 text-white text-xs mb-2">Subscribed</Badge>}

        {verified && (
          <div className="flex items-center text-xs text-[#00BFFF] mb-2">
            <Check className="w-3 h-3 mr-1" />
            Verified
          </div>
        )}

        {rating && (
          <div className="flex items-center text-xs text-[#A0A0A0]">
            <Star className="w-3 h-3 mr-1 fill-[#FFD700] text-[#FFD700]" />
            {rating}
          </div>
        )}

        <ExternalLink className="w-4 h-4 text-[#A0A0A0] mt-2" />
      </div>
    </motion.div>
  )
}

function PurchaseOptionCard({
  provider,
  logoUrl,
  options,
  verified,
  isExpanded,
  onToggleExpand,
  onToggleSelect,
  selectedOptions,
}: PurchaseOptionCardProps) {
  return (
    <motion.div
      className="bg-[#282828] rounded-lg p-4"
      initial={false}
      animate={{ height: isExpanded ? "auto" : "auto" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="relative w-12 h-12 mr-3">
            <Image
              src={logoUrl || "/placeholder.svg?height=48&width=48&query=streaming service logo"}
              alt={provider}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h4 className="font-medium text-[#E0E0E0]">{provider}</h4>
            {verified && (
              <div className="flex items-center text-xs text-[#00BFFF]">
                <Check className="w-3 h-3 mr-1" />
                Verified
              </div>
            )}
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={onToggleExpand} className="text-[#A0A0A0] hover:text-[#E0E0E0]">
          <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <motion.div
            key={option.id}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border cursor-pointer",
              selectedOptions.includes(option.id)
                ? "border-[#00BFFF] bg-[#00BFFF]/10"
                : "border-[#3A3A3A] hover:border-[#A0A0A0]",
            )}
            whileHover={{ scale: 1.02 }}
            onClick={() => onToggleSelect(option.id)}
          >
            <div className="flex items-center">
              <div
                className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center mr-3",
                  selectedOptions.includes(option.id) ? "bg-[#00BFFF] border-[#00BFFF]" : "border-[#A0A0A0]",
                )}
              >
                {selectedOptions.includes(option.id) && <CheckboxIcon className="w-2.5 h-2.5 text-white" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={option.type === "rent" ? "secondary" : "default"} className="capitalize text-xs">
                    {option.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {option.quality}
                  </Badge>
                </div>
                {option.price && <p className="text-[#E0E0E0] font-medium mt-1">{option.price}</p>}
              </div>
            </div>

            <ExternalLink className="w-4 h-4 text-[#A0A0A0]" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export function WhereToWatchSectionEnhanced({
  movieId,
  movieTitle,
  streamingOptions = mockStreamingOptions,
  userRegion = "US",
}: WhereToWatchSectionEnhancedProps) {
  const [selectedRegion, setSelectedRegion] = useState(userRegion)
  const [activeTab, setActiveTab] = useState<"all" | "subscription" | "rent" | "buy" | "free">("all")
  const [showRegionSelector, setShowRegionSelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [qualityFilter, setQualityFilter] = useState<Record<string, boolean>>({
    SD: false,
    HD: false,
    "4K": false,
    "8K": false,
  })
  const [priceSort, setPriceSort] = useState<"low-to-high" | "high-to-low" | null>(null)
  const [showSubscribedOnly, setShowSubscribedOnly] = useState(false)
  const [expandedProviders, setExpandedProviders] = useState<Record<string, boolean>>({})
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [showPriceComparison, setShowPriceComparison] = useState(false)
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const availableRegions = Object.keys(streamingOptions).sort()
  const currentRegionOptions = streamingOptions[selectedRegion] || []

  // Filter options based on active tab, search query, and filters
  const getFilteredOptions = () => {
    let filtered = currentRegionOptions

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((option) => option.type === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((option) => option.provider.toLowerCase().includes(query))
    }

    // Filter by quality
    const activeQualityFilters = Object.entries(qualityFilter)
      .filter(([_, isActive]) => isActive)
      .map(([quality]) => quality)

    if (activeQualityFilters.length > 0) {
      filtered = filtered.filter((option) => activeQualityFilters.includes(option.quality))
    }

    // Filter by subscription
    if (showSubscribedOnly) {
      filtered = filtered.filter((option) => option.userHasSubscription)
    }

    // Sort by price
    if (priceSort && (activeTab === "rent" || activeTab === "buy" || activeTab === "all")) {
      filtered = [...filtered].sort((a, b) => {
        if (!a.price || !b.price) return 0

        const priceA = Number.parseFloat(a.price.replace(/[^0-9.]/g, ""))
        const priceB = Number.parseFloat(b.price.replace(/[^0-9.]/g, ""))

        return priceSort === "low-to-high" ? priceA - priceB : priceB - priceA
      })
    }

    return filtered
  }

  const filteredOptions = getFilteredOptions()

  // Group options by provider for subscription type
  const groupedSubscriptionOptions = filteredOptions
    .filter((option) => option.type === "subscription")
    .reduce<{ [provider: string]: StreamingOption[] }>((acc, option) => {
      if (!acc[option.provider]) {
        acc[option.provider] = []
      }
      acc[option.provider].push(option)
      return acc
    }, {})

  // Group options by provider for rent/buy types
  const groupedPurchaseOptions = filteredOptions
    .filter((option) => option.type === "rent" || option.type === "buy")
    .reduce<{ [provider: string]: StreamingOption[] }>((acc, option) => {
      if (!acc[option.provider]) {
        acc[option.provider] = []
      }
      acc[option.provider].push(option)
      return acc
    }, {})

  // Toggle provider expansion
  const toggleProviderExpansion = (provider: string) => {
    setExpandedProviders((prev) => ({
      ...prev,
      [provider]: !prev[provider],
    }))
  }

  // Detect user location
  const detectLocation = () => {
    setIsDetectingLocation(true)

    // Simulate geolocation API
    setTimeout(() => {
      setSelectedRegion("UK") // Simulated result
      setIsDetectingLocation(false)
    }, 1500)
  }

  // Toggle provider selection for comparison
  const toggleProviderSelection = (providerId: string) => {
    setSelectedProviders((prev) => {
      if (prev.includes(providerId)) {
        return prev.filter((id) => id !== providerId)
      } else {
        return [...prev, providerId]
      }
    })
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setQualityFilter({
      SD: false,
      HD: false,
      "4K": false,
      "8K": false,
    })
    setPriceSort(null)
    setShowSubscribedOnly(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <motion.section
      ref={sectionRef}
      className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Section Title */}
      <motion.div className="flex flex-col md:flex-row md:items-center justify-between mb-6" variants={itemVariants}>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-inter text-[#E0E0E0] mb-2">Where to Watch</h2>
          <p className="text-[#A0A0A0] font-dmsans">Find where to stream, rent, or buy {movieTitle} in your region</p>
        </div>

        {/* Region Selector */}
        <div className="flex items-center mt-4 md:mt-0 gap-2">
          <Popover open={showRegionSelector} onOpenChange={setShowRegionSelector}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0]">
                <Globe className="mr-2 h-4 w-4 text-[#A0A0A0]" />
                {selectedRegion}
                <ChevronDown className="ml-2 h-4 w-4 text-[#A0A0A0]" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-[#282828] border-[#3A3A3A]">
              <div className="space-y-4">
                <h4 className="font-medium text-[#E0E0E0]">Select Region</h4>

                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A0A0A0]" />
                  <Input placeholder="Search regions..." className="pl-8 bg-[#1A1A1A] border-[#3A3A3A]" />
                </div>

                <div className="max-h-60 overflow-y-auto pr-2 space-y-1">
                  {availableRegions.map((region) => (
                    <motion.button
                      key={region}
                      className={cn(
                        "w-full text-left px-2 py-1.5 rounded-md flex items-center",
                        region === selectedRegion
                          ? "bg-[#00BFFF]/10 text-[#00BFFF]"
                          : "text-[#E0E0E0] hover:bg-[#3A3A3A]",
                      )}
                      onClick={() => {
                        setSelectedRegion(region)
                        setShowRegionSelector(false)
                      }}
                      whileHover={{ x: 2 }}
                    >
                      {region === selectedRegion && <Check className="mr-2 h-4 w-4" />}
                      {region}
                    </motion.button>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#3A3A3A]">
                  <Button
                    variant="outline"
                    className="w-full border-[#3A3A3A] text-[#E0E0E0]"
                    onClick={detectLocation}
                    disabled={isDetectingLocation}
                  >
                    {isDetectingLocation ? (
                      <>
                        <div className="h-4 w-4 border-2 border-[#E0E0E0] border-t-transparent rounded-full animate-spin mr-2" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        Detect My Location
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0]">
                <Info className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-2">Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#282828] border-[#3A3A3A]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-[#E0E0E0]">Streaming Filters</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#A0A0A0] hover:text-[#E0E0E0] h-8 px-2"
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm text-[#A0A0A0]">Quality</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {(["SD", "HD", "4K", "8K"] as const).map((quality) => (
                      <div key={quality} className="flex items-center space-x-2">
                        <Checkbox
                          id={`quality-${quality}`}
                          checked={qualityFilter[quality]}
                          onCheckedChange={(checked) => setQualityFilter((prev) => ({ ...prev, [quality]: !!checked }))}
                        />
                        <label
                          htmlFor={`quality-${quality}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#E0E0E0]"
                        >
                          {quality}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#3A3A3A]">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="subscribed-only"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#E0E0E0]"
                    >
                      Show my subscriptions only
                    </label>
                    <Switch id="subscribed-only" checked={showSubscribedOnly} onCheckedChange={setShowSubscribedOnly} />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#3A3A3A]">
                  <Button
                    className="w-full bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD]"
                    onClick={() => setShowFilters(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </motion.div>

      {/* Search and Compare */}
      <motion.div className="mb-6 flex flex-col sm:flex-row gap-4" variants={itemVariants}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A0A0A0]" />
          <Input
            placeholder="Search streaming services..."
            className="pl-10 bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#A0A0A0] hover:text-[#E0E0E0]"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          className={cn(
            "border-[#3A3A3A] text-[#E0E0E0]",
            selectedProviders.length > 0 && "border-[#00BFFF] text-[#00BFFF]",
          )}
          onClick={() => setShowPriceComparison(true)}
          disabled={selectedProviders.length < 2}
        >
          <span className="mr-2">Compare Prices</span>
          {selectedProviders.length > 0 && (
            <Badge className="bg-[#00BFFF] text-[#1A1A1A]">{selectedProviders.length}</Badge>
          )}
        </Button>
      </motion.div>

      {/* No Streaming Options Message */}
      {filteredOptions.length === 0 && (
        <motion.div
          className="bg-[#282828] rounded-lg p-6 text-center"
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4">
            <Info className="h-12 w-12 mx-auto text-[#A0A0A0]" />
          </div>
          <h3 className="text-xl font-semibold text-[#E0E0E0] mb-2">No Streaming Options Available</h3>
          <p className="text-[#A0A0A0] max-w-md mx-auto">
            {searchQuery
              ? `No results found for "${searchQuery}". Try a different search term or adjust your filters.`
              : `We couldn't find any streaming options for ${movieTitle} in ${selectedRegion} with your current filters.`}
          </p>
          {(searchQuery || Object.values(qualityFilter).some(Boolean) || priceSort || showSubscribedOnly) && (
            <Button variant="outline" className="mt-4 border-[#3A3A3A] text-[#E0E0E0]" onClick={resetFilters}>
              Reset Filters
            </Button>
          )}
        </motion.div>
      )}

      {/* Streaming Options */}
      {filteredOptions.length > 0 && (
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="bg-[#282828] mb-6">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#3A3A3A]">
                All
              </TabsTrigger>
              <TabsTrigger value="subscription" className="data-[state=active]:bg-[#3A3A3A]">
                Subscription
              </TabsTrigger>
              <TabsTrigger value="rent" className="data-[state=active]:bg-[#3A3A3A]">
                Rent
              </TabsTrigger>
              <TabsTrigger value="buy" className="data-[state=active]:bg-[#3A3A3A]">
                Buy
              </TabsTrigger>
              <TabsTrigger value="free" className="data-[state=active]:bg-[#3A3A3A]">
                Free
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {/* Subscription Section */}
              {Object.keys(groupedSubscriptionOptions).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-[#E0E0E0] mb-4 flex items-center">
                    <span>Subscription</span>
                    <Badge className="ml-2 bg-[#282828] text-[#A0A0A0]">
                      {Object.keys(groupedSubscriptionOptions).length}
                    </Badge>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Object.entries(groupedSubscriptionOptions).map(([provider, options]) => (
                      <StreamingServiceCard
                        key={provider}
                        provider={provider}
                        logoUrl={options[0].logoUrl}
                        url={options[0].url}
                        type="subscription"
                        quality={options[0].quality}
                        verified={options[0].verified}
                        rating={options[0].rating}
                        userHasSubscription={options[0].userHasSubscription}
                        isSelected={selectedProviders.includes(options[0].id)}
                        onToggleSelect={() => toggleProviderSelection(options[0].id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Rent/Buy Section */}
              {Object.keys(groupedPurchaseOptions).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-[#E0E0E0] mb-4 flex items-center">
                    <span>Rent or Buy</span>
                    <Badge className="ml-2 bg-[#282828] text-[#A0A0A0]">
                      {Object.keys(groupedPurchaseOptions).length}
                    </Badge>
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(groupedPurchaseOptions).map(([provider, options]) => (
                      <PurchaseOptionCard
                        key={provider}
                        provider={provider}
                        logoUrl={options[0].logoUrl}
                        options={options}
                        verified={options[0].verified}
                        isExpanded={!!expandedProviders[provider]}
                        onToggleExpand={() => toggleProviderExpansion(provider)}
                        onToggleSelect={(optionId) => toggleProviderSelection(optionId)}
                        selectedOptions={selectedProviders}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Free Section */}
              {filteredOptions.filter((option) => option.type === "free").length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-[#E0E0E0] mb-4 flex items-center">
                    <span>Free</span>
                    <Badge className="ml-2 bg-[#282828] text-[#A0A0A0]">
                      {filteredOptions.filter((option) => option.type === "free").length}
                    </Badge>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredOptions
                      .filter((option) => option.type === "free")
                      .map((option) => (
                        <StreamingServiceCard
                          key={option.id}
                          provider={option.provider}
                          logoUrl={option.logoUrl}
                          url={option.url}
                          type="free"
                          quality={option.quality}
                          verified={option.verified}
                          rating={option.rating}
                          isSelected={selectedProviders.includes(option.id)}
                          onToggleSelect={() => toggleProviderSelection(option.id)}
                        />
                      ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="subscription" className="mt-0">
              {Object.keys(groupedSubscriptionOptions).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Object.entries(groupedSubscriptionOptions).map(([provider, options]) => (
                    <StreamingServiceCard
                      key={provider}
                      provider={provider}
                      logoUrl={options[0].logoUrl}
                      url={options[0].url}
                      type="subscription"
                      quality={options[0].quality}
                      verified={options[0].verified}
                      rating={options[0].rating}
                      userHasSubscription={options[0].userHasSubscription}
                      isSelected={selectedProviders.includes(options[0].id)}
                      onToggleSelect={() => toggleProviderSelection(options[0].id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-[#282828] rounded-lg p-6 text-center">
                  <p className="text-[#A0A0A0]">
                    No subscription options available for {movieTitle} in {selectedRegion}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rent" className="mt-0">
              {filteredOptions.filter((option) => option.type === "rent").length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(groupedPurchaseOptions)
                    .filter(([_, options]) => options.some((opt) => opt.type === "rent"))
                    .map(([provider, options]) => (
                      <PurchaseOptionCard
                        key={provider}
                        provider={provider}
                        logoUrl={options[0].logoUrl}
                        options={options.filter((opt) => opt.type === "rent")}
                        verified={options[0].verified}
                        isExpanded={!!expandedProviders[provider]}
                        onToggleExpand={() => toggleProviderExpansion(provider)}
                        onToggleSelect={(optionId) => toggleProviderSelection(optionId)}
                        selectedOptions={selectedProviders}
                      />
                    ))}
                </div>
              ) : (
                <div className="bg-[#282828] rounded-lg p-6 text-center">
                  <p className="text-[#A0A0A0]">
                    No rental options available for {movieTitle} in {selectedRegion}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="buy" className="mt-0">
              {filteredOptions.filter((option) => option.type === "buy").length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(groupedPurchaseOptions)
                    .filter(([_, options]) => options.some((opt) => opt.type === "buy"))
                    .map(([provider, options]) => (
                      <PurchaseOptionCard
                        key={provider}
                        provider={provider}
                        logoUrl={options[0].logoUrl}
                        options={options.filter((opt) => opt.type === "buy")}
                        verified={options[0].verified}
                        isExpanded={!!expandedProviders[provider]}
                        onToggleExpand={() => toggleProviderExpansion(provider)}
                        onToggleSelect={(optionId) => toggleProviderSelection(optionId)}
                        selectedOptions={selectedProviders}
                      />
                    ))}
                </div>
              ) : (
                <div className="bg-[#282828] rounded-lg p-6 text-center">
                  <p className="text-[#A0A0A0]">
                    No purchase options available for {movieTitle} in {selectedRegion}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="free" className="mt-0">
              {filteredOptions.filter((option) => option.type === "free").length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredOptions
                    .filter((option) => option.type === "free")
                    .map((option) => (
                      <StreamingServiceCard
                        key={option.id}
                        provider={option.provider}
                        logoUrl={option.logoUrl}
                        url={option.url}
                        type="free"
                        quality={option.quality}
                        verified={option.verified}
                        rating={option.rating}
                        isSelected={selectedProviders.includes(option.id)}
                        onToggleSelect={() => toggleProviderSelection(option.id)}
                      />
                    ))}
                </div>
              ) : (
                <div className="bg-[#282828] rounded-lg p-6 text-center">
                  <p className="text-[#A0A0A0]">
                    No free options available for {movieTitle} in {selectedRegion}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      )}

      {/* Price Comparison Modal */}
      <AnimatePresence>
        {showPriceComparison && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPriceComparison(false)}
          >
            <motion.div
              className="bg-[#1A1A1A] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-[#282828]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#E0E0E0]">Price Comparison</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#A0A0A0] hover:text-[#E0E0E0]"
                    onClick={() => setShowPriceComparison(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  {selectedProviders.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedProviders.map((providerId) => {
                          const option = currentRegionOptions.find((opt) => opt.id === providerId)
                          if (!option) return null

                          return (
                            <motion.div
                              key={option.id}
                              className="bg-[#282828] rounded-lg p-4 flex items-center justify-between"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="flex items-center">
                                <div className="relative w-12 h-12 mr-3">
                                  <Image
                                    src={
                                      option.logoUrl ||
                                      "/placeholder.svg?height=48&width=48&query=streaming service logo"
                                    }
                                    alt={option.provider}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-medium text-[#E0E0E0]">{option.provider}</h4>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Badge variant="outline" className="text-xs font-normal">
                                      {option.quality}
                                    </Badge>
                                    <Badge
                                      variant={option.type === "rent" ? "secondary" : "default"}
                                      className="capitalize text-xs"
                                    >
                                      {option.type}
                                    </Badge>
                                    {option.price && <span className="text-[#E0E0E0] font-medium">{option.price}</span>}
                                  </div>
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-[#A0A0A0] hover:text-[#E0E0E0]"
                                onClick={() => toggleProviderSelection(option.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          )
                        })}
                      </div>

                      <div className="pt-4 border-t border-[#282828]">
                        <h4 className="font-medium text-[#E0E0E0] mb-3">Comparison Summary</h4>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[#A0A0A0]">Best Price (Rent)</span>
                            <span className="text-[#E0E0E0] font-medium">$3.99 on Amazon Prime Video</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-[#A0A0A0]">Best Price (Buy)</span>
                            <span className="text-[#E0E0E0] font-medium">$9.99 on Apple TV+</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-[#A0A0A0]">Best Quality</span>
                            <span className="text-[#E0E0E0] font-medium">4K on Netflix</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-[#A0A0A0]">User Rating</span>
                            <div className="flex items-center">
                              <span className="text-[#E0E0E0] font-medium mr-1">4.5</span>
                              <div className="flex">
                                {[1, 2, 3, 4].map((i) => (
                                  <Star key={i} className="w-3 h-3 text-[#FFD700] fill-[#FFD700]" />
                                ))}
                                <Star className="w-3 h-3 text-[#FFD700] fill-[#FFD700] opacity-50" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-[#A0A0A0]">Select at least 2 providers to compare prices</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
