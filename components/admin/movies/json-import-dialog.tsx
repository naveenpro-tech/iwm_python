"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileJson, AlertCircle, CheckCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface JsonImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "movies" | "quizzes" | "lists"
}

export function JsonImportDialog({ open, onOpenChange, type }: JsonImportDialogProps) {
  const [jsonContent, setJsonContent] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [previewData, setPreviewData] = useState<any[] | null>(null)

  const sampleTemplates = {
    movies: {
      movies: [
        {
          title: "Movie Title",
          synopsis: "Brief description of the movie",
          releaseDate: "2024-01-01",
          runtime: 120,
          genres: ["Action", "Thriller"],
          cast: [{ name: "Actor Name", role: "Character Name" }],
          crew: [{ name: "Director Name", role: "Director" }],
          sidduScore: 8.5,
          status: "released",
        },
      ],
    },
    quizzes: {
      quiz: {
        title: "Quiz Title",
        description: "Quiz description",
        questions: [
          {
            question: "Question text?",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 0,
            difficulty: "medium",
          },
        ],
        timeLimit: 300,
        passScore: 70,
      },
    },
    lists: {
      list: {
        title: "List Title",
        description: "List description",
        movies: ["movie-id-1", "movie-id-2"],
        featured: true,
      },
    },
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setJsonContent(e.target?.result as string)
      }
      reader.readAsText(file)
      setPreviewData(null)
    }
  }

  const handleImport = async () => {
    setIsImporting(true)
    setError("")
    setSuccess(false)

    try {
      // Validate JSON
      const parsedData = JSON.parse(jsonContent)

      if (type === "movies") {
        if (!Array.isArray(parsedData.movies)) {
          throw new Error("Invalid JSON: The root element must be an object with a 'movies' property that is an array.")
        }

        for (let i = 0; i < parsedData.movies.length; i++) {
          const item = parsedData.movies[i]
          if (!item.title) {
            setError(`Invalid JSON: Item at index ${i} is missing 'title'. Found: ${JSON.stringify(item)}`)
            return
          }
          if (!item.releaseDate) {
            setError(`Invalid JSON: Item at index ${i} is missing 'releaseDate'. Found: ${JSON.stringify(item)}`)
            return
          }
        }
        setPreviewData(parsedData.movies.slice(0, 3)) // Show first 3 items
      } else {
        setPreviewData([parsedData])
      }

      // Simulate import progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      // onImportSuccess(parsedData); // Call a prop function to update parent state
      // This should be passed from the page to update the main movie list.

      setSuccess(true)
      setTimeout(() => {
        onOpenChange(false)
        // Reset state
        setJsonContent("")
        setProgress(0)
        setSuccess(false)
        setPreviewData(null)
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Invalid JSON format. Please check your data and try again.")
    } finally {
      setIsImporting(false)
    }
  }

  const downloadSampleTemplate = () => {
    const template = JSON.stringify(sampleTemplates[type], null, 2)
    const blob = new Blob([template], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sample-${type}-template.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import {type.charAt(0).toUpperCase() + type.slice(1)} from JSON</DialogTitle>
          <DialogDescription>
            Upload a JSON file or paste JSON data to import {type}.
            <Button variant="link" size="sm" className="px-1" onClick={downloadSampleTemplate}>
              Download sample template
            </Button>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" id="json-upload" />
            <label htmlFor="json-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">JSON files only</p>
            </label>
          </div>

          <div className="relative">
            <Textarea
              placeholder="Or paste your JSON data here..."
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
            {jsonContent && (
              <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => setJsonContent("")}>
                Clear
              </Button>
            )}
          </div>

          {previewData && !isImporting && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-sm">Data Preview (first {previewData.length} items):</h4>
              <ScrollArea className="h-32 border rounded-md p-2 bg-muted/30">
                <pre className="text-xs">{JSON.stringify(previewData, null, 2)}</pre>
              </ScrollArea>
            </div>
          )}

          <AnimatePresence>
            {isImporting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span>Importing {type}...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert className="border-green-500/50 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Successfully imported {type}!</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!jsonContent || isImporting} className="gap-2">
              <FileJson size={16} />
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
