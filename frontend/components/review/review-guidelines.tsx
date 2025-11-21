"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, CheckCircle, AlertCircle, Users, Star, Shield, MessageSquare } from "lucide-react"

export function ReviewGuidelines() {
  const [isExpanded, setIsExpanded] = useState(false)

  const guidelines = [
    {
      icon: CheckCircle,
      text: "Focus on the film's merits rather than personal attacks",
      color: "text-green-400",
    },
    {
      icon: Star,
      text: "Support opinions with specific examples from the film",
      color: "text-siddu-accent-yellow",
    },
    {
      icon: AlertCircle,
      text: "Consider technical aspects (direction, acting, cinematography)",
      color: "text-siddu-electric-blue",
    },
    {
      icon: Shield,
      text: "Mark spoilers appropriately to respect other viewers",
      color: "text-orange-400",
    },
    {
      icon: Users,
      text: "Keep language appropriate for all audiences",
      color: "text-purple-400",
    },
    {
      icon: MessageSquare,
      text: "Be constructive and respectful in your criticism",
      color: "text-pink-400",
    },
  ]

  return (
    <div className="border border-siddu-border-subtle rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-siddu-bg-card-dark hover:bg-siddu-bg-card-dark/80 transition-colors flex items-center justify-between"
      >
        <span className="text-sm font-medium text-siddu-text-light">Review Guidelines</span>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-siddu-text-subtle" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3 bg-siddu-bg-card">
              {guidelines.map((guideline, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <guideline.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${guideline.color}`} />
                  <p className="text-sm text-siddu-text-subtle">{guideline.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
