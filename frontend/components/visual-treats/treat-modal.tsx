"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Heart,
  Share2,
  Download,
  Eye,
  Film,
  Palette,
  Tag,
  ChevronLeft,
  ChevronRight,
  Check,
  PlusCircle,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { VisualTreat } from "./types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

interface TreatModalProps {
  treat: VisualTreat | null
  isOpen: boolean
  onClose: () => void
  onLikeToggle: (id: string) => void
  onBookmarkToggle: (id: string) => void
  onNavigate?: (direction: "prev" | "next") => VisualTreat | null // Optional: for prev/next treat
  relatedTreats?: VisualTreat[] // Optional: for related treats display
}

export function TreatModal({
  treat,
  isOpen,
  onClose,
  onLikeToggle,
  onBookmarkToggle,
  onNavigate,
  relatedTreats = [],
}: TreatModalProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (treat) {
      setIsImageLoaded(false) // Reset on new treat
    }
  }, [treat])

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (treat) onLikeToggle(treat.id)
  }
  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (treat) onBookmarkToggle(treat.id)
  }

  const handleShare = () => {
    if (!treat) return
    if (navigator.share) {
      navigator
        .share({
          title: treat.title,
          text: treat.description,
          url: window.location.href, // This should ideally be the specific treat's URL
        })
        .catch((err) => console.error("Share failed:", err))
    } else {
      navigator.clipboard.writeText(window.location.href) // Fallback
      toast({ title: "Link Copied!", description: "Treat URL copied to clipboard." })
    }
  }

  const handleDownload = () => {
    if (!treat) return
    // Mock download
    toast({ title: "Download Started (Mock)", description: `Downloading ${treat.title}.` })
    console.log("Download treat:", treat.id)
  }

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color)
    setCopiedColor(color)
    toast({ title: "Color Copied!", description: `${color} copied to clipboard.` })
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const handlePrev = () => onNavigate && onNavigate("prev")
  const handleNext = () => onNavigate && onNavigate("next")

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return
      if (event.key === "Escape") onClose()
      if (onNavigate) {
        if (event.key === "ArrowLeft") handlePrev()
        if (event.key === "ArrowRight") handleNext()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, onNavigate])

  if (!treat) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {onNavigate && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-[101] h-12 w-12 bg-black/30 text-white hover:bg-black/50 rounded-full"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-[101] h-12 w-12 bg-black/30 text-white hover:bg-black/50 rounded-full"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative w-full h-full sm:max-w-6xl sm:max-h-[95vh] sm:rounded-lg overflow-hidden bg-[#1A1A1A] border border-gray-700 flex flex-col md:flex-row"
          >
            {/* Image Section */}
            <div className="relative flex-1 md:max-w-[calc(100%-24rem)] min-h-[300px] md:min-h-0 bg-black">
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-gray-600 border-t-[#00BFFF] rounded-full animate-spin"></div>
                </div>
              )}
              <Image
                src={treat.imageUrl || "/placeholder.svg?width=1200&height=800&query=cinematic+detail"}
                alt={treat.title}
                fill
                className={`object-contain transition-opacity duration-500 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setIsImageLoaded(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 h-10 w-10 p-0 bg-black/50 text-white hover:bg-black/70 rounded-full z-10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content Section */}
            <ScrollArea className="w-full md:w-96 bg-[#1F1F1F] border-l border-gray-700">
              <div className="p-6 space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="bg-[#3A3A3A] text-gray-200 border-gray-600 text-xs">
                      {treat.category}
                    </Badge>
                    <span className="text-xs text-gray-400">{treat.year}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{treat.title}</h2>
                  <p className="text-sm text-gray-300">{treat.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLike}
                      className={`p-1 h-auto ${treat.userLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                    >
                      <Heart className={`h-5 w-5 mr-1 ${treat.userLiked ? "fill-current" : ""}`} />
                      <span className="text-sm">{treat.likes.toLocaleString()}</span>
                    </Button>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Eye className="h-5 w-5 mr-1" />
                      <span>{treat.views.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-[#00BFFF]"
                      onClick={handleBookmark}
                    >
                      <PlusCircle
                        className={`h-5 w-5 ${treat.userBookmarked ? "text-[#00BFFF] fill-[#00BFFF]" : ""}`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleShare}
                      className="h-8 w-8 text-gray-400 hover:text-white"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDownload}
                      className="h-8 w-8 text-gray-400 hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Separator className="bg-gray-700" />

                <Card className="bg-[#282828] border-gray-700 shadow-md">
                  <CardHeader className="p-4">
                    <CardTitle className="text-md text-white flex items-center gap-2">
                      <Film className="h-5 w-5 text-[#00BFFF]" /> Film Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Film:</span>{" "}
                      <span className="text-gray-100 text-right">{treat.film}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Director:</span>{" "}
                      <span className="text-gray-100 text-right">{treat.director}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cinematographer:</span>{" "}
                      <span className="text-gray-100 text-right">{treat.cinematographer}</span>
                    </div>
                  </CardContent>
                </Card>

                {treat.colorPalette && treat.colorPalette.length > 0 && (
                  <Card className="bg-[#282828] border-gray-700 shadow-md">
                    <CardHeader className="p-4">
                      <CardTitle className="text-md text-white flex items-center gap-2">
                        <Palette className="h-5 w-5 text-[#00BFFF]" /> Color Palette
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="grid grid-cols-5 gap-2">
                        {treat.colorPalette.map((color, index) => (
                          <div key={index} className="space-y-1 group relative">
                            <div
                              className="w-full h-12 rounded border border-gray-600 cursor-pointer transition-transform group-hover:scale-105"
                              style={{ backgroundColor: color }}
                              onClick={() => handleCopyColor(color)}
                            />
                            <div className="text-xs text-gray-400 text-center font-mono truncate" title={color}>
                              {color}
                            </div>
                            {copiedColor === color && (
                              <Check className="absolute top-1 right-1 h-4 w-4 text-white bg-green-500 rounded-full p-0.5" />
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {treat.tags && treat.tags.length > 0 && (
                  <Card className="bg-[#282828] border-gray-700 shadow-md">
                    <CardHeader className="p-4">
                      <CardTitle className="text-md text-white flex items-center gap-2">
                        <Tag className="h-5 w-5 text-[#00BFFF]" /> Tags
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex flex-wrap gap-2">
                        {treat.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-[#3A3A3A] text-gray-200 border-gray-600 hover:bg-[#4F4F4F] text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Related Treats Section (Mock) */}
                {relatedTreats && relatedTreats.length > 0 && (
                  <Card className="bg-[#282828] border-gray-700 shadow-md">
                    <CardHeader className="p-4">
                      <CardTitle className="text-md text-white">Related Treats</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      {relatedTreats.slice(0, 3).map((rt) => (
                        <div
                          key={rt.id}
                          className="flex items-center gap-2 p-2 rounded hover:bg-[#3A3A3A] cursor-pointer"
                          onClick={() => console.log("Navigate to related treat", rt.id) /* Placeholder */}
                        >
                          <Image
                            src={rt.imageUrl || "/placeholder.svg"}
                            alt={rt.title}
                            width={40}
                            height={60}
                            className="rounded object-cover aspect-[2/3]"
                          />
                          <div>
                            <p className="text-sm text-white font-medium line-clamp-1">{rt.title}</p>
                            <p className="text-xs text-gray-400 line-clamp-1">{rt.film}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-3 pt-2">
                  <Button className="flex-1 bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white">View Film Details</Button>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
