"use client"

import { motion } from "framer-motion"
import { CheckCircle, AlertCircle, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { WatchStatus } from "./types"

interface BatchActionsBarProps {
  selectedCount: number
  onUpdateStatus: (status: WatchStatus) => void
  onUpdatePriority: (priority: "high" | "medium" | "low") => void
  onRemove: () => void
  onCancel: () => void
}

export function BatchActionsBar({
  selectedCount,
  onUpdateStatus,
  onUpdatePriority,
  onRemove,
  onCancel,
}: BatchActionsBarProps) {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-[#282828] border-t border-[#3A3A3A] p-4 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 500 }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-[#E0E0E0] font-medium">{selectedCount} items selected</span>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-[#3A3A3A] bg-[#1A1A1A]">
                <CheckCircle className="mr-2 h-4 w-4" />
                Set Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#282828] border-[#3A3A3A]">
              <DropdownMenuItem
                className="cursor-pointer flex items-center text-[#00BFFF]"
                onClick={() => onUpdateStatus("want-to-watch")}
              >
                <span className="w-3 h-3 rounded-full bg-[#00BFFF] mr-2"></span>
                Want to Watch
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center text-[#FFD700]"
                onClick={() => onUpdateStatus("watching")}
              >
                <span className="w-3 h-3 rounded-full bg-[#FFD700] mr-2"></span>
                Watching
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center text-[#32CD32]"
                onClick={() => onUpdateStatus("watched")}
              >
                <span className="w-3 h-3 rounded-full bg-[#32CD32] mr-2"></span>
                Watched
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-[#3A3A3A] bg-[#1A1A1A]">
                <AlertCircle className="mr-2 h-4 w-4" />
                Set Priority
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#282828] border-[#3A3A3A]">
              <DropdownMenuItem
                className="cursor-pointer flex items-center text-[#FF4500]"
                onClick={() => onUpdatePriority("high")}
              >
                <span className="w-3 h-3 rounded-full bg-[#FF4500] mr-2"></span>
                High
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center text-[#FFD700]"
                onClick={() => onUpdatePriority("medium")}
              >
                <span className="w-3 h-3 rounded-full bg-[#FFD700] mr-2"></span>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center text-[#32CD32]"
                onClick={() => onUpdatePriority("low")}
              >
                <span className="w-3 h-3 rounded-full bg-[#32CD32] mr-2"></span>
                Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="destructive" className="bg-[#FF4500] hover:bg-[#FF4500]/90" onClick={onRemove}>
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>

          <Button variant="ghost" className="text-[#A0A0A0]" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
