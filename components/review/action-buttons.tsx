"use client"

import { motion } from "framer-motion"
import { Check, Save, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ActionButtonsProps {
  onSubmit: () => void
  onSaveDraft: () => void
  onCancel: () => void
  isSubmitting: boolean
  canSubmit: boolean
}

export function ActionButtons({ onSubmit, onSaveDraft, onCancel, isSubmitting, canSubmit }: ActionButtonsProps) {
  return (
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

        <motion.div whileHover={canSubmit ? { scale: 1.02 } : {}} whileTap={canSubmit ? { scale: 0.98 } : {}}>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit || isSubmitting}
            className="w-full md:w-auto bg-siddu-electric-blue hover:bg-siddu-electric-blue/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
