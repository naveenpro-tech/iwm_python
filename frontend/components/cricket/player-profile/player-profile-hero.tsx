"use client"

import { motion } from "framer-motion"
import { Calendar, Flag, Award, Star, Users } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PlayerProfileHeroProps {
  player: {
    id: string
    name: string
    fullName: string
    role: string
    battingStyle: string
    bowlingStyle?: string
    country: string
    countryCode: string
    dateOfBirth: string
    age: number
    teams: string[]
    imageUrl: string
    coverImageUrl: string
    isFollowing?: boolean
    isFavorite?: boolean
    rating: {
      batting: number
      bowling?: number
      fielding: number
    }
  }
}

export function PlayerProfileHero({ player }: PlayerProfileHeroProps) {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <Image
          src={player.coverImageUrl || "/cricket/wankhede-stadium.png"}
          alt={`${player.name} cover`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1A1A1A]"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="relative -mt-32 md:-mt-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row gap-6 items-start"
          >
            {/* Player Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative h-48 w-48 rounded-lg overflow-hidden border-4 border-[#1A1A1A] shadow-xl z-10"
            >
              <Image
                src={player.imageUrl || "/cricket/virat-kohli.png"}
                alt={player.name}
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Player Info */}
            <div className="flex-1 pt-4 md:pt-16">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Image
                      src={`/cricket/${player.countryCode.toLowerCase()}-logo.png`}
                      alt={player.country}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <Badge variant="outline" className="bg-[#3A3A3A] text-white border-gray-600">
                      {player.country}
                    </Badge>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{player.name}</h1>
                  <p className="text-gray-400">{player.fullName}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-[#3A3A3A] hover:text-white"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {player.isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button className="bg-[#00BFFF] hover:bg-[#00BFFF]/80 text-white">
                    <Star className="h-4 w-4 mr-2" />
                    {player.isFavorite ? "Favorited" : "Add to Favorites"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#282828] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-[#00BFFF]" />
                    <span className="text-sm text-gray-400">Age</span>
                  </div>
                  <p className="text-white font-medium">
                    {player.age} <span className="text-sm text-gray-400">({player.dateOfBirth})</span>
                  </p>
                </div>

                <div className="bg-[#282828] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Flag className="h-4 w-4 text-[#00BFFF]" />
                    <span className="text-sm text-gray-400">Role</span>
                  </div>
                  <p className="text-white font-medium">{player.role}</p>
                </div>

                <div className="bg-[#282828] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-4 w-4 text-[#00BFFF]" />
                    <span className="text-sm text-gray-400">Batting</span>
                  </div>
                  <p className="text-white font-medium">{player.battingStyle}</p>
                </div>

                {player.bowlingStyle && (
                  <div className="bg-[#282828] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="h-4 w-4 text-[#00BFFF]" />
                      <span className="text-sm text-gray-400">Bowling</span>
                    </div>
                    <p className="text-white font-medium">{player.bowlingStyle}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {player.teams.map((team) => (
                  <Badge key={team} variant="secondary" className="bg-[#3A3A3A] text-white border-none">
                    {team}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
