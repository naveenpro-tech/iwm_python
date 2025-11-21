"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { CheckCircle, Archive, Trash2, XCircle, EyeOff } from "lucide-react"

interface MovieBatchActionsToolbarProps {
  selectedCount: number
  onPublish: () => void
  onUnpublish: () => void
  onArchive: () => void
  onDelete: () => void
  onClearSelection: () => void
}

export function MovieBatchActionsToolbar({
  selectedCount,
  onPublish,
  onUnpublish,
  onArchive,
  onDelete,
  onClearSelection,
}: MovieBatchActionsToolbarProps) {
  if (selectedCount === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="sticky top-[60px] z-40 bg-background/95 backdrop-blur-sm border-b shadow-sm p-3 rounded-lg mb-4"
    >
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-primary">
            {selectedCount} movie{selectedCount > 1 ? "s" : ""} selected
          </span>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="ghost" size="sm" onClick={onClearSelection} className="text-sm">
            <XCircle className="mr-2 h-4 w-4" />
            Clear Selection
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPublish} className="text-sm">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Publish
          </Button>
          <Button variant="outline" size="sm" onClick={onUnpublish} className="text-sm">
            <EyeOff className="mr-2 h-4 w-4 text-orange-500" />
            Unpublish
          </Button>
          <Button variant="outline" size="sm" onClick={onArchive} className="text-sm">
            <Archive className="mr-2 h-4 w-4 text-blue-500" />
            Archive
          </Button>
          <Button variant="destructive-outline" size="sm" onClick={onDelete} className="text-sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
