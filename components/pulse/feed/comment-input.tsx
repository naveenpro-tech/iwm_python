'use client'

/**
 * Comment Input Component
 * Mini composer for comments
 */

import { useState } from 'react'
import { Send } from 'lucide-react'

interface CommentInputProps {
  onSubmit: (content: string) => void
}

export default function CommentInput({ onSubmit }: CommentInputProps) {
  const [content, setContent] = useState('')

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content)
      setContent('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex gap-3">
      <img
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser"
        alt="Your avatar"
        className="w-8 h-8 rounded-full flex-shrink-0"
      />

      <div className="flex-1 flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Write a comment..."
          className="flex-1 px-4 py-2 bg-[#3A3A3A] border border-[#3A3A3A] rounded-lg text-[#E0E0E0] placeholder:text-[#A0A0A0] outline-none focus:border-[#00BFFF] transition-colors"
        />

        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="px-4 py-2 bg-gradient-to-r from-[#00BFFF] to-[#0080FF] text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:shadow-lg hover:shadow-[#00BFFF]/20"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}

