"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show the prompt banner
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    // We no longer need the prompt regardless of outcome
    setDeferredPrompt(null)
    setShowPrompt(false)

    // Optionally log or handle the outcome
    console.log(`User ${outcome} the A2HS prompt`)
  }

  const dismissPrompt = () => {
    setShowPrompt(false)
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-80 bg-[#282828] rounded-lg shadow-lg z-50"
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 p-2 bg-[#00BFFF] rounded-full mr-3">
                <Download className="text-white" size={20} />
              </div>

              <div className="flex-1">
                <h3 className="text-white font-medium">Add Siddu to Home Screen</h3>
                <p className="text-[#E0E0E0] text-sm mt-1">
                  Install Siddu for a better experience with offline access and faster loading.
                </p>

                <div className="mt-3 flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={dismissPrompt}
                    className="text-[#A0A0A0] hover:text-white hover:bg-[#333]"
                  >
                    Not Now
                  </Button>

                  <Button size="sm" onClick={handleInstall} className="bg-[#00BFFF] hover:bg-[#00A0E0] text-white">
                    Install
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
