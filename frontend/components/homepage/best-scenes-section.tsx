"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Film, PlayCircle } from "lucide-react"
import type { BestScene } from "./types" // Assuming this type exists

interface BestScenesSectionProps {
  scenes: BestScene[]
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
}

export const BestScenesSection: React.FC<BestScenesSectionProps> = ({ scenes }) => {
  if (!scenes || scenes.length === 0) {
    return (
      <section className="py-8 md:py-12 bg-slate-950">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Iconic Scenes</h2>
          <p className="text-slate-400">No scenes to display at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-black via-red-900/20 to-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-red-500 flex items-center">
            <Film className="w-7 h-7 mr-2.5 text-red-500" />
            Unforgettable Moments: Best Scenes
          </h2>
          <Link href="/scene-explorer" passHref>
            <Button variant="link" className="text-red-400 hover:text-red-300 px-0 group">
              Explore All Scenes
              <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {scenes.slice(0, 3).map(
            (
              scene,
              index, // Displaying top 3 for brevity
            ) => (
              <motion.div
                key={scene.id}
                className="bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl overflow-hidden group border border-slate-700/50 hover:border-red-500/60 transition-all duration-300"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(239, 68, 68, 0.2)" }}
              >
                <Link href={`/scene-explorer/${scene.id}`} passHref legacyBehavior>
                  <a className="block">
                    <div className="relative aspect-video">
                      <Image
                        src={scene.thumbnailUrl || "/placeholder.svg?width=400&height=225&query=Movie+Scene"}
                        alt={`Scene from ${scene.movieTitle}`}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <PlayCircle className="w-16 h-16 text-white/80" />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-red-300 group-hover:text-red-200 transition-colors mb-1 line-clamp-1">
                        {scene.title}
                      </h3>
                      <p className="text-sm text-slate-300 mb-1 line-clamp-1">
                        From:{" "}
                        <span className="font-medium">
                          {scene.movieTitle} ({scene.movieYear})
                        </span>
                      </p>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{scene.description}</p>
                    </div>
                  </a>
                </Link>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
