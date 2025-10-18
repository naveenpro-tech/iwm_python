"use client"

import { motion } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"

interface ProfileNavigationProps {
  activeTab: string
  onTabChange: (tab: any) => void
  showApplications: boolean
  showContact: boolean
}

export function ProfileNavigation({ activeTab, onTabChange, showApplications, showContact }: ProfileNavigationProps) {
  const isMobile = useMobile()

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "portfolio", label: "Portfolio" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "about", label: "About" },
  ]

  // Conditionally add tabs based on permissions
  if (showApplications) {
    tabs.push({ id: "applications", label: "Applications" })
  }

  if (showContact) {
    tabs.push({ id: "contact", label: "Contact" })
  }

  return (
    <div className="mt-6 md:mt-8 border-b border-[#3A3A3A]">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`relative px-4 py-3 font-inter text-sm md:text-base whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:ring-inset ${
              activeTab === tab.id ? "text-[#E0E0E0]" : "text-[#A0A0A0] hover:text-[#E0E0E0]"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <span>{tab.label}</span>

            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00BFFF]"
                layoutId="activeTab"
                initial={false}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
