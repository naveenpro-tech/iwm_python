"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { ArrowLeft, Upload, FileJson, Database, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function BulkImportPage() {
  const [activeTab, setActiveTab] = useState("json")
  const [isImporting, setIsImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleImport = async () => {
    setIsImporting(true)
    setError("")
    setSuccess(false)

    try {
      // Simulate import progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      setSuccess(true)
    } catch (err) {
      setError("An error occurred during import. Please check your data and try again.")
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-4"
      >
        <Link href="/admin/where-to-watch">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Bulk Import Streaming Links</h1>
          <p className="text-muted-foreground mt-1">Import streaming availability data from various sources</p>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="json">JSON Import</TabsTrigger>
          <TabsTrigger value="api">API Import</TabsTrigger>
          <TabsTrigger value="csv">CSV Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="json" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Import from JSON</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input type="file" accept=".json" className="hidden" id="json-upload" />
                <label htmlFor="json-upload" className="cursor-pointer">
                  <FileJson className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">JSON files only</p>
                </label>
              </div>

              <div className="space-y-2">
                <Label>Or paste JSON data</Label>
                <Textarea placeholder="Paste your JSON data here..." className="min-h-[200px] font-mono text-sm" />
              </div>

              <div className="space-y-2">
                <Label>Sample Format</Label>
                <div className="bg-muted p-3 rounded-md overflow-auto max-h-40">
                  <pre className="text-xs">
                    {JSON.stringify(
                      {
                        movies: [
                          {
                            tmdbId: "123456",
                            title: "Movie Title",
                            streamingLinks: [
                              {
                                service: "netflix",
                                region: "US",
                                url: "https://www.netflix.com/title/12345",
                                type: "subscription",
                              },
                            ],
                          },
                        ],
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Import from External API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Source</Label>
                <Select defaultValue="tmdb">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tmdb">TMDB API</SelectItem>
                    <SelectItem value="justwatch">JustWatch API</SelectItem>
                    <SelectItem value="custom">Custom API</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>API Key</Label>
                <Input type="password" placeholder="Enter your API key" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Select defaultValue="us">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="in">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Import Limit</Label>
                  <Input type="number" defaultValue="100" min="1" max="1000" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="csv" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Import from CSV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input type="file" accept=".csv" className="hidden" id="csv-upload" />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">CSV files only</p>
                </label>
              </div>

              <div className="space-y-2">
                <Label>CSV Template</Label>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Download our CSV template to ensure correct formatting
                  </p>
                  <Button variant="outline" size="sm">
                    Download Template
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Column Mapping</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm">Movie ID Column</p>
                    <Select defaultValue="tmdb_id">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tmdb_id">tmdb_id</SelectItem>
                        <SelectItem value="imdb_id">imdb_id</SelectItem>
                        <SelectItem value="title">title</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">Service Column</p>
                    <Select defaultValue="service">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service">service</SelectItem>
                        <SelectItem value="provider">provider</SelectItem>
                        <SelectItem value="platform">platform</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="space-y-4">
        {isImporting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span>Importing data...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </motion.div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500/50 text-green-500">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Successfully imported streaming data!</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/where-to-watch">Cancel</Link>
          </Button>
          <Button onClick={handleImport} disabled={isImporting} className="gap-2">
            <Upload size={16} />
            Start Import
          </Button>
        </div>
      </div>
    </div>
  )
}
