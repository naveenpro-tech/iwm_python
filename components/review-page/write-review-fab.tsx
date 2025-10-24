"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Pencil, LogIn, Edit, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { WriteReviewFABProps } from "@/types/review-page"

export default function WriteReviewFAB({
  movieId,
  isLoggedIn,
  hasReviewed,
  requiresQuiz,
}: WriteReviewFABProps) {
  const router = useRouter()
  const [isPulsing, setIsPulsing] = useState(true)

  const getButtonConfig = () => {
    if (!isLoggedIn) {
      return {
        label: "Write a Review",
        icon: LogIn,
        onClick: () => router.push("/login"),
        color: "bg-gradient-to-r from-[#00BFFF] to-[#0080FF]",
      }
    }

    if (requiresQuiz) {
      return {
        label: "Take Quiz to Review",
        icon: HelpCircle,
        onClick: () => router.push(`/movies/${movieId}/quiz`),
        color: "bg-gradient-to-r from-[#F59E0B] to-[#D97706]",
      }
    }

    if (hasReviewed) {
      return {
        label: "Edit Your Review",
        icon: Edit,
        onClick: () => router.push(`/movies/${movieId}/review/edit`),
        color: "bg-gradient-to-r from-[#10B981] to-[#059669]",
      }
    }

    return {
      label: "Write Your Review",
      icon: Pencil,
      onClick: () => router.push(`/movies/${movieId}/review/create`),
      color: "bg-gradient-to-r from-[#00BFFF] to-[#0080FF]",
    }
  }

  const config = getButtonConfig()
  const Icon = config.icon

  return (
    <>
      {/* Desktop FAB (Bottom Right) */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 1.2 }}
        className="hidden md:block fixed bottom-8 right-8 z-50"
      >
        <Button
          onClick={config.onClick}
          onMouseEnter={() => setIsPulsing(false)}
          onMouseLeave={() => setIsPulsing(true)}
          className={`${config.color} text-white font-semibold px-6 py-6 rounded-full shadow-lg hover:shadow-2xl transition-all duration-200 hover:scale-105 flex items-center gap-2`}
        >
          <Icon className="w-5 h-5" />
          <span>{config.label}</span>
        </Button>

        {/* Pulse Animation */}
        {isPulsing && (
          <motion.div
            className={`absolute inset-0 ${config.color} rounded-full opacity-75`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.75, 0, 0.75],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>

      {/* Mobile FAB (Sticky Bottom) */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 1.2 }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-[#1A1A1A] to-transparent"
      >
        <Button
          onClick={config.onClick}
          className={`${config.color} text-white font-semibold w-full py-6 rounded-lg shadow-lg flex items-center justify-center gap-2`}
        >
          <Icon className="w-5 h-5" />
          <span>{config.label}</span>
        </Button>
      </motion.div>
    </>
  )
}

