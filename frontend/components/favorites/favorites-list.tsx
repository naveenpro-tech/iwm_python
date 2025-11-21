"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, CalendarDays, StarIcon, Film, Tv, User, ImageIcon, FileText, Loader2 } from "lucide-react"
import { removeFromFavorites } from "@/lib/api/favorites"
import { useToast } from "@/hooks/use-toast"
import type { FavoriteItem } from "./types"

interface FavoritesListProps {
  favorites: FavoriteItem[]
  onRemove?: (id: string) => void
}

const TypeIcon = ({ type }: { type: FavoriteItem["type"] }) => {
  switch (type) {
    case "movie":
      return <Film className="h-5 w-5 text-sky-400" />
    case "tv-show":
      return <Tv className="h-5 w-5 text-green-400" />
    case "person":
      return <User className="h-5 w-5 text-purple-400" />
    case "scene":
      return <ImageIcon className="h-5 w-5 text-orange-400" />
    case "article":
      return <FileText className="h-5 w-5 text-yellow-400" />
    default:
      return null
  }
}

export function FavoritesList({ favorites, onRemove }: FavoritesListProps) {
  const [removingId, setRemovingId] = useState<string | null>(null)
  const { toast } = useToast()

  if (favorites.length === 0) {
    return null // Empty state handled by FavoritesEmptyState
  }

  const handleRemove = async (favoriteId: string) => {
    if (!confirm("Remove this item from your favorites?")) {
      return
    }

    setRemovingId(favoriteId)
    try {
      await removeFromFavorites(favoriteId)
      toast({
        title: "Success",
        description: "Removed from favorites",
      })
      if (onRemove) {
        onRemove(favoriteId)
      }
    } catch (error: any) {
      console.error("Error removing from favorites:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to remove from favorites",
        variant: "destructive",
      })
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <motion.div
      className="space-y-3 p-4"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.05 } },
      }}
    >
      {favorites.map((item) => (
        <motion.div
          key={item.id}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 },
          }}
          layout
          className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-700/50 transition-colors duration-200 group"
        >
          <Link href={`/${item.type}/${item.id}`} className="flex-shrink-0">
            <div className="relative w-16 h-24 rounded overflow-hidden">
              <Image
                src={item.imageUrl || `/placeholder.svg?text=${item.title.replace(/\s/g, "+")}`}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-1">
              <Link
                href={`/${item.type}/${item.id}`}
                className="text-lg font-semibold text-gray-100 hover:text-sky-400 transition-colors line-clamp-1"
              >
                {item.title}
              </Link>
              <Badge
                variant="outline"
                className="border-gray-600 text-gray-400 capitalize text-xs hidden sm:inline-flex items-center"
              >
                <TypeIcon type={item.type} /> <span className="ml-1.5">{item.type.replace("-", " ")}</span>
              </Badge>
            </div>
            <div className="text-xs text-gray-400 flex items-center space-x-3">
              {item.releaseYear && (
                <span className="flex items-center">
                  <CalendarDays className="h-3 w-3 mr-1" /> {item.releaseYear}
                </span>
              )}
              {item.userRating && (
                <span className="flex items-center text-yellow-400">
                  <StarIcon className="h-3 w-3 mr-1 fill-current" /> {item.userRating}/10
                </span>
              )}
              <span className="hidden md:inline">Added: {new Date(item.addedDate).toLocaleDateString()}</span>
            </div>
            {item.genres && item.genres.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {item.genres.slice(0, 3).map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:bg-red-500/10 hover:text-red-400 flex-shrink-0"
            onClick={() => handleRemove(item.id)}
            disabled={removingId === item.id}
          >
            {removingId === item.id ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Heart className="h-5 w-5 fill-current" />
            )}
            <span className="sr-only">Remove from favorites</span>
          </Button>
        </motion.div>
      ))}
    </motion.div>
  )
}
