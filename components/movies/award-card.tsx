"use client"

import { motion } from "framer-motion"
import { Trophy, Award, Star, Calendar, Image as ImageIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPrestigeBadgeColor, getPrestigeBadgeLabel } from "@/lib/api/award-ceremonies"

export interface AwardCardProps {
  award: {
    id: string
    name: string
    year: number
    category: string
    status: "Winner" | "Nominee"
    ceremony_id?: string
    country?: string
    language?: string
    prestige_level?: string
    recipient?: string
    notes?: string
  }
  ceremonyLogo?: string | null
  index?: number
}

export function AwardCard({ award, ceremonyLogo, index = 0 }: AwardCardProps) {
  const isWinner = award.status === "Winner"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className={`bg-[#1C1C1C] border-gray-700 hover:border-[#00BFFF] transition-all duration-300 ${
          isWinner ? "ring-1 ring-[#FFD700]/20" : ""
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Ceremony Logo or Icon */}
            <div className="flex-shrink-0">
              {ceremonyLogo ? (
                <div className="w-16 h-16 rounded-lg bg-[#282828] border border-gray-700 flex items-center justify-center overflow-hidden">
                  <img
                    src={ceremonyLogo}
                    alt={award.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = "none"
                      const parent = e.currentTarget.parentElement
                      if (parent) {
                        const icon = document.createElement("div")
                        icon.innerHTML = `<svg class="w-8 h-8 text-[#FFD700]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>`
                        parent.appendChild(icon.firstChild!)
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-[#282828] border border-gray-700 flex items-center justify-center">
                  {isWinner ? (
                    <Trophy className="w-8 h-8 text-[#FFD700]" />
                  ) : (
                    <Award className="w-8 h-8 text-[#00BFFF]" />
                  )}
                </div>
              )}
            </div>

            {/* Award Details */}
            <div className="flex-1 min-w-0">
              {/* Header with Name and Status */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-white mb-1 flex items-center gap-2">
                    {award.name}
                    {isWinner && <Star className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />}
                  </h3>
                  <p className="text-gray-300 font-medium">{award.category}</p>
                </div>

                {/* Year Badge */}
                <div className="flex items-center gap-2 text-gray-400 flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                  <span className="text-lg font-semibold">{award.year}</span>
                </div>
              </div>

              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {/* Status Badge */}
                <Badge
                  variant={isWinner ? "default" : "secondary"}
                  className={
                    isWinner
                      ? "bg-green-500 text-black hover:bg-green-600 font-semibold"
                      : "bg-blue-500 text-black hover:bg-blue-600"
                  }
                >
                  {award.status}
                </Badge>

                {/* Country Badge */}
                {award.country && (
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {award.country}
                  </Badge>
                )}

                {/* Language Badge */}
                {award.language && (
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {award.language}
                  </Badge>
                )}

                {/* Prestige Level Badge */}
                {award.prestige_level && (
                  <Badge className={`${getPrestigeBadgeColor(award.prestige_level)} border`}>
                    {getPrestigeBadgeLabel(award.prestige_level)}
                  </Badge>
                )}
              </div>

              {/* Additional Info */}
              {(award.recipient || award.notes) && (
                <div className="space-y-1 text-sm text-gray-400">
                  {award.recipient && (
                    <p>
                      <span className="text-gray-500">Recipient:</span> {award.recipient}
                    </p>
                  )}
                  {award.notes && (
                    <p className="text-gray-400 italic">{award.notes}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

