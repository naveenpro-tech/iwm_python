"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Clock, Bookmark, Users, Briefcase, CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { CastingCall } from "../types"
import Link from "next/link"

interface CastingCallCardProps {
  call: CastingCall
}

export default function CastingCallCard({ call }: CastingCallCardProps) {
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
      <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="h-full">
        <Card className="overflow-hidden h-full flex flex-col bg-[#282828] border-[#3A3A3A] hover:border-[#00BFFF] transition-colors">
          {/* Card Header with Image */}
          <div className="relative h-40">
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent z-10" />
            <img
              src={call.posterImage || "/placeholder.svg?height=160&width=400&query=film production"}
              alt={call.projectTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 z-20">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full bg-black/50 backdrop-blur-sm ${
                  isBookmarked ? "text-[#00BFFF]" : "text-white"
                }`}
                onClick={toggleBookmark}
              >
                <Bookmark className="w-4 h-4" fill={isBookmarked ? "#00BFFF" : "none"} />
              </Button>
            </div>
            {call.isVerified && (
              <Badge className="absolute top-2 left-2 z-20 bg-[#00BFFF] text-black border-0">
                <CheckCircle className="w-3 h-3 mr-1" /> Verified
              </Badge>
            )}
            <div className="absolute bottom-2 left-2 z-20">
              <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-0">
                {call.projectType.replace("-", " ")}
              </Badge>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{call.projectTitle}</h3>
            <p className="text-[#A0A0A0] text-sm mb-3 line-clamp-2">{call.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-xs text-[#A0A0A0]">
                <MapPin className="w-3 h-3 mr-1 text-[#00BFFF]" />
                <span>
                  {call.location.city}, {call.location.state}
                </span>
              </div>
              <div className="flex items-center text-xs text-[#A0A0A0]">
                <Calendar className="w-3 h-3 mr-1 text-[#00BFFF]" />
                <span>
                  Shooting: {new Date(call.productionTimeline.start).toLocaleDateString()} -{" "}
                  {new Date(call.productionTimeline.end).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
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

            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center text-xs">
                <Clock className="w-3 h-3 mr-1 text-[#00BFFF]" />
                <span>Posted {formatDistanceToNow(new Date(call.postedDate), { addSuffix: true })}</span>
              </div>
              <Badge
                className={`${
                  daysToDeadline <= 3 ? "bg-red-500" : daysToDeadline <= 7 ? "bg-amber-500" : "bg-green-600"
                } text-white border-0`}
              >
                {daysToDeadline <= 0 ? "Closing today" : `${daysToDeadline} days left`}
              </Badge>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  )
}
