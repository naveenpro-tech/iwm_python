"use client"

import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ReviewMetadataProps {
  containsSpoilers: boolean
  onSpoilerToggle: (value: boolean) => void
  isVerified: boolean
  movieId: string
}

export function ReviewMetadata({ containsSpoilers, onSpoilerToggle, isVerified, movieId }: ReviewMetadataProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-siddu-bg-card-dark rounded-lg">
      <div className="flex items-center gap-3">
        <Switch id="spoiler-toggle" checked={containsSpoilers} onCheckedChange={onSpoilerToggle} />
        <label htmlFor="spoiler-toggle" className="flex items-center gap-2 cursor-pointer">
          <AlertTriangle className="w-4 h-4 text-siddu-accent-yellow" />
          <span className="text-sm font-medium text-siddu-text-light">This review contains spoilers</span>
        </label>
      </div>

      <div>
        {isVerified ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Verified Reviewer</span>
          </motion.div>
        ) : (
          <Link href={`/movies/${movieId}/review/verification`}>
            <Button variant="ghost" size="sm" className="text-siddu-electric-blue">
              <Info className="w-4 h-4 mr-2" />
              Take Verification Quiz
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
