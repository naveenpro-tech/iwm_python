"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, Globe, Ticket } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FestivalHeaderProps {
  festivalId: string
}

// Mock data - in production, fetch based on festivalId
const festivalData = {
  cannes: {
    name: "Cannes Film Festival",
    edition: "77th",
    dates: "May 14-25, 2024",
    location: "Cannes, France",
    website: "festival-cannes.com",
    image: "/cannes-header.png",
    logo: "/cannes-logo.png",
    status: "upcoming",
    description: "The most prestigious film festival in the world, showcasing the best in international cinema",
  },
}

export function FestivalHeader({ festivalId }: FestivalHeaderProps) {
  const festival = festivalData[festivalId as keyof typeof festivalData] || festivalData.cannes

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative h-[50vh] min-h-[400px] overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image src={festival.image || "/placeholder.svg"} alt={festival.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#1A1A1A]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-4">
            {festival.logo && (
              <Image
                src={festival.logo || "/placeholder.svg"}
                alt={`${festival.name} logo`}
                width={80}
                height={80}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-2"
              />
            )}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white">{festival.name}</h1>
              <p className="text-xl text-gray-200">{festival.edition} Edition</p>
            </div>
          </div>

          <p className="text-lg text-gray-300 max-w-3xl mb-6">{festival.description}</p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="h-5 w-5 text-[#00BFFF]" />
              <span>{festival.dates}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="h-5 w-5 text-[#00BFFF]" />
              <span>{festival.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Globe className="h-5 w-5 text-[#00BFFF]" />
              <span>{festival.website}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white">
              <Ticket className="mr-2 h-4 w-4" />
              Get Accreditation
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Official Website
            </Button>
            <Badge className="bg-green-500/20 text-green-500 border-green-500/20 px-4 py-2">{festival.status}</Badge>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
