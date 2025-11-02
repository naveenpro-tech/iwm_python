"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
  PencilIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  StarIcon, 
  XIcon,
  StarOffIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"

// ============================================================================
// Type Definitions
// ============================================================================

export interface BulkActionToolbarProps {
  selectedCount: number
  onBulkUpdate: () => void
  onBulkPublish: () => void
  onBulkUnpublish: () => void
  onBulkFeature: () => void
  onBulkUnfeature: () => void
  onClearSelection: () => void
}

// ============================================================================
// Component
// ============================================================================

export function BulkActionToolbar({
  selectedCount,
  onBulkUpdate,
  onBulkPublish,
  onBulkUnpublish,
  onBulkFeature,
  onBulkUnfeature,
  onClearSelection,
}: BulkActionToolbarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-background border border-border rounded-lg shadow-2xl p-4 min-w-[600px] max-w-4xl">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Selected Count */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {selectedCount}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {selectedCount === 1 ? "1 movie selected" : `${selectedCount} movies selected`}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBulkUpdate}
                  className="gap-2"
                  aria-label="Bulk update selected movies"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Bulk Update</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBulkPublish}
                  className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                  aria-label="Publish selected movies"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Publish</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBulkUnpublish}
                  className="gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950"
                  aria-label="Unpublish selected movies"
                >
                  <XCircleIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Unpublish</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBulkFeature}
                  className="gap-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-950"
                  aria-label="Feature selected movies"
                >
                  <StarIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Feature</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBulkUnfeature}
                  className="gap-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-950"
                  aria-label="Unfeature selected movies"
                >
                  <StarOffIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Unfeature</span>
                </Button>

                <div className="h-6 w-px bg-border mx-1" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearSelection}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear selection"
                >
                  <XIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Clear</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

