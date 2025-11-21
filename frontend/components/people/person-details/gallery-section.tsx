"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface GallerySectionProps {
  personId: string | number
}

export function GallerySection({ personId }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState("all")

  // Mock gallery data
  const gallery = [
    {
      id: 1,
      type: "portrait",
      image: "/christopher-nolan.png",
      caption: "Christopher Nolan at the Oppenheimer premiere, 2023",
      credit: "Siddu Media",
    },
    {
      id: 2,
      type: "behind-the-scenes",
      image: "/christopher-nolan-filmmaking.png",
      caption: "Christopher Nolan directing on the set of Oppenheimer, 2022",
      credit: "Universal Pictures",
    },
    {
      id: 3,
      type: "event",
      image: "/christopher-nolan-interview.png",
      caption: "Christopher Nolan during a press interview, 2023",
      credit: "Siddu Media",
    },
    {
      id: 4,
      type: "film-still",
      image: "/dunkirk-poster.png",
      caption: "Film still from Dunkirk, 2017",
      credit: "Warner Bros.",
    },
    {
      id: 5,
      type: "portrait",
      image: "/placeholder.svg?height=600&width=400&query=christopher%20nolan%20portrait",
      caption: "Christopher Nolan portrait session, 2020",
      credit: "Siddu Media",
    },
    {
      id: 6,
      type: "behind-the-scenes",
      image: "/placeholder.svg?height=600&width=400&query=christopher%20nolan%20directing",
      caption: "Christopher Nolan on the set of Tenet, 2019",
      credit: "Warner Bros.",
    },
    {
      id: 7,
      type: "event",
      image: "/placeholder.svg?height=600&width=400&query=christopher%20nolan%20award%20ceremony",
      caption: "Christopher Nolan at the Academy Awards, 2023",
      credit: "Academy of Motion Picture Arts and Sciences",
    },
    {
      id: 8,
      type: "film-still",
      image: "/placeholder.svg?height=600&width=400&query=inception%20film%20still",
      caption: "Film still from Inception, 2010",
      credit: "Warner Bros.",
    },
  ]

  // Filter gallery items
  const filteredGallery = activeFilter === "all" ? gallery : gallery.filter((item) => item.type === activeFilter)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div>
      {/* Gallery Filters */}
      <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full mb-6">
        <TabsList className="w-full justify-start overflow-x-auto bg-[#282828] p-0 h-auto">
          <TabsTrigger
            value="all"
            className="py-2 px-4 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="portrait"
            className="py-2 px-4 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
          >
            Portraits
          </TabsTrigger>
          <TabsTrigger
            value="behind-the-scenes"
            className="py-2 px-4 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
          >
            Behind the Scenes
          </TabsTrigger>
          <TabsTrigger
            value="film-still"
            className="py-2 px-4 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
          >
            Film Stills
          </TabsTrigger>
          <TabsTrigger
            value="event"
            className="py-2 px-4 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
          >
            Events
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Gallery Grid */}
      {filteredGallery.length > 0 ? (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredGallery.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="relative aspect-square bg-[#282828] rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(item.image)}
            >
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.caption}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No images in this category</h3>
          <p className="text-gray-400 mb-4">Try selecting a different category</p>
          <Button variant="outline" onClick={() => setActiveFilter("all")}>
            View All Images
          </Button>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </Button>

            <div className="relative h-[80vh]">
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt="Gallery image"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            <div className="mt-2 text-center">
              <p className="text-sm text-gray-300">{gallery.find((item) => item.image === selectedImage)?.caption}</p>
              <p className="text-xs text-gray-500">
                Credit: {gallery.find((item) => item.image === selectedImage)?.credit}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
