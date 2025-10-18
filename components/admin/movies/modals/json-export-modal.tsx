"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface JsonExportModalProps {
  isOpen: boolean
  onClose: () => void
  movieCount: number
}

export function JsonExportModal({ isOpen, onClose, movieCount }: JsonExportModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    try {
      setIsLoading(true)
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
      const res = await fetch(`${apiBase}/api/v1/movies`)
      
      if (!res.ok) throw new Error("Failed to fetch movies")
      const data = await res.json()
      
      // Export as JSON file
      const jsonStr = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonStr], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `movies-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast({ title: "Export Successful", description: `Exported ${data.length} movies` })
      onClose()
    } catch (error: any) {
      toast({ variant: "destructive", title: "Export Failed", description: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Export Movies to JSON</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Export all {movieCount} movies from the database as a JSON file.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isLoading}>
            {isLoading ? "Exporting..." : "Export All Movies"}
          </Button>
        </div>
      </div>
    </div>
  )
}

