"use client"

import { motion } from "framer-motion"
import { Bell, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { NotificationFilters } from "./types"

interface EmptyStateProps {
  filters: NotificationFilters
}

export function EmptyState({ filters }: EmptyStateProps) {
  const getMessage = () => {
    if (filters.type !== "all") {
      return `No ${filters.type} notifications found.`
    }

    if (filters.readStatus === "unread") {
      return "No unread notifications found."
    }

    if (filters.readStatus === "read") {
      return "No read notifications found."
    }

    if (filters.dateRange !== "all") {
      const period = filters.dateRange === "today" ? "today" : filters.dateRange === "week" ? "this week" : "this month"
      return `No notifications found for ${period}.`
    }

    return "No notifications found."
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 bg-[#282828] rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-[#333333] p-4 rounded-full mb-4">
        <Bell className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium mb-2">No Notifications</h3>
      <p className="text-gray-400 text-center mb-6 max-w-md">{getMessage()}</p>
      <Button
        variant="outline"
        className="border-[#3A3A3A] hover:bg-[#333333]"
        onClick={() => window.location.reload()}
      >
        <AlertCircle className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </motion.div>
  )
}
