"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Award, Calendar, ChevronDown, ChevronUp, Film, Trophy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface AwardsSectionProps {
  personId: string | number
}

export function AwardsSection({ personId }: AwardsSectionProps) {
  const [expandedAwards, setExpandedAwards] = useState<number[]>([])

  // Toggle award expansion
  const toggleAward = (awardId: number) => {
    if (expandedAwards.includes(awardId)) {
      setExpandedAwards(expandedAwards.filter((id) => id !== awardId))
    } else {
      setExpandedAwards([...expandedAwards, awardId])
    }
  }

  // Mock awards data
  const awards = [
    {
      id: 1,
      organization: "Academy Awards (Oscars)",
      awards: [
        {
          id: 101,
          category: "Best Director",
          year: 2023,
          film: "Oppenheimer",
          result: "Winner",
          image: "/placeholder.svg?height=300&width=300&query=oscar%20trophy",
        },
        {
          id: 102,
          category: "Best Picture",
          year: 2023,
          film: "Oppenheimer",
          result: "Winner",
          image: "/placeholder.svg?height=300&width=300&query=oscar%20trophy",
        },
        {
          id: 103,
          category: "Best Original Screenplay",
          year: 2010,
          film: "Inception",
          result: "Nominee",
          image: "/placeholder.svg?height=300&width=300&query=oscar%20trophy",
        },
        {
          id: 104,
          category: "Best Picture",
          year: 2010,
          film: "Inception",
          result: "Nominee",
          image: "/placeholder.svg?height=300&width=300&query=oscar%20trophy",
        },
        {
          id: 105,
          category: "Best Director",
          year: 2017,
          film: "Dunkirk",
          result: "Nominee",
          image: "/placeholder.svg?height=300&width=300&query=oscar%20trophy",
        },
      ],
    },
    {
      id: 2,
      organization: "Golden Globe Awards",
      awards: [
        {
          id: 201,
          category: "Best Director",
          year: 2023,
          film: "Oppenheimer",
          result: "Winner",
          image: "/placeholder.svg?height=300&width=300&query=golden%20globe%20trophy",
        },
        {
          id: 202,
          category: "Best Motion Picture - Drama",
          year: 2023,
          film: "Oppenheimer",
          result: "Winner",
          image: "/placeholder.svg?height=300&width=300&query=golden%20globe%20trophy",
        },
      ],
    },
    {
      id: 3,
      organization: "BAFTA Awards",
      awards: [
        {
          id: 301,
          category: "Best Direction",
          year: 2023,
          film: "Oppenheimer",
          result: "Winner",
          image: "/placeholder.svg?height=300&width=300&query=bafta%20trophy",
        },
        {
          id: 302,
          category: "Best Film",
          year: 2023,
          film: "Oppenheimer",
          result: "Winner",
          image: "/placeholder.svg?height=300&width=300&query=bafta%20trophy",
        },
        {
          id: 303,
          category: "Best Original Screenplay",
          year: 2010,
          film: "Inception",
          result: "Nominee",
          image: "/placeholder.svg?height=300&width=300&query=bafta%20trophy",
        },
      ],
    },
  ]

  // Group awards by film
  const awardsByFilm = awards
    .flatMap((org) =>
      org.awards.map((award) => ({
        ...award,
        organization: org.organization,
      })),
    )
    .reduce(
      (acc, award) => {
        if (!acc[award.film]) {
          acc[award.film] = []
        }
        acc[award.film].push(award)
        return acc
      },
      {} as Record<string, any[]>,
    )

  // Group awards by year
  const awardsByYear = awards
    .flatMap((org) =>
      org.awards.map((award) => ({
        ...award,
        organization: org.organization,
      })),
    )
    .reduce(
      (acc, award) => {
        if (!acc[award.year]) {
          acc[award.year] = []
        }
        acc[award.year].push(award)
        return acc
      },
      {} as Record<string, any[]>,
    )

  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  // Calculate award statistics
  const totalAwards = awards.flatMap((org) => org.awards).length
  const totalWins = awards.flatMap((org) => org.awards).filter((award) => award.result === "Winner").length
  const totalNominations = totalAwards - totalWins

  return (
    <div>
      {/* Awards Summary */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="bg-[#282828] rounded-lg p-4 text-center" variants={itemVariants}>
          <Trophy className="mx-auto h-8 w-8 text-[#FFD700] mb-2" />
          <p className="text-2xl font-bold">{totalAwards}</p>
          <p className="text-sm text-gray-400">Total Awards & Nominations</p>
        </motion.div>

        <motion.div className="bg-[#282828] rounded-lg p-4 text-center" variants={itemVariants}>
          <Award className="mx-auto h-8 w-8 text-[#FFD700] mb-2" />
          <p className="text-2xl font-bold">{totalWins}</p>
          <p className="text-sm text-gray-400">Wins</p>
        </motion.div>

        <motion.div className="bg-[#282828] rounded-lg p-4 text-center" variants={itemVariants}>
          <Badge className="mx-auto h-8 w-8 text-[#C0C0C0] mb-2" />
          <p className="text-2xl font-bold">{totalNominations}</p>
          <p className="text-sm text-gray-400">Nominations</p>
        </motion.div>
      </motion.div>

      {/* Awards Tabs */}
      <Tabs defaultValue="by-organization" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto bg-[#282828] p-0 h-auto mb-6">
          <TabsTrigger
            value="by-organization"
            className="py-2 px-4 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
          >
            By Organization
          </TabsTrigger>
          <TabsTrigger
            value="by-film"
            className="py-2 px-4 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
          >
            By Film
          </TabsTrigger>
          <TabsTrigger
            value="by-year"
            className="py-2 px-4 data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] rounded-none"
          >
            By Year
          </TabsTrigger>
        </TabsList>

        <TabsContent value="by-organization">
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            {awards.map((organization) => (
              <motion.div key={organization.id} variants={itemVariants}>
                <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">{organization.organization}</h3>
                <div className="space-y-4">
                  {organization.awards.map((award) => (
                    <AwardCard
                      key={award.id}
                      award={{ ...award, organization: organization.organization }}
                      isExpanded={expandedAwards.includes(award.id)}
                      onToggle={() => toggleAward(award.id)}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="by-film">
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            {Object.entries(awardsByFilm).map(([film, awards]) => (
              <motion.div key={film} variants={itemVariants}>
                <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">{film}</h3>
                <div className="space-y-4">
                  {awards.map((award) => (
                    <AwardCard
                      key={award.id}
                      award={award}
                      isExpanded={expandedAwards.includes(award.id)}
                      onToggle={() => toggleAward(award.id)}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="by-year">
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            {Object.entries(awardsByYear)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([year, awards]) => (
                <motion.div key={year} variants={itemVariants}>
                  <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">{year}</h3>
                  <div className="space-y-4">
                    {awards.map((award) => (
                      <AwardCard
                        key={award.id}
                        award={award}
                        isExpanded={expandedAwards.includes(award.id)}
                        onToggle={() => toggleAward(award.id)}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface AwardCardProps {
  award: {
    id: number
    organization: string
    category: string
    year: number
    film: string
    result: string
    image: string
  }
  isExpanded: boolean
  onToggle: () => void
}

function AwardCard({ award, isExpanded, onToggle }: AwardCardProps) {
  return (
    <div
      className={`bg-[#282828] rounded-lg overflow-hidden border border-gray-700 transition-all ${
        isExpanded ? "shadow-lg" : ""
      }`}
    >
      <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#333333]" onClick={onToggle}>
        <div className="flex-1">
          <div className="flex items-center">
            <Badge
              className={`mr-2 ${award.result === "Winner" ? "bg-[#FFD700] text-black" : "bg-[#C0C0C0] text-black"}`}
            >
              {award.result}
            </Badge>
            <h4 className="font-medium">{award.category}</h4>
          </div>

          <div className="flex flex-wrap items-center mt-1 text-sm text-gray-400">
            <div className="flex items-center mr-4">
              <Calendar size={14} className="mr-1" />
              {award.year}
            </div>
            <div className="flex items-center mr-4">
              <Film size={14} className="mr-1" />
              {award.film}
            </div>
            <div>{award.organization}</div>
          </div>
        </div>

        <button className="p-1 rounded-full hover:bg-[#3A3A3A]">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 pt-0 border-t border-gray-700 mt-2">
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <div className="relative w-24 h-24 shrink-0">
              <Image
                src={award.image || "/placeholder.svg"}
                alt={`${award.organization} trophy`}
                fill
                className="object-contain"
              />
            </div>

            <div>
              <p className="text-sm text-gray-300 mb-2">
                {award.result === "Winner"
                  ? `Won the ${award.organization} for ${award.category} for the film "${award.film}" in ${award.year}.`
                  : `Nominated for the ${award.organization} for ${award.category} for the film "${award.film}" in ${award.year}.`}
              </p>

              {award.result === "Winner" && (
                <div className="text-sm text-gray-400">
                  <p>Acceptance speech available in the media gallery.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
