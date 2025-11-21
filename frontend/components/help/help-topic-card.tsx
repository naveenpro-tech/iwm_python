"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FileText, Clock } from "lucide-react"
import type { HelpTopic } from "./types"
import { formatDate } from "@/lib/utils"

export interface HelpTopicCardProps {
  topic: HelpTopic
}

export function HelpTopicCard({ topic }: HelpTopicCardProps) {
  return (
    <Link href={`/help/topic/${topic.id}`}>
      <motion.div
        whileHover={{ y: -3 }}
        className="bg-[#1A1A1A] border border-[#333] hover:border-[#00BFFF] rounded-lg p-4 transition-colors"
      >
        <div className="flex items-center mb-2">
          <FileText size={16} className="text-[#00BFFF] mr-2" />
          <h3 className="text-lg font-medium text-white">{topic.title}</h3>
        </div>

        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{topic.content.substring(0, 120)}...</p>

        <div className="flex items-center text-gray-400 text-xs">
          <Clock size={12} className="mr-1" />
          <span>Updated {formatDate(topic.lastUpdated, { year: "numeric", month: "short", day: "numeric" })}</span>
        </div>
      </motion.div>
    </Link>
  )
}
