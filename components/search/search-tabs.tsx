"use client"

import { motion } from "framer-motion"
import { Film, Users, MessageCircle, Trophy } from "lucide-react"

interface SearchTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function SearchTabs({ activeTab, onTabChange }: SearchTabsProps) {
  const tabs = [
    { id: "all", label: "All", icon: <Film size={16} /> },
    { id: "movies", label: "Movies", icon: <Film size={16} /> },
    { id: "people", label: "People", icon: <Users size={16} /> },
    { id: "pulses", label: "Pulses", icon: <MessageCircle size={16} /> },
    { id: "cricket", label: "Cricket", icon: <Trophy size={16} /> },
  ]

  return (
    <div className="relative overflow-x-auto">
      <motion.div
        className="flex space-x-1 md:space-x-2 pb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-4 py-2 rounded-full flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === tab.id ? "bg-[#00BFFF] text-white" : "bg-[#282828] text-gray-300 hover:bg-[#333333]"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>

            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00BFFF]"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </motion.div>
    </div>
  )
}
