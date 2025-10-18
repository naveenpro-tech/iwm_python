"use client"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { FavoriteItem } from "./types"

interface FavoritesWallProps {
  favorites: FavoriteItem[]
}

export function FavoritesWall({ favorites }: FavoritesWallProps) {
  if (favorites.length === 0) {
    return null // Empty state handled by FavoritesEmptyState
  }

  // This is a simplified masonry-like wall. For true masonry, a library or more complex CSS might be needed.
  // Using CSS columns for a basic masonry effect.
  return (
    <motion.div
      className="p-4 columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.03 } },
      }}
    >
      {favorites.map((item) => (
        <motion.div
          key={item.id}
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
          }}
          layout
          className="mb-4 break-inside-avoid group"
        >
          <Link href={`/${item.type}/${item.id}`} className="block relative overflow-hidden rounded-lg shadow-lg">
            <Image
              src={item.imageUrl || `/placeholder.svg?text=${item.title.replace(/\s/g, "+")}`}
              alt={item.title}
              width={300} // Provide appropriate width/height or use aspect ratio
              height={item.type === "person" ? 450 : 200} // Example: Taller for people
              objectFit="cover"
              className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <h3 className="text-white text-sm font-semibold line-clamp-2">{item.title}</h3>
              <p className="text-xs text-gray-300 capitalize">{item.type.replace("-", " ")}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
