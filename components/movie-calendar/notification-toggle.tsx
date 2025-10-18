"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell } from "lucide-react"

interface NotificationToggleProps {
  movieId: string
}

export function NotificationToggle({ movieId }: NotificationToggleProps) {
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleToggle = () => {
    setIsSubscribed(!isSubscribed)

    // In a real app, this would call an API to subscribe/unsubscribe
    console.log(`${isSubscribed ? "Unsubscribed from" : "Subscribed to"} notifications for movie ${movieId}`)
  }

  return (
    <motion.button
      className={`
        p-1.5 rounded-full transition-colors
        ${isSubscribed ? "text-[#00BFFF] bg-[#00BFFF]/10" : "text-[#A0A0A0] hover:text-[#E0E0E0] hover:bg-[#3A3A3A]"}
      `}
      onClick={handleToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isSubscribed ? "Unsubscribe from notifications" : "Subscribe to notifications"}
      aria-pressed={isSubscribed}
    >
      <Bell className={`w-4 h-4 ${isSubscribed ? "fill-current" : ""}`} />

      {/* Bell ring animation when subscribed */}
      {isSubscribed && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#00BFFF]"
          initial={{ scale: 0.8, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.button>
  )
}
