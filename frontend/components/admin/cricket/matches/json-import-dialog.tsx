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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, Check, FileUp, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface JsonImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JsonImportDialog({ open, onOpenChange }: JsonImportDialogProps) {
  const [importTab, setImportTab] = useState("file")
  const [jsonText, setJsonText] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleImport = () => {
    setIsUploading(true)

    // Simulate API call
    setTimeout(() => {
      try {
        if (importTab === "paste" && jsonText) {
          // Validate JSON
          JSON.parse(jsonText)
        }

        setUploadStatus("success")
        setIsUploading(false)

        // Close dialog after success
        setTimeout(() => {
          onOpenChange(false)
          setUploadStatus("idle")
          setJsonText("")
        }, 1500)
      } catch (error) {
        setUploadStatus("error")
        setErrorMessage("Invalid JSON format. Please check your data and try again.")
        setIsUploading(false)
      }
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Cricket Data (JSON)</DialogTitle>
          <DialogDescription>
            Upload cricket match data in JSON format. You can upload a file or paste JSON directly.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="file" value={importTab} onValueChange={setImportTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">Upload File</TabsTrigger>
            <TabsTrigger value="paste">Paste JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4 py-4">
            <motion.div
              className="border-2 border-dashed rounded-lg p-8 text-center"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <FileUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Drag and drop your JSON file</h3>
              <p className="text-sm text-muted-foreground mb-4">or click to browse your files</p>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Select File
              </Button>
            </motion.div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Sample Format</AlertTitle>
              <AlertDescription className="text-xs font-mono mt-2 overflow-auto max-h-32">
                {`[
  {
    "id": "match-123",
    "teams": {
      "home": { "id": "ind", "name": "India" },
      "away": { "id": "aus", "name": "Australia" }
    },
    "series": { "id": "bgt-2023", "name": "Border-Gavaskar Trophy" },
    "venue": { "id": "mcg", "name": "MCG, Melbourne" },
    "datetime": "2023-05-27T09:00:00Z",
    "type": "Test"
  }
]`}
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="paste" className="space-y-4 py-4">
            <Textarea
              placeholder="Paste your JSON data here..."
              className="font-mono text-sm h-64"
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
            />

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Sample Format</AlertTitle>
              <AlertDescription className="text-xs font-mono mt-2 overflow-auto max-h-32">
                {`[
  {
    "id": "match-123",
    "teams": {
      "home": { "id": "ind", "name": "India" },
      "away": { "id": "aus", "name": "Australia" }
    },
    "series": { "id": "bgt-2023", "name": "Border-Gavaskar Trophy" },
    "venue": { "id": "mcg", "name": "MCG, Melbourne" },
    "datetime": "2023-05-27T09:00:00Z",
    "type": "Test"
  }
]`}
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        {uploadStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {uploadStatus === "success" && (
          <Alert variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
            <Check className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Data imported successfully!</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={isUploading}>
            {isUploading ? (
              <>
                <motion.div
                  className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                Importing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
