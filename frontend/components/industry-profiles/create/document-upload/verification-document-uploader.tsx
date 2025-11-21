"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Eye,
  Trash2,
  RotateCcw,
  Plus,
  Minus,
  Loader2,
  FileCheck,
  FileWarning,
  Info,
  HelpCircle,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Document types with detailed information
const documentTypes = [
  {
    id: "identity",
    label: "Identity Document",
    description: "Government-issued photo ID such as passport, driver's license, or national ID card",
    examples: ["Passport", "Driver's License", "National ID Card"],
    required: true,
    maxSize: 5, // MB
    acceptedFormats: [".jpg", ".jpeg", ".png", ".pdf"],
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: "professional",
    label: "Professional Credential",
    description: "Industry membership cards, guild memberships, or professional certifications",
    examples: ["Directors Guild Card", "Producers Guild Card", "Union Membership"],
    required: true,
    maxSize: 5, // MB
    acceptedFormats: [".jpg", ".jpeg", ".png", ".pdf"],
    icon: <FileCheck className="h-5 w-5" />,
  },
  {
    id: "award",
    label: "Award Certificate",
    description: "Certificates or official documentation of industry awards or recognitions",
    examples: ["Award Certificate", "Official Award Letter", "Recognition Document"],
    required: false,
    maxSize: 5, // MB
    acceptedFormats: [".jpg", ".jpeg", ".png", ".pdf"],
    icon: <FileCheck className="h-5 w-5" />,
  },
  {
    id: "press",
    label: "Press Coverage",
    description: "Articles, interviews, or press mentions that verify your industry status",
    examples: ["Magazine Article", "Newspaper Clipping", "Online Interview"],
    required: false,
    maxSize: 10, // MB
    acceptedFormats: [".jpg", ".jpeg", ".png", ".pdf"],
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: "other",
    label: "Other Supporting Document",
    description: "Any other document that supports your verification request",
    examples: ["Contract", "Official Letter", "Other Proof"],
    required: false,
    maxSize: 10, // MB
    acceptedFormats: [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"],
    icon: <FileText className="h-5 w-5" />,
  },
]

// Mock uploaded documents for demonstration
const mockUploadedDocuments = [
  {
    id: "doc-1",
    name: "passport.jpg",
    type: "identity",
    size: 2.4, // MB
    uploadDate: new Date("2023-05-15"),
    status: "verified",
    url: "/passport-document.png",
    notes: "Verified on May 20, 2023",
  },
  {
    id: "doc-2",
    name: "directors_guild_card.pdf",
    type: "professional",
    size: 1.8, // MB
    uploadDate: new Date("2023-05-15"),
    status: "pending",
    url: "/generic-membership-card.png",
    notes: "Awaiting verification",
  },
  {
    id: "doc-3",
    name: "award_certificate.pdf",
    type: "award",
    size: 3.2, // MB
    uploadDate: new Date("2023-05-16"),
    status: "rejected",
    url: "/award-certificate.png",
    notes: "Document unclear, please resubmit with higher resolution",
  },
]

interface VerificationDocumentUploaderProps {
  initialDocuments?: any[]
  onDocumentsChange?: (documents: any[]) => void
}

export default function VerificationDocumentUploader({
  initialDocuments = mockUploadedDocuments,
  onDocumentsChange,
}: VerificationDocumentUploaderProps) {
  const [documents, setDocuments] = useState(initialDocuments)
  const [activeTab, setActiveTab] = useState("upload")
  const [selectedDocType, setSelectedDocType] = useState(documentTypes[0].id)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState("")
  const [previewDocument, setPreviewDocument] = useState<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update parent component when documents change
  useEffect(() => {
    if (onDocumentsChange) {
      onDocumentsChange(documents)
    }
  }, [documents, onDocumentsChange])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
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
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    // Get selected document type
    const docType = documentTypes.find((type) => type.id === selectedDocType)
    if (!docType) return

    // Validate file size
    if (file.size > docType.maxSize * 1024 * 1024) {
      setUploadError(`File size exceeds the maximum allowed size of ${docType.maxSize}MB`)
      return
    }

    // Validate file format
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
    if (!docType.acceptedFormats.includes(fileExtension)) {
      setUploadError(`Invalid file format. Accepted formats: ${docType.acceptedFormats.join(", ")}`)
      return
    }

    // Reset error and start upload
    setUploadError("")
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const totalTime = 3000 // 3 seconds for simulation
    const interval = 100 // Update every 100ms
    const steps = totalTime / interval
    let currentStep = 0

    const progressInterval = setInterval(() => {
      currentStep++
      const newProgress = Math.min((currentStep / steps) * 100, 99)
      setUploadProgress(newProgress)

      if (currentStep >= steps) {
        clearInterval(progressInterval)

        // Simulate processing
        setTimeout(() => {
          setUploadProgress(100)

          // Create new document object
          const newDocument = {
            id: `doc-${Date.now()}`,
            name: file.name,
            type: selectedDocType,
            size: Number.parseFloat((file.size / (1024 * 1024)).toFixed(1)), // Convert to MB
            uploadDate: new Date(),
            status: "pending",
            url: URL.createObjectURL(file),
            notes: "Awaiting verification",
          }

          // Add to documents list
          setDocuments((prev) => [...prev, newDocument])

          // Reset upload state
          setTimeout(() => {
            setIsUploading(false)
            setUploadProgress(0)

            // Switch to manage tab
            setActiveTab("manage")

            // Reset file input
            if (fileInputRef.current) {
              fileInputRef.current.value = ""
            }
          }, 500)
        }, 500)
      }
    }, interval)
  }

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const handlePreviewDocument = (document: any) => {
    setPreviewDocument(document)
    setIsPreviewOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <Info className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        )
    }
  }

  // Document preview component with zoom and pan controls
  const DocumentPreview = ({ document }: { document: any }) => {
    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDraggingPreview, setIsDraggingPreview] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

    const handleZoomIn = () => {
      setScale((prev) => Math.min(prev + 0.25, 3))
    }

    const handleZoomOut = () => {
      setScale((prev) => Math.max(prev - 0.25, 0.5))
    }

    const handleReset = () => {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    }

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDraggingPreview(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
      if (isDraggingPreview) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
    }

    const handleMouseUp = () => {
      setIsDraggingPreview(false)
    }

    const handleMouseLeave = () => {
      setIsDraggingPreview(false)
    }

    const isPdf = document.name.toLowerCase().endsWith(".pdf")

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">{document.name}</h3>
            <p className="text-sm text-muted-foreground">
              {documentTypes.find((type) => type.id === document.type)?.label} • {document.size}MB
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={scale <= 0.5}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm w-16 text-center">{Math.round(scale * 100)}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={scale >= 3}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          className="relative overflow-hidden bg-checkerboard rounded-md border h-[400px] flex items-center justify-center"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: isDraggingPreview ? "grabbing" : "grab" }}
        >
          {isPdf ? (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">PDF Preview</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                PDF preview is not available in this demo. In the full implementation, a PDF viewer would be integrated
                here.
              </p>
              <Button className="mt-4">
                <Eye className="h-4 w-4 mr-2" />
                Open PDF
              </Button>
            </div>
          ) : (
            <div
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transition: isDraggingPreview ? "none" : "transform 0.2s",
              }}
              className="max-w-full max-h-full"
            >
              <Image
                src={document.url || "/placeholder.svg"}
                alt={document.name}
                width={800}
                height={600}
                className="max-w-none"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getStatusBadge(document.status)}
            <span className="text-sm text-muted-foreground ml-2">
              Uploaded on {document.uploadDate.toLocaleDateString()}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsPreviewOpen(false)}>
            Close
          </Button>
        </div>

        {document.notes && (
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm">
              <span className="font-medium">Notes:</span> {document.notes}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Verification Documents</h2>
          <p className="text-sm text-muted-foreground">
            Upload documents to verify your identity and professional status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Verification Guide
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p className="text-sm">
                  Learn more about our verification process and requirements in our comprehensive guide.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Documents</TabsTrigger>
          <TabsTrigger value="manage">Manage Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="document-type">Document Type</Label>
                  <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                    <SelectTrigger id="document-type">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center">
                            {type.icon}
                            <span className="ml-2">{type.label}</span>
                            {type.required && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {documentTypes.find((type) => type.id === selectedDocType) && (
                  <div className="bg-muted p-4 rounded-md space-y-3">
                    <h4 className="font-medium text-sm">
                      {documentTypes.find((type) => type.id === selectedDocType)?.label}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {documentTypes.find((type) => type.id === selectedDocType)?.description}
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium">Examples:</p>
                      <ul className="text-xs text-muted-foreground list-disc list-inside">
                        {documentTypes
                          .find((type) => type.id === selectedDocType)
                          ?.examples.map((example, index) => (
                            <li key={index}>{example}</li>
                          ))}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="font-normal">
                        Max {documentTypes.find((type) => type.id === selectedDocType)?.maxSize}MB
                      </Badge>
                      <Badge variant="outline" className="font-normal">
                        {documentTypes.find((type) => type.id === selectedDocType)?.acceptedFormats.join(", ")}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center p-8 transition-colors",
                  isDragging
                    ? "border-primary/70 bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50",
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isUploading ? (
                  <div className="w-full max-w-xs space-y-4">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
                      <h3 className="font-medium">Uploading Document</h3>
                      <p className="text-sm text-muted-foreground">
                        {uploadProgress < 100 ? "Uploading..." : "Processing..."}
                      </p>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground">
                      {uploadProgress < 100 ? `${Math.round(uploadProgress)}% complete` : "Finalizing upload..."}
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-1">Upload Document</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                      Drag and drop your document here, or click to browse
                    </p>
                    <Button onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Select File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept={documentTypes.find((type) => type.id === selectedDocType)?.acceptedFormats.join(",")}
                    />
                  </>
                )}
              </div>

              {uploadError && (
                <div className="mt-4 bg-red-500/10 text-red-500 p-3 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{uploadError}</p>
                </div>
              )}

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Upload Requirements</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Clear, legible document images or scans
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    All text and information must be clearly visible
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Documents must be current and not expired
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Your name must match your profile information
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4 pt-4">
          {documents.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Your Documents ({documents.length})</h3>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("upload")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {documents.map((document) => (
                    <motion.div
                      key={document.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                              {document.name.toLowerCase().endsWith(".pdf") ? (
                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                  <FileText className="h-6 w-6 text-muted-foreground" />
                                </div>
                              ) : (
                                <Image
                                  src={document.url || "/placeholder.svg"}
                                  alt={document.name}
                                  width={48}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium truncate">{document.name}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                      {documentTypes.find((type) => type.id === document.type)?.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <span className="text-xs text-muted-foreground">{document.size} MB</span>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <span className="text-xs text-muted-foreground">
                                      {document.uploadDate.toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">{getStatusBadge(document.status)}</div>
                              </div>

                              {document.notes && (
                                <div className="mt-2">
                                  <p className="text-xs text-muted-foreground">{document.notes}</p>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handlePreviewDocument(document)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDocument(document.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">Verification Status</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                          documents.some((doc) => doc.type === "identity" && doc.status === "verified")
                            ? "bg-green-500/20 text-green-500"
                            : "bg-muted-foreground/20 text-muted-foreground",
                        )}
                      >
                        {documents.some((doc) => doc.type === "identity" && doc.status === "verified") ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">Identity Verification</p>
                        <p className="text-xs text-muted-foreground">Government-issued photo ID required</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        documents.some((doc) => doc.type === "identity" && doc.status === "verified")
                          ? "default"
                          : "outline"
                      }
                    >
                      {documents.some((doc) => doc.type === "identity" && doc.status === "verified")
                        ? "Verified"
                        : documents.some((doc) => doc.type === "identity")
                          ? "Pending"
                          : "Required"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                          documents.some((doc) => doc.type === "professional" && doc.status === "verified")
                            ? "bg-green-500/20 text-green-500"
                            : "bg-muted-foreground/20 text-muted-foreground",
                        )}
                      >
                        {documents.some((doc) => doc.type === "professional" && doc.status === "verified") ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">Professional Verification</p>
                        <p className="text-xs text-muted-foreground">Industry membership or credential required</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        documents.some((doc) => doc.type === "professional" && doc.status === "verified")
                          ? "default"
                          : "outline"
                      }
                    >
                      {documents.some((doc) => doc.type === "professional" && doc.status === "verified")
                        ? "Verified"
                        : documents.some((doc) => doc.type === "professional")
                          ? "Pending"
                          : "Required"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                          documents.some((doc) => doc.type === "award" && doc.status === "verified")
                            ? "bg-green-500/20 text-green-500"
                            : "bg-muted-foreground/20 text-muted-foreground",
                        )}
                      >
                        {documents.some((doc) => doc.type === "award" && doc.status === "verified") ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Info className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">Award Verification</p>
                        <p className="text-xs text-muted-foreground">Optional: Enhances profile credibility</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        documents.some((doc) => doc.type === "award" && doc.status === "verified")
                          ? "default"
                          : "outline"
                      }
                    >
                      {documents.some((doc) => doc.type === "award" && doc.status === "verified")
                        ? "Verified"
                        : documents.some((doc) => doc.type === "award")
                          ? "Pending"
                          : "Optional"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <FileWarning className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Documents Uploaded</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                You haven't uploaded any verification documents yet. Upload documents to verify your identity and
                professional status.
              </p>
              <Button className="mt-4" onClick={() => setActiveTab("upload")}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          {previewDocument && <DocumentPreview document={previewDocument} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
