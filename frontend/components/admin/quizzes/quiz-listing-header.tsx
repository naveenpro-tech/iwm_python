"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Grid3X3, List, Plus, Download, Upload, MoreVertical } from "lucide-react"
import { JsonImportDialog } from "../movies/json-import-dialog"
import { JsonExportDialog } from "../movies/json-export-dialog"

interface QuizListingHeaderProps {
  viewMode: "table" | "grid"
  onViewModeChange: (mode: "table" | "grid") => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function QuizListingHeader({ viewMode, onViewModeChange, searchQuery, onSearchChange }: QuizListingHeaderProps) {
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-1 gap-2 w-full md:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search quizzes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-r-none"
              onClick={() => onViewModeChange("table")}
            >
              <List size={20} />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-l-none"
              onClick={() => onViewModeChange("grid")}
            >
              <Grid3X3 size={20} />
            </Button>
          </div>

          <Button variant="default" className="gap-2">
            <Plus size={20} />
            Create Quiz
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowImportDialog(true)}>
                <Upload size={16} className="mr-2" />
                Import Quiz (JSON)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowExportDialog(true)}>
                <Download size={16} className="mr-2" />
                Export Quizzes (JSON)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <JsonImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} type="quizzes" />
      <JsonExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} type="quizzes" />
    </>
  )
}
