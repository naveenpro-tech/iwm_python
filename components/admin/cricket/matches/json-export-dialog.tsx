"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Clipboard, Download, Eye } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface JsonExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JsonExportDialog({ open, onOpenChange }: JsonExportDialogProps) {
  const [exportTab, setExportTab] = useState("options")
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<"idle" | "success" | "error">("idle")
  const [showPreview, setShowPreview] = useState(false)

  // Export options
  const [exportOptions, setExportOptions] = useState({
    currentFilters: true,
    includeScorecard: true,
    includePlayerStats: true,
    includeCommentary: false,
    includeVenueDetails: true,
  })

  const handleExport = () => {
    setIsExporting(true)

    // Simulate API call
    setTimeout(() => {
      setExportStatus("success")
      setIsExporting(false)
      setShowPreview(true)
      setExportTab("preview")

      // Reset after some time
      setTimeout(() => {
        setExportStatus("idle")
      }, 3000)
    }, 1500)
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(sampleExportJson)
    setExportStatus("success")

    // Reset after some time
    setTimeout(() => {
      setExportStatus("idle")
    }, 3000)
  }

  const sampleExportJson = `[
  {
    "id": "match-1",
    "teams": {
      "home": { "id": "ind", "name": "India" },
      "away": { "id": "aus", "name": "Australia" }
    },
    "series": { "id": "bgt-2023", "name": "Border-Gavaskar Trophy" },
    "venue": { "id": "mcg", "name": "MCG, Melbourne" },
    "datetime": "2023-05-27T09:00:00Z",
    "type": "Test",
    "status": "upcoming"
  },
  {
    "id": "match-2",
    "teams": {
      "home": { "id": "csk", "name": "Chennai Super Kings" },
      "away": { "id": "mi", "name": "Mumbai Indians" }
    },
    "series": { "id": "ipl-2023", "name": "IPL 2023" },
    "venue": { "id": "wankhede", "name": "Wankhede Stadium, Mumbai" },
    "datetime": "2023-05-26T14:00:00Z",
    "type": "T20",
    "status": "live",
    "score": {
      "home": { "runs": 145, "wickets": 6, "overs": 18.2 },
      "away": { "runs": 0, "wickets": 0, "overs": 0 }
    }
  }
]`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Export Cricket Data (JSON)</DialogTitle>
          <DialogDescription>
            Export cricket match data in JSON format. Customize what data to include.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="options" value={exportTab} onValueChange={setExportTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="options">Export Options</TabsTrigger>
            <TabsTrigger value="preview" disabled={!showPreview}>
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="options" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="currentFilters"
                  checked={exportOptions.currentFilters}
                  onCheckedChange={(checked) =>
                    setExportOptions({ ...exportOptions, currentFilters: checked as boolean })
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="currentFilters">Export currently filtered matches only</Label>
                  <p className="text-sm text-muted-foreground">
                    Only export matches that match your current filter criteria
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="includeScorecard"
                  checked={exportOptions.includeScorecard}
                  onCheckedChange={(checked) =>
                    setExportOptions({ ...exportOptions, includeScorecard: checked as boolean })
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="includeScorecard">Include detailed scorecard</Label>
                  <p className="text-sm text-muted-foreground">
                    Export complete batting and bowling scorecard for each match
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="includePlayerStats"
                  checked={exportOptions.includePlayerStats}
                  onCheckedChange={(checked) =>
                    setExportOptions({ ...exportOptions, includePlayerStats: checked as boolean })
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="includePlayerStats">Include player statistics</Label>
                  <p className="text-sm text-muted-foreground">Export player statistics for each match</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="includeCommentary"
                  checked={exportOptions.includeCommentary}
                  onCheckedChange={(checked) =>
                    setExportOptions({ ...exportOptions, includeCommentary: checked as boolean })
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="includeCommentary">Include ball-by-ball commentary</Label>
                  <p className="text-sm text-muted-foreground">
                    Export commentary for each match (increases file size significantly)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="includeVenueDetails"
                  checked={exportOptions.includeVenueDetails}
                  onCheckedChange={(checked) =>
                    setExportOptions({ ...exportOptions, includeVenueDetails: checked as boolean })
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="includeVenueDetails">Include venue details</Label>
                  <p className="text-sm text-muted-foreground">Export detailed venue information for each match</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 py-4">
            <div className="relative">
              <pre className="bg-secondary p-4 rounded-md overflow-auto max-h-64 text-xs font-mono">
                {sampleExportJson}
              </pre>
              <Button size="sm" variant="secondary" className="absolute top-2 right-2" onClick={handleCopyToClipboard}>
                <Clipboard className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {exportStatus === "success" && (
          <Alert variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
            <Check className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              {exportTab === "preview" ? "Copied to clipboard!" : "Data exported successfully!"}
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {exportTab === "options" ? (
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <motion.div
                    className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                  Exporting...
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </>
              )}
            </Button>
          ) : (
            <Button onClick={() => onOpenChange(false)}>
              <Download className="mr-2 h-4 w-4" />
              Download JSON
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
