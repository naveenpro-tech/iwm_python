"use client"

import { motion } from "framer-motion"
import { Clock, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RecentHeaderProps {
  totalItems: number
  onClearHistory: () => void
  isClearing: boolean
}

export function RecentHeader({ totalItems, onClearHistory, isClearing }: RecentHeaderProps) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#1A1A1A] rounded-lg">
            <Clock className="w-6 h-6 text-[#00BFFF]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#E0E0E0] font-inter">Recently Viewed</h1>
            <p className="text-[#A0A0A0] font-dmsans mt-1">
              {totalItems > 0
                ? `${totalItems} item${totalItems !== 1 ? "s" : ""} in your history`
                : "No items in your history"}
            </p>
          </div>
        </div>

        {totalItems > 0 && (
          <Button
            onClick={onClearHistory}
            disabled={isClearing}
            variant="outline"
            className="border-[#282828] hover:bg-[#282828] text-[#E0E0E0]"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isClearing ? "Clearing..." : "Clear History"}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
