"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Download, FileJson, Copy, CheckCircle2, Info, Loader2, ClipboardCopy, FileDown } from "lucide-react"

interface JsonExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExport?: (options: any) => void
}

export function JsonExportDialog({ open, onOpenChange, onExport }: JsonExportDialogProps) {
  const [exportOptions, setExportOptions] = useState({
    includeUnverified: true,
    includeFilmography: true,
    includeSocialMedia: true,
    includeContactInfo: false,
    includePrivateNotes: false,
    includeAnalytics: false,
    includeDocuments: false,
    prettyPrint: true,
  })
  const [exportScope, setExportScope] = useState("filtered")
  const [exportFormat, setExportFormat] = useState("json")
  const [exporting, setExporting] = useState(false)
  const [exported, setExported] = useState(false)
  const [copied, setCopied] = useState(false)
  const [jsonPreview, setJsonPreview] = useState("")
  const [exportProgress, setExportProgress] = useState(0)
  const [processingStep, setProcessingStep] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("preview")

  // Sample data for preview
  const sampleData = [
    {
      id: "prof_001",
      name: "Christopher Nolan",
      role: "Director",
      email: exportOptions.includeContactInfo ? "nolan@example.com" : undefined,
      company: "Syncopy Inc.",
      bio: "Acclaimed filmmaker known for complex narratives",
      verified: true,
      verifiedAt: "2024-01-15T10:30:00Z",
      filmography: exportOptions.includeFilmography
        ? [
            { title: "Oppenheimer", year: 2023, role: "Director" },
            { title: "Tenet", year: 2020, role: "Director" },
          ]
        : undefined,
      socialMedia: exportOptions.includeSocialMedia
        ? {
            twitter: "@ChristopherNolan",
            instagram: "christophernolan",
          }
        : undefined,
      privateNotes: exportOptions.includePrivateNotes ? "VIP client, handle with care" : undefined,
      analytics: exportOptions.includeAnalytics
        ? {
            profileViews: 24350,
            engagement: 3240,
            followers: 15420,
          }
        : undefined,
      documents: exportOptions.includeDocuments
        ? [
            {
              id: "doc_001",
              type: "identity",
              status: "verified",
              verifiedAt: "2024-01-10T14:30:00Z",
            },
          ]
        : undefined,
    },
  ]

  // Update preview when options change
  useEffect(() => {
    if (!exported) {
      const jsonString = JSON.stringify(sampleData, null, exportOptions.prettyPrint ? 2 : 0)
      setJsonPreview(jsonString)
    }
  }, [exportOptions, exported])

  const handleExport = async () => {
    setExporting(true)
    setExportProgress(0)
    setProcessingStep("preparing")

    try {
      // Simulate export process
      for (let i = 0; i <= 100; i += 5) {
        setExportProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 50))

        // Update processing step based on progress
        if (i === 25) setProcessingStep("querying")
        if (i === 50) setProcessingStep("formatting")
        if (i === 75) setProcessingStep("finalizing")
      }

      // Generate full export data
      const exportData = []
      const count = exportScope === "filtered" ? 24 : 1247

      // Generate more realistic data for the full export
      for (let i = 0; i < Math.min(count, 100); i++) {
        exportData.push({
          id: `prof_${(i + 1).toString().padStart(3, "0")}`,
          name: `Professional ${i + 1}`,
          role:
            i % 5 === 0
              ? "Director"
              : i % 5 === 1
                ? "Producer"
                : i % 5 === 2
                  ? "Actor"
                  : i % 5 === 3
                    ? "Writer"
                    : "Cinematographer",
          email: exportOptions.includeContactInfo ? `pro${i + 1}@example.com` : undefined,
          company: i % 3 === 0 ? "Studio A" : i % 3 === 1 ? "Production House B" : "Independent",
          bio: `Professional bio for item ${i + 1}`,
          verified: i % 4 !== 0,
          verifiedAt: i % 4 !== 0 ? new Date().toISOString() : undefined,
          filmography: exportOptions.includeFilmography
            ? [
                { title: `Film Title ${i + 1}`, year: 2023 - (i % 5), role: "Lead" },
                { title: `Another Project ${i + 1}`, year: 2021 - (i % 3), role: "Supporting" },
              ]
            : undefined,
          socialMedia: exportOptions.includeSocialMedia
            ? {
                twitter: `@professional${i + 1}`,
                instagram: `pro.${i + 1}`,
              }
            : undefined,
          privateNotes: exportOptions.includePrivateNotes ? `Private notes for professional ${i + 1}` : undefined,
          analytics: exportOptions.includeAnalytics
            ? {
                profileViews: 10000 + i * 100,
                engagement: 1000 + i * 10,
                followers: 5000 + i * 50,
              }
            : undefined,
          documents: exportOptions.includeDocuments
            ? [
                {
                  id: `doc_${(i + 1).toString().padStart(3, "0")}`,
                  type: "identity",
                  status: i % 4 !== 0 ? "verified" : "pending",
                  verifiedAt: i % 4 !== 0 ? new Date().toISOString() : undefined,
                },
              ]
            : undefined,
        })
      }

      const jsonString = JSON.stringify(exportData, null, exportOptions.prettyPrint ? 2 : 0)
      setJsonPreview(jsonString)
      setExported(true)
      setProcessingStep("complete")

      // Call onExport callback
      if (onExport) {
        onExport({
          options: exportOptions,
          scope: exportScope,
          format: exportFormat,
          count,
        })
      }
    } catch (error) {
      console.error("Export failed:", error)
      setProcessingStep("error")
    } finally {
      setExporting(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([jsonPreview], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `siddu-professionals-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonPreview)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getExportSize = () => {
    const bytes = new Blob([jsonPreview]).size
    if (bytes < 1024) return `${bytes} bytes`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getExportCount = () => {
    return exportScope === "filtered" ? 24 : 1247
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Export Industry Professionals
          </DialogTitle>
          <DialogDescription>Configure export options and download professional data</DialogDescription>
        </DialogHeader>

        {exporting ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              <div className="flex flex-col items-center text-center">
                {processingStep === "complete" ? (
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                ) : (
                  <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                )}
                <h3 className="text-lg font-medium mb-2">
                  {processingStep === "preparing"
                    ? "Preparing Export"
                    : processingStep === "querying"
                      ? "Querying Database"
                      : processingStep === "formatting"
                        ? "Formatting Data"
                        : processingStep === "finalizing"
                          ? "Finalizing Export"
                          : processingStep === "complete"
                            ? "Export Complete!"
                            : "Processing..."}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {processingStep === "preparing"
                    ? "Setting up export parameters..."
                    : processingStep === "querying"
                      ? `Retrieving ${getExportCount()} professional profiles...`
                      : processingStep === "formatting"
                        ? "Formatting and structuring data..."
                        : processingStep === "finalizing"
                          ? "Finalizing export file..."
                          : processingStep === "complete"
                            ? `Successfully exported ${getExportCount()} professional profiles!`
                            : "Please wait while we process your export..."}
                </p>
              </div>

              {processingStep !== "complete" && <Progress value={exportProgress} className="w-full" />}

              {processingStep === "complete" && (
                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={handleCopy}>
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <ClipboardCopy className="h-4 w-4 mr-2" />
                        Copy JSON
                      </>
                    )}
                  </Button>
                  <Button onClick={handleDownload}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto space-y-6">
            {!exported ? (
              <>
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Export Scope</Label>
                    <RadioGroup value={exportScope} onValueChange={setExportScope}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="filtered" id="filtered" />
                        <Label htmlFor="filtered" className="font-normal cursor-pointer">
                          Currently filtered results (24 professionals)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all" className="font-normal cursor-pointer">
                          All professionals (1,247 total)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">Export Format</Label>
                    <RadioGroup value={exportFormat} onValueChange={setExportFormat}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="json" id="json" />
                        <Label htmlFor="json" className="font-normal cursor-pointer">
                          JSON (JavaScript Object Notation)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="csv" id="csv" disabled />
                        <Label htmlFor="csv" className="font-normal cursor-pointer text-muted-foreground">
                          CSV (Comma Separated Values) - Coming Soon
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">Data to Include</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="unverified"
                            checked={exportOptions.includeUnverified}
                            onCheckedChange={(checked) =>
                              setExportOptions((prev) => ({
                                ...prev,
                                includeUnverified: checked as boolean,
                              }))
                            }
                          />
                          <Label htmlFor="unverified" className="font-normal cursor-pointer">
                            Include unverified professionals
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="filmography"
                            checked={exportOptions.includeFilmography}
                            onCheckedChange={(checked) =>
                              setExportOptions((prev) => ({
                                ...prev,
                                includeFilmography: checked as boolean,
                              }))
                            }
                          />
                          <Label htmlFor="filmography" className="font-normal cursor-pointer">
                            Include filmography data
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="social"
                            checked={exportOptions.includeSocialMedia}
                            onCheckedChange={(checked) =>
                              setExportOptions((prev) => ({
                                ...prev,
                                includeSocialMedia: checked as boolean,
                              }))
                            }
                          />
                          <Label htmlFor="social" className="font-normal cursor-pointer">
                            Include social media profiles
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="prettyPrint"
                            checked={exportOptions.prettyPrint}
                            onCheckedChange={(checked) =>
                              setExportOptions((prev) => ({
                                ...prev,
                                prettyPrint: checked as boolean,
                              }))
                            }
                          />
                          <Label htmlFor="prettyPrint" className="font-normal cursor-pointer">
                            Pretty print (formatted JSON)
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="contact"
                            checked={exportOptions.includeContactInfo}
                            onCheckedChange={(checked) =>
                              setExportOptions((prev) => ({
                                ...prev,
                                includeContactInfo: checked as boolean,
                              }))
                            }
                          />
                          <Label htmlFor="contact" className="font-normal cursor-pointer">
                            Include contact information (sensitive)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="notes"
                            checked={exportOptions.includePrivateNotes}
                            onCheckedChange={(checked) =>
                              setExportOptions((prev) => ({
                                ...prev,
                                includePrivateNotes: checked as boolean,
                              }))
                            }
                          />
                          <Label htmlFor="notes" className="font-normal cursor-pointer">
                            Include private admin notes (sensitive)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="analytics"
                            checked={exportOptions.includeAnalytics}
                            onCheckedChange={(checked) =>
                              setExportOptions((prev) => ({
                                ...prev,
                                includeAnalytics: checked as boolean,
                              }))
                            }
                          />
                          <Label htmlFor="analytics" className="font-normal cursor-pointer">
                            Include analytics data
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="documents"
                            checked={exportOptions.includeDocuments}
                            onCheckedChange={(checked) =>
                              setExportOptions((prev) => ({
                                ...prev,
                                includeDocuments: checked as boolean,
                              }))
                            }
                          />
                          <Label htmlFor="documents" className="font-normal cursor-pointer">
                            Include document metadata
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Export Information</AlertTitle>
                  <AlertDescription>
                    Exported data will be formatted as a JSON array. Sensitive information will only be included if
                    explicitly selected. The estimated export size is{" "}
                    {exportScope === "filtered" ? "~50KB" : exportScope === "all" ? "~2.5MB" : "unknown"}.
                  </AlertDescription>
                </Alert>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted px-4 py-2 text-sm font-medium flex justify-between items-center">
                    <span>Preview</span>
                    <span className="text-xs text-muted-foreground">Sample data ({getExportSize()})</span>
                  </div>
                  <div className="p-4 max-h-[200px] overflow-auto bg-muted/30">
                    <pre className="text-xs">{jsonPreview}</pre>
                  </div>
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertTitle>Export Ready</AlertTitle>
                  <AlertDescription className="text-green-500">
                    {exportScope === "filtered" ? "24" : "1,247"} professionals exported successfully. The file size is{" "}
                    {getExportSize()}.
                  </AlertDescription>
                </Alert>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="info">Export Info</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview">
                    <div className="relative border rounded-lg">
                      <div className="absolute top-2 right-2 z-10">
                        <Button size="sm" variant="outline" className="h-8" onClick={handleCopy}>
                          {copied ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                      <pre className="p-4 bg-muted/30 rounded-lg text-xs overflow-auto max-h-[300px] pt-12">
                        {jsonPreview}
                      </pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="info">
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Export Details</h4>
                          <ul className="text-sm space-y-1">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Format:</span>
                              <span className="font-mono">{exportFormat.toUpperCase()}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Records:</span>
                              <span className="font-mono">{exportScope === "filtered" ? "24" : "1,247"}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">File Size:</span>
                              <span className="font-mono">{getExportSize()}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Generated:</span>
                              <span className="font-mono">{new Date().toLocaleString()}</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Included Data</h4>
                          <ul className="text-sm space-y-1">
                            {Object.entries(exportOptions).map(([key, value]) => {
                              if (key === "prettyPrint") return null
                              const label = key
                                .replace("include", "")
                                .replace(/([A-Z])/g, " $1")
                                .trim()
                              return (
                                <li key={key} className="flex items-center gap-2">
                                  {value ? (
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <span className="h-3 w-3 block" />
                                  )}
                                  <span className={value ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">Usage Information</h4>
                        <p className="text-sm text-muted-foreground">
                          This export can be used for backup purposes, data migration, or importing into other systems.
                          The data is formatted as a standard JSON array that can be parsed by any system that supports
                          JSON.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </div>
        )}

        <DialogFooter>
          {!exported ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={exporting}>
                {exporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileJson className="h-4 w-4 mr-2" />
                    Export Data
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
