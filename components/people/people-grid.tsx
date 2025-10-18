"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Award, Film } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function PeopleGrid() {
  // Mock data - in a real app, this would come from an API
  const people = [
    {
      id: 1,
      name: "Christopher Nolan",
      photo: "/christopher-nolan.png",
      primaryRole: "Director",
      knownFor: ["Inception", "The Dark Knight", "Interstellar"],
      isVerified: true,
    },
    {
      id: 2,
      name: "Leonardo DiCaprio",
      photo: "/leonardo-dicaprio.png",
      primaryRole: "Actor",
      knownFor: ["Inception", "The Revenant", "Titanic"],
      isVerified: true,
    },
    {
      id: 3,
      name: "Cillian Murphy",
      photo: "/cillian-murphy-portrait.png",
      primaryRole: "Actor",
      knownFor: ["Oppenheimer", "Peaky Blinders", "Inception"],
      isVerified: true,
    },
    {
      id: 4,
      name: "Marion Cotillard",
      photo: "/marion-cotillard.png",
      primaryRole: "Actress",
      knownFor: ["Inception", "La Vie en Rose", "The Dark Knight Rises"],
      isVerified: true,
    },
    {
      id: 5,
      name: "Tom Hardy",
      photo: "/tom-hardy.png",
      primaryRole: "Actor",
      knownFor: ["Inception", "Mad Max: Fury Road", "The Revenant"],
      isVerified: true,
    },
    {
      id: 6,
      name: "Elliot Page",
      photo: "/elliot-page.png",
      primaryRole: "Actor",
      knownFor: ["Inception", "Juno", "The Umbrella Academy"],
      isVerified: true,
    },
    {
      id: 7,
      name: "Joseph Gordon-Levitt",
      photo: "/joseph-gordon-levitt.png",
      primaryRole: "Actor",
      knownFor: ["Inception", "500 Days of Summer", "The Dark Knight Rises"],
      isVerified: true,
    },
    {
      id: 8,
      name: "Ken Watanabe",
      photo: "/ken-watanabe.png",
      primaryRole: "Actor",
      knownFor: ["Inception", "The Last Samurai", "Batman Begins"],
      isVerified: true,
    },
    {
      id: 9,
      name: "Quentin Tarantino",
      photo: "/film-director-portrait.png",
      primaryRole: "Director",
      knownFor: ["Pulp Fiction", "Django Unchained", "Kill Bill"],
      isVerified: true,
    },
    {
      id: 10,
      name: "Meryl Streep",
      photo: "/meryl-streep-portrait.png",
      primaryRole: "Actress",
      knownFor: ["The Devil Wears Prada", "Sophie's Choice", "Mamma Mia!"],
      isVerified: true,
    },
    {
      id: 11,
      name: "Steven Spielberg",
      photo: "/steven-spielberg-portrait.png",
      primaryRole: "Director",
      knownFor: ["Jurassic Park", "E.T.", "Schindler's List"],
      isVerified: true,
    },
    {
      id: 12,
      name: "Viola Davis",
      photo: "/viola-davis-portrait.png",
      primaryRole: "Actress",
      knownFor: ["Fences", "The Help", "How to Get Away with Murder"],
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
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      variants={containerVariants}
    >
      {people.map((person) => (
        <motion.div
          key={person.id}
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-[#282828] rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors"
        >
          <Link href={`/people/${person.id}`}>
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={person.photo || "/placeholder.svg"}
                alt={person.name}
                fill
                className="object-cover transition-transform hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
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

            <div className="p-4">
              <h3 className="font-semibold text-lg line-clamp-1">{person.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{person.primaryRole}</p>

              <div className="flex items-center text-xs text-gray-300">
                <Film size={14} className="mr-1 text-[#00BFFF]" />
                <span className="line-clamp-1">Known for: {person.knownFor.join(", ")}</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
