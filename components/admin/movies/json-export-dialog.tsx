"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Download } from "lucide-react"
import type { Movie } from "@/types"

interface JsonExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "movies" | "quizzes" | "lists"
  allMovies: Movie[]
  filteredMovies: Movie[]
  selectedMovieIds: string[]
}

export function JsonExportDialog({
  open,
  onOpenChange,
  type,
  allMovies,
  filteredMovies,
  selectedMovieIds,
}: JsonExportDialogProps) {
  const [exportOptions, setExportOptions] = useState({
    scope: "all",
    includeMetadata: true,
    includeRelations: true,
    prettify: true,
  })

  const handleExport = () => {
    let dataToExport: Movie[] = []
    if (exportOptions.scope === "all") dataToExport = allMovies
    else if (exportOptions.scope === "filtered") dataToExport = filteredMovies
    else if (exportOptions.scope === "selected") dataToExport = allMovies.filter((m) => selectedMovieIds.includes(m.id))

    const processedData = dataToExport.map((movie) => {
      const newMovie = { ...movie }
      if (!exportOptions.includeMetadata) {
        delete newMovie.createdAt
        delete newMovie.updatedAt
      }
      if (!exportOptions.includeRelations) {
        delete newMovie.cast
        delete newMovie.crew
        delete newMovie.awards
        delete newMovie.streamingLinks
      }
      return newMovie
    })

    // Simulate export
    const data = {
      exportDate: new Date().toISOString(),
      type,
      count: processedData.length,
      data: processedData,
    }

    const jsonString = exportOptions.prettify ? JSON.stringify(data, null, 2) : JSON.stringify(data)

    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type}-export-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export {type.charAt(0).toUpperCase() + type.slice(1)} to JSON</DialogTitle>
          <DialogDescription>Configure your export options and download the data as a JSON file.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Export Scope</Label>
            <RadioGroup
              value={exportOptions.scope}
              onValueChange={(value) => setExportOptions({ ...exportOptions, scope: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="font-normal">
                  All {type} ({allMovies.length} items)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="filtered" id="filtered" />
                <Label htmlFor="filtered" className="font-normal">
                  Currently filtered {type} ({filteredMovies.length} items)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="selected" id="selected" />
                <Label htmlFor="selected" className="font-normal">
                  Selected {type} only ({selectedMovieIds.length} items)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Export Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metadata"
                  checked={exportOptions.includeMetadata}
                  onCheckedChange={(checked) =>
                    setExportOptions({ ...exportOptions, includeMetadata: checked as boolean })
                  }
                />
                <Label htmlFor="metadata" className="font-normal">
                  Include metadata (created date, last modified, etc.)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="relations"
                  checked={exportOptions.includeRelations}
                  onCheckedChange={(checked) =>
                    setExportOptions({ ...exportOptions, includeRelations: checked as boolean })
                  }
                />
                <Label htmlFor="relations" className="font-normal">
                  Include related data (cast, crew, reviews, etc.)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prettify"
                  checked={exportOptions.prettify}
                  onCheckedChange={(checked) => setExportOptions({ ...exportOptions, prettify: checked as boolean })}
                />
                <Label htmlFor="prettify" className="font-normal">
                  Pretty print JSON (larger file size)
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} className="gap-2">
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
