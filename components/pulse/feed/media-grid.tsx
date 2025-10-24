'use client'

/**
 * Media Grid Component
 * Displays 1-4 images or video in responsive grid
 */

import { PulseMedia } from '@/types/pulse'
import { Play } from 'lucide-react'

interface MediaGridProps {
  media: PulseMedia[]
}

export default function MediaGrid({ media }: MediaGridProps) {
  if (media.length === 0) return null

  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-2',
    4: 'grid-cols-2',
  }[media.length] || 'grid-cols-2'

  return (
    <div className={`grid ${gridClass} gap-2 rounded-lg overflow-hidden`}>
      {media.map((item, index) => (
        <div
          key={item.id}
          className={`relative bg-[#3A3A3A] ${
            media.length === 3 && index === 0 ? 'row-span-2' : 'aspect-video'
          } ${media.length === 1 ? 'aspect-video' : ''}`}
        >
          {item.type === 'video' ? (
            <>
              <img
                src={item.thumbnail_url || item.url}
                alt={item.alt_text || 'Video thumbnail'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                  <Play size={24} className="text-black ml-1" fill="black" />
                </div>
              </div>
              {item.duration && (
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-white text-xs font-medium">
                  {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, '0')}
                </div>
              )}
            </>
          ) : (
            <img
              src={item.url}
              alt={item.alt_text || 'Image'}
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
            />
          )}
        </div>
      ))}
    </div>
  )
}

