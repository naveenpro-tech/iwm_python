"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { UsersIcon } from "lucide-react" // Changed to UsersIcon
import type { GenreNotableFigure } from "@/lib/api"

interface GenreNotableFiguresProps {
  figures: GenreNotableFigure[]
  genreName: string
}

export function GenreNotableFigures({ figures, genreName }: GenreNotableFiguresProps) {
  if (!figures || figures.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="w-full"
    >
      <h3 className="text-base font-semibold text-gray-100 mb-2.5 flex items-center">
        <UsersIcon className="text-[#00BFFF] mr-1.5" size={18} />
        Notable Figures
      </h3>
      <div className="space-y-2">
        {figures.slice(0, 4).map((figure, index) => (
          <Link
            href={figure.profileUrl}
            key={figure.id}
            className="block group"
            aria-label={`View profile of ${figure.name}`}
          >
            <motion.div
              className="bg-gray-700/40 rounded-md flex items-center gap-2 p-2 hover:bg-gray-600/60 transition-all shadow-sm hover:shadow-md"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.07 }}
              whileHover={{ scale: 1.02, y: -1 }}
            >
              <Image
                src={figure.imageUrl || "/placeholder.svg?height=40&width=40&query=person portrait"}
                alt={figure.name}
                width={32} // Adjusted size
                height={32}
                className="rounded-full object-cover flex-shrink-0"
              />
              <div>
                <p className="text-xs font-medium text-gray-200 group-hover:text-white line-clamp-1">{figure.name}</p>
                <p className="text-[10px] text-gray-400 group-hover:text-gray-300">{figure.role}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}
