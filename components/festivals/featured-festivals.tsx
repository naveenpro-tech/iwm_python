"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FeaturedFestivalsProps {
  viewMode?: "grid" | "list"
}

const festivals = [
  {
    id: "cannes",
    name: "Cannes Film Festival",
    location: "Cannes, France",
    dates: "May 14-25, 2024",
    image: "/cannes-festival.png",
    description: "The world's most prestigious film festival",
    categories: ["Competition", "Un Certain Regard", "Directors' Fortnight"],
    status: "upcoming",
  },
  {
    id: "venice",
    name: "Venice Film Festival",
    location: "Venice, Italy",
    dates: "Aug 28 - Sep 7, 2024",
    image: "/venice-festival.png",
    description: "The oldest film festival in the world",
    categories: ["Golden Lion", "Silver Lion", "Horizons"],
    status: "upcoming",
  },
  {
    id: "sundance",
    name: "Sundance Film Festival",
    location: "Park City, USA",
    dates: "Jan 23 - Feb 2, 2025",
    image: "/sundance-festival.png",
    description: "Premier showcase for independent cinema",
    categories: ["U.S. Dramatic", "World Cinema", "Documentary"],
    status: "upcoming",
  },
]

export function FeaturedFestivals({ viewMode = "grid" }: FeaturedFestivalsProps) {
  const router = useRouter()

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {festivals.map((festival, index) => (
          <motion.div
            key={festival.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="bg-[#282828] border-gray-800 overflow-hidden hover:bg-[#333] transition-colors cursor-pointer"
              onClick={() => router.push(`/festivals/${festival.id}`)}
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-64 h-48 md:h-auto">
                  <Image src={festival.image || "/placeholder.svg"} alt={festival.name} fill className="object-cover" />
                </div>
                <CardContent className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{festival.name}</h3>
                      <p className="text-gray-400">{festival.description}</p>
                    </div>
                    <Badge className="bg-[#00BFFF]/10 text-[#00BFFF] border-[#00BFFF]/20">{festival.status}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{festival.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{festival.dates}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {festival.categories.map((category) => (
                      <Badge key={category} variant="outline" className="bg-[#282828] border-gray-700">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {festivals.map((festival, index) => (
        <motion.div
          key={festival.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className="bg-[#282828] border-gray-800 overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer h-full"
            onClick={() => router.push(`/festivals/${festival.id}`)}
          >
            <div className="relative h-48">
              <Image src={festival.image || "/placeholder.svg"} alt={festival.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <Badge className="absolute top-4 right-4 bg-[#00BFFF]/90 text-white">{festival.status}</Badge>
            </div>

            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{festival.name}</h3>
              <p className="text-gray-400 mb-4">{festival.description}</p>

              <div className="space-y-2 mb-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{festival.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{festival.dates}</span>
                </div>
              </div>

              <Button
                className="w-full bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/festivals/${festival.id}`)
                }}
              >
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
