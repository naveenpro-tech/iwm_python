"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Clock, AlertCircle, CheckCircle, MoreVertical, Trash2, Edit, Play, Star, Calendar, User } from "lucide-react"
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

interface WatchlistListItemProps {
  item: WatchlistItem
  isBatchMode: boolean
  isSelected: boolean
  onUpdateStatus: (itemId: string, newStatus: WatchStatus) => void
  onUpdatePriority: (itemId: string, newPriority: "high" | "medium" | "low") => void
  onUpdateProgress: (itemId: string, newProgress: number) => void
  onRemoveItem: (itemId: string) => void
  onToggleSelection: (itemId: string) => void
}

export function WatchlistListItem({
  item,
  isBatchMode,
  isSelected,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateProgress,
  onRemoveItem,
  onToggleSelection,
}: WatchlistListItemProps) {
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

  const formatRuntime = (minutes: number | undefined) => {
    if (!minutes) return "N/A"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
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
      onClick={() => (isBatchMode ? onToggleSelection(item.id) : null)}
    >
      <div className="flex">
        {isBatchMode && (
          <div className="flex items-center justify-center pl-3">
            <Checkbox
              checked={isSelected}
              className="data-[state=checked]:bg-[#00BFFF] data-[state=checked]:text-[#1A1A1A] border-[#A0A0A0]"
              onCheckedChange={() => onToggleSelection(item.id)}
            />
          </div>
        )}

        <Link
          href={isBatchMode ? "#" : `/movies/${item.id}`}
          className="shrink-0"
          onClick={(e) => isBatchMode && e.preventDefault()}
        >
          <div className="relative h-24 w-16 sm:h-32 sm:w-20 md:h-36 md:w-24">
            <Image
              src={item.posterUrl || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
            />
          </div>
        </Link>

        <div className="flex-1 p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <Link href={isBatchMode ? "#" : `/movies/${item.id}`} onClick={(e) => isBatchMode && e.preventDefault()}>
                <h3 className="font-semibold text-[#E0E0E0] hover:text-[#00BFFF] transition-colors">{item.title}</h3>
              </Link>

              <Badge
                variant="outline"
                className={`${priorityColors[item.priority as keyof typeof priorityColors]} text-white border-0 flex items-center gap-1`}
              >
                {priorityIcons[item.priority as keyof typeof priorityIcons]}
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-[#A0A0A0]">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(item.releaseDate).getFullYear()}
              </div>

              <div className="flex items-center">
                <Star className="w-3 h-3 mr-1 fill-[#FFD700] text-[#FFD700]" />
                {item.rating.toFixed(1)}
              </div>

              {item.runtime && (
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatRuntime(item.runtime)}
                </div>
              )}

              {item.director && (
                <div className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  {item.director}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {item.genres.slice(0, 3).map((genre) => (
                <Badge key={genre} variant="secondary" className="bg-[#1A1A1A] text-[#A0A0A0] hover:bg-[#3A3A3A]">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-[#A0A0A0]">Added {formatDate(item.dateAdded)}</div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-[#1A1A1A] border-[#3A3A3A]">
                {statusLabels[item.status as keyof typeof statusLabels]}
              </Badge>

              {!isBatchMode && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-full hover:bg-[#3A3A3A] transition-colors">
                      <MoreVertical className="w-4 h-4 text-[#E0E0E0]" />
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
              )}
            </div>
          </div>

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
      </div>
    </motion.div>
  )
}
