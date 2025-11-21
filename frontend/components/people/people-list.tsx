"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Award, Film, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function PeopleList() {
  // Mock data - in a real app, this would come from an API
  const people = [
    {
      id: 1,
      name: "Christopher Nolan",
      photo: "/christopher-nolan.png",
      primaryRole: "Director",
      knownFor: ["Inception", "The Dark Knight", "Interstellar"],
      bio: "British-American film director, producer, and screenwriter known for his cerebral, nonlinear storytelling.",
      isVerified: true,
    },
    {
      id: 2,
      name: "Leonardo DiCaprio",
      photo: "/leonardo-dicaprio.png",
      primaryRole: "Actor",
      knownFor: ["Inception", "The Revenant", "Titanic"],
      bio: "American actor and film producer known for his work in biopics and period films as well as blockbusters.",
      isVerified: true,
    },
    {
      id: 3,
      name: "Cillian Murphy",
      photo: "/cillian-murphy-portrait.png",
      primaryRole: "Actor",
      knownFor: ["Oppenheimer", "Peaky Blinders", "Inception"],
      bio: "Irish actor known for his intense performances and striking blue eyes. Frequent collaborator with Christopher Nolan.",
      isVerified: true,
    },
    {
      id: 4,
      name: "Marion Cotillard",
      photo: "/marion-cotillard.png",
      primaryRole: "Actress",
      knownFor: ["Inception", "La Vie en Rose", "The Dark Knight Rises"],
      bio: "French actress, singer-songwriter, and environmentalist who achieved international fame with her portrayal of Édith Piaf.",
      isVerified: true,
    },
    {
      id: 5,
      name: "Tom Hardy",
      photo: "/tom-hardy.png",
      primaryRole: "Actor",
      knownFor: ["Inception", "Mad Max: Fury Road", "The Revenant"],
      bio: "English actor and producer known for his transformative roles and intense physical performances.",
      isVerified: true,
    },
    {
      id: 6,
      name: "Elliot Page",
      photo: "/elliot-page.png",
      primaryRole: "Actor",
      knownFor: ["Inception", "Juno", "The Umbrella Academy"],
      bio: "Canadian actor and producer who has received various accolades, including an Academy Award nomination.",
      isVerified: true,
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  }

  return (
    <motion.div className="space-y-4" variants={containerVariants}>
      {people.map((person) => (
        <motion.div
          key={person.id}
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-[#282828] rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors"
        >
          <Link href={`/people/${person.id}`} className="flex flex-col sm:flex-row">
            <div className="relative w-full sm:w-48 h-48 shrink-0">
              <Image
                src={person.photo || "/placeholder.svg"}
                alt={person.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 192px"
              />
              {person.isVerified && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-[#00BFFF] text-white">
                    <Award size={12} className="mr-1" />
                    Verified
                  </Badge>
                </div>
              )}
            </div>

            <div className="p-4 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{person.name}</h3>
                  <p className="text-sm text-gray-400">{person.primaryRole}</p>
                </div>

                <div className="flex items-center space-x-1 bg-[#1A1A1A] px-2 py-1 rounded">
                  <Star size={14} className="text-[#00BFFF]" />
                  <span className="text-sm font-medium">Popular</span>
                </div>
              </div>

              <p className="text-sm text-gray-300 mt-3 mb-4 line-clamp-2">{person.bio}</p>

              <div className="flex items-center text-xs text-gray-300">
                <Film size={14} className="mr-1 text-[#00BFFF]" />
                <span>Known for: {person.knownFor.join(", ")}</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
