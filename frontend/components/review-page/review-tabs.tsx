"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, Award, Users } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ReviewTabsProps, ReviewTab } from "@/types/review-page"

export default function ReviewTabs({ activeTab, onTabChange, reviewCounts }: ReviewTabsProps) {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 600)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const tabs: Array<{
    id: ReviewTab
    label: string
    icon: typeof Star
    count: number
  }> = [
    {
      id: "siddu",
      label: "Siddu Review",
      icon: Star,
      count: reviewCounts.official,
    },
    {
      id: "critics",
      label: "Critic Reviews",
      icon: Award,
      count: reviewCounts.critics,
    },
    {
      id: "users",
      label: "User Reviews",
      icon: Users,
      count: reviewCounts.users,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className={`${
        isSticky
          ? "fixed top-20 left-0 right-0 z-40 bg-[#1A1A1A]/95 backdrop-blur-lg shadow-lg"
          : "relative"
      } transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as ReviewTab)}>
          <TabsList className="w-full bg-[#282828] border border-[#3A3A3A] p-1 grid grid-cols-3 gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="relative flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-[#A0A0A0] data-[state=active]:text-[#00BFFF] data-[state=active]:bg-[#1A1A1A] rounded-md transition-all duration-200 hover:text-[#E0E0E0]"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                  {tab.count !== null && (
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-[#3A3A3A] text-xs font-semibold">
                      {tab.count}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00BFFF] shadow-[0_0_10px_rgba(0,191,255,0.5)]"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      </div>
    </motion.div>
  )
}

