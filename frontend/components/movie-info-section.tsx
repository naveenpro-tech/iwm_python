"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Person {
  id: string
  name: string
  role: string
  profileUrl?: string
}

interface CastMember extends Person {
  character: string
}

interface MovieInfoSectionProps {
  movie: {
    directors: Person[]
    writers: Person[]
    producers: Person[]
    genres: string[]
    cast: CastMember[]
  }
}

export function MovieInfoSection({ movie }: MovieInfoSectionProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  }

  return (
    <motion.section
      className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Section Title */}
      <motion.h2 className="text-2xl md:text-3xl font-bold font-inter text-[#E0E0E0] mb-6" variants={itemVariants}>
        About the Movie
      </motion.h2>

      {/* Details List */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6" variants={itemVariants}>
        {/* Directors */}
        <div className="flex flex-col space-y-1">
          <span className="text-[#A0A0A0] font-dmsans text-sm">
            {movie.directors.length > 1 ? "Directors" : "Director"}
          </span>
          <div className="text-[#E0E0E0] font-dmsans">
            {movie.directors.map((director, index) => (
              <span key={director.id}>
                <Link href={`/person/${director.id}`} className="hover:text-[#00BFFF] transition-colors">
                  {director.name}
                </Link>
                {index < movie.directors.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Writers */}
        <div className="flex flex-col space-y-1">
          <span className="text-[#A0A0A0] font-dmsans text-sm">{movie.writers.length > 1 ? "Writers" : "Writer"}</span>
          <div className="text-[#E0E0E0] font-dmsans">
            {movie.writers.map((writer, index) => (
              <span key={writer.id}>
                <Link href={`/person/${writer.id}`} className="hover:text-[#00BFFF] transition-colors">
                  {writer.name}
                </Link>
                {index < movie.writers.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Producers */}
        <div className="flex flex-col space-y-1">
          <span className="text-[#A0A0A0] font-dmsans text-sm">
            {movie.producers.length > 1 ? "Producers" : "Producer"}
          </span>
          <div className="text-[#E0E0E0] font-dmsans">
            {movie.producers.map((producer, index) => (
              <span key={producer.id}>
                <Link href={`/person/${producer.id}`} className="hover:text-[#00BFFF] transition-colors">
                  {producer.name}
                </Link>
                {index < movie.producers.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Genre Tags */}
      <motion.div className="flex flex-wrap gap-2 mb-8" variants={itemVariants} custom={1}>
        {movie.genres.map((genre) => (
          <motion.div key={genre} variants={tagVariants}>
            <Link href={`/movies/genre/${genre.toLowerCase()}`}>
              <Badge
                className="bg-transparent border border-[#00BFFF] text-[#E0E0E0] hover:bg-[#00BFFF]/10 transition-colors font-dmsans cursor-pointer"
                variant="outline"
              >
                {genre}
              </Badge>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Cast Section */}
      <motion.div variants={itemVariants} custom={2}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold font-inter text-[#E0E0E0]">Cast</h3>
        </div>

        {/* Cast Carousel */}
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {movie.cast.map((actor, index) => (
              <motion.div
                key={actor.id}
                className="flex-shrink-0 w-[140px] md:w-[160px] snap-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <motion.div
                  className="bg-[#282828] rounded-lg shadow-md overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.15 }}
                >
                  <Link href={`/person/${actor.id}`}>
                    <div className="flex flex-col items-center p-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-3 bg-[#3A3A3A]">
                        {actor.profileUrl ? (
                          <Image
                            src={actor.profileUrl || "/placeholder.svg"}
                            alt={actor.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#3A3A3A] text-[#A0A0A0]">
                            <span className="text-2xl">{actor.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <h4 className="font-inter font-medium text-[#E0E0E0] text-center line-clamp-1">{actor.name}</h4>
                      <p className="text-[#A0A0A0] text-sm font-dmsans text-center line-clamp-1 mt-1">
                        {actor.character}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Scroll Indicators */}
          <div className="absolute left-0 right-0 bottom-0 h-1 bg-[#282828] rounded-full overflow-hidden">
            <div className="h-full bg-[#00BFFF]/30 w-1/3 rounded-full"></div>
          </div>
        </div>

        {/* See All Button */}
        <div className="flex justify-center md:justify-end mt-6">
          <motion.div whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
            <Button
              variant="ghost"
              className="text-[#00BFFF] hover:text-[#00BFFF] hover:bg-[#00BFFF]/10 font-inter"
              asChild
            >
              <Link href="/movies/inception/cast-crew">
                See All Cast & Crew
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  )
}
