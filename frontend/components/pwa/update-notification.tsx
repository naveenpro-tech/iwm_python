"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UpdateNotification() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)

  useEffect(() => {
    // This is a simplified example. In a real app, you would check for service worker updates
    // and show the notification when a new version is available.
    const checkForUpdates = () => {
      // Simulate checking for updates after some time
      setTimeout(() => {
        setShowUpdatePrompt(true)
      }, 60000) // Show after 1 minute for demo purposes
    }

    checkForUpdates()
  }, [])

  const handleUpdate = () => {
    // In a real app, this would trigger the service worker to update and reload the page
    window.location.reload()
  }

  const dismissPrompt = () => {
    setShowUpdatePrompt(false)
  }

  return (
    <AnimatePresence>
      {showUpdatePrompt && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-[#282828] rounded-lg shadow-lg z-50"
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-[#00BFFF] rounded-full mr-3">
                <RefreshCw className="text-white" size={20} />
              </div>

              <div className="flex-1">
                <h3 className="text-white font-medium">Update Available</h3>
                <p className="text-[#E0E0E0] text-sm mt-1">
                  A new version of Siddu is available. Refresh to get the latest features and improvements.
                </p>

                <div className="mt-3 flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={dismissPrompt}
                    className="text-[#A0A0A0] hover:text-white hover:bg-[#333]"
                  >
                    Later
                  </Button>

                  <Button size="sm" onClick={handleUpdate} className="bg-[#00BFFF] hover:bg-[#00A0E0] text-white">
                    Update Now
                  </Button>
                </div>
              </div>

              <button onClick={dismissPrompt} className="ml-2 text-[#A0A0A0] hover:text-white">
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
