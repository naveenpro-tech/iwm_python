'use client'

/**
 * More Menu Component
 * Dropdown menu with options
 */

import { useState } from 'react'
import { MoreHorizontal, Link2, Flag, VolumeX, Ban } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MoreMenuProps {
  postId: string
  authorId: string
}

export default function MoreMenu({ postId, authorId }: MoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/pulse/${postId}`)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-[#3A3A3A] rounded-full transition-colors"
      >
        <MoreHorizontal size={20} className="text-[#A0A0A0]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute right-0 top-full mt-2 z-20 bg-[#282828] border border-[#3A3A3A] rounded-lg shadow-lg overflow-hidden min-w-[200px]"
            >
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#3A3A3A] transition-colors text-left"
              >
                <Link2 size={18} className="text-[#A0A0A0]" />
                <span className="text-[#E0E0E0]">Copy link</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#3A3A3A] transition-colors text-left"
              >
                <Flag size={18} className="text-[#A0A0A0]" />
                <span className="text-[#E0E0E0]">Report pulse</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#3A3A3A] transition-colors text-left"
              >
                <VolumeX size={18} className="text-[#A0A0A0]" />
                <span className="text-[#E0E0E0]">Mute @{authorId}</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#3A3A3A] transition-colors text-left text-[#EF4444]"
              >
                <Ban size={18} />
                <span>Block @{authorId}</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

