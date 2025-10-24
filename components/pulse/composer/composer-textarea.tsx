'use client'

/**
 * Composer Textarea Component
 * Auto-resizing textarea that expands on focus
 */

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface ComposerTextareaProps {
  value: string
  onChange: (value: string) => void
  isExpanded: boolean
  onFocus: () => void
  placeholder: string
}

export default function ComposerTextarea({
  value,
  onChange,
  isExpanded,
  onFocus,
  placeholder,
}: ComposerTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  return (
    <motion.textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      placeholder={placeholder}
      className="w-full bg-transparent text-[#E0E0E0] placeholder:text-[#A0A0A0] resize-none outline-none font-['DM_Sans'] text-base leading-relaxed"
      style={{
        minHeight: isExpanded ? '120px' : '60px',
        maxHeight: '240px',
      }}
      animate={{
        minHeight: isExpanded ? 120 : 60,
      }}
      transition={{ duration: 0.3 }}
    />
  )
}

