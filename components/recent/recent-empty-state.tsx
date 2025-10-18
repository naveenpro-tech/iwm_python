"use client"

import { motion } from "framer-motion"
import { Clock, Film, Users, Briefcase, Trophy, Activity, PowerIcon as Pulse } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { ContentType } from "./types"

interface RecentEmptyStateProps {
  selectedFilter: ContentType | "all"
  hasAnyItems: boolean
}

export function RecentEmptyState({ selectedFilter, hasAnyItems }: RecentEmptyStateProps) {
  const getEmptyMessage = () => {
    if (!hasAnyItems) {
      return {
        title: "No recent activity",
        description: "Start exploring Siddu to build your viewing history",
        icon: Clock,
        cta: {
          label: "Explore Movies",
          href: "/movies",
        },
      }
    }

    const messages: Record<
      ContentType,
      { title: string; description: string; icon: any; cta: { label: string; href: string } }
    > = {
      movie: {
        title: "No movies viewed recently",
        description: "Discover amazing films and build your movie history",
        icon: Film,
        cta: { label: "Browse Movies", href: "/movies" },
      },
      profile: {
        title: "No profiles viewed recently",
        description: "Explore talented individuals in the industry",
        icon: Users,
        cta: { label: "Discover Talent", href: "/talent-hub" },
      },
      casting: {
        title: "No casting calls viewed recently",
        description: "Find exciting opportunities in film and entertainment",
        icon: Briefcase,
        cta: { label: "View Casting Calls", href: "/talent-hub/calls" },
      },
      industry: {
        title: "No industry profiles viewed recently",
        description: "Connect with verified industry professionals",
        icon: Trophy,
        cta: { label: "Explore Industry Pros", href: "/industry/profiles" },
      },
      cricket: {
        title: "No cricket content viewed recently",
        description: "Stay updated with live matches and cricket news",
        icon: Activity,
        cta: { label: "Cricket Dashboard", href: "/cricket" },
      },
      pulse: {
        title: "No pulse posts viewed recently",
        description: "Join the conversation about movies and entertainment",
        icon: Pulse,
        cta: { label: "Explore Pulse", href: "/pulse" },
      },
    }

    return messages[selectedFilter as ContentType] || messages.movie
  }

  const { title, description, icon: Icon, cta } = getEmptyMessage()

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4 bg-[#1A1A1A] rounded-full mb-6">
        <Icon className="w-12 h-12 text-[#00BFFF]" />
      </div>
      <h3 className="text-xl font-semibold text-[#E0E0E0] font-inter mb-2">{title}</h3>
      <p className="text-[#A0A0A0] font-dmsans text-center max-w-md mb-6">{description}</p>
      <Link href={cta.href}>
        <Button className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white">{cta.label}</Button>
      </Link>
    </motion.div>
  )
}
