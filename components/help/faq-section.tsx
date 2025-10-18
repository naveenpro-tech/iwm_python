"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from "lucide-react"
import type { HelpCategory } from "./types"

interface FAQSectionProps {
  category: HelpCategory
}

export default function FAQSection({ category }: FAQSectionProps) {
  const [expandedFAQs, setExpandedFAQs] = useState<string[]>([])
  const [helpfulFAQs, setHelpfulFAQs] = useState<string[]>([])
  const [unhelpfulFAQs, setUnhelpfulFAQs] = useState<string[]>([])

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQs((prev) => (prev.includes(faqId) ? prev.filter((id) => id !== faqId) : [...prev, faqId]))
  }

  const markHelpful = (faqId: string) => {
    if (!helpfulFAQs.includes(faqId)) {
      setHelpfulFAQs((prev) => [...prev, faqId])
      setUnhelpfulFAQs((prev) => prev.filter((id) => id !== faqId))
    }
  }

  const markUnhelpful = (faqId: string) => {
    if (!unhelpfulFAQs.includes(faqId)) {
      setUnhelpfulFAQs((prev) => [...prev, faqId])
      setHelpfulFAQs((prev) => prev.filter((id) => id !== faqId))
    }
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {category.faqs.map((faq) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#282828] rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(faq.id)}
              className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
            >
              <span className="text-lg font-medium text-white">{faq.question}</span>
              {expandedFAQs.includes(faq.id) ? (
                <ChevronUp className="text-[#A0A0A0]" size={20} />
              ) : (
                <ChevronDown className="text-[#A0A0A0]" size={20} />
              )}
            </button>

            <AnimatePresence>
              {expandedFAQs.includes(faq.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 pt-0 border-t border-[#444] text-[#E0E0E0]">
                    <div className="prose prose-invert max-w-none">
                      <p>{faq.answer}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                      <span className="text-sm text-[#A0A0A0] mr-4">Was this helpful?</span>
                      <button
                        onClick={() => markHelpful(faq.id)}
                        className={`p-2 rounded-full mr-2 ${helpfulFAQs.includes(faq.id) ? "bg-green-900 text-green-400" : "hover:bg-[#333] text-[#A0A0A0]"}`}
                      >
                        <ThumbsUp size={16} />
                      </button>
                      <button
                        onClick={() => markUnhelpful(faq.id)}
                        className={`p-2 rounded-full ${unhelpfulFAQs.includes(faq.id) ? "bg-red-900 text-red-400" : "hover:bg-[#333] text-[#A0A0A0]"}`}
                      >
                        <ThumbsDown size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
