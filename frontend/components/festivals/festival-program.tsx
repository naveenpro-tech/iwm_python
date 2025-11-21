"use client"

import { motion } from "framer-motion"
import { Film, Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

interface FestivalProgramProps {
  festivalId: string
}

const programSections = {
  competition: [
    {
      title: "The Zone of Interest",
      director: "Jonathan Glazer",
      country: "UK/Poland",
      premiere: "World Premiere",
      image: "/zone-of-interest.png",
    },
    {
      title: "Anatomy of a Fall",
      director: "Justine Triet",
      country: "France",
      premiere: "World Premiere",
      image: "/anatomy-of-fall.png",
    },
  ],
  outOfCompetition: [
    {
      title: "Indiana Jones 5",
      director: "James Mangold",
      country: "USA",
      premiere: "Out of Competition",
      image: "/indiana-jones-5.png",
    },
  ],
  specialScreenings: [
    {
      title: "Killers of the Flower Moon",
      director: "Martin Scorsese",
      country: "USA",
      premiere: "Special Screening",
      image: "/killers-flower-moon.png",
    },
  ],
}

export function FestivalProgram({ festivalId }: FestivalProgramProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Official Program</h2>
        <Badge className="bg-[#00BFFF]/10 text-[#00BFFF] border-[#00BFFF]/20">
          <Film className="h-3 w-3 mr-1" />
          45 Films
        </Badge>
      </div>

      <Tabs defaultValue="competition" className="space-y-6">
        <TabsList className="bg-[#282828] border border-gray-800">
          <TabsTrigger value="competition">Competition</TabsTrigger>
          <TabsTrigger value="out-of-competition">Out of Competition</TabsTrigger>
          <TabsTrigger value="special">Special Screenings</TabsTrigger>
          <TabsTrigger value="retrospective">Retrospectives</TabsTrigger>
        </TabsList>

        <TabsContent value="competition" className="space-y-4">
          {programSections.competition.map((film, index) => (
            <motion.div
              key={film.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-[#282828] border-gray-800 overflow-hidden hover:bg-[#333] transition-colors">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-48 h-48 md:h-32">
                    <Image src={film.image || "/placeholder.svg"} alt={film.title} fill className="object-cover" />
                  </div>
                  <CardContent className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{film.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">Directed by {film.director}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{film.country}</span>
                          <Badge variant="outline" className="text-xs">
                            {film.premiere}
                          </Badge>
                        </div>
                      </div>
                      <Trophy className="h-5 w-5 text-[#00BFFF]" />
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="out-of-competition" className="space-y-4">
          {programSections.outOfCompetition.map((film, index) => (
            <motion.div
              key={film.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-[#282828] border-gray-800 overflow-hidden hover:bg-[#333] transition-colors">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-48 h-48 md:h-32">
                    <Image src={film.image || "/placeholder.svg"} alt={film.title} fill className="object-cover" />
                  </div>
                  <CardContent className="flex-1 p-4">
                    <h3 className="text-lg font-semibold text-white mb-1">{film.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">Directed by {film.director}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{film.country}</span>
                      <Badge variant="outline" className="text-xs">
                        {film.premiere}
                      </Badge>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="special" className="space-y-4">
          {programSections.specialScreenings.map((film, index) => (
            <motion.div
              key={film.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-[#282828] border-gray-800 overflow-hidden hover:bg-[#333] transition-colors">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-48 h-48 md:h-32">
                    <Image src={film.image || "/placeholder.svg"} alt={film.title} fill className="object-cover" />
                  </div>
                  <CardContent className="flex-1 p-4">
                    <h3 className="text-lg font-semibold text-white mb-1">{film.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">Directed by {film.director}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{film.country}</span>
                      <Badge variant="outline" className="text-xs">
                        {film.premiere}
                      </Badge>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="retrospective">
          <Card className="bg-[#282828] border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Classic Cinema Retrospective</h3>
            <p className="text-gray-400">
              This year's retrospective celebrates the golden age of cinema with restored classics.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
