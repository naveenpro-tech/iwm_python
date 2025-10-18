"use client"

import { motion } from "framer-motion"
import { Bell, Users, Film, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { NotificationFilters, NotificationCounts } from "./types"

interface NotificationFiltersProps {
  filters: NotificationFilters
  onFiltersChange: (filters: NotificationFilters) => void
  notificationCounts: NotificationCounts
}

export function NotificationFilters({ filters, onFiltersChange, notificationCounts }: NotificationFiltersProps) {
  const handleTypeChange = (type: NotificationFilters["type"]) => {
    onFiltersChange({ ...filters, type })
  }

  const handleReadStatusChange = (readStatus: NotificationFilters["readStatus"]) => {
    onFiltersChange({ ...filters, readStatus })
  }

  const handleDateRangeChange = (dateRange: NotificationFilters["dateRange"]) => {
    onFiltersChange({ ...filters, dateRange })
  }

  const resetFilters = () => {
    onFiltersChange({
      type: "all",
      readStatus: "all",
      dateRange: "all",
    })
  }

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  }

  return (
    <motion.div
      className="w-full lg:w-64 bg-[#282828] rounded-lg p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">Filters</h3>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-400 hover:text-white" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      <div className="space-y-6">
        {/* Notification Type Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Notification Type</h4>
          <div className="space-y-2">
            <Button
              variant={filters.type === "all" ? "default" : "outline"}
              size="sm"
              className={`w-full justify-start ${
                filters.type === "all" ? "bg-[#00BFFF] text-[#1A1A1A]" : "border-[#3A3A3A] hover:bg-[#333333]"
              }`}
              onClick={() => handleTypeChange("all")}
            >
              <Bell className="h-4 w-4 mr-2" />
              <span>All Notifications</span>
              <span className="ml-auto bg-[#1A1A1A]/20 px-2 py-0.5 rounded text-xs">{notificationCounts.all}</span>
            </Button>

            <Button
              variant={filters.type === "social" ? "default" : "outline"}
              size="sm"
              className={`w-full justify-start ${
                filters.type === "social" ? "bg-[#00BFFF] text-[#1A1A1A]" : "border-[#3A3A3A] hover:bg-[#333333]"
              }`}
              onClick={() => handleTypeChange("social")}
            >
              <Users className="h-4 w-4 mr-2" />
              <span>Social</span>
              <span className="ml-auto bg-[#1A1A1A]/20 px-2 py-0.5 rounded text-xs">{notificationCounts.social}</span>
            </Button>

            <Button
              variant={filters.type === "release" ? "default" : "outline"}
              size="sm"
              className={`w-full justify-start ${
                filters.type === "release" ? "bg-[#00BFFF] text-[#1A1A1A]" : "border-[#3A3A3A] hover:bg-[#333333]"
              }`}
              onClick={() => handleTypeChange("release")}
            >
              <Film className="h-4 w-4 mr-2" />
              <span>Releases</span>
              <span className="ml-auto bg-[#1A1A1A]/20 px-2 py-0.5 rounded text-xs">{notificationCounts.releases}</span>
            </Button>

            <Button
              variant={filters.type === "system" ? "default" : "outline"}
              size="sm"
              className={`w-full justify-start ${
                filters.type === "system" ? "bg-[#00BFFF] text-[#1A1A1A]" : "border-[#3A3A3A] hover:bg-[#333333]"
              }`}
              onClick={() => handleTypeChange("system")}
            >
              <Bell className="h-4 w-4 mr-2" />
              <span>System</span>
              <span className="ml-auto bg-[#1A1A1A]/20 px-2 py-0.5 rounded text-xs">{notificationCounts.system}</span>
            </Button>

            <Button
              variant={filters.type === "club" ? "default" : "outline"}
              size="sm"
              className={`w-full justify-start ${
                filters.type === "club" ? "bg-[#00BFFF] text-[#1A1A1A]" : "border-[#3A3A3A] hover:bg-[#333333]"
              }`}
              onClick={() => handleTypeChange("club")}
            >
              <Users className="h-4 w-4 mr-2" />
              <span>Clubs</span>
              <span className="ml-auto bg-[#1A1A1A]/20 px-2 py-0.5 rounded text-xs">{notificationCounts.clubs}</span>
            </Button>

            <Button
              variant={filters.type === "quiz" ? "default" : "outline"}
              size="sm"
              className={`w-full justify-start ${
                filters.type === "quiz" ? "bg-[#00BFFF] text-[#1A1A1A]" : "border-[#3A3A3A] hover:bg-[#333333]"
              }`}
              onClick={() => handleTypeChange("quiz")}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              <span>Quizzes</span>
              <span className="ml-auto bg-[#1A1A1A]/20 px-2 py-0.5 rounded text-xs">{notificationCounts.quizzes}</span>
            </Button>
          </div>
        </div>

        <Separator className="bg-[#3A3A3A]" />

        {/* Read Status Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Read Status</h4>
          <RadioGroup
            value={filters.readStatus}
            onValueChange={(value) => handleReadStatusChange(value as NotificationFilters["readStatus"])}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all-status" className="border-[#3A3A3A]" />
              <Label htmlFor="all-status" className="text-gray-300">
                All
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unread" id="unread" className="border-[#3A3A3A]" />
              <Label htmlFor="unread" className="text-gray-300">
                Unread only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="read" id="read" className="border-[#3A3A3A]" />
              <Label htmlFor="read" className="text-gray-300">
                Read only
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Separator className="bg-[#3A3A3A]" />

        {/* Date Range Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Time Period</h4>
          <RadioGroup
            value={filters.dateRange}
            onValueChange={(value) => handleDateRangeChange(value as NotificationFilters["dateRange"])}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all-time" className="border-[#3A3A3A]" />
              <Label htmlFor="all-time" className="text-gray-300">
                All time
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="today" id="today" className="border-[#3A3A3A]" />
              <Label htmlFor="today" className="text-gray-300">
                Today
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="week" id="week" className="border-[#3A3A3A]" />
              <Label htmlFor="week" className="text-gray-300">
                This week
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="month" id="month" className="border-[#3A3A3A]" />
              <Label htmlFor="month" className="text-gray-300">
                This month
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </motion.div>
  )
}
