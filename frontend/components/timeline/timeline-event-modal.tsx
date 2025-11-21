"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, ExternalLink, LinkIcon, Tag, Info, Film, ImageIcon } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { TimelineEventData } from "./types"

interface TimelineEventModalProps {
  event: TimelineEventData | null
  onClose: () => void
}

export function TimelineEventModal({ event, onClose }: TimelineEventModalProps) {
  if (!event) return null

  const categoryStyles: Record<TimelineEventData["category"], string> = {
    development: "bg-purple-500 text-purple-50",
    production: "bg-blue-500 text-blue-50",
    "post-production": "bg-indigo-500 text-indigo-50",
    marketing: "bg-pink-500 text-pink-50",
    release: "bg-green-500 text-green-50",
    reception: "bg-teal-500 text-teal-50",
    award: "bg-yellow-500 text-yellow-900", // Darker text for yellow
  }
  const categoryStyle = categoryStyles[event.category] || "bg-gray-500 text-gray-50"

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Section */}
          <div className="relative">
            {(event.image || event.videoEmbed) && (
              <div className="relative h-56 sm:h-72 w-full rounded-t-xl overflow-hidden bg-black">
                {event.videoEmbed && (
                  <iframe
                    src={
                      event.videoEmbed.includes("youtube.com/embed")
                        ? event.videoEmbed
                        : `https://www.youtube.com/embed/${event.videoEmbed}`
                    }
                    title={`${event.title} video`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                )}
                {!event.videoEmbed && event.image && (
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C] via-transparent to-transparent"></div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </Button>
            <div
              className={`absolute bottom-0 left-0 right-0 p-4 pt-10 bg-gradient-to-t from-[#1C1C1C] to-transparent`}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white shadow-text">{event.title}</h2>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-5 sm:p-6 overflow-y-auto scrollbar-hide flex-grow">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-[#00BFFF]">
                <Calendar className="h-4 w-4" />
                <span>{event.formattedDate}</span>
              </div>
              <Badge className={`${categoryStyle} text-xs font-medium capitalize`}>
                {event.category.replace("-", " ")}
              </Badge>
              {event.significance && event.significance !== "minor" && (
                <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-400 capitalize">
                  {event.significance.replace("-", " ")}
                </Badge>
              )}
            </div>

            <p className="text-gray-300 leading-relaxed mb-5">{event.details || event.description}</p>

            {event.media && event.media.length > 0 && (
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-[#00BFFF]" />
                  Media Gallery
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {event.media.map((item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-md overflow-hidden aspect-video relative group bg-[#2A2A2A]"
                    >
                      {item.type === "image" ? (
                        <Image
                          src={item.url || "/placeholder.svg"}
                          alt={item.caption || event.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-10 h-10 text-gray-500" />
                        </div>
                      )}
                      {item.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-black/60 text-white text-xs truncate group-hover:opacity-100 opacity-0 transition-opacity">
                          {item.caption}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {event.sourceCitations && event.sourceCitations.length > 0 && (
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-[#00BFFF]" />
                  Source Citations
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                  {event.sourceCitations.map((citation, index) => (
                    <li key={index}>
                      {citation.url ? (
                        <a
                          href={citation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#00BFFF] hover:underline"
                        >
                          {citation.text} <ExternalLink className="inline h-3 w-3 ml-0.5" />
                        </a>
                      ) : (
                        citation.text
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {event.relatedLinks && event.relatedLinks.length > 0 && (
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                  <LinkIcon className="w-5 h-5 mr-2 text-[#00BFFF]" />
                  Related Links
                </h3>
                <div className="space-y-1.5">
                  {event.relatedLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-[#00BFFF] hover:underline hover:text-[#00DFFF]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {event.tags && event.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-[#00BFFF]" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-[#2A2A2A] text-[#A0A0A0] border-[#3A3A3A] text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
