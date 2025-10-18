"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, UploadCloud, ListChecks, AlertCircle, CheckCircle, Film } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface ApiImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImportComplete: (importedMovies: any[]) => void // Callback with imported movies
}

type ApiSource = "TMDB" | "OMDB"

interface MockSearchResult {
  id: string
  title: string
  year: string
  posterUrl?: string
  source: ApiSource
}

const mockTmdbSearch = (query: string): Promise<MockSearchResult[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (query.toLowerCase().includes("inception")) {
        resolve([
          {
            id: "tmdb-inc",
            title: "Inception (TMDB)",
            year: "2010",
            posterUrl: "/inception-movie-poster.png",
            source: "TMDB",
          },
          { id: "tmdb-inc2", title: "Inception: The Cobol Job (TMDB)", year: "2010", source: "TMDB" },
        ])
      } else if (query.toLowerCase().includes("matrix")) {
        resolve([
          { id: "tmdb-mat", title: "The Matrix (TMDB)", year: "1999", posterUrl: "/matrix-poster.png", source: "TMDB" },
        ])
      } else resolve([])
    }, 500)
  })
}

const mockOmdbSearch = (query: string): Promise<MockSearchResult[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (query.toLowerCase().includes("inception")) {
        resolve([{ id: "omdb-inc", title: "Inception (OMDB)", year: "2010", source: "OMDB" }])
      } else if (query.toLowerCase().includes("oppenheimer")) {
        resolve([
          {
            id: "omdb-opp",
            title: "Oppenheimer (OMDB)",
            year: "2023",
            posterUrl: "/oppenheimer-inspired-poster.png",
            source: "OMDB",
          },
        ])
      } else resolve([])
    }, 500)
  })
}

export function ApiImportModal({ isOpen, onClose, onImportComplete }: ApiImportModalProps) {
  const [source, setSource] = useState<ApiSource>("TMDB")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<MockSearchResult[]>([])
  const [selectedMovies, setSelectedMovies] = useState<MockSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importLogs, setImportLogs] = useState<string[]>([])
  const [importStatus, setImportStatus] = useState<"idle" | "in-progress" | "completed" | "error">("idle")
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    setSearchResults([])
    setSelectedMovies([])
    try {
      const results = source === "TMDB" ? await mockTmdbSearch(searchQuery) : await mockOmdbSearch(searchQuery)
      setSearchResults(results)
    } catch (error) {
      toast({ title: "Search Error", description: `Failed to search ${source}.`, variant: "destructive" })
    } finally {
      setIsSearching(false)
    }
  }

  const toggleSelection = (movie: MockSearchResult) => {
    setSelectedMovies((prev) =>
      prev.find((m) => m.id === movie.id) ? prev.filter((m) => m.id !== movie.id) : [...prev, movie],
    )
  }

  const handleImport = async () => {
    if (selectedMovies.length === 0) {
      toast({ title: "No movies selected", description: "Please select movies to import.", variant: "default" })
      return
    }
    setIsImporting(true)
    setImportStatus("in-progress")
    setImportProgress(0)
    setImportLogs([`Starting import of ${selectedMovies.length} movies from ${source}...`])

    const importedSuccessfully: any[] = []

    for (let i = 0; i < selectedMovies.length; i++) {
      const movie = selectedMovies[i]
      // Simulate API call to fetch full movie details and import
      await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 400))
      const success = Math.random() > 0.1 // 90% success rate
      if (success) {
        setImportLogs((prev) => [...prev, `Successfully imported: ${movie.title} (${movie.year})`])
        // Simulate adding to our DB; in reality, this would be a more complex object
        importedSuccessfully.push({ ...movie, importedId: movie.id, sidduId: `siddu-${Date.now()}-${i}` })
      } else {
        setImportLogs((prev) => [...prev, `ERROR importing: ${movie.title} (${movie.year}) - Mock API error`])
      }
      setImportProgress(Math.round(((i + 1) / selectedMovies.length) * 100))
    }

    setImportStatus(importedSuccessfully.length > 0 ? "completed" : "error")
    setIsImporting(false)
    onImportComplete(importedSuccessfully) // Pass successfully imported movies
    toast({
      title: "Import Finished",
      description: `${importedSuccessfully.length} of ${selectedMovies.length} movies imported. Check logs for details.`,
    })
  }

  const resetAndClose = () => {
    setSearchQuery("")
    setSearchResults([])
    setSelectedMovies([])
    setImportProgress(0)
    setImportLogs([])
    setImportStatus("idle")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UploadCloud size={24} /> Import Movies from API
          </DialogTitle>
          <DialogDescription>Search and import movie data from external APIs like TMDB or OMDB.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 mt-4 max-h-[70vh]">
          {/* Controls Panel */}
          <div className="space-y-4 p-1">
            <div>
              <Label htmlFor="api-source">API Source</Label>
              <Select value={source} onValueChange={(val: ApiSource) => setSource(val)}>
                <SelectTrigger id="api-source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TMDB">TMDB</SelectItem>
                  <SelectItem value="OMDB">OMDB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="search-query">Search Movie Title</Label>
              <div className="flex gap-2">
                <Input
                  id="search-query"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., Inception"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                  <Search size={16} className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Search</span>
                </Button>
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="pt-2">
                <h4 className="font-medium mb-2 text-sm">Search Results ({searchResults.length}):</h4>
                <ScrollArea className="h-48 border rounded-md p-2 bg-muted/30">
                  {searchResults.map((movie) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => toggleSelection(movie)}
                    >
                      <input
                        type="checkbox"
                        checked={!!selectedMovies.find((m) => m.id === movie.id)}
                        readOnly
                        className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      {movie.posterUrl && (
                        <div className="relative w-10 h-14 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={movie.posterUrl || "/placeholder.svg"}
                            alt={movie.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      {!movie.posterUrl && (
                        <div className="w-10 h-14 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <Film size={20} className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-grow">
                        <p className="text-sm font-medium truncate" title={movie.title}>
                          {movie.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {movie.year} - {movie.source}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </ScrollArea>
                <Button
                  onClick={handleImport}
                  disabled={isImporting || selectedMovies.length === 0}
                  className="w-full mt-3 gap-2"
                >
                  <UploadCloud size={16} /> Import Selected ({selectedMovies.length})
                </Button>
              </div>
            )}
            {isSearching && <p className="text-sm text-muted-foreground text-center">Searching...</p>}
            {!isSearching && searchResults.length === 0 && searchQuery && (
              <p className="text-sm text-muted-foreground text-center">No results found for "{searchQuery}".</p>
            )}
          </div>

          {/* Import Status/Logs Panel */}
          <div className="space-y-3 p-1">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <ListChecks size={18} /> Import Status & Logs
            </h4>
            <AnimatePresence>
              {importStatus === "in-progress" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-1"
                >
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Importing...</span>
                    <span>{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} className="w-full h-2" />
                </motion.div>
              )}
            </AnimatePresence>
            <ScrollArea className="h-64 border rounded-md p-3 text-xs bg-muted/30">
              {importLogs.length === 0 && <p className="text-muted-foreground italic">Import logs will appear here.</p>}
              {importLogs.map((log, i) => (
                <p
                  key={i}
                  className={`mb-1 ${log.startsWith("ERROR") ? "text-destructive" : log.startsWith("Successfully") ? "text-green-600" : ""}`}
                >
                  {log}
                </p>
              ))}
            </ScrollArea>
            <AnimatePresence>
              {importStatus === "completed" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Alert variant="default" className="border-green-500/50 text-green-600">
                    <CheckCircle className="h-4 w-4 !text-green-600" />
                    <AlertTitle>Import Complete</AlertTitle>
                    <AlertDescription>
                      {
                        selectedMovies.filter((m) =>
                          importLogs.some((l) => l.includes(m.title) && l.startsWith("Successfully")),
                        ).length
                      }{" "}
                      movies imported successfully.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
              {importStatus === "error" && selectedMovies.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Import Failed / Partially Failed</AlertTitle>
                    <AlertDescription>Some movies could not be imported. Check logs.</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={resetAndClose} disabled={isImporting}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
