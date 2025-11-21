"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Trash2, Clock, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Notification } from "./types"
import Link from "next/link"
import Image from "next/image"

interface NotificationsListProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

export function NotificationsList({ notifications, onMarkAsRead, onDelete }: NotificationsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)

    // Mark as read when expanded
    if (expandedId !== id) {
      const notification = notifications.find((n) => n.id === id)
      if (notification && !notification.isRead) {
        onMarkAsRead(id)
      }
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffTime / (1000 * 60))

    if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "social":
        return <Users className="h-5 w-5 text-blue-400" />
      case "release":
        return <Film className="h-5 w-5 text-purple-400" />
      case "system":
        return <Bell className="h-5 w-5 text-yellow-400" />
      case "club":
        return <Users className="h-5 w-5 text-green-400" />
      case "quiz":
        return <BookOpen className="h-5 w-5 text-pink-400" />
      default:
        return <Bell className="h-5 w-5 text-gray-400" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "social":
        return <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">Social</Badge>
      case "release":
        return <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">Release</Badge>
      case "system":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">System</Badge>
      case "club":
        return <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">Club</Badge>
      case "quiz":
        return <Badge className="bg-pink-500/20 text-pink-400 border border-pink-500/30">Quiz</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border border-gray-500/30">{type}</Badge>
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
  }

  return (
    <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className={`bg-[#282828] rounded-lg overflow-hidden ${!notification.isRead ? "border-l-4 border-[#00BFFF]" : ""}`}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
          >
            <div
              className={`p-4 cursor-pointer transition-colors ${expandedId === notification.id ? "bg-[#2A2A2A]" : "hover:bg-[#2A2A2A]"}`}
              onClick={() => toggleExpand(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{getTypeIcon(notification.type)}</div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-medium ${!notification.isRead ? "text-white" : "text-gray-300"}`}>
                      {notification.title}
                    </h3>
                    {getTypeBadge(notification.type)}
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{notification.message}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>{formatTimestamp(notification.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {expandedId === notification.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Separator className="bg-[#3A3A3A]" />
                  <div className="p-4 bg-[#2A2A2A]">
                    {notification.metadata && (
                      <div className="mb-4">
                        {notification.metadata.moviePoster && (
                          <div className="flex items-center gap-3 mb-3">
                            <div className="relative w-16 h-24 rounded overflow-hidden">
                              <Image
                                src={notification.metadata.moviePoster || "/placeholder.svg"}
                                alt={notification.metadata.movieTitle || "Movie poster"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{notification.metadata.movieTitle}</h4>
                              <p className="text-sm text-gray-400">Related to this film</p>
                            </div>
                          </div>
                        )}

                        {notification.metadata.userAvatar && (
                          <div className="flex items-center gap-3 mb-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                              <Image
                                src={notification.metadata.userAvatar || "/placeholder.svg"}
                                alt={notification.metadata.userName || "User avatar"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{notification.metadata.userName}</h4>
                              <p className="text-sm text-gray-400">User profile</p>
                            </div>
                          </div>
                        )}

                        {notification.metadata.clubName && (
                          <div className="flex items-center gap-2 mb-3">
                            <Users className="h-5 w-5 text-green-400" />
                            <span className="text-gray-300">{notification.metadata.clubName}</span>
                          </div>
                        )}

                        {notification.metadata.quizTitle && (
                          <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="h-5 w-5 text-pink-400" />
                            <span className="text-gray-300">{notification.metadata.quizTitle}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        {notification.actionUrl && (
                          <Link href={notification.actionUrl}>
                            <Button size="sm" className="bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A]">
                              View Details
                            </Button>
                          </Link>
                        )}
                        {!notification.isRead && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#3A3A3A] hover:bg-[#333333]"
                            onClick={(e) => {
                              e.stopPropagation()
                              onMarkAsRead(notification.id)
                            }}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Mark as Read
                          </Button>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(notification.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {notifications.length > 10 && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" className="border-[#3A3A3A] hover:bg-[#333333]">
            Load More
          </Button>
        </div>
      )}
    </motion.div>
  )
}

// Import these icons to fix the missing imports
function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function Film(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18" />
      <line x1="7" x2="7" y1="2" y2="22" />
      <line x1="17" x2="17" y1="2" y2="22" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <line x1="2" x2="7" y1="7" y2="7" />
      <line x1="2" x2="7" y1="17" y2="17" />
      <line x1="17" x2="22" y1="17" y2="17" />
      <line x1="17" x2="22" y1="7" y2="7" />
    </svg>
  )
}

function BookOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}
