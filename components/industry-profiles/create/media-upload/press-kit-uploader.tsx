"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  ImageIcon,
  FileVideo,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Trash2,
  RefreshCw,
  Eye,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface PressKitUploaderProps {
  onUpload: (files: File[]) => void
  onRemove: () => void
  maxFiles?: number
  initialPreview?: string
}

export default function PressKitUploader({ onUpload, onRemove, maxFiles = 1, initialPreview }: PressKitUploaderProps) {
  const [activeTab, setActiveTab] = useState<"images" | "videos" | "documents">("images")
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<
    Array<{
      file: File
      id: string
      preview: string
      progress: number
      status: "uploading" | "processing" | "success" | "error"
      error?: string
    }>
  >([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreview || null)
  const [showPreview, setShowPreview] = useState(false)

  const acceptedTypes = {
    images: ".jpg,.jpeg,.png,.gif,.webp",
    videos: ".mp4,.webm,.mov,.avi",
    documents: ".pdf,.doc,.docx,.txt",
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleFiles = (selectedFiles: File[]) => {
    // Filter files based on active tab
    const filteredFiles = selectedFiles.filter((file) => {
      const fileType = file.type.split("/")[0]
      if (activeTab === "images" && fileType === "image") return true
      if (activeTab === "videos" && fileType === "video") return true
      if (activeTab === "documents" && (fileType === "application" || fileType === "text")) return true
      return false
    })

    if (filteredFiles.length === 0) return

    // Limit to max files
    const filesToAdd = filteredFiles.slice(0, maxFiles - files.length)
    if (filesToAdd.length === 0) return

    // Add files to state
    const newFiles = filesToAdd.map((file) => ({
      file,
      id: Math.random().toString(36).substring(2, 9),
      preview: URL.createObjectURL(file),
      progress: 0,
      status: "uploading" as const,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Start upload simulation for each file
    newFiles.forEach((fileObj) => {
      simulateUpload(fileObj.id)
    })

    // Set preview URL for the first file
    if (newFiles.length > 0 && !previewUrl) {
      setPreviewUrl(newFiles[0].preview)
    }

    // Call onUpload with the new files
    onUpload(filesToAdd)
  }

  const simulateUpload = (id: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 5

      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, progress: Math.min(progress, 100) } : f)))

      if (progress >= 100) {
        clearInterval(interval)

        // Set status to processing
        setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "processing" } : f)))

        // Simulate processing delay
        setTimeout(() => {
          // Randomly succeed or fail (90% success rate)
          const success = Math.random() > 0.1

          setFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? {
                    ...f,
                    status: success ? "success" : "error",
                    error: success ? undefined : "Upload failed. Please try again.",
                  }
                : f,
            ),
          )
        }, 1500)
      }
    }, 100)
  }

  const handleRetry = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, progress: 0, status: "uploading", error: undefined } : f)),
    )
    simulateUpload(id)
  }

  const handleRemoveFile = (id: string) => {
    const fileToRemove = files.find((f) => f.id === id)
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview)
    }

    setFiles((prev) => prev.filter((f) => f.id !== id))

    // If removing the file that's currently previewed, update preview
    if (fileToRemove && previewUrl === fileToRemove.preview) {
      const remainingFiles = files.filter((f) => f.id !== id)
      if (remainingFiles.length > 0) {
        setPreviewUrl(remainingFiles[0].preview)
      } else {
        setPreviewUrl(null)
        onRemove()
      }
    }
  }

  const handleRemoveAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview))
    setFiles([])
    setPreviewUrl(null)
    onRemove()
  }

  const getFileTypeIcon = (file: File) => {
    const fileType = file.type.split("/")[0]

    if (fileType === "image") {
      return <ImageIcon className="h-5 w-5 text-blue-500" />
    } else if (fileType === "video") {
      return <FileVideo className="h-5 w-5 text-purple-500" />
    } else {
      return <FileText className="h-5 w-5 text-orange-500" />
    }
  }

  const getTabIcon = (tab: "images" | "videos" | "documents") => {
    switch (tab) {
      case "images":
        return <ImageIcon className="h-4 w-4" />
      case "videos":
        return <FileVideo className="h-4 w-4" />
      case "documents":
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {files.length === 0 && (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border",
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="p-4">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="images" className="flex items-center gap-2">
                  {getTabIcon("images")}
                  <span className="hidden sm:inline">Images</span>
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2">
                  {getTabIcon("videos")}
                  <span className="hidden sm:inline">Videos</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  {getTabIcon("documents")}
                  <span className="hidden sm:inline">Documents</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              {getTabIcon(activeTab)}
              <h3 className="mt-4 text-lg font-medium">
                Upload {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                Drag and drop your {activeTab} here, or click to browse
              </p>

              <div className="mt-4">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="relative">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose {activeTab === "images" ? "Image" : activeTab === "videos" ? "Video" : "Document"}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedTypes[activeTab]}
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    multiple={maxFiles > 1}
                  />
                </Button>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Max {maxFiles} file{maxFiles > 1 ? "s" : ""} • Accepted formats: {acceptedTypes[activeTab]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview Area */}
      {previewUrl && (
        <div className="relative rounded-lg overflow-hidden bg-muted/30 aspect-video">
          {previewUrl.includes("video") ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <FileVideo className="h-16 w-16 text-muted" />
            </div>
          ) : previewUrl.includes("application") || previewUrl.includes("text") ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <FileText className="h-16 w-16 text-muted" />
            </div>
          ) : (
            <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
          )}

          <div className="absolute top-2 right-2 flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
              onClick={() => setShowPreview(true)}
            >
              <Eye className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
              onClick={handleRemoveAll}
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Uploaded Files</h4>
            {files.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10"
                onClick={handleRemoveAll}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Remove All
              </Button>
            )}
          </div>

          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
            <AnimatePresence>
              {files.map((fileObj) => (
                <motion.div
                  key={fileObj.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-muted/30 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {fileObj.status === "success" ? (
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        ) : fileObj.status === "error" ? (
                          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            {getFileTypeIcon(fileObj.file)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                          <p className="font-medium text-sm truncate">{fileObj.file.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {(fileObj.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {fileObj.status === "error" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRetry(fileObj.id)}
                          className="h-7 w-7 p-0"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      ) : fileObj.status === "success" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewUrl(fileObj.preview)}
                          className="h-7 w-7 p-0"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      ) : null}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(fileObj.id)}
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {(fileObj.status === "uploading" || fileObj.status === "processing") && (
                    <div className="mt-2 space-y-1">
                      {fileObj.status === "uploading" && (
                        <>
                          <div className="flex items-center justify-between text-xs">
                            <span>Uploading...</span>
                            <span>{fileObj.progress}%</span>
                          </div>
                          <Progress value={fileObj.progress} className="h-1" />
                        </>
                      )}

                      {fileObj.status === "processing" && (
                        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground py-1">
                          <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      )}
                    </div>
                  )}

                  {fileObj.status === "error" && fileObj.error && (
                    <p className="mt-2 text-xs text-red-500">{fileObj.error}</p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Full Preview Modal */}
      {showPreview && previewUrl && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
              onClick={() => setShowPreview(false)}
            >
              <X className="h-4 w-4 text-white" />
            </Button>

            {previewUrl.includes("video") ? (
              <div className="w-full h-full flex items-center justify-center">
                <FileVideo className="h-24 w-24 text-muted" />
              </div>
            ) : previewUrl.includes("application") || previewUrl.includes("text") ? (
              <div className="w-full h-full flex items-center justify-center">
                <FileText className="h-24 w-24 text-muted" />
              </div>
            ) : (
              <div className="relative w-full h-full">
                <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
