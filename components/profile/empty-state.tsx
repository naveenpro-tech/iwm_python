"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center bg-[#282828] rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#3A3A3A] mb-4 text-[#A0A0A0]">
        {icon}
      </div>
      <h3 className="text-xl font-inter font-medium text-[#E0E0E0] mb-2">{title}</h3>
      <p className="text-[#A0A0A0] font-dmsans max-w-md mb-6">{description}</p>

      {actionLabel && onAction && (
        <Button className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD]" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}
