"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StreamingServiceLogo } from "./streaming-service-logo" // Ensure this path is correct
import { ExternalLink, CheckCircle, XCircle, ShoppingCart, Tv } from "lucide-react"
import type { MovieCardProps } from "./homepage/movie-card" // Or a more generic type

type StreamingOption = MovieCardProps["streamingOptions"][string][0]

interface PriceComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  movieTitle: string
  streamingOptions: MovieCardProps["streamingOptions"] // Region -> Options[]
}

const formatPrice = (price?: string) => {
  if (!price) return "N/A"
  // Basic price formatting, can be enhanced for currency symbols etc.
  return price.startsWith("$") || price.startsWith("₹") || price.startsWith("€") ? price : `$${price}`
}

const getOfferTypeIcon = (type: StreamingOption["type"]) => {
  switch (type) {
    case "subscription":
      return <Tv className="w-4 h-4 text-sky-500" />
    case "rent":
    case "buy":
      return <ShoppingCart className="w-4 h-4 text-green-500" />
    case "free":
      return <CheckCircle className="w-4 h-4 text-emerald-500" />
    default:
      return null
  }
}

export function PriceComparisonModal({ isOpen, onClose, movieTitle, streamingOptions }: PriceComparisonModalProps) {
  if (!streamingOptions || Object.keys(streamingOptions).length === 0) {
    return null // Or a message indicating no options available
  }

  // For simplicity, let's assume a single region or merge options.
  // Here, we'll just pick the first region's options if multiple exist.
  // A more robust solution would allow region selection or show all.
  const regionKey = Object.keys(streamingOptions)[0]
  const optionsToShow = streamingOptions[regionKey] || []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-slate-900 border-slate-700 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-inter text-slate-50">
            Where to Watch: <span className="text-[#00BFFF]">{movieTitle}</span>
          </DialogTitle>
          <DialogDescription className="text-slate-400 font-dmsans">
            Streaming and purchase options available. Prices and availability may vary.
          </DialogDescription>
        </DialogHeader>

        {optionsToShow.length > 0 ? (
          <ScrollArea className="max-h-[60vh] pr-3">
            <div className="space-y-4 py-4">
              {optionsToShow.map((option) => (
                <div
                  key={option.id || `${option.provider}-${option.type}-${option.quality}`}
                  className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-[#00BFFF]/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <StreamingServiceLogo providerName={option.provider} logoUrl={option.logoUrl} size={32} />
                    <div>
                      <p className="font-semibold text-slate-100">{option.provider}</p>
                      <p className="text-xs text-slate-400 capitalize">
                        {option.type} {option.quality && `(${option.quality})`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getOfferTypeIcon(option.type)}
                    {option.price && (
                      <span className="text-sm font-medium text-slate-200">{formatPrice(option.price)}</span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-[#00BFFF] hover:text-[#00A3DD] hover:bg-slate-700/50"
                    >
                      <a href={option.url} target="_blank" rel="noopener noreferrer">
                        Go to Site <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </a>
                    </Button>
                    {option.verified ? (
                      <CheckCircle className="w-4 h-4 text-green-500" title="Verified Link" />
                    ) : (
                      <XCircle className="w-4 h-4 text-yellow-500" title="Link not recently verified" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center text-slate-400 font-dmsans">
            No streaming options currently available for your region.
          </div>
        )}

        <DialogFooter className="mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
