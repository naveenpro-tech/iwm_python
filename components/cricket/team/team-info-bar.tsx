"use client"

import { MapPin, User, Award } from "lucide-react"
import type { TeamProfile } from "./types"

interface TeamInfoBarProps {
  team: TeamProfile
}

export default function TeamInfoBar({ team }: TeamInfoBarProps) {
  return (
    <div className="bg-[#282828] border-b border-[#444]">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center py-3">
          <div className="flex items-center mr-6 mb-2 md:mb-0">
            <MapPin className="text-[#00BFFF] mr-2" size={18} />
            <span className="text-white">{team.homeGround}</span>
          </div>
          <div className="flex items-center mr-6 mb-2 md:mb-0">
            <User className="text-[#00BFFF] mr-2" size={18} />
            <span className="text-white">Captain: {team.captain}</span>
          </div>
          <div className="flex items-center mr-6 mb-2 md:mb-0">
            <Award className="text-[#00BFFF] mr-2" size={18} />
            <span className="text-white">Coach: {team.coach}</span>
          </div>
          <div className="ml-auto flex items-center">
            <span className="text-[#E0E0E0] mr-2">ICC Ranking:</span>
            <span className="text-white font-bold">
              #{team.iccRanking.test} Test | #{team.iccRanking.odi} ODI | #{team.iccRanking.t20} T20
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
