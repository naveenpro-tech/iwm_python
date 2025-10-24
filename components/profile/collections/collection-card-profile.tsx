"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, Globe, Edit, Trash2, MoreVertical } from "lucide-react"
import Link from "next/link"
import type { UserCollection } from "@/types/profile"

interface CollectionCardProfileProps {
  collection: UserCollection
  onEdit: () => void
  onDelete: () => void
}

export function CollectionCardProfile({
  collection,
  onEdit,
  onDelete,
}: CollectionCardProfileProps) {
  const [showMenu, setShowMenu] = useState(false)

  // Get first 4 movie posters for collage
  const posterImages = collection.movies.slice(0, 4).map(m => m.posterUrl)

  return (
    <motion.div
      className="group relative bg-[#282828] border border-[#3A3A3A] rounded-lg overflow-hidden hover:border-[#00BFFF] transition-all duration-200"
      whileHover={{ y: -5 }}
    >
      <Link href={`/collections/${collection.id}`} className="block">
        {/* 4-Poster Collage */}
        <div className="aspect-[4/3] bg-[#1A1A1A] relative overflow-hidden">
          {posterImages.length === 1 ? (
            // Single poster
            <img
              src={posterImages[0]}
              alt={collection.title}
              className="w-full h-full object-cover"
            />
          ) : posterImages.length >= 2 ? (
            // 2x2 grid collage
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-0.5">
              {posterImages.map((poster, index) => (
                <div key={index} className="relative overflow-hidden bg-[#1A1A1A]">
                  <img
                    src={poster}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {/* Fill empty slots if less than 4 */}
              {Array.from({ length: 4 - posterImages.length }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="bg-[#1A1A1A] flex items-center justify-center"
                >
                  <span className="text-[#3A3A3A] text-4xl">🎬</span>
                </div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[#3A3A3A] text-6xl">📚</span>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <span className="text-white font-dm-sans text-sm">View Collection</span>
          </div>
        </div>

        {/* Collection Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-inter font-semibold text-[#E0E0E0] text-lg line-clamp-1 group-hover:text-[#00BFFF] transition-colors">
              {collection.title}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              {collection.isPublic ? (
                <Globe className="w-4 h-4 text-[#00BFFF]" />
              ) : (
                <Lock className="w-4 h-4 text-[#A0A0A0]" />
              )}
            </div>
          </div>

          <p className="text-[#A0A0A0] font-dm-sans text-sm line-clamp-2 mb-3">
            {collection.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-[#A0A0A0] font-dm-sans text-sm">
              {collection.movieCount} {collection.movieCount === 1 ? "movie" : "movies"}
            </span>
            <span className="text-[#A0A0A0] font-dm-sans text-xs">
              {collection.isPublic ? "Public" : "Private"}
            </span>
          </div>
        </div>
      </Link>

      {/* Action Menu */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowMenu(!showMenu)
          }}
          className="p-2 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00BFFF]"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <>
            {/* Backdrop to close menu */}
            <div
              className="fixed inset-0 z-20"
              onClick={() => setShowMenu(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-40 bg-[#282828] border border-[#3A3A3A] rounded-lg shadow-xl overflow-hidden z-30"
            >
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowMenu(false)
                  onEdit()
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-[#E0E0E0] hover:bg-[#00BFFF] hover:text-white transition-colors font-dm-sans text-sm"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowMenu(false)
                  onDelete()
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-colors font-dm-sans text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  )
}

