"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Award, Film, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RelatedPeopleSectionProps {
  personId: string | number
}

export function RelatedPeopleSection({ personId }: RelatedPeopleSectionProps) {
  // Mock related people data
  const frequentCollaborators = [
    {
      id: 2,
      name: "Leonardo DiCaprio",
      photo: "/leonardo-dicaprio.png",
      primaryRole: "Actor",
      relationship: "Frequent Collaborator",
      collaborations: 3,
      films: ["Inception", "Don't Look Up", "The Revenant"],
      isVerified: true,
    },
    {
      id: 3,
      name: "Cillian Murphy",
      photo: "/cillian-murphy-portrait.png",
      primaryRole: "Actor",
      relationship: "Frequent Collaborator",
      collaborations: 6,
      films: ["Oppenheimer", "Inception", "The Dark Knight Rises", "Batman Begins", "Dunkirk"],
      isVerified: true,
    },
    {
      id: 5,
      name: "Tom Hardy",
      photo: "/tom-hardy.png",
      primaryRole: "Actor",
      relationship: "Frequent Collaborator",
      collaborations: 3,
      films: ["Inception", "The Dark Knight Rises", "Dunkirk"],
      isVerified: true,
    },
    {
      id: 8,
      name: "Michael Caine",
      photo: "/michael-caine.png",
      primaryRole: "Actor",
      relationship: "Frequent Collaborator",
      collaborations: 7,
      films: [
        "Inception",
        "Interstellar",
        "The Prestige",
        "The Dark Knight",
        "The Dark Knight Rises",
        "Batman Begins",
        "Tenet",
      ],
      isVerified: true,
    },
  ]

  const similarProfessionals = [
    {
      id: 101,
      name: "Denis Villeneuve",
      photo: "/placeholder.svg?height=400&width=400&query=denis%20villeneuve%20portrait",
      primaryRole: "Director",
      relationship: "Similar Style",
      collaborations: 0,
      films: ["Dune", "Blade Runner 2049", "Arrival"],
      isVerified: true,
    },
    {
      id: 102,
      name: "David Fincher",
      photo: "/placeholder.svg?height=400&width=400&query=david%20fincher%20portrait",
      primaryRole: "Director",
      relationship: "Similar Style",
      collaborations: 0,
      films: ["Fight Club", "The Social Network", "Gone Girl"],
      isVerified: true,
    },
    {
      id: 103,
      name: "Ridley Scott",
      photo: "/placeholder.svg?height=400&width=400&query=ridley%20scott%20portrait",
      primaryRole: "Director",
      relationship: "Similar Style",
      collaborations: 0,
      films: ["Blade Runner", "Gladiator", "The Martian"],
      isVerified: true,
    },
  ]

  const influences = [
    {
      id: 201,
      name: "Stanley Kubrick",
      photo: "/placeholder.svg?height=400&width=400&query=stanley%20kubrick%20portrait",
      primaryRole: "Director",
      relationship: "Influence",
      collaborations: 0,
      films: ["2001: A Space Odyssey", "The Shining", "A Clockwork Orange"],
      isVerified: true,
    },
    {
      id: 202,
      name: "Terrence Malick",
      photo: "/placeholder.svg?height=400&width=400&query=terrence%20malick%20portrait",
      primaryRole: "Director",
      relationship: "Influence",
      collaborations: 0,
      films: ["The Tree of Life", "The Thin Red Line", "Days of Heaven"],
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
      transition: { duration: 0.4 },
    },
  }

  return (
    <div>
      <Tabs defaultValue="collaborators" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto bg-[#282828] p-0 h-auto mb-6">
          <TabsTrigger
            value="collaborators"
            className="py-2 px-4 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
          >
            Frequent Collaborators
          </TabsTrigger>
          <TabsTrigger
            value="similar"
            className="py-2 px-4 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
          >
            Similar Professionals
          </TabsTrigger>
          <TabsTrigger
            value="influences"
            className="py-2 px-4 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
          >
            Influences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collaborators">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {frequentCollaborators.map((person) => (
              <RelatedPersonCard key={person.id} person={person} variants={itemVariants} />
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="similar">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {similarProfessionals.map((person) => (
              <RelatedPersonCard key={person.id} person={person} variants={itemVariants} />
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="influences">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {influences.map((person) => (
              <RelatedPersonCard key={person.id} person={person} variants={itemVariants} />
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface RelatedPersonCardProps {
  person: {
    id: number
    name: string
    photo: string
    primaryRole: string
    relationship: string
    collaborations: number
    films: string[]
    isVerified: boolean
  }
  variants: any
}

function RelatedPersonCard({ person, variants }: RelatedPersonCardProps) {
  return (
    <motion.div
      variants={variants}
      className="bg-[#282828] rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors"
    >
      <Link href={`/people/${person.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={person.photo || "/placeholder.svg"}
            alt={person.name}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          {person.isVerified && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-[#00BFFF] text-white">
                <Award size={12} className="mr-1" />
                Verified
              </Badge>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <Badge className="bg-[#1A1A1A]/80 text-white">{person.relationship}</Badge>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{person.name}</h3>
          <p className="text-sm text-gray-400 mb-3">{person.primaryRole}</p>

          {person.collaborations > 0 && (
            <div className="flex items-center text-xs text-gray-300 mb-2">
              <Users size={14} className="mr-1 text-[#00BFFF]" />
              <span>{person.collaborations} collaborations</span>
            </div>
          )}

          <div className="flex items-center text-xs text-gray-300">
            <Film size={14} className="mr-1 text-[#00BFFF]" />
            <span className="line-clamp-1">Known for: {person.films.join(", ")}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
