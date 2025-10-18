"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, ChevronRight, Film, Heart, Lock, MoreVertical, PenSquare, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { Collection } from "./types"

interface CollectionListItemProps {
  collection: Collection
  onDelete?: () => void
}

export function CollectionListItem({ collection, onDelete }: CollectionListItemProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  const { id, title, description, posterUrls, moviesCount, likesCount, curator, lastUpdated, isPrivate } = collection

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <motion.div
      variants={itemVariants}
      className="bg-[#1E1E1E] rounded-lg overflow-hidden border border-[#333333]"
      whileHover={{ scale: 1.005, x: 2 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/collections/${id}`} className="flex h-full">
        <div className="w-16 sm:w-24 md:w-32 flex-shrink-0 relative">
          <Image
            src={posterUrls[0] || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 64px, (max-width: 768px) 96px, 128px"
          />
        </div>

        <div className="flex-1 p-3 md:p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-white">{title}</h3>

              <div className="flex items-center gap-2">
                {isPrivate && (
                  <Badge
                    variant="outline"
                    className="bg-transparent border-[#333333] text-[#A0A0A0] flex items-center gap-1"
                  >
                    <Lock className="w-3 h-3" />
                    Private
                  </Badge>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-full hover:bg-[#333333]" onClick={(e) => e.preventDefault()}>
                      <MoreVertical className="w-4 h-4 text-[#A0A0A0]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#1E1E1E] border-[#333333]">
                    <DropdownMenuItem className="cursor-pointer">
                      <PenSquare className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#333333]" />
                    <DropdownMenuItem
                      className="text-red-500 cursor-pointer focus:text-red-500"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onDelete?.()
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <p className="text-[#B0B0B0] text-sm line-clamp-1 mt-1">{description}</p>
          </div>

          <div className="flex items-center justify-between mt-2 text-xs text-[#A0A0A0]">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <div className="flex items-center">
                <Film className="w-3 h-3 mr-1" />
                {moviesCount} films
              </div>
              <div className="flex items-center">
                <Heart className="w-3 h-3 mr-1" />
                {likesCount} likes
              </div>
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                Updated {formatDate(lastUpdated)}
              </div>
            </div>

            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-[#6e4bbd]" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
