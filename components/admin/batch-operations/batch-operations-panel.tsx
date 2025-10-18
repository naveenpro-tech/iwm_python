"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import {
  FileText,
  Upload,
  Download,
  Edit,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Filter,
  Clock,
  Search,
} from "lucide-react"

export function BatchOperationsPanel() {
  const [selectedTab, setSelectedTab] = useState("import")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [operation, setOperation] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<{
    success: number
    warning: number
    error: number
    details: Array<{
      id: string
      status: "success" | "warning" | "error"
      message: string
    }>
  } | null>(null)

  // Mock data for batch selection
  const mockItems = [
    { id: "item1", name: "Oppenheimer", type: "movie", status: "published" },
    { id: "item2", name: "Dune: Part Two", type: "movie", status: "published" },
    { id: "item3", name: "Poor Things", type: "movie", status: "published" },
    { id: "item4", name: "Barbie", type: "movie", status: "published" },
    { id: "item5", name: "Killers of the Flower Moon", type: "movie", status: "published" },
    { id: "item6", name: "The Creator", type: "movie", status: "draft" },
    { id: "item7", name: "Challengers", type: "movie", status: "published" },
    { id: "item8", name: "Asteroid City", type: "movie", status: "published" },
    { id: "item9", name: "Past Lives", type: "movie", status: "draft" },
    { id: "item10", name: "The Zone of Interest", type: "movie", status: "published" },
  ]

  // Toggle item selection
  const toggleItemSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  // Select all items
  const selectAllItems = () => {
    if (selectedItems.length === mockItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(mockItems.map((item) => item.id))
    }
  }

  // Start batch operation
  const startBatchOperation = () => {
    if (!operation || selectedItems.length === 0) return

    setIsProcessing(true)
    setProgress(0)
    setResults(null)

    // Simulate processing with progress updates
    const totalSteps = selectedItems.length
    let currentStep = 0

    const processInterval = setInterval(() => {
      currentStep++
      const newProgress = Math.round((currentStep / totalSteps) * 100)
      setProgress(newProgress)

      if (currentStep >= totalSteps) {
        clearInterval(processInterval)
        setIsProcessing(false)

        // Generate mock results
        const mockResults = {
          success: Math.floor(selectedItems.length * 0.8),
          warning: Math.floor(selectedItems.length * 0.15),
          error: Math.floor(selectedItems.length * 0.05),
          details: selectedItems.map((id, index) => {
            // Randomly assign status with weighted distribution
            const rand = Math.random()
            let status: "success" | "warning" | "error" = "success"
            let message = "Operation completed successfully"

            if (rand > 0.95) {
              status = "error"
              message = "Failed to process item"
            } else if (rand > 0.8) {
              status = "warning"
              message = "Operation completed with warnings"
            }

            return {
              id,
              status,
              message,
            }
          }),
        }

        setResults(mockResults)
      }
    }, 100)
  }

  // Reset the operation
  const resetOperation = () => {
    setOperation(null)
    setResults(null)
    setProgress(0)
    setIsProcessing(false)
  }

  // Render import content
  const renderImportContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="import-source" className="mb-2 block">
            Import Source
          </Label>
          <Select>
            <SelectTrigger id="import-source">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON File</SelectItem>
              <SelectItem value="csv">CSV File</SelectItem>
              <SelectItem value="tmdb">TMDB API</SelectItem>
              <SelectItem value="omdb">OMDB API</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="import-type" className="mb-2 block">
            Content Type
          </Label>
          <Select>
            <SelectTrigger id="import-type">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="movies">Movies</SelectItem>
              <SelectItem value="people">People</SelectItem>
              <SelectItem value="reviews">Reviews</SelectItem>
              <SelectItem value="talent">Talent Profiles</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-2 border-dashed rounded-md p-6 text-center">
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <div className="text-sm font-medium mb-1">Drag and drop files here</div>
        <div className="text-xs text-muted-foreground mb-4">Supports JSON, CSV, or Excel files up to 10MB</div>
        <Button variant="outline" size="sm">
          Browse Files
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="import-options" className="block">
          Import Options
        </Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="option-1" />
            <label htmlFor="option-1" className="text-sm">
              Skip existing items
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="option-2" />
            <label htmlFor="option-2" className="text-sm">
              Update existing items
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="option-3" />
            <label htmlFor="option-3" className="text-sm">
              Import relationships
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="option-4" />
            <label htmlFor="option-4" className="text-sm">
              Import media assets
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button
          className="w-full"
          onClick={() => {
            setOperation("import")
            startBatchOperation()
          }}
        >
          Start Import
        </Button>
      </div>
    </div>
  )

  // Render export content
  const renderExportContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="export-format" className="mb-2 block">
            Export Format
          </Label>
          <Select>
            <SelectTrigger id="export-format">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="pdf">PDF Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="export-type" className="mb-2 block">
            Content Type
          </Label>
          <Select>
            <SelectTrigger id="export-type">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="movies">Movies</SelectItem>
              <SelectItem value="people">People</SelectItem>
              <SelectItem value="reviews">Reviews</SelectItem>
              <SelectItem value="talent">Talent Profiles</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="export-filter" className="mb-2 block">
          Filter Criteria
        </Label>
        <div className="flex gap-2">
          <Input id="export-filter" placeholder="Search by title, ID, or other attributes" />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="export-options" className="block">
          Export Options
        </Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="export-option-1" />
            <label htmlFor="export-option-1" className="text-sm">
              Include metadata
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="export-option-2" />
            <label htmlFor="export-option-2" className="text-sm">
              Include relationships
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="export-option-3" />
            <label htmlFor="export-option-3" className="text-sm">
              Include media URLs
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="export-option-4" />
            <label htmlFor="export-option-4" className="text-sm">
              Pretty print (JSON only)
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button
          className="w-full"
          onClick={() => {
            setOperation("export")
            startBatchOperation()
          }}
        >
          Start Export
        </Button>
      </div>
    </div>
  )

  // Render batch edit content
  const renderBatchEditContent = () => (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="item-selection" className="font-medium">
            Select Items
          </Label>
          <Button variant="ghost" size="sm" onClick={selectAllItems}>
            {selectedItems.length === mockItems.length ? "Deselect All" : "Select All"}
          </Button>
        </div>

        <div className="border rounded-md max-h-[200px] overflow-y-auto">
          <div className="p-2 border-b bg-muted/50 sticky top-0">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                className="h-8 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          <div className="divide-y">
            {mockItems.map((item) => (
              <div key={item.id} className="flex items-center p-2 hover:bg-muted/50">
                <Checkbox
                  id={item.id}
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => toggleItemSelection(item.id)}
                  className="mr-2"
                />
                <label htmlFor={item.id} className="flex items-center justify-between w-full cursor-pointer">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{item.name}</span>
                  </div>
                  <Badge variant={item.status === "published" ? "default" : "secondary"}>{item.status}</Badge>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          {selectedItems.length} of {mockItems.length} items selected
        </div>
      </div>

      <div className="pt-4 border-t">
        <Label htmlFor="batch-action" className="mb-2 block">
          Batch Action
        </Label>
        <Select>
          <SelectTrigger id="batch-action">
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="status">Change Status</SelectItem>
            <SelectItem value="tags">Add/Remove Tags</SelectItem>
            <SelectItem value="category">Change Category</SelectItem>
            <SelectItem value="delete">Delete Items</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="action-value" className="mb-2 block">
          New Value
        </Label>
        <Select>
          <SelectTrigger id="action-value">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes" className="mb-2 block">
          Notes (Optional)
        </Label>
        <Textarea id="notes" placeholder="Add notes about this batch operation" />
      </div>

      <div className="pt-4">
        <Button
          className="w-full"
          disabled={selectedItems.length === 0}
          onClick={() => {
            setOperation("batch-edit")
            startBatchOperation()
          }}
        >
          Apply to {selectedItems.length} Items
        </Button>
      </div>
    </div>
  )

  // Render operation progress
  const renderOperationProgress = () => (
    <div className="space-y-4">
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
          {operation === "import" && <Upload className="h-6 w-6 text-primary" />}
          {operation === "export" && <Download className="h-6 w-6 text-primary" />}
          {operation === "batch-edit" && <Edit className="h-6 w-6 text-primary" />}
        </div>
        <h3 className="text-lg font-medium mb-1">
          {operation === "import" && "Importing Content"}
          {operation === "export" && "Exporting Content"}
          {operation === "batch-edit" && "Updating Items"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isProcessing ? (
            <>Processing {selectedItems.length} items. Please wait...</>
          ) : (
            <>Operation complete. See results below.</>
          )}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {isProcessing && (
        <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 animate-spin" />
          <span>
            Estimated time remaining:{" "}
            {Math.ceil((selectedItems.length - (selectedItems.length * progress) / 100) * 0.1)} seconds
          </span>
        </div>
      )}

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
              <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
              <div className="text-xl font-bold">{results.success}</div>
              <div className="text-xs text-muted-foreground">Successful</div>
            </div>
            <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
              <AlertTriangle className="h-5 w-5 text-amber-500 mb-1" />
              <div className="text-xl font-bold">{results.warning}</div>
              <div className="text-xs text-muted-foreground">Warnings</div>
            </div>
            <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
              <XCircle className="h-5 w-5 text-red-500 mb-1" />
              <div className="text-xl font-bold">{results.error}</div>
              <div className="text-xs text-muted-foreground">Errors</div>
            </div>
          </div>

          <div className="border rounded-md max-h-[200px] overflow-y-auto">
            <div className="sticky top-0 p-2 border-b bg-muted/50 text-sm font-medium">Operation Details</div>
            <div className="divide-y">
              {results.details.map((detail) => (
                <div key={detail.id} className="p-2 flex items-start">
                  {detail.status === "success" && (
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 shrink-0" />
                  )}
                  {detail.status === "warning" && (
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 shrink-0" />
                  )}
                  {detail.status === "error" && <XCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 shrink-0" />}
                  <div>
                    <div className="text-sm">{mockItems.find((item) => item.id === detail.id)?.name || detail.id}</div>
                    <div className="text-xs text-muted-foreground">{detail.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="w-full" onClick={resetOperation}>
              Start New Operation
            </Button>
            <Button className="w-full">{operation === "export" ? "Download Results" : "View Detailed Report"}</Button>
          </div>
        </motion.div>
      )}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Operations</CardTitle>
        <CardDescription>Efficiently manage multiple items with batch operations</CardDescription>
      </CardHeader>
      <CardContent>
        {(operation && isProcessing) || results ? (
          renderOperationProgress()
        ) : (
          <Tabs defaultValue="import" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="import">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </TabsTrigger>
              <TabsTrigger value="export">
                <Download className="h-4 w-4 mr-2" />
                Export
              </TabsTrigger>
              <TabsTrigger value="batch-edit">
                <Edit className="h-4 w-4 mr-2" />
                Batch Edit
              </TabsTrigger>
            </TabsList>

            <TabsContent value="import">{renderImportContent()}</TabsContent>

            <TabsContent value="export">{renderExportContent()}</TabsContent>

            <TabsContent value="batch-edit">{renderBatchEditContent()}</TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
