'use client'

/**
 * Media Preview Grid Component
 * Shows uploaded media with remove buttons
 */

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { PulseMedia } from '@/types/pulse'

interface MediaPreviewGridProps {
  media: PulseMedia[]
  onRemove: (mediaId: string) => void
}

export default function MediaPreviewGrid({
  media,
  onRemove,
}: MediaPreviewGridProps) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-2',
    4: 'grid-cols-2',
  }[media.length] || 'grid-cols-2'

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`grid ${gridClass} gap-2`}
    >
      {media.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: index * 0.05 }}
          className="relative group rounded-lg overflow-hidden aspect-video bg-[#3A3A3A]"
        >
          {/* Image */}
          <img
            src={item.thumbnail_url || item.url}
            alt={item.alt_text || 'Media preview'}
            className="w-full h-full object-cover"
          />

          {/* Remove Button */}
          <button
            onClick={() => onRemove(item.id)}
            className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black/90 rounded-full transition-colors opacity-0 group-hover:opacity-100"
          >
            <X size={16} className="text-white" />
          </button>
        </motion.div>
      ))}
    </motion.div>
  )
}

