"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Award, Search, Trophy, Medal } from "lucide-react"
import type { IndustryProfessionalProfile } from "../../types"

interface ProfileAwardsProps {
  profile: IndustryProfessionalProfile
}

export function ProfileAwards({ profile }: ProfileAwardsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "wins" | "nominations">("all")

  const filteredAwards = profile.awards
    ?.filter((award) => {
      const matchesSearch =
        award.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        award.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (award.category && award.category.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesFilter =
        filterType === "all" ||
        (filterType === "wins" && !award.isNomination) ||
        (filterType === "nominations" && award.isNomination)

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => b.year - a.year)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  }

  const totalWins = profile.awards?.filter((a) => !a.isNomination).length || 0
  const totalNominations = profile.awards?.filter((a) => a.isNomination).length || 0

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-[#FFD700] mx-auto mb-2" />
            <p className="text-3xl font-bold text-[#E0E0E0]">{totalWins}</p>
            <p className="text-sm text-[#A0A0A0]">Awards Won</p>
          </CardContent>
        </Card>
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardContent className="p-6 text-center">
            <Medal className="w-8 h-8 text-[#C0C0C0] mx-auto mb-2" />
            <p className="text-3xl font-bold text-[#E0E0E0]">{totalNominations}</p>
            <p className="text-sm text-[#A0A0A0]">Nominations</p>
          </CardContent>
        </Card>
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 text-[#00BFFF] mx-auto mb-2" />
            <p className="text-3xl font-bold text-[#E0E0E0]">{profile.awards?.length || 0}</p>
            <p className="text-sm text-[#A0A0A0]">Total Recognition</p>
          </CardContent>
        </Card>
      </div>

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search awards..."
            className="pl-10 bg-[#282828] border-[#3A3A3A] focus:border-[#00BFFF]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("all")}
            className={
              filterType === "all"
                ? "bg-[#00BFFF] hover:bg-[#0099CC] text-black"
                : "border-[#3A3A3A] hover:bg-[#282828]"
            }
          >
            All
          </Button>
          <Button
            variant={filterType === "wins" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("wins")}
            className={
              filterType === "wins"
                ? "bg-[#00BFFF] hover:bg-[#0099CC] text-black"
                : "border-[#3A3A3A] hover:bg-[#282828]"
            }
          >
            <Trophy className="w-4 h-4 mr-2" />
            Wins
          </Button>
          <Button
            variant={filterType === "nominations" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("nominations")}
            className={
              filterType === "nominations"
                ? "bg-[#00BFFF] hover:bg-[#0099CC] text-black"
                : "border-[#3A3A3A] hover:bg-[#282828]"
            }
          >
            <Medal className="w-4 h-4 mr-2" />
            Nominations
          </Button>
        </div>
      </div>

      {/* Awards List */}
      {filteredAwards && filteredAwards.length > 0 ? (
        <motion.div className="space-y-4" initial="hidden" animate="visible" variants={containerVariants}>
          {filteredAwards.map((award) => (
            <motion.div key={award.id} variants={itemVariants}>
              <Card
                className={`bg-[#282828] border-[#3A3A3A] hover:border-[#00BFFF] transition-colors ${
                  !award.isNomination ? "border-l-4 border-l-[#FFD700]" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                        award.isNomination ? "bg-[#3A3A3A]" : "bg-[#FFD700]/20"
                      }`}
                    >
                      {award.isNomination ? (
                        <Medal className="w-6 h-6 text-[#C0C0C0]" />
                      ) : (
                        <Trophy className="w-6 h-6 text-[#FFD700]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-[#E0E0E0]">
                            {award.name}
                            {award.isNomination && (
                              <span className="ml-2 text-sm font-normal text-gray-400">(Nomination)</span>
                            )}
                          </h3>
                          {award.category && <p className="text-[#00BFFF]">{award.category}</p>}
                          <div className="flex items-center text-sm text-[#A0A0A0] mt-2">
                            <span className="font-medium">{award.project}</span>
                            <span className="mx-2">•</span>
                            <span>{award.year}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#E0E0E0]">{award.year}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="w-12 h-12 text-gray-500 mb-4" />
            <p className="text-[#A0A0A0]">No awards found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
