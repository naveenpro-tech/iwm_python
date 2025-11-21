"use client"

import { motion } from "framer-motion"
import { Clock, Tag, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { HelpTopic } from "./types"
import { formatDate } from "@/lib/utils"

export interface HelpTopicContentProps {
  topic: HelpTopic
}

export function HelpTopicContent({ topic }: HelpTopicContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
    >
      <Link href="/help" className="inline-flex items-center text-[#00BFFF] hover:underline mb-4">
        <ArrowLeft size={16} className="mr-1" />
        Back to Help Center
      </Link>

      <h1 className="text-3xl font-bold text-white mb-4">{topic.title}</h1>

      <div className="flex items-center text-gray-400 text-sm mb-6">
        <div className="flex items-center mr-4">
          <Clock size={14} className="mr-1" />
          <span>Updated {formatDate(topic.lastUpdated)}</span>
        </div>
        <div className="flex items-center">
          <Tag size={14} className="mr-1" />
          <span>{topic.category}</span>
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: topic.content }} />
      </div>

      {topic.relatedTopics && topic.relatedTopics.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[#333]">
          <h3 className="text-xl font-bold text-white mb-4">Related Topics</h3>
          <ul className="space-y-2">
            {topic.relatedTopics.map((relatedTopic, index) => (
              <li key={index}>
                <Link href={`/help/topic/${relatedTopic}`} className="text-[#00BFFF] hover:underline">
                  {relatedTopic}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  )
}
