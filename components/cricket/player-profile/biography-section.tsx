"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface BiographySectionProps {
  playerBio: {
    fullName: string
    nickname?: string
    bio: string
    careerHighlights: string[]
    personalLife: string
    imageUrl: string
  }
}

export function BiographySection({ playerBio }: BiographySectionProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-white mb-6"
      >
        Biography
      </motion.h2>

      <Card className="bg-[#282828] border-gray-700 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-2 p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">{playerBio.fullName}</h3>
              {playerBio.nickname && (
                <p className="text-gray-400 mb-4">
                  <span className="font-medium">Nickname:</span> {playerBio.nickname}
                </p>
              )}
              <div className="space-y-4 text-gray-300">
                <p>{playerBio.bio}</p>

                <h4 className="text-lg font-medium text-white mt-6 mb-2">Career Highlights</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {playerBio.careerHighlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>

                <h4 className="text-lg font-medium text-white mt-6 mb-2">Personal Life</h4>
                <p>{playerBio.personalLife}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative h-full min-h-[300px] md:min-h-0"
            >
              <Image
                src={playerBio.imageUrl || "/cricket/virat-kohli.png"}
                alt={playerBio.fullName}
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
