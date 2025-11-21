"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Globe, ExternalLink, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"

interface StreamingOption {
  id: string
  provider: string
  logoUrl: string
  type: "subscription" | "rent" | "buy" | "free"
  price?: string
  quality: "SD" | "HD" | "4K" | "8K"
  url: string
  verified: boolean
}

interface WhereToWatchSectionProps {
  movieId: string
  movieTitle: string
  streamingOptions: {
    [region: string]: StreamingOption[]
  }
  userRegion?: string
}

export function WhereToWatchSection({
  movieId,
  movieTitle,
  streamingOptions,
  userRegion = "US",
}: WhereToWatchSectionProps) {
  const [selectedRegion, setSelectedRegion] = useState(userRegion)
  const [activeTab, setActiveTab] = useState<"all" | "subscription" | "rent" | "buy" | "free">("all")

  const availableRegions = Object.keys(streamingOptions).sort()
  const currentRegionOptions = streamingOptions[selectedRegion] || []

  const filteredOptions =
    activeTab === "all" ? currentRegionOptions : currentRegionOptions.filter((option) => option.type === activeTab)

  // Group options by provider for subscription type
  const groupedSubscriptionOptions = currentRegionOptions
    .filter((option) => option.type === "subscription")
    .reduce<{ [provider: string]: StreamingOption[] }>((acc, option) => {
      if (!acc[option.provider]) {
        acc[option.provider] = []
      }
      acc[option.provider].push(option)
      return acc
    }, {})

  // Group options by provider for rent/buy types
  const groupedPurchaseOptions = currentRegionOptions
    .filter((option) => option.type === "rent" || option.type === "buy")
    .reduce<{ [provider: string]: StreamingOption[] }>((acc, option) => {
      if (!acc[option.provider]) {
        acc[option.provider] = []
      }
      acc[option.provider].push(option)
      return acc
    }, {})

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
      className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Section Title */}
      <motion.div className="flex flex-col md:flex-row md:items-center justify-between mb-6" variants={itemVariants}>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-inter text-[#E0E0E0] mb-2">Where to Watch</h2>
          <p className="text-[#A0A0A0] font-dmsans">Find where to stream, rent, or buy {movieTitle} in your region</p>
        </div>

        {/* Region Selector */}
        <div className="flex items-center mt-4 md:mt-0">
          <Globe className="mr-2 h-4 w-4 text-[#A0A0A0]" />
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[180px] bg-[#282828] border-[#3A3A3A]">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {availableRegions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* No Streaming Options Message */}
      {currentRegionOptions.length === 0 && (
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
            We couldn't find any streaming options for {movieTitle} in {selectedRegion}. Try selecting a different
            region or check back later.
          </p>
        </motion.div>
      )}

      {/* Streaming Options */}
      {currentRegionOptions.length > 0 && (
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
                  <h3 className="text-xl font-semibold text-[#E0E0E0] mb-4">Subscription</h3>
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
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Rent/Buy Section */}
              {Object.keys(groupedPurchaseOptions).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-[#E0E0E0] mb-4">Rent or Buy</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(groupedPurchaseOptions).map(([provider, options]) => (
                      <PurchaseOptionCard
                        key={provider}
                        provider={provider}
                        logoUrl={options[0].logoUrl}
                        options={options}
                        verified={options[0].verified}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Free Section */}
              {currentRegionOptions.filter((option) => option.type === "free").length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-[#E0E0E0] mb-4">Free</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {currentRegionOptions
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
              {currentRegionOptions.filter((option) => option.type === "rent").length > 0 ? (
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
              {currentRegionOptions.filter((option) => option.type === "buy").length > 0 ? (
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
              {currentRegionOptions.filter((option) => option.type === "free").length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {currentRegionOptions
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

      {/* Disclaimer */}
      <motion.div
        className="mt-8 text-xs text-[#A0A0A0] text-center max-w-2xl mx-auto"
        variants={itemVariants}
        custom={3}
      >
        <p>
          Streaming availability information is provided by our partners and is accurate as of{" "}
          {new Date().toLocaleDateString()}. Availability may change over time.
        </p>
      </motion.div>
    </motion.section>
  )
}

interface StreamingServiceCardProps {
  provider: string
  logoUrl: string
  url: string
  type: "subscription" | "rent" | "buy" | "free"
  quality: "SD" | "HD" | "4K" | "8K"
  verified: boolean
}

function StreamingServiceCard({ provider, logoUrl, url, type, quality, verified }: StreamingServiceCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="bg-[#282828] rounded-lg overflow-hidden"
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 h-full flex flex-col items-center text-center"
      >
        <div className="relative w-16 h-16 mb-3">
          <Image
            src={logoUrl || "/placeholder.svg?height=64&width=64&query=streaming service logo"}
            alt={provider}
            fill
            className="object-contain"
          />
        </div>
        <h4 className="font-medium text-[#E0E0E0] mb-1">{provider}</h4>
        <div className="flex items-center justify-center gap-2 mt-auto pt-2">
          <Badge variant="outline" className="text-xs font-normal">
            {quality}
          </Badge>
          {verified && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="outline"
                    className="text-xs font-normal bg-green-500/10 text-green-400 border-green-500/20"
                  >
                    Verified
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Link verified within the last 24 hours</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </a>
    </motion.div>
  )
}

interface PurchaseOptionCardProps {
  provider: string
  logoUrl: string
  options: StreamingOption[]
  verified: boolean
}

function PurchaseOptionCard({ provider, logoUrl, options, verified }: PurchaseOptionCardProps) {
  // Sort options by type (rent first, then buy) and then by price
  const sortedOptions = [...options].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "rent" ? -1 : 1
    }
    const priceA = a.price ? Number.parseFloat(a.price.replace(/[^0-9.]/g, "")) : 0
    const priceB = b.price ? Number.parseFloat(b.price.replace(/[^0-9.]/g, "")) : 0
    return priceA - priceB
  })

  return (
    <motion.div whileHover={{ scale: 1.01 }} className="bg-[#282828] rounded-lg overflow-hidden p-4">
      <div className="flex items-center gap-4 mb-3">
        <div className="relative w-12 h-12 flex-shrink-0">
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
            <Badge
              variant="outline"
              className="text-xs font-normal bg-green-500/10 text-green-400 border-green-500/20 mt-1"
            >
              Verified
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sortedOptions.map((option) => (
          <a
            key={`${option.id}-${option.type}-${option.quality}`}
            href={option.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-[#3A3A3A] rounded-md p-3 hover:bg-[#4A4A4A] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Badge variant={option.type === "rent" ? "secondary" : "default"} className="capitalize">
                {option.type}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {option.quality}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#E0E0E0]">{option.price}</span>
              <ExternalLink size={14} className="text-[#A0A0A0]" />
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  )
}
