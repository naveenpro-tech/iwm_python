'use client'

/**
 * Echo Button Component
 * Rotation animation + modal for echo/quote echo
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Repeat2, X } from 'lucide-react'

interface EchoButtonProps {
  isEchoed: boolean
  echoCount: number
  onEcho: (type: 'echo' | 'quote_echo', quoteContent?: string) => void
}

export default function EchoButton({ isEchoed, echoCount, onEcho }: EchoButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [quoteContent, setQuoteContent] = useState('')

  const handleEcho = () => {
    onEcho('echo')
    setIsModalOpen(false)
  }

  const handleQuoteEcho = () => {
    if (quoteContent.trim()) {
      onEcho('quote_echo', quoteContent)
      setQuoteContent('')
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        whileTap={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 group"
      >
        <Repeat2
          size={20}
          className={`transition-colors ${
            isEchoed ? 'text-[#00BFFF]' : 'text-[#A0A0A0] group-hover:text-[#00BFFF]'
          }`}
        />
        <span className={`text-sm font-medium ${isEchoed ? 'text-[#00BFFF]' : 'text-[#A0A0A0]'}`}>
          {echoCount}
        </span>
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#282828] border border-[#3A3A3A] rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#E0E0E0]">Echo this pulse?</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-[#3A3A3A] rounded">
                  <X size={20} className="text-[#A0A0A0]" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleEcho}
                  className="w-full p-3 bg-[#3A3A3A] hover:bg-[#4A4A4A] rounded-lg text-left transition-colors"
                >
                  <div className="font-semibold text-[#E0E0E0]">Echo</div>
                  <div className="text-sm text-[#A0A0A0]">Share to your followers</div>
                </button>

                <div className="border-t border-[#3A3A3A] pt-3">
                  <textarea
                    value={quoteContent}
                    onChange={(e) => setQuoteContent(e.target.value)}
                    placeholder="Add your thoughts..."
                    className="w-full p-3 bg-[#3A3A3A] border border-[#3A3A3A] rounded-lg text-[#E0E0E0] placeholder:text-[#A0A0A0] resize-none outline-none focus:border-[#00BFFF] transition-colors"
                    rows={3}
                  />
                  <button
                    onClick={handleQuoteEcho}
                    disabled={!quoteContent.trim()}
                    className="mt-2 w-full py-2 bg-gradient-to-r from-[#00BFFF] to-[#0080FF] text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Quote Echo
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

