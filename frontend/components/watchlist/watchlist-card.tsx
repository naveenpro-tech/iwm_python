"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Clock, AlertCircle, CheckCircle, MoreVertical, Trash2, Edit, Play, Star, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { WatchlistItem, WatchStatus } from "./types"

interface WatchlistCardProps {
  item: WatchlistItem
  isBatchMode: boolean
  isSelected: boolean
  onUpdateStatus: (itemId: string, newStatus: WatchStatus) => void
  onUpdatePriority: (itemId: string, newPriority: "high" | "medium" | "low") => void
  onUpdateProgress: (itemId: string, newProgress: number) => void
  onRemoveItem: (itemId: string) => void
  onToggleSelection: (itemId: string) => void
}

export function WatchlistCard({
  item,
  isBatchMode,
  isSelected,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateProgress,
  onRemoveItem,
  onToggleSelection,
}: WatchlistCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const priorityColors = {
    high: "bg-[#FF4500]",
    medium: "bg-[#FFD700]",
    low: "bg-[#32CD32]",
  }

  const priorityIcons = {
    high: <AlertCircle className="w-3 h-3" />,
    medium: <Clock className="w-3 h-3" />,
    low: <CheckCircle className="w-3 h-3" />,
  }

  const statusLabels = {
    "want-to-watch": "Want to Watch",
    watching: "Watching",
    watched: "Watched",
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const handleProgressUpdate = (value: number) => {
    onUpdateProgress(item.id, value)

    // If progress is 100%, automatically update status to watched
    if (value === 100) {
      onUpdateStatus(item.id, "watched")
    }
  }

  return (
    <motion.div
      className={`bg-[#282828] rounded-lg overflow-hidden ${
        isBatchMode
          ? "ring-2 ring-offset-2 ring-offset-[#1A1A1A] " + (isSelected ? "ring-[#00BFFF]" : "ring-transparent")
          : ""
      }`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative">
        {isBatchMode && (
          <div
            className="absolute top-2 left-2 z-20 bg-[#1A1A1A]/70 rounded-md p-1"
            onClick={() => onToggleSelection(item.id)}
          >
            <Checkbox
              checked={isSelected}
              className="data-[state=checked]:bg-[#00BFFF] data-[state=checked]:text-[#1A1A1A] border-[#A0A0A0]"
            />
          </div>
        )}

        <div
          className="relative aspect-[2/3] overflow-hidden cursor-pointer"
          onClick={() => (isBatchMode ? onToggleSelection(item.id) : null)}
        >
          <Link href={isBatchMode ? "#" : `/movies/${item.id}`} onClick={(e) => isBatchMode && e.preventDefault()}>
            <div className="relative aspect-[2/3] overflow-hidden">
              <Image
                src={item.posterUrl || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />

              {isHovered && !isBatchMode && (
                <motion.div
                  className="absolute inset-0 bg-black/60 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Play className="w-12 h-12 text-white" />
                  </motion.div>
                </motion.div>
              )}
            </div>
          </Link>
        </div>

        {!isBatchMode && (
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors">
                  <MoreVertical className="w-4 h-4 text-white" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#282828] border-[#3A3A3A]">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Status</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-[#282828] border-[#3A3A3A]">
                    {(Object.keys(statusLabels) as WatchStatus[]).map((status) => (
                      <DropdownMenuItem
                        key={status}
                        className={`cursor-pointer ${item.status === status ? "text-[#00BFFF]" : ""}`}
                        onClick={() => onUpdateStatus(item.id, status)}
                      >
                        {statusLabels[status]}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span>Priority</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-[#282828] border-[#3A3A3A]">
                    {(["high", "medium", "low"] as const).map((priority) => (
                      <DropdownMenuItem
                        key={priority}
                        className={`cursor-pointer ${item.priority === priority ? "text-[#00BFFF]" : ""}`}
                        onClick={() => onUpdatePriority(item.id, priority)}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                {item.status === "watching" && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                      <Play className="w-4 h-4 mr-2" />
                      <span>Progress</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="bg-[#282828] border-[#3A3A3A]">
                      {[0, 25, 50, 75, 100].map((progress) => (
                        <DropdownMenuItem
                          key={progress}
                          className={`cursor-pointer ${item.progress === progress ? "text-[#00BFFF]" : ""}`}
                          onClick={() => handleProgressUpdate(progress)}
                        >
                          {progress}%
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}

                <DropdownMenuSeparator className="bg-[#3A3A3A]" />

                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <Edit className="w-4 h-4" />
                  <span>Edit Notes</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="flex items-center gap-2 text-[#FF4500] cursor-pointer"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {!isBatchMode && (
          <div className="absolute top-2 left-2 z-10">
            <Badge
              variant="outline"
              className={`${priorityColors[item.priority as keyof typeof priorityColors]} text-white border-0 flex items-center gap-1`}
            >
              {priorityIcons[item.priority as keyof typeof priorityIcons]}
              {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-[#E0E0E0] line-clamp-1">{item.title}</h3>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center text-xs text-[#A0A0A0]">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(item.releaseDate).getFullYear()}
          </div>

          <div className="flex items-center text-xs text-[#FFD700]">
            <Star className="w-3 h-3 mr-1 fill-[#FFD700]" />
            {item.rating.toFixed(1)}
          </div>
        </div>

        <p className="text-xs text-[#A0A0A0] mt-1">Added {formatDate(item.dateAdded)}</p>

        {item.status === "watching" && item.progress !== undefined && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{item.progress}%</span>
            </div>
            <Progress value={item.progress} className="h-1.5 bg-[#3A3A3A]" indicatorClassName="bg-[#00BFFF]" />
          </div>
        )}
      </div>
    </motion.div>
  )
}
