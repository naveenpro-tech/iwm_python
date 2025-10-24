"use client"

import { motion } from "framer-motion"
import { Clock, AlertTriangle } from "lucide-react"
import { useState } from "react"

interface CriticMediaSectionProps {
  youtubeVideoId: string | null
  writtenContent: string
  images: { url: string; caption: string }[]
  spoilerWarning: boolean
  tags: string[]
}

export function CriticMediaSection({
  youtubeVideoId,
  writtenContent,
  images,
  spoilerWarning,
  tags,
}: CriticMediaSectionProps) {
  const [showSpoilers, setShowSpoilers] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Calculate reading time (average 200 words per minute)
  const wordCount = writtenContent.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  return (
    <div className="space-y-8">
      {/* Tags & Reading Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
          <Clock className="w-4 h-4" />
          <span>{readingTime} min read</span>
        </div>
        <div className="w-px h-4 bg-[#3A3A3A]" />
        {tags.map((tag, index) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 + index * 0.1, duration: 0.3 }}
            className="px-3 py-1 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded-full text-xs text-[#00BFFF] hover:bg-[#00BFFF]/20 transition-colors cursor-pointer"
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>

      {/* Spoiler Warning */}
      {spoilerWarning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-4 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#FFD700] mb-1">Spoiler Warning</p>
            <p className="text-sm text-[#E0E0E0]">
              This review contains spoilers. Spoiler sections are clearly marked below.
            </p>
          </div>
        </motion.div>
      )}

      {/* YouTube Video */}
      {youtubeVideoId && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="relative aspect-video rounded-xl overflow-hidden border border-[#3A3A3A] bg-[#0A0A0A]"
        >
          <iframe
            src={`https://www.youtube.com/embed/${youtubeVideoId}`}
            title="Critic Review Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            loading="lazy"
          />
        </motion.div>
      )}

      {/* Written Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="prose prose-invert prose-lg max-w-none"
        style={{
          "--tw-prose-body": "#E0E0E0",
          "--tw-prose-headings": "#FFFFFF",
          "--tw-prose-links": "#00BFFF",
          "--tw-prose-bold": "#FFFFFF",
          "--tw-prose-quotes": "#A0A0A0",
          "--tw-prose-quote-borders": "#00BFFF",
        } as React.CSSProperties}
      >
        <div
          dangerouslySetInnerHTML={{ __html: writtenContent }}
          className="font-dmsans leading-relaxed"
        />
      </motion.div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.6 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold font-inter text-[#E0E0E0]">Gallery</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.2 + index * 0.1, duration: 0.4 }}
                className="group relative aspect-video rounded-lg overflow-hidden border border-[#3A3A3A] cursor-pointer hover:border-[#00BFFF] transition-colors"
                onClick={() => setSelectedImage(image.url)}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundImage: `url(${image.url})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-sm text-[#E0E0E0] opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.caption}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            src={selectedImage}
            alt="Gallery image"
            className="max-w-full max-h-full rounded-lg"
          />
        </motion.div>
      )}
    </div>
  )
}

