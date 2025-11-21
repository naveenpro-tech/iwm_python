"use client"

import { motion } from "framer-motion"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
  showRetry?: boolean
}

export function ErrorState({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  showRetry = true 
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 md:py-20 px-4"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
        <div className="relative bg-[#282828] rounded-full p-6">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
      </div>

      <h3 className="text-lg md:text-xl font-semibold text-[#E0E0E0] mb-2 text-center">
        Oops! Something went wrong
      </h3>

      <p className="text-sm md:text-base text-[#A0A0A0] text-center max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      {showRetry && onRetry && (
        <Button 
          onClick={onRetry} 
          className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white"
          size="lg"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

