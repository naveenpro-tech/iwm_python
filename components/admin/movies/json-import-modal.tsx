"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Upload, FileJson, AlertCircle, CheckCircle2, Sparkles } from "lucide-react"
import { generateMoviePrompt, generateBlankTemplate } from "@/lib/utils/movie-json-template"
import { validateMovieJSON, sanitizeMovieData } from "@/lib/utils/movie-json-validator"
import type { Movie } from "@/components/admin/movies/types"
import { useToast } from "@/hooks/use-toast"

interface JSONImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (movieData: Partial<Movie>) => void
}

export function JSONImportModal({ open, onOpenChange, onImport }: JSONImportModalProps) {
  const [activeTab, setActiveTab] = useState<"prompt" | "paste">("prompt")
  const [movieName, setMovieName] = useState("")
  const [jsonInput, setJsonInput] = useState("")
  const [validationResult, setValidationResult] = useState<ReturnType<typeof validateMovieJSON> | null>(null)
  const { toast } = useToast()

  const handleCopyPrompt = () => {
    if (!movieName.trim()) {
      toast({
        title: "Movie name required",
        description: "Please enter a movie name to generate the prompt",
        variant: "destructive",
      })
      return
    }

    const prompt = generateMoviePrompt(movieName)
    navigator.clipboard.writeText(prompt)
    toast({
      title: "Prompt copied!",
      description: "Paste this into ChatGPT, Claude, or any LLM to generate movie data",
    })
  }

  const handleCopyTemplate = () => {
    const template = generateBlankTemplate()
    navigator.clipboard.writeText(template)
    toast({
      title: "Template copied!",
      description: "JSON template copied to clipboard",
    })
  }

  const handleValidateJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      const result = validateMovieJSON(parsed)
      setValidationResult(result)

      if (result.isValid) {
        toast({
          title: "Validation successful!",
          description: `JSON is valid. ${result.warnings.length > 0 ? `${result.warnings.length} warnings found.` : ""}`,
        })
      } else {
        toast({
          title: "Validation failed",
          description: `Found ${result.errors.length} errors`,
          variant: "destructive",
        })
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        errors: [{ field: "root", message: "Invalid JSON syntax" }],
        warnings: [],
      })
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax",
        variant: "destructive",
      })
    }
  }

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      const result = validateMovieJSON(parsed)

      if (!result.isValid) {
        toast({
          title: "Cannot import",
          description: `Please fix ${result.errors.length} validation errors first`,
          variant: "destructive",
        })
        return
      }

      const sanitized = sanitizeMovieData(parsed)
      onImport(sanitized)
      onOpenChange(false)

      toast({
        title: "Import successful!",
        description: "Movie data has been imported. Review and save when ready.",
      })

      // Reset state
      setMovieName("")
      setJsonInput("")
      setValidationResult(null)
      setActiveTab("prompt")
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Invalid JSON format",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setJsonInput(content)
      setActiveTab("paste")
    }
    reader.readAsText(file)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Import Movie via JSON
          </DialogTitle>
          <DialogDescription>
            Generate movie data using AI or paste your own JSON to quickly populate all form fields
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "prompt" | "paste")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="prompt" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate with AI
            </TabsTrigger>
            <TabsTrigger value="paste" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Paste/Upload JSON
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Generate with AI */}
          <TabsContent value="prompt" className="space-y-4">
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                Enter a movie name and copy the generated prompt to use with ChatGPT, Claude, or any LLM. The AI will
                generate complete movie data including cast, crew, awards, and more.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="movie-name">Movie Name</Label>
              <Input
                id="movie-name"
                placeholder="e.g., The Dark Knight, Interstellar, Parasite"
                value={movieName}
                onChange={(e) => setMovieName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCopyPrompt()
                }}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCopyPrompt} className="flex-1" disabled={!movieName.trim()}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Movie Request Prompt
              </Button>
              <Button onClick={handleCopyTemplate} variant="outline">
                <Copy className="mr-2 h-4 w-4" />
                Copy Template Only
              </Button>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>How to use:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Enter the movie name above</li>
                  <li>Click "Copy Movie Request Prompt"</li>
                  <li>Paste into ChatGPT, Claude, or any LLM</li>
                  <li>Copy the generated JSON response</li>
                  <li>Switch to "Paste/Upload JSON" tab and paste the response</li>
                  <li>Click "Import Movie Data"</li>
                </ol>
              </AlertDescription>
            </Alert>

            {movieName.trim() && (
              <div className="space-y-2">
                <Label>Preview of Generated Prompt</Label>
                <Textarea
                  value={generateMoviePrompt(movieName).substring(0, 500) + "..."}
                  readOnly
                  className="h-32 font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Full prompt is {generateMoviePrompt(movieName).length} characters
                </p>
              </div>
            )}
          </TabsContent>

          {/* TAB 2: Paste/Upload JSON */}
          <TabsContent value="paste" className="space-y-4">
            <Alert>
              <Upload className="h-4 w-4" />
              <AlertDescription>
                Paste the JSON response from your LLM or upload a JSON file. The data will be validated before import.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="json-input">JSON Data</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleValidateJSON} disabled={!jsonInput.trim()}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Validate
                  </Button>
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <FileJson className="mr-2 h-4 w-4" />
                        Upload File
                      </span>
                    </Button>
                  </Label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
              <Textarea
                id="json-input"
                placeholder='Paste your JSON here... e.g., { "title": "Inception", "synopsis": "...", ... }'
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value)
                  setValidationResult(null)
                }}
                className="h-64 font-mono text-xs"
              />
            </div>

            {/* Validation Results */}
            {validationResult && (
              <div className="space-y-2">
                {validationResult.isValid ? (
                  <Alert className="border-green-500 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Validation passed!</strong> JSON is valid and ready to import.
                      {validationResult.warnings.length > 0 && (
                        <span className="block mt-1 text-sm">
                          {validationResult.warnings.length} warnings (non-critical)
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Validation failed!</strong> Found {validationResult.errors.length} errors.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Show errors */}
                {validationResult.errors.length > 0 && (
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    <p className="text-sm font-medium text-red-600">Errors:</p>
                    {validationResult.errors.map((error, index) => (
                      <p key={index} className="text-xs text-red-600">
                        • {error.field}: {error.message}
                      </p>
                    ))}
                  </div>
                )}

                {/* Show warnings */}
                {validationResult.warnings.length > 0 && (
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    <p className="text-sm font-medium text-yellow-600">Warnings:</p>
                    {validationResult.warnings.map((warning, index) => (
                      <p key={index} className="text-xs text-yellow-600">
                        • {warning.field}: {warning.message}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!jsonInput.trim() || (validationResult !== null && !validationResult.isValid)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Import Movie Data
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

