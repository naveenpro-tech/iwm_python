'use client'

/**
 * Media Upload Button Component
 * Mock file upload button (no actual file handling)
 */

import { Image } from 'lucide-react'
import { motion } from 'framer-motion'
import { PulseMedia } from '@/types/pulse'

interface MediaUploadButtonProps {
  onMediaAdd: (media: PulseMedia[]) => void
  disabled?: boolean
}

export default function MediaUploadButton({
  onMediaAdd,
  disabled = false,
}: MediaUploadButtonProps) {
  const handleClick = () => {
    if (disabled) return

    // Mock media upload - generate random image
    const mockMedia: PulseMedia = {
      id: `media-${Date.now()}`,
      type: 'image',
      url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=800`,
      thumbnail_url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=400`,
      width: 1920,
      height: 1080,
      alt_text: 'Uploaded image',
    }

    onMediaAdd([mockMedia])
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`p-2 rounded-lg transition-colors ${
        disabled
          ? 'text-[#3A3A3A] cursor-not-allowed'
          : 'text-[#00BFFF] hover:bg-[#00BFFF]/10'
      }`}
      title="Add media"
    >
      <Image size={20} />
    </motion.button>
  )
}

