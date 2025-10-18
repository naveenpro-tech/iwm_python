"use client"

import { motion } from "framer-motion"
import { Trophy, Award, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface FestivalJuryProps {
  festivalId: string
}

const juryMembers = [
  {
    name: "Ruben Östlund",
    role: "Jury President",
    title: "Director",
    image: "/jury-president.png",
    films: ["Triangle of Sadness", "The Square"],
  },
  {
    name: "Brie Larson",
    role: "Jury Member",
    title: "Actor/Director",
    image: "/jury-member-1.png",
    films: ["Room", "Captain Marvel"],
  },
  {
    name: "Paul Dano",
    role: "Jury Member",
    title: "Actor/Director",
    image: "/jury-member-2.png",
    films: ["The Batman", "The Fabelmans"],
  },
]

const awards = [
  {
    name: "Palme d'Or",
    description: "Best Film",
    icon: Trophy,
    color: "text-yellow-500",
  },
  {
    name: "Grand Prix",
    description: "Runner-up Award",
    icon: Award,
    color: "text-gray-400",
  },
  {
    name: "Best Director",
    description: "Directorial Excellence",
    icon: Users,
    color: "text-[#00BFFF]",
  },
]

export function FestivalJury({ festivalId }: FestivalJuryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Jury Members */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Competition Jury</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {juryMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-[#282828] border-gray-800 overflow-hidden hover:bg-[#333] transition-colors">
                <div className="relative h-64">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <Badge className="absolute top-4 right-4 bg-[#00BFFF]/90 text-white">{member.role}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{member.title}</p>
                  <div className="space-y-1">
                    {member.films.map((film) => (
                      <p key={film} className="text-xs text-gray-500">
                        • {film}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Awards */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Award Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.map((award, index) => {
            const Icon = award.icon
            return (
              <motion.div
                key={award.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-[#282828] border-gray-800 p-6 hover:bg-[#333] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-[#1A1A1A] rounded-lg ${award.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{award.name}</h3>
                      <p className="text-sm text-gray-400">{award.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
