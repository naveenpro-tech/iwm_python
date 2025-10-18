"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Clock, Bookmark, Users, Briefcase, CheckCircle, ChevronRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { CastingCall } from "../types"
import Link from "next/link"

interface CastingCallListItemProps {
  call: CastingCall
}

export default function CastingCallListItem({ call }: CastingCallListItemProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  const actingRolesCount = call.roles.filter((role) => role.type === "acting").length
  const crewRolesCount = call.roles.filter((role) => role.type === "crew").length

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
  }

  const daysToDeadline = Math.ceil(
    (new Date(call.submissionDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <Link href={`/talent-hub/calls/${call.id}`}>
      <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
        <Card className="overflow-hidden bg-[#282828] border-[#3A3A3A] hover:border-[#00BFFF] transition-colors">
          <div className="flex flex-col md:flex-row">
            {/* Image (only on md and up) */}
            <div className="relative w-full md:w-48 h-32 md:h-auto">
              <img
                src={call.posterImage || "/placeholder.svg?height=160&width=200&query=film production"}
                alt={call.projectTitle}
                className="w-full h-full object-cover"
              />
              {call.isVerified && (
                <Badge className="absolute top-2 left-2 z-20 bg-[#00BFFF] text-black border-0">
                  <CheckCircle className="w-3 h-3 mr-1" /> Verified
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{call.projectTitle}</h3>
                    <Badge variant="outline" className="bg-[#3A3A3A] border-0">
                      {call.projectType.replace("-", " ")}
                    </Badge>
                  </div>
                  <p className="text-[#A0A0A0] text-sm mt-1 line-clamp-2">{call.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full ${isBookmarked ? "text-[#00BFFF]" : "text-white"}`}
                  onClick={toggleBookmark}
                >
                  <Bookmark className="w-4 h-4" fill={isBookmarked ? "#00BFFF" : "none"} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
                <div className="flex items-center text-xs text-[#A0A0A0]">
                  <MapPin className="w-3 h-3 mr-1 text-[#00BFFF]" />
                  <span>
                    {call.location.city}, {call.location.state}
                  </span>
                </div>
                <div className="flex items-center text-xs text-[#A0A0A0]">
                  <Calendar className="w-3 h-3 mr-1 text-[#00BFFF]" />
                  <span>
                    Shooting:{" "}
                    {new Date(call.productionTimeline.start).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(call.productionTimeline.end).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center text-xs text-[#A0A0A0]">
                  <Clock className="w-3 h-3 mr-1 text-[#00BFFF]" />
                  <span>Posted {formatDistanceToNow(new Date(call.postedDate), { addSuffix: true })}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between mt-4">
                <div className="flex gap-2">
                  {actingRolesCount > 0 && (
                    <Badge variant="outline" className="bg-[#3A3A3A] border-0">
                      <Users className="w-3 h-3 mr-1" />
                      {actingRolesCount} {actingRolesCount === 1 ? "Acting Role" : "Acting Roles"}
                    </Badge>
                  )}
                  {crewRolesCount > 0 && (
                    <Badge variant="outline" className="bg-[#3A3A3A] border-0">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {crewRolesCount} {crewRolesCount === 1 ? "Crew Position" : "Crew Positions"}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <Badge
                    className={`${
                      daysToDeadline <= 3 ? "bg-red-500" : daysToDeadline <= 7 ? "bg-amber-500" : "bg-green-600"
                    } text-white border-0`}
                  >
                    {daysToDeadline <= 0 ? "Closing today" : `${daysToDeadline} days left`}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-[#00BFFF]" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  )
}
