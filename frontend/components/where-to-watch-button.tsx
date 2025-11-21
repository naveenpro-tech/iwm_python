"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tv, Play, ShoppingCart, CheckCircle, ExternalLink } from "lucide-react"
import Image from "next/image"
import type { StreamingOption } from "./homepage/types" // Adjust path as needed
import Link from "next/link"

interface WhereToWatchButtonProps {
  streamingOptions?: { [region: string]: StreamingOption[] }
  movieId: string
  title: string
  variant?: "button" | "icon"
  className?: string
}

const providerLogos: { [key: string]: string } = {
  Netflix: "/netflix-inspired-logo.png",
  "Amazon Prime Video": "/amazon-prime-video-logo.png",
  "Disney+": "/disney-plus-logo.png",
  "HBO Max": "/hbo-max-logo.png", // or Max
  Max: "/hbo-max-logo.png",
  Hulu: "/hulu-logo.png",
  "Apple TV+": "/apple-tv-plus-logo.png",
  ParamountPlus: "/icons/paramount.png", // Ensure this path is correct
  Peacock: "/generic-bird-streaming-logo.png", // Placeholder
  YouTube: "/youtube-logo.png",
  "Google Play": "/google-play-logo.png",
  Vudu: "/vudu-logo.png",
  "Microsoft Store": "/microsoft-store-logo.png",
  JioCinema: "/jiocinema-logo.png",
  // Add more as needed
}

const getProviderIcon = (type: StreamingOption["type"]) => {
  switch (type) {
    case "subscription":
      return <Tv className="w-4 h-4 mr-2 text-sky-500" />
    case "rent":
      return <Play className="w-4 h-4 mr-2 text-green-500" />
    case "buy":
      return <ShoppingCart className="w-4 h-4 mr-2 text-purple-500" />
    case "free":
      return <CheckCircle className="w-4 h-4 mr-2 text-yellow-500" />
    default:
      return <Tv className="w-4 h-4 mr-2 text-gray-500" />
  }
}

export const WhereToWatchButton: React.FC<WhereToWatchButtonProps> = ({
  streamingOptions,
  movieId,
  title,
  variant = "button",
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentRegion, setCurrentRegion] = useState("US") // Default or detect user region

  const optionsForRegion = streamingOptions?.[currentRegion] || []

  if (!streamingOptions || Object.keys(streamingOptions).length === 0) {
    if (variant === "icon") return null // Don't render anything for icon variant if no options
    return (
      <Button variant="outline" disabled className={`text-xs ${className}`}>
        Not Available
      </Button>
    )
  }

  const triggerContent =
    variant === "icon" ? (
      <Tv className="w-5 h-5" />
    ) : (
      <>
        <Tv className="w-4 h-4 mr-1.5" />
        Where to Watch
      </>
    )

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant === "icon" ? "ghost" : "outline"}
          size={variant === "icon" ? "icon" : "sm"}
          className={`${variant === "icon" ? "bg-black/30 hover:bg-black/50 backdrop-blur-sm p-1.5 h-8 w-8 rounded-full text-white" : "text-xs border-slate-600 hover:border-sky-500 hover:bg-sky-900/30 hover:text-sky-300"} ${className}`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          aria-label={`Where to watch ${title}`}
        >
          {triggerContent}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 bg-slate-800 border-slate-700 text-white shadow-xl p-0"
        onClick={(e) => e.stopPropagation()} // Prevent closing if clicking inside popover
        side="bottom"
        align="end"
      >
        <div className="p-4 border-b border-slate-700">
          <h4 className="font-semibold text-base mb-0.5">Watch "{title}"</h4>
          <p className="text-xs text-slate-400">Available options in {currentRegion}</p>
          {/* Region selector can be added here if multiple regions in data */}
        </div>
        <div className="max-h-72 overflow-y-auto p-2 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50">
          {optionsForRegion.length > 0 ? (
            optionsForRegion.map((option) => (
              <a
                key={option.id || `${option.provider}-${option.type}`}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-2.5 rounded-md hover:bg-slate-700/70 transition-colors group"
              >
                <Image
                  src={providerLogos[option.provider] || "/placeholder.svg?width=32&height=32&query=Service"}
                  alt={option.provider}
                  width={28}
                  height={28}
                  className="rounded-sm mr-3 object-contain"
                />
                <div className="flex-grow">
                  <p className="text-sm font-medium text-slate-100 group-hover:text-sky-300 transition-colors">
                    {option.provider}
                  </p>
                  <div className="flex items-center text-xs text-slate-400">
                    {getProviderIcon(option.type)}
                    <span className="capitalize">{option.type}</span>
                    {option.price && (
                      <>
                        <span className="mx-1.5">•</span>
                        <span>{option.price}</span>
                      </>
                    )}
                    <span className="mx-1.5">•</span>
                    <span className="uppercase">{option.quality}</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors ml-2" />
              </a>
            ))
          ) : (
            <p className="p-4 text-sm text-slate-400 text-center">No streaming options found for your region.</p>
          )}
        </div>
        <div className="p-3 border-t border-slate-700 text-center">
          <Link href={`/movies/${movieId}/where-to-watch`} passHref>
            <Button variant="link" size="sm" className="text-xs text-sky-400 hover:text-sky-300">
              See all options & regions
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
