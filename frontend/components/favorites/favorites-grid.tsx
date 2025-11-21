"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, CalendarDays, StarIcon, Loader2 } from "lucide-react" // Renamed Star to StarIcon
import { removeFromFavorites } from "@/lib/api/favorites"
import { useToast } from "@/hooks/use-toast"
import type { FavoriteItem } from "./types"

interface FavoritesGridProps {
  favorites: FavoriteItem[]
  onRemove?: (id: string) => void
}

export function FavoritesGrid({ favorites, onRemove }: FavoritesGridProps) {
  const [removingId, setRemovingId] = useState<string | null>(null)
  const { toast } = useToast()

  if (!favorites || favorites.length === 0) {
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
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6 p-3 md:p-4"
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
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          layout
        >
          <Card className="bg-gray-800 border-gray-700 text-gray-100 h-full flex flex-col overflow-hidden hover:shadow-xl hover:shadow-sky-500/20 transition-shadow duration-300 group">
            <Link href={`/${item.type}/${item.id}`} className="block">
              {" "}
              {/* Adjust link as needed */}
              <div className="relative aspect-[2/3] w-full">
                <Image
                  src={item.imageUrl || `/placeholder.svg?text=${item.title.replace(/\s/g, "+")}`}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Badge className="absolute top-2 right-2 bg-sky-600 text-white capitalize">{item.type}</Badge>
              </div>
            </Link>
            <CardHeader className="p-4">
              <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-sky-400 transition-colors">
                <Link href={`/${item.type}/${item.id}`}>{item.title}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
              {item.releaseYear && (
                <div className="flex items-center text-xs text-gray-400 mb-1">
                  <CalendarDays className="h-3 w-3 mr-1.5" />
                  {item.releaseYear}
                </div>
              )}
              {item.userRating && (
                <div className="flex items-center text-xs text-yellow-400">
                  <StarIcon className="h-3 w-3 mr-1.5 fill-current" />
                  {item.userRating}/10
                </div>
              )}
            </CardContent>
            <CardFooter className="p-4 border-t border-gray-700/50">
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:bg-red-500/10 hover:text-red-400 w-full justify-start"
                onClick={() => handleRemove(item.id)}
                disabled={removingId === item.id}
              >
                {removingId === item.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-2 fill-current" />
                    Remove
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
