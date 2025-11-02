"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2Icon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { bulkUpdateMovies } from "@/lib/api/admin-curation"

// ============================================================================
// Type Definitions
// ============================================================================

export interface MovieListItem {
  id: number
  title: string
  year: number | null
  curation_status: string
  quality_score: number | null
  is_featured: boolean
}

export interface BulkUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  selectedMovieIds: number[]
  selectedMovies: MovieListItem[]
  onSuccess: () => void
}

// ============================================================================
// Form Schema
// ============================================================================

const bulkUpdateSchema = z.object({
  curation_status: z.enum(["draft", "pending_review", "approved", "rejected"]).optional(),
  quality_score: z.number().min(0).max(100).optional(),
  curator_notes: z.string().max(500).optional(),
})

type BulkUpdateFormValues = z.infer<typeof bulkUpdateSchema>

// ============================================================================
// Component
// ============================================================================

export function BulkUpdateModal({
  isOpen,
  onClose,
  selectedMovieIds,
  selectedMovies,
  onSuccess,
}: BulkUpdateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BulkUpdateFormValues>({
    resolver: zodResolver(bulkUpdateSchema),
    defaultValues: {
      curation_status: undefined,
      quality_score: undefined,
      curator_notes: "",
    },
  })

  const handleSubmit = async (values: BulkUpdateFormValues) => {
    // Filter out undefined values to only update fields that were set
    const curationData: Record<string, any> = {}
    if (values.curation_status !== undefined) {
      curationData.curation_status = values.curation_status
    }
    if (values.quality_score !== undefined) {
      curationData.quality_score = values.quality_score
    }
    if (values.curator_notes && values.curator_notes.trim()) {
      curationData.curator_notes = values.curator_notes.trim()
    }

    // Validate that at least one field is being updated
    if (Object.keys(curationData).length === 0) {
      toast.error("Please select at least one field to update")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await bulkUpdateMovies({
        movie_ids: selectedMovieIds,
        curation_data: curationData,
      })

      if (response.success_count > 0) {
        toast.success(response.message, {
          description: response.failure_count > 0 
            ? `${response.failure_count} movie(s) failed to update`
            : undefined,
        })
      }

      if (response.failure_count > 0 && response.success_count === 0) {
        toast.error("Failed to update movies", {
          description: `${response.failure_count} movie(s) could not be updated`,
        })
      }

      // Reset form and close modal
      form.reset()
      onClose()
      onSuccess()
    } catch (error) {
      toast.error("Failed to update movies", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset()
      onClose()
    }
  }

  // Preview movies (first 5)
  const previewMovies = selectedMovies.slice(0, 5)
  const hasMoreMovies = selectedMovies.length > 5

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Update Movies</DialogTitle>
          <DialogDescription>
            Update curation fields for {selectedMovieIds.length} selected movie{selectedMovieIds.length !== 1 ? "s" : ""}.
            Only fields you fill will be updated.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Preview Section */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h4 className="text-sm font-medium mb-3">Selected Movies Preview</h4>
              <div className="space-y-2">
                {previewMovies.map((movie) => (
                  <div key={movie.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {movie.title} {movie.year && `(${movie.year})`}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {movie.curation_status || "No status"}
                    </span>
                  </div>
                ))}
                {hasMoreMovies && (
                  <p className="text-xs text-muted-foreground italic">
                    ...and {selectedMovies.length - 5} more
                  </p>
                )}
              </div>
            </div>

            {/* Curation Status Field */}
            <FormField
              control={form.control}
              name="curation_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curation Status (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status (leave empty to skip)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending_review">Pending Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Set the curation status for all selected movies
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quality Score Field */}
            <FormField
              control={form.control}
              name="quality_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quality Score (Optional)</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={field.value !== undefined ? [field.value] : [0]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">0</span>
                        <span className="font-semibold text-primary">
                          {field.value !== undefined ? field.value : "Not set"}
                        </span>
                        <span className="text-muted-foreground">100</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Set the quality score (0-100) for all selected movies
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Curator Notes Field */}
            <FormField
              control={form.control}
              name="curator_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curator Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add notes about this curation action..."
                      className="resize-none"
                      rows={4}
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/500 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Updating..." : `Update ${selectedMovieIds.length} Movie${selectedMovieIds.length !== 1 ? "s" : ""}`}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

