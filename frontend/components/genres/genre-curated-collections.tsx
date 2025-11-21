"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { LayersIcon } from "lucide-react" // Changed to LayersIcon
import type { GenreCuratedCollection } from "@/lib/api"

interface GenreCuratedCollectionsProps {
  collections: GenreCuratedCollection[]
  genreName: string
}

export function GenreCuratedCollections({ collections, genreName }: GenreCuratedCollectionsProps) {
  if (!collections || collections.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="w-full"
    >
      <h3 className="text-base font-semibold text-gray-100 mb-2.5 flex items-center">
        <LayersIcon className="text-[#00BFFF] mr-1.5" size={18} />
        Curated Collections
      </h3>
      <div className="space-y-2.5">
        {collections.slice(0, 3).map((collection, index) => (
          <Link
            href={collection.url}
            key={collection.id}
            className="block group"
            aria-label={`View collection: ${collection.title}`}
          >
            <motion.div
              className="bg-gray-700/40 rounded-md overflow-hidden flex items-center gap-2.5 p-2 hover:bg-gray-600/60 transition-all shadow-sm hover:shadow-md"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.07 }}
              whileHover={{ scale: 1.02, y: -1 }}
            >
              <Image
                src={collection.imageUrl || "/placeholder.svg?height=50&width=90&query=collection art"}
                alt={collection.title}
                width={70} // Adjusted size
                height={39} // Adjusted size for 16:9
                className="rounded-sm object-cover aspect-video flex-shrink-0"
              />
              <p className="text-xs font-medium text-gray-300 group-hover:text-white line-clamp-2 leading-snug">
                {collection.title}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}
