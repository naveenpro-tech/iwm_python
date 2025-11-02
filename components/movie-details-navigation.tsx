"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Info, Star, Users, Clock, Film, Lightbulb, Trophy } from "lucide-react"

interface MovieDetailsNavigationProps {
  movieId: string
  movieTitle: string
}

export function MovieDetailsNavigation({ movieId, movieTitle }: MovieDetailsNavigationProps) {
  const pathname = usePathname()

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <Info className="w-4 h-4 mr-2" />,
      href: `/movies/${movieId}`,
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: <Star className="w-4 h-4 mr-2" />,
      href: `/movies/${movieId}/reviews`,
    },
    {
      id: "cast",
      label: "Cast & Crew",
      icon: <Users className="w-4 h-4 mr-2" />,
      href: `/movies/${movieId}/cast`,
    },
    {
      id: "timeline",
      label: "Timeline",
      icon: <Clock className="w-4 h-4 mr-2" />,
      href: `/movies/${movieId}/timeline`,
    },
    {
      id: "scenes",
      label: "Scenes",
      icon: <Film className="w-4 h-4 mr-2" />,
      href: `/movies/${movieId}/scenes`,
    },
    {
      id: "trivia",
      label: "Trivia",
      icon: <Lightbulb className="w-4 h-4 mr-2" />,
      href: `/movies/${movieId}/trivia`,
    },
    {
      id: "awards",
      label: "Awards",
      icon: <Trophy className="w-4 h-4 mr-2" />,
      href: `/movies/${movieId}/awards`,
    },
  ]

  const getActiveTab = () => {
    if (pathname === `/movies/${movieId}`) return "overview"
    if (pathname.includes("/reviews")) return "reviews"
    if (pathname.includes("/cast")) return "cast"
    if (pathname.includes("/timeline")) return "timeline"
    if (pathname.includes("/scenes")) return "scenes"
    if (pathname.includes("/trivia")) return "trivia"
    if (pathname.includes("/awards")) return "awards"
    return "overview"
  }

  const activeTab = getActiveTab()

  return (
    <div className="bg-[#1A1A1A] border-b border-[#282828] sticky top-14 md:top-16 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`relative flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? "text-[#00BFFF]" : "text-[#A0A0A0] hover:text-[#E0E0E0]"
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00BFFF]"
                  layoutId="activeTabIndicator"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
