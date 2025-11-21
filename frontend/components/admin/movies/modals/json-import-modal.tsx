"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface JsonImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImportComplete: (movies: any[]) => Promise<void>
}

export function JsonImportModal({ isOpen, onClose, onImportComplete }: JsonImportModalProps) {
  const [jsonText, setJsonText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleImport = async () => {
    try {
      setIsLoading(true)
      const data = JSON.parse(jsonText)
      const movies = Array.isArray(data) ? data : [data]
      
      if (movies.length === 0) {
        toast({ variant: "destructive", title: "Error", description: "No movies found in JSON" })
        return
      }
      
      await onImportComplete(movies)
      setJsonText("")
    } catch (e: any) {
      toast({ variant: "destructive", title: "Invalid JSON", description: e.message })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Import Movies from JSON</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Paste your JSON array of movies below. Each movie should have at least a title and external_id.
        </p>
        <textarea
          className="w-full h-64 p-3 border rounded-md font-mono text-sm mb-4 bg-muted"
          placeholder='[{"external_id": "movie-1", "title": "Movie Title", ...}]'
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={isLoading || !jsonText.trim()}>
            {isLoading ? "Importing..." : "Import"}
          </Button>
        </div>
      </div>
    </div>
  )
}

