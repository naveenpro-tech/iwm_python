"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, AlertCircle, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  publishDraftCategory,
  discardDraftCategory,
  getDraftStatus,
  getCategoryDisplayName,
  type CategoryType,
} from "@/lib/api/movie-export-import"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DraftPublishControlsProps {
  movieId: string
  category: CategoryType
  onPublishSuccess?: () => void
}

export function DraftPublishControls({
  movieId,
  category,
  onPublishSuccess,
}: DraftPublishControlsProps) {
  const [draftStatus, setDraftStatus] = useState<{
    status: "draft" | "published"
    has_draft: boolean
    has_published: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isDiscarding, setIsDiscarding] = useState(false)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const { toast } = useToast()

  // Load draft status on mount
  useEffect(() => {
    loadDraftStatus()
  }, [movieId, category])

  const loadDraftStatus = async () => {
    try {
      setIsLoading(true)
      const response = await getDraftStatus(movieId)
      const categoryStatus = response.draft_status[category]
      if (categoryStatus) {
        setDraftStatus(categoryStatus)
      }
    } catch (error) {
      console.error("Failed to load draft status:", error)
      // Don't show error toast, just silently fail
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!draftStatus?.has_draft) {
      toast({
        title: "No Draft",
        description: `No draft ${getCategoryDisplayName(category)} to publish`,
        variant: "destructive",
      })
      return
    }

    setIsPublishing(true)
    try {
      const response = await publishDraftCategory(movieId, category)
      toast({
        title: "Published Successfully",
        description: response.message,
      })
      await loadDraftStatus()
      if (onPublishSuccess) {
        onPublishSuccess()
      }
    } catch (error) {
      toast({
        title: "Publish Failed",
        description:
          error instanceof Error ? error.message : "Failed to publish draft",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const handleDiscard = async () => {
    if (!draftStatus?.has_draft) {
      toast({
        title: "No Draft",
        description: `No draft ${getCategoryDisplayName(category)} to discard`,
        variant: "destructive",
      })
      return
    }

    setIsDiscarding(true)
    try {
      const response = await discardDraftCategory(movieId, category)
      toast({
        title: "Draft Discarded",
        description: response.message,
      })
      await loadDraftStatus()
    } catch (error) {
      toast({
        title: "Discard Failed",
        description:
          error instanceof Error ? error.message : "Failed to discard draft",
        variant: "destructive",
      })
    } finally {
      setIsDiscarding(false)
      setShowDiscardDialog(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading status...</span>
      </div>
    )
  }

  if (!draftStatus) {
    return null
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Status:</span>
        {draftStatus.has_draft && (
          <Badge variant="secondary" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Draft Available
          </Badge>
        )}
        {draftStatus.has_published && (
          <Badge variant="default" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Published
          </Badge>
        )}
        {!draftStatus.has_draft && !draftStatus.has_published && (
          <Badge variant="outline">No Data</Badge>
        )}
      </div>

      {/* Publish/Discard Buttons */}
      {draftStatus.has_draft && (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handlePublish}
            disabled={isPublishing}
            className="gap-2"
          >
            {isPublishing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Publish Draft
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowDiscardDialog(true)}
            disabled={isDiscarding}
            className="gap-2"
          >
            {isDiscarding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Discard Draft
          </Button>
        </div>
      )}

      {/* Discard Confirmation Dialog */}
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Draft?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to discard the draft {getCategoryDisplayName(category)}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDiscard}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

