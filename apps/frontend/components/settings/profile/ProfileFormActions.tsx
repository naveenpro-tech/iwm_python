"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfileFormActionsProps {
  isSubmitting?: boolean
  isDirty?: boolean
  onCancel?: () => void
  className?: string
}

/**
 * Profile form action buttons (Save/Cancel)
 */
export const ProfileFormActions = React.forwardRef<HTMLDivElement, ProfileFormActionsProps>(
  ({ isSubmitting = false, isDirty = false, onCancel, className }, ref) => {
    return (
      <div ref={ref} className={cn("flex gap-3", className)}>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="bg-sky-600 hover:bg-sky-500 text-white gap-2"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    )
  }
)

ProfileFormActions.displayName = "ProfileFormActions"

