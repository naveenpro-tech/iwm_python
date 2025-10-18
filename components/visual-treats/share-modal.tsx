"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Link2, Twitter, Facebook, Download, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { VisualTreat } from "./types"

interface ShareModalProps {
  treat: VisualTreat
  isOpen: boolean
  onClose: () => void
}

export function ShareModal({ treat, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `https://siddu.app/visual-treats/${treat.id}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    // In a real app, this would download the high-res image
    const link = document.createElement("a")
    link.href = treat.image
    link.download = `${treat.title.replace(/\s+/g, "-").toLowerCase()}.jpg`
    link.click()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-[#282828] rounded-lg p-6 max-w-md w-full"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold mb-4">Share Visual Treat</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Share link</p>
                <div className="flex gap-2">
                  <Input value={shareUrl} readOnly className="bg-[#1A1A1A] border-gray-700" />
                  <Button variant="outline" size="icon" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Share on social</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out this visual treat from ${treat.movie}!`)}`,
                      )
                    }
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)
                    }
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                </div>
              </div>

              <Button className="w-full bg-[#00BFFF] hover:bg-[#0099CC]" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download High Resolution
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
