"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Upload, Loader2, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  exportMovieCategory,
  exportAllCategories,
  downloadJSON,
  downloadZIP,
  getCategoryDisplayName,
  type CategoryType,
} from "@/lib/api/movie-export-import"

interface CategoryExportImportButtonsProps {
  movieId: string
  category: CategoryType
  onImportClick: () => void
  showBulkExport?: boolean
}

export function CategoryExportImportButtons({
  movieId,
  category,
  onImportClick,
  showBulkExport = false,
}: CategoryExportImportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingAll, setIsExportingAll] = useState(false)
  const { toast } = useToast()

  const handleExportCategory = async () => {
    setIsExporting(true)
    try {
      const data = await exportMovieCategory(movieId, category)
      downloadJSON(data)
      toast({
        title: "Export Successful",
        description: `${getCategoryDisplayName(category)} data exported successfully`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description:
          error instanceof Error ? error.message : "Failed to export category",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportAll = async () => {
    setIsExportingAll(true)
    try {
      const blob = await exportAllCategories(movieId)
      downloadZIP(blob, `${movieId}-export.zip`)
      toast({
        title: "Bulk Export Successful",
        description: "All categories exported as ZIP file",
      })
    } catch (error) {
      toast({
        title: "Bulk Export Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to export all categories",
        variant: "destructive",
      })
    } finally {
      setIsExportingAll(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportCategory}
        disabled={isExporting}
        className="gap-2"
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Export {getCategoryDisplayName(category)} JSON
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onImportClick}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        Import {getCategoryDisplayName(category)} JSON
      </Button>

      {showBulkExport && (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExportAll}
          disabled={isExportingAll}
          className="gap-2"
        >
          {isExportingAll ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Package className="h-4 w-4" />
          )}
          Export All Categories (ZIP)
        </Button>
      )}
    </div>
  )
}

