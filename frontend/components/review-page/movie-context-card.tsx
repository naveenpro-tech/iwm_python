"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MovieContextCardProps {
  movie: {
    id: string
    title: string
    releaseYear: number
    posterUrl: string
    sidduScore: number
  }
}

export function MovieContextCard({ movie }: MovieContextCardProps) {
  return (
    <motion.div
      className="bg-[#151515] rounded-lg border border-[#3A3A3A] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="p-6">
        <h3 className="text-xl font-bold font-inter text-[#E0E0E0] mb-4">
          About This Movie
        </h3>

        <div className="flex gap-6">
          {/* Poster */}
          <Link href={`/movies/${movie.id}`} className="flex-shrink-0">
            <div className="relative w-32 h-48 rounded-lg overflow-hidden hover:ring-2 hover:ring-[#00BFFF] transition-all">
              <Image
                src={movie.posterUrl || "/placeholder-poster.jpg"}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </Link>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <Link
                href={`/movies/${movie.id}`}
                className="text-2xl font-bold font-inter text-[#E0E0E0] hover:text-[#00BFFF] transition-colors mb-2 block"
              >
                {movie.title}
              </Link>
              <p className="text-[#A0A0A0] font-dmsans mb-4">
                {movie.releaseYear}
              </p>

              {/* SidduScore */}
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#00BFFF] text-[#1A1A1A] rounded-full w-12 h-12 flex items-center justify-center font-bold font-inter">
                  {movie.sidduScore.toFixed(1)}
                </div>
                <div>
                  <p className="text-sm text-[#E0E0E0] font-dmsans">SidduScore</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(movie.sidduScore / 2)
                            ? "text-[#FFD700] fill-[#FFD700]"
                            : "text-[#3A3A3A]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link href={`/movies/${movie.id}`}>
              <Button className="w-full bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD] font-inter">
                View Movie Details
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

