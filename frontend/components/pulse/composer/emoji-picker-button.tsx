'use client'

/**
 * Emoji Picker Button Component
 * Simple emoji picker with common emojis
 */

import { useState } from 'react'
import { Smile } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface EmojiPickerButtonProps {
  onEmojiSelect: (emoji: string) => void
}

const COMMON_EMOJIS = [
  '😀', '😂', '😍', '🥰', '😎', '🤔', '😢', '😭',
  '👍', '👏', '🙌', '❤️', '🔥', '✨', '🎬', '🏏',
  '🎉', '🎊', '🎯', '💯', '⭐', '🌟', '💪', '🙏',
]

export default function EmojiPickerButton({ onEmojiSelect }: EmojiPickerButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-lg text-[#00BFFF] hover:bg-[#00BFFF]/10 transition-colors"
        title="Add emoji"
      >
        <Smile size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Emoji Picker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute bottom-full left-0 mb-2 z-20 bg-[#282828] border border-[#3A3A3A] rounded-lg p-3 shadow-lg"
            >
              <div className="grid grid-cols-8 gap-2 w-64">
                {COMMON_EMOJIS.map((emoji) => (
                  <motion.button
                    key={emoji}
                    onClick={() => handleEmojiClick(emoji)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-2xl hover:bg-[#3A3A3A] rounded p-1 transition-colors"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

