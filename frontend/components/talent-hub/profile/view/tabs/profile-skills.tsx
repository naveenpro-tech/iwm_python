"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThumbsUp, Search, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { TalentProfile } from "../../types"

interface ProfileSkillsProps {
  profile: TalentProfile
  isVerifiedIndustry?: boolean
}

export function ProfileSkills({ profile, isVerifiedIndustry = false }: ProfileSkillsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [endorsedSkills, setEndorsedSkills] = useState<Set<string>>(new Set())

  const handleEndorseSkill = (categoryName: string, skillName: string) => {
    const skillKey = `${categoryName}:${skillName}`
    const newEndorsedSkills = new Set(endorsedSkills)

    if (newEndorsedSkills.has(skillKey)) {
      newEndorsedSkills.delete(skillKey)
    } else {
      newEndorsedSkills.add(skillKey)
    }

    setEndorsedSkills(newEndorsedSkills)
  }

  // Filter skills based on search query
  const filteredSkills = profile.skills
    .map((category) => ({
      ...category,
      items: category.items.filter((skill) => skill.name.toLowerCase().includes(searchQuery.toLowerCase())),
    }))
    .filter((category) => category.items.length > 0)

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
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search skills..."
          className="pl-10 bg-[#282828] border-[#3A3A3A] text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredSkills.length > 0 ? (
        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
          {filteredSkills.map((category) => (
            <motion.div key={category.category} variants={itemVariants}>
              <Card className="bg-[#282828] border-[#3A3A3A]">
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.items.map((skill, index) => {
                      const skillKey = `${category.category}:${skill.name}`
                      const isEndorsed = endorsedSkills.has(skillKey)

                      return (
                        <div key={index} className="bg-[#1A1A1A] p-3 rounded-lg flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{skill.name}</span>
                              {skill.proficiency && (
                                <Badge variant="outline" className="border-[#3A3A3A] text-gray-400 capitalize">
                                  {skill.proficiency}
                                </Badge>
                              )}
                            </div>

                            {skill.endorsements && skill.endorsements > 0 && (
                              <div className="flex items-center mt-2 text-xs text-gray-400">
                                <ThumbsUp className="w-3 h-3 mr-1 text-[#00BFFF]" />
                                <span>
                                  {skill.endorsements} {skill.endorsements === 1 ? "endorsement" : "endorsements"}
                                </span>
                              </div>
                            )}
                          </div>

                          {isVerifiedIndustry && (
                            <Button
                              variant={isEndorsed ? "default" : "outline"}
                              size="sm"
                              className={
                                isEndorsed
                                  ? "bg-[#00BFFF] hover:bg-[#0099CC] text-black"
                                  : "border-[#3A3A3A] text-gray-400 hover:text-white hover:bg-[#3A3A3A]"
                              }
                              onClick={() => handleEndorseSkill(category.category, skill.name)}
                            >
                              {isEndorsed ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Endorsed
                                </>
                              ) : (
                                <>
                                  <ThumbsUp className="w-4 h-4 mr-1" />
                                  Endorse
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-[#282828] rounded-lg">
          <p className="text-gray-400">{searchQuery ? "No skills match your search" : "No skills added yet"}</p>
        </div>
      )}
    </div>
  )
}
