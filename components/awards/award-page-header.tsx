"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, Award, User } from "lucide-react"
import Image from "next/image"

export interface AwardPageHeaderProps {
  name: string
  shortName: string
  year: number
  date: string
  location: string
  host: string
  broadcaster: string
  imageUrl: string
  description: string
}

export function AwardPageHeader({
  name,
  shortName,
  year,
  date,
  location,
  host,
  broadcaster,
  imageUrl,
  description,
}: AwardPageHeaderProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full rounded-xl overflow-hidden mb-8"
    >
      <div className="relative h-64 md:h-80">
        <Image src={imageUrl || "/placeholder.svg"} alt={`${name} ${year}`} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#12121280] to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="inline-block bg-[#FFD700] text-black font-bold px-3 py-1 rounded-full text-sm mb-3">
              {year}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{name}</h1>

            <div className="flex flex-wrap gap-4 text-gray-300 text-sm mb-4">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{formattedDate}</span>
              </div>

              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                <span>{location}</span>
              </div>

              <div className="flex items-center">
                <User size={16} className="mr-1" />
                <span>Host: {host}</span>
              </div>

              <div className="flex items-center">
                <Award size={16} className="mr-1" />
                <span>Broadcast by {broadcaster}</span>
              </div>
            </div>

            <p className="text-gray-300 max-w-3xl">{description}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
