"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Heart, MoreVertical, Play, Share2, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Collection } from "./types"

interface CollectionCardProps {
  collection: Collection
  variant: "featured" | "popular" | "user"
  onDelete?: () => void
}

export function CollectionCard({ collection, variant, onDelete }: CollectionCardProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative bg-[#1E1E1E] rounded-lg overflow-hidden border border-[#333333] hover:border-[#6e4bbd] transition-all duration-300"
    >
      <Link href={`/collections/${collection.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* 4-poster collage */}
          <div className="grid grid-cols-2 h-full">
            {collection.posterImages.slice(0, 4).map((poster, index) => (
              <div key={index} className="relative overflow-hidden">
                <Image
                  src={poster || "/placeholder.svg"}
                  alt=""
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Play className="h-4 w-4 text-white" />
                  <span className="text-white text-sm">View Collection</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Collection type badge */}
          {variant === "featured" && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-[#6e4bbd] text-white">Featured</Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link href={`/collections/${collection.id}`}>
              <h3 className="font-semibold text-white line-clamp-1 hover:text-[#6e4bbd] transition-colors">
                {collection.title}
              </h3>
            </Link>
            <p className="text-sm text-[#A0A0A0] mt-1 line-clamp-2">{collection.description}</p>
          </div>

          {variant === "user" && onDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#A0A0A0] hover:text-white">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#2A2A2A] border-[#444444]">
                <DropdownMenuItem className="text-red-400 hover:text-red-300" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Collection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-4 text-xs text-[#A0A0A0]">
            <span>{collection.movieCount} movies</span>
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>{collection.followers}</span>
            </div>
          </div>
          <div className="text-xs text-[#A0A0A0]">By {collection.creator}</div>
        </div>
      </div>
    </motion.div>
  )
}
