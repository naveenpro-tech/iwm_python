"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MessageSquare, Heart, Repeat, ExternalLink } from "lucide-react"
import type { TrendingPulse } from "./types" // Assuming this type exists
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNowStrict } from "date-fns"
import React from "react"

interface PulseTrendingCardProps {
  pulse: TrendingPulse
  className?: string
}

export const PulseTrendingCard: React.FC<PulseTrendingCardProps> = ({ pulse, className = "" }) => {
  const [isHovered, setIsHovered] = React.useState(false)

  const timeAgo = formatDistanceToNowStrict(new Date(pulse.timestamp), { addSuffix: true })

  return (
    <motion.div
      className={`bg-slate-800/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden group border border-slate-700/50 hover:border-sky-500/60 transition-all duration-300 ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "circOut" }}
    >
      <Link href={`/pulse/${pulse.id}`} passHref legacyBehavior>
        <a className="block p-5">
          <div className="flex items-start mb-3">
            <Avatar className="w-10 h-10 mr-3 border-2 border-slate-600 group-hover:border-sky-500 transition-colors">
              <AvatarImage src={pulse.user.avatarUrl || "/placeholder.svg"} alt={pulse.user.name} />
              <AvatarFallback>
                {pulse.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-semibold text-sky-300 group-hover:text-sky-200 transition-colors">
                {pulse.user.name}
              </h4>
              <p className="text-xs text-slate-400">
                @{pulse.user.username} · {timeAgo}
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-200 mb-3 line-clamp-3 leading-relaxed">{pulse.content.text}</p>

          {pulse.content.imageUrl && (
            <div className="relative aspect-video rounded-md overflow-hidden mb-3 shadow-md">
              <Image
                src={pulse.content.imageUrl || "/placeholder.svg"}
                alt="Pulse image"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}

          {pulse.relatedMovie && (
            <div className="mb-3 p-2.5 bg-slate-700/50 rounded-md flex items-center text-xs text-slate-300 hover:bg-slate-700 transition-colors">
              <Image
                src={pulse.relatedMovie.posterUrl || "/placeholder.svg?width=40&height=60&query=Movie"}
                alt={pulse.relatedMovie.title}
                width={32}
                height={48}
                className="rounded object-cover mr-2.5"
              />
              <div>
                <span className="block font-medium line-clamp-1">{pulse.relatedMovie.title}</span>
                <span className="block text-slate-400">{pulse.relatedMovie.year}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 ml-auto text-slate-500" />
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-3">
              <span className="flex items-center hover:text-sky-400 transition-colors">
                <MessageSquare className="w-3.5 h-3.5 mr-1" /> {pulse.stats.comments}
              </span>
              <span className="flex items-center hover:text-pink-400 transition-colors">
                <Heart className="w-3.5 h-3.5 mr-1" /> {pulse.stats.likes}
              </span>
              <span className="flex items-center hover:text-green-400 transition-colors">
                <Repeat className="w-3.5 h-3.5 mr-1" /> {pulse.stats.reposts}
              </span>
            </div>
            {pulse.topic && (
              <span className="px-2 py-0.5 bg-sky-800/70 text-sky-300 rounded-full text-[11px] line-clamp-1">
                #{pulse.topic}
              </span>
            )}
          </div>
        </a>
      </Link>
    </motion.div>
  )
}
