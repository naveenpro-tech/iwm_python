"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { NotificationsHeader } from "@/components/notifications/notifications-header"
import { NotificationFilters } from "@/components/notifications/notification-filters"
import { NotificationsList } from "@/components/notifications/notifications-list"
import { EmptyState } from "@/components/notifications/empty-state"
import { mockNotifications } from "@/components/notifications/mock-data"

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [notifications, setNotifications] = useState(mockNotifications)

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true
    return notification.type === activeFilter
  })

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  return (
    <motion.div
      className="min-h-screen bg-[#1A1A1A] text-white pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <NotificationsHeader unreadCount={notifications.filter((n) => !n.read).length} onMarkAllRead={markAllAsRead} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <NotificationFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

          <div className="flex-1">
            {filteredNotifications.length > 0 ? (
              <NotificationsList
                notifications={filteredNotifications}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ) : (
              <EmptyState filter={activeFilter} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
