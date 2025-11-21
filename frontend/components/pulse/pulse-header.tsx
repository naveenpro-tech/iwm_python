"use client"

import { motion } from "framer-motion"
import { Edit, TrendingUp, Clock, Users, Zap, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { FilterType } from "./types"
import { useMobile } from "@/hooks/use-mobile"

interface PulseHeaderProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  onComposeClick: () => void
}

export function PulseHeader({ activeFilter, onFilterChange, onComposeClick }: PulseHeaderProps) {
  const isMobile = useMobile()

  const filters = [
    { id: "latest", label: "Latest", icon: Clock },
    { id: "popular", label: "Popular", icon: TrendingUp },
    { id: "following", label: "Following", icon: Users },
    { id: "trending", label: "Trending", icon: Zap },
  ]

  const getActiveFilter = () => {
    return filters.find((filter) => filter.id === activeFilter) || filters[0]
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      className="flex justify-between items-center mb-4 sticky top-0 z-10 bg-[#1A1A1A] py-2"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center">
        <h1 className="text-xl font-bold mr-4">Pulse</h1>

        {/* Desktop Filter Tabs */}
        {!isMobile && (
          <div className="flex space-x-1">
            {filters.map((filter) => {
              const isActive = filter.id === activeFilter
              const FilterIcon = filter.icon

              return (
                <Button
                  key={filter.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`px-3 ${
                    isActive
                      ? "bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-black"
                      : "text-[#A0A0A0] hover:text-white hover:bg-[#282828]"
                  }`}
                  onClick={() => onFilterChange(filter.id as FilterType)}
                >
                  <FilterIcon className="h-4 w-4 mr-2" />
                  {filter.label}
                </Button>
              )
            })}
          </div>
        )}

        {/* Mobile Filter Dropdown */}
        {isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-[#A0A0A0] hover:text-white hover:bg-[#282828]">
                <motion.div className="flex items-center">
                  {(() => {
                    const ActiveFilter = getActiveFilter()
                    const FilterIcon = ActiveFilter.icon
                    return (
                      <>
                        <FilterIcon className="h-4 w-4 mr-2" />
                        {ActiveFilter.label}
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </>
                    )
                  })()}
                </motion.div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-[#282828] border-[#3A3A3A]">
              {filters.map((filter) => {
                const isActive = filter.id === activeFilter
                const FilterIcon = filter.icon

                return (
                  <DropdownMenuItem
                    key={filter.id}
                    className={`flex items-center ${isActive ? "bg-[#3A3A3A] text-[#00BFFF]" : "text-[#E0E0E0]"}`}
                    onClick={() => onFilterChange(filter.id as FilterType)}
                  >
                    <FilterIcon className="h-4 w-4 mr-2" />
                    {filter.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Compose Button - Hidden on mobile, shown on desktop */}
      <Button
        onClick={onComposeClick}
        className="hidden md:flex items-center bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-black"
        size="sm"
      >
        <Edit className="h-4 w-4 mr-2" />
        Create Pulse
      </Button>
    </motion.div>
  )
}
