"use client"

import { motion } from "framer-motion"
import { Check, Save, X, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ActionButtonsProps {
  onSubmit: () => void
  onSaveDraft: () => void
  onCancel: () => void
  isSubmitting: boolean
  canSubmit: boolean
  rating?: number
  reviewLength?: number
}

export function ActionButtons({ onSubmit, onSaveDraft, onCancel, isSubmitting, canSubmit, rating = 0, reviewLength = 0 }: ActionButtonsProps) {
  const getDisabledReason = () => {
    if (rating === 0 && reviewLength < 50) {
      return "Please add a rating and write at least 50 characters"
    }
    if (rating === 0) {
      return "Please select a rating (1-10 stars)"
    }
    if (reviewLength < 50) {
      return `Please write at least ${50 - reviewLength} more characters (${reviewLength}/50)`
    }
    return ""
  }

  return (
    <div className="space-y-3">
      {/* Validation Message */}
      {!canSubmit && !isSubmitting && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-500">Review Requirements</p>
            <p className="text-xs text-amber-500/80 mt-1">{getDisabledReason()}</p>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col-reverse md:flex-row gap-3 md:justify-between pt-6 border-t border-siddu-border-subtle">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting} className="w-full md:w-auto">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>

        <div className="flex flex-col md:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={canSubmit ? { scale: 1.02 } : {}} whileTap={canSubmit ? { scale: 0.98 } : {}}>
                  <Button
                    type="button"
                    onClick={onSubmit}
                    disabled={!canSubmit || isSubmitting}
                    className="w-full md:w-auto bg-siddu-electric-blue hover:bg-siddu-electric-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Publish Review
                      </>
                    )}
                  </Button>
                </motion.div>
              </TooltipTrigger>
              {!canSubmit && !isSubmitting && (
                <TooltipContent>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{getDisabledReason()}</span>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
