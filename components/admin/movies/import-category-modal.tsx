"use client"

import { useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  FileJson,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Copy,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  importMovieCategory,
  validateImportJSON,
  getCategoryDisplayName,
  getCategoryDescription,
  getCategoryTemplate,
  type CategoryType,
  type ImportRequest,
  type MovieContext,
} from "@/lib/api/movie-export-import"

interface ImportCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  movieId: string
  category: CategoryType
  onImportSuccess?: () => void
  movieData?: MovieContext
}

export function ImportCategoryModal({
  isOpen,
  onClose,
  movieId,
  category,
  onImportSuccess,
  movieData,
}: ImportCategoryModalProps) {
  const [jsonInput, setJsonInput] = useState("")
  const [validationResult, setValidationResult] = useState<{
    valid: boolean
    error?: string
    data?: ImportRequest
  } | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const { toast } = useToast()

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setJsonInput(content)
        setValidationResult(null)
        setImportResult(null)
      }
      reader.readAsText(file)
    },
    []
  )

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type === "application/json") {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setJsonInput(content)
        setValidationResult(null)
        setImportResult(null)
      }
      reader.readAsText(file)
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  const handleValidate = () => {
    const result = validateImportJSON(jsonInput)
    setValidationResult(result)

    if (result.valid) {
      toast({
        title: "Validation Successful",
        description: "JSON structure is valid and ready to import",
      })
    } else {
      toast({
        title: "Validation Failed",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  const handleImport = async () => {
    if (!validationResult?.valid || !validationResult.data) {
      toast({
        title: "Validation Required",
        description: "Please validate the JSON before importing",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)
    setImportResult(null)

    try {
      const response = await importMovieCategory(
        movieId,
        category,
        validationResult.data
      )

      setImportResult({
        success: response.success,
        message: response.message,
      })

      toast({
        title: "Import Successful - Saved as Draft",
        description: response.message,
      })

      // Close modal after 1 second to show success message
      setTimeout(() => {
        onClose()
        setJsonInput("")
        setValidationResult(null)
        setImportResult(null)

        // Refresh data after modal closes
        if (onImportSuccess) {
          onImportSuccess()
        }
      }, 1000)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to import category"

      setImportResult({
        success: false,
        message: errorMessage,
      })

      toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleCopyTemplate = () => {
    if (!movieData) {
      toast({
        title: "Error",
        description: "Movie data not available for template generation",
        variant: "destructive",
      })
      return
    }

    const template = getCategoryTemplate(category, movieData)
    const templateString = JSON.stringify(template, null, 2)
    navigator.clipboard.writeText(templateString)

    toast({
      title: "Template Copied",
      description: `Intelligent ${getCategoryDisplayName(category)} template copied to clipboard with movie context and instructions`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Import {getCategoryDisplayName(category)} Data
          </DialogTitle>
          <DialogDescription>
            {getCategoryDescription(category)}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="paste" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste">Paste JSON</TabsTrigger>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
          </TabsList>

          <TabsContent value="paste" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="json-input">JSON Data</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyTemplate}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy Template
                </Button>
              </div>
              <Textarea
                id="json-input"
                placeholder={`Paste your enriched ${getCategoryDisplayName(category)} JSON here...`}
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value)
                  setValidationResult(null)
                  setImportResult(null)
                }}
                className="font-mono text-sm min-h-[300px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  JSON files only
                </p>
              </label>
            </div>

            {jsonInput && (
              <div className="space-y-2">
                <Label>Uploaded JSON Preview</Label>
                <Textarea
                  value={jsonInput}
                  readOnly
                  className="font-mono text-sm min-h-[200px]"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        {validationResult && (
          <Alert
            variant={validationResult.valid ? "default" : "destructive"}
            className="mt-4"
          >
            {validationResult.valid ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {validationResult.valid
                ? "JSON is valid and ready to import"
                : validationResult.error}
            </AlertDescription>
          </Alert>
        )}

        {importResult && (
          <Alert
            variant={importResult.success ? "default" : "destructive"}
            className="mt-4"
          >
            {importResult.success ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{importResult.message}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isImporting}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={handleValidate}
            disabled={!jsonInput.trim() || isImporting}
            className="gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            Validate
          </Button>
          <Button
            onClick={handleImport}
            disabled={!validationResult?.valid || isImporting}
            className="gap-2"
          >
            {isImporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileJson className="h-4 w-4" />
            )}
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

