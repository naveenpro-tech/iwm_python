"use client"

import { motion } from "framer-motion"
import { Bell, CheckCheck, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface NotificationsHeaderProps {
  unreadCount: number
  onMarkAllRead: () => void
}

export function NotificationsHeader({ unreadCount, onMarkAllRead }: NotificationsHeaderProps) {
  return (
    <div className="border-b border-gray-700 bg-[#1A1A1A]/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative p-2 bg-[#00BFFF]/20 rounded-lg">
              <Bell className="h-6 w-6 text-[#00BFFF]" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-gray-400 text-sm">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : "You're all caught up!"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Button variant="outline" onClick={onMarkAllRead} className="border-gray-700">
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all read
                </Button>
              </motion.div>
            )}

            <Link href="/settings?tab=notifications">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
