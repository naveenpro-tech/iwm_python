"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Trash2, CalendarDays } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { ReleaseDateInfo } from "@/components/admin/movies/types"
import { STREAMING_REGIONS, RELEASE_TYPES } from "@/components/admin/movies/types" // Assuming RELEASE_TYPES is defined
import { useToast } from "@/hooks/use-toast"

interface UpdateReleaseDateModalProps {
  isOpen: boolean
  onClose: () => void
  movieId: string
  initialDates: ReleaseDateInfo[]
  onSave: (movieId: string, updatedDates: ReleaseDateInfo[]) => Promise<void>
}

const emptyDateInfo: Omit<ReleaseDateInfo, "id"> & { id?: string } = {
  // Allow id to be optional for new entries
  region: STREAMING_REGIONS[0]?.code || "US",
  date: new Date().toISOString().split("T")[0], // Default to today
  type: RELEASE_TYPES[0] || "Theatrical",
}

export function UpdateReleaseDateModal({
  isOpen,
  onClose,
  movieId,
  initialDates,
  onSave,
}: UpdateReleaseDateModalProps) {
  const [dates, setDates] = useState<ReleaseDateInfo[]>([])
  const [editingDate, setEditingDate] = useState<(Partial<ReleaseDateInfo> & { tempId?: string }) | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      // Ensure each date has a unique ID for list rendering, if not already present
      setDates(
        JSON.parse(JSON.stringify(initialDates)).map((d: ReleaseDateInfo, i: number) => ({
          ...d,
          // Use existing ID or generate one if missing (e.g. for newly added items not yet saved)
          id: d.id || `temp-date-${Date.now()}-${i}`,
        })),
      )
      setEditingDate(null)
      setIsAdding(false)
    }
  }, [isOpen, initialDates])

  const handleInputChange = (field: keyof ReleaseDateInfo, value: any) => {
    if (editingDate) {
      setEditingDate({ ...editingDate, [field]: value })
    }
  }

  const handleSaveDateEntry = () => {
    if (!editingDate || !editingDate.date || !editingDate.region || !editingDate.type) {
      toast({ title: "Error", description: "Region, Date, and Type are required.", variant: "destructive" })
      return
    }

    const finalDateEntry: ReleaseDateInfo = {
      // Use existing ID if editing, or tempId if adding new, or generate new if both are missing
      id: editingDate.id || editingDate.tempId || `date-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      region: editingDate.region!,
      date: editingDate.date!,
      type: editingDate.type!,
    }

    let newDatesList
    if (editingDate.id && !isAdding) {
      // Editing existing
      newDatesList = dates.map((d) => (d.id === editingDate!.id ? finalDateEntry : d))
    } else {
      // Adding new
      newDatesList = [...dates, finalDateEntry]
    }
    setDates(newDatesList)
    setEditingDate(null)
    setIsAdding(false)
  }

  const handleDeleteDateEntry = (idToDelete: string) => {
    setDates(dates.filter((d) => d.id !== idToDelete))
  }

  const startEdit = (dateEntry: ReleaseDateInfo) => {
    setEditingDate({ ...dateEntry })
    setIsAdding(false)
  }

  const startAdd = () => {
    setEditingDate({ ...emptyDateInfo, tempId: `new-date-${Date.now()}` })
    setIsAdding(true)
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      // Remove temporary IDs before saving if they exist
      const datesToSave = dates.map(({ tempId, ...rest }) => rest)
      await onSave(movieId, datesToSave as ReleaseDateInfo[])
      toast({ title: "Success", description: "Release dates updated." })
      onClose()
    } catch (error) {
      toast({ title: "Error", description: "Failed to save release dates.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const renderDateForm = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="p-4 border rounded-lg space-y-4 mb-4 bg-muted/30"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label htmlFor="date-region">Region</Label>
          <Select value={editingDate?.region} onValueChange={(val) => handleInputChange("region", val)}>
            <SelectTrigger id="date-region">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STREAMING_REGIONS.map((r) => (
                <SelectItem key={r.code} value={r.code}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="date-value">Date</Label>
          <Input
            id="date-value"
            type="date"
            value={editingDate?.date || ""}
            onChange={(e) => handleInputChange("date", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="date-type">Type</Label>
          <Select
            value={editingDate?.type}
            onValueChange={(val: ReleaseDateInfo["type"]) => handleInputChange("type", val)}
          >
            <SelectTrigger id="date-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RELEASE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="ghost"
          onClick={() => {
            setEditingDate(null)
            setIsAdding(false)
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSaveDateEntry}>Save Date Entry</Button>
      </div>
    </motion.div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Update Release Dates</DialogTitle>
          <DialogDescription>Manage regional and type-specific release dates for this movie.</DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh]">
          <ScrollArea className="h-full pr-3">
            <div className="space-y-3">
              <AnimatePresence>
                {(isAdding || editingDate) && !isAdding && editingDate && renderDateForm()}
              </AnimatePresence>

              {dates.map((dateEntry) => (
                <motion.div
                  key={dateEntry.id || dateEntry.tempId} // Use tempId as fallback key for new items
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3 border rounded-md bg-card flex items-center justify-between gap-2"
                >
                  {editingDate?.id === dateEntry.id && !isAdding ? (
                    renderDateForm()
                  ) : (
                    <>
                      <div className="flex-grow flex items-center gap-3">
                        <CalendarDays className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                          <span className="font-semibold">
                            {new Date(dateEntry.date).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {STREAMING_REGIONS.find((r) => r.code === dateEntry.region)?.name || dateEntry.region} -{" "}
                            {dateEntry.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(dateEntry)}>
                          <Plus size={14} className="transform rotate-45" /> {/* Edit icon replacement */}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleDeleteDateEntry(dateEntry.id || dateEntry.tempId!)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
              <AnimatePresence>{isAdding && editingDate && renderDateForm()}</AnimatePresence>
            </div>

            {!editingDate && !isAdding && (
              <Button variant="outline" onClick={startAdd} className="mt-4 w-full gap-2">
                <Plus size={16} /> Add New Release Date
              </Button>
            )}
          </ScrollArea>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSaving}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSaveChanges} disabled={isSaving || !!editingDate}>
            {isSaving ? "Saving..." : "Save All Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
