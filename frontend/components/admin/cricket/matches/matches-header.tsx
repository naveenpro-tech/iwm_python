"use client"

import { Button } from "@/components/ui/button"
import { Plus, Upload, Download } from "lucide-react"
import { useState } from "react"
import { JsonImportDialog } from "./json-import-dialog"
import { JsonExportDialog } from "./json-export-dialog"

export function MatchesHeader() {
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cricket Matches</h1>
        <p className="text-muted-foreground">Manage all cricket matches, scores, and details</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => setShowImportDialog(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" onClick={() => setShowExportDialog(true)}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button asChild>
          <a href="/admin/cricket/matches/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Match
          </a>
        </Button>
      </div>

      <JsonImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} />

      <JsonExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} />
    </div>
  )
}
