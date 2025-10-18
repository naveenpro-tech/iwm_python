"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileJson, AlertCircle, CheckCircle2, FileText, AlertTriangle, Loader2, Info } from "lucide-react"

interface JsonImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport?: (data: any[]) => void
}

export function JsonImportDialog({ open, onOpenChange, onImport }: JsonImportDialogProps) {
  const [jsonData, setJsonData] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [importing, setImporting] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingStep, setProcessingStep] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setJsonData(content)
        validateJson(content)
      }
      reader.readAsText(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      setFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setJsonData(content)
        validateJson(content)
      }
      reader.readAsText(file)
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData("text")
    setJsonData(pastedText)
    validateJson(pastedText)
  }

  const validateJson = (data: string) => {
    try {
      setError("")
      setValidationResult(null)
      setPreviewData([])

      const parsed = JSON.parse(data)

      // Check if it's an array
      if (!Array.isArray(parsed)) {
        setError("JSON must be an array of professional objects")
        return false
      }

      // Validate required fields
      const requiredFields = ["name", "role", "email"]
      const invalidItems = parsed.filter((item, index) => {
        const missingFields = requiredFields.filter((field) => !item[field])
        if (missingFields.length > 0) {
          return true
        }
        return false
      })

      if (invalidItems.length > 0) {
        setError(`${invalidItems.length} items are missing required fields`)
        setValidationResult({
          total: parsed.length,
          valid: parsed.length - invalidItems.length,
          invalid: invalidItems.length,
        })
        return false
      }

      // Set preview data (first 5 items)
      setPreviewData(parsed.slice(0, 5))
      setValidationResult({ total: parsed.length, valid: parsed.length })
      return true
    } catch (e: any) {
      setError("Invalid JSON format: " + e.message)
      setValidationResult(null)
      return false
    }
  }

  const handleImport = async () => {
    if (!validateJson(jsonData)) return

    setImporting(true)
    setUploadProgress(0)
    setProcessingStep("uploading")

    try {
      const parsed = JSON.parse(jsonData)

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Simulate processing steps
      setProcessingStep("validating")
      await new Promise((resolve) => setTimeout(resolve, 800))

      setProcessingStep("processing")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setProcessingStep("importing")
      await new Promise((resolve) => setTimeout(resolve, 1200))

      // Call onImport callback
      if (onImport) {
        onImport(parsed)
      }

      setSuccess(true)
      setProcessingStep("complete")

      // Reset and close after delay
      setTimeout(() => {
        onOpenChange(false)
        // Reset state after dialog closes
        setTimeout(() => {
          setJsonData("")
          setFile(null)
          setError("")
          setSuccess(false)
          setValidationResult(null)
          setPreviewData([])
          setProcessingStep(null)
        }, 300)
      }, 1500)
    } catch (error: any) {
      setError("Failed to import professionals: " + error.message)
      setProcessingStep("error")
    } finally {
      setImporting(false)
    }
  }

  // Sample JSON for reference
  const sampleJson = `[
  {
    "name": "Christopher Nolan",
    "role": "Director",
    "email": "nolan@example.com",
    "company": "Syncopy Inc.",
    "bio": "Acclaimed filmmaker known for complex narratives",
    "verified": true,
    "filmography": [
      { "title": "Oppenheimer", "year": 2023, "role": "Director" },
      { "title": "Tenet", "year": 2020, "role": "Director" }
    ]
  },
  {
    "name": "Emma Thomas",
    "role": "Producer",
    "email": "thomas@example.com",
    "company": "Syncopy Inc.",
    "bio": "Award-winning producer and co-founder of Syncopy",
    "verified": true
  }
]`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Import Industry Professionals
          </DialogTitle>
          <DialogDescription>
            Import multiple professional profiles from a JSON file or paste JSON data directly
          </DialogDescription>
        </DialogHeader>

        {importing ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              <div className="flex flex-col items-center text-center">
                {processingStep === "complete" ? (
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                ) : processingStep === "error" ? (
                  <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                ) : (
                  <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                )}
                <h3 className="text-lg font-medium mb-2">
                  {processingStep === "uploading"
                    ? "Uploading Data"
                    : processingStep === "validating"
                      ? "Validating JSON"
                      : processingStep === "processing"
                        ? "Processing Records"
                        : processingStep === "importing"
                          ? "Importing Professionals"
                          : processingStep === "complete"
                            ? "Import Complete!"
                            : processingStep === "error"
                              ? "Import Failed"
                              : "Processing..."}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {processingStep === "uploading"
                    ? "Uploading your JSON data to the server..."
                    : processingStep === "validating"
                      ? `Validating ${validationResult?.total || 0} records...`
                      : processingStep === "processing"
                        ? "Processing and preparing data for import..."
                        : processingStep === "importing"
                          ? `Importing ${validationResult?.valid || 0} professional profiles...`
                          : processingStep === "complete"
                            ? `Successfully imported ${validationResult?.valid || 0} professional profiles!`
                            : processingStep === "error"
                              ? error || "An error occurred during import"
                              : "Please wait while we process your data..."}
                </p>
              </div>

              {processingStep !== "complete" && processingStep !== "error" && (
                <Progress value={uploadProgress} className="w-full" />
              )}

              {processingStep === "complete" && (
                <div className="flex justify-center">
                  <Button onClick={() => onOpenChange(false)}>Close</Button>
                </div>
              )}

              {processingStep === "error" && (
                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setProcessingStep(null)
                      setImporting(false)
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Tabs defaultValue="upload" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload File</TabsTrigger>
              <TabsTrigger value="paste">Paste JSON</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="flex-1 overflow-auto">
              <div className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? "border-primary/50 bg-primary/5"
                      : file
                        ? "border-green-500/50 bg-green-500/5"
                        : "border-muted-foreground/25"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <label htmlFor="json-file" className="cursor-pointer">
                    <span className="text-primary hover:underline">Choose a file</span>
                    <span className="text-muted-foreground"> or drag and drop</span>
                  </label>
                  <input
                    id="json-file"
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  {file && (
                    <div className="mt-4">
                      <Badge variant="outline" className="text-sm font-normal">
                        <FileText className="h-3 w-3 mr-1" />
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </Badge>
                    </div>
                  )}
                </div>

                {jsonData && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">JSON Preview</h4>
                      <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
                        {showPreview ? "Hide Preview" : "Show Preview"}
                      </Button>
                    </div>
                    {showPreview ? (
                      <pre className="text-xs overflow-auto max-h-[200px]">{jsonData}</pre>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {jsonData.length} characters, approximately {Math.ceil(jsonData.length / 1000)}KB
                      </p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="paste" className="flex-1 overflow-auto">
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste your JSON data here..."
                  value={jsonData}
                  onChange={(e) => {
                    setJsonData(e.target.value)
                    if (e.target.value) validateJson(e.target.value)
                  }}
                  onPaste={handlePaste}
                  className="min-h-[300px] font-mono text-sm"
                />

                <details className="cursor-pointer">
                  <summary className="text-sm text-muted-foreground hover:text-foreground">
                    View sample JSON format
                  </summary>
                  <pre className="mt-2 p-4 bg-muted/50 rounded-lg text-xs overflow-auto">{sampleJson}</pre>
                </details>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Preview Data */}
        {!importing && previewData.length > 0 && (
          <div className="border rounded-lg overflow-hidden mt-4">
            <div className="bg-muted px-4 py-2 text-sm font-medium">
              Data Preview ({previewData.length} of {validationResult?.total || 0} items)
            </div>
            <div className="p-4 max-h-[200px] overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium">Name</th>
                    <th className="text-left py-2 px-2 font-medium">Role</th>
                    <th className="text-left py-2 px-2 font-medium">Email</th>
                    <th className="text-left py-2 px-2 font-medium">Company</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((item, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-2 px-2">{item.name}</td>
                      <td className="py-2 px-2">{item.role}</td>
                      <td className="py-2 px-2">{item.email}</td>
                      <td className="py-2 px-2">{item.company || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Validation Results */}
        <AnimatePresence>
          {error && !importing && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {validationResult && !error && !importing && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Alert
                className={`mt-4 ${
                  validationResult.invalid ? "border-amber-500 bg-amber-500/10" : "border-green-500 bg-green-500/10"
                }`}
              >
                {validationResult.invalid ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
                <AlertTitle>{validationResult.invalid ? "Validation Warning" : "Validation Successful"}</AlertTitle>
                <AlertDescription>
                  {validationResult.invalid
                    ? `Found ${validationResult.valid} valid and ${validationResult.invalid} invalid records out of ${validationResult.total} total.`
                    : `Ready to import ${validationResult.valid} professional profiles.`}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {!jsonData && !importing && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Import Instructions</AlertTitle>
                <AlertDescription>
                  Upload a JSON file or paste JSON data containing professional profiles. Each profile must include at
                  least a name, role, and email address.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {!importing && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!jsonData || !!error || importing || success || !validationResult?.valid}
            >
              {validationResult?.valid ? `Import ${validationResult.valid} Professionals` : "Import Professionals"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
