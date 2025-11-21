"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, CheckCircle, AlertCircle, XCircle, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { ProfileFormData, VerificationDocument } from "../../types"

interface VerificationStepProps {
  data: ProfileFormData
  updateData: (updates: Partial<ProfileFormData>) => void
}

export function VerificationStep({ data, updateData }: VerificationStepProps) {
  const [documentType, setDocumentType] = useState<"association" | "company" | "credit" | "other">("association")
  const [documentName, setDocumentName] = useState("")
  const [documentNotes, setDocumentNotes] = useState("")

  const handleAddDocument = () => {
    if (documentName.trim()) {
      const newDocument: VerificationDocument = {
        id: `doc-${Date.now()}`,
        type: documentType,
        name: documentName.trim(),
        url: "/placeholder.svg",
        uploadedAt: new Date(),
        status: "pending",
      }

      updateData({
        verificationDocuments: [...(data.verificationDocuments || []), newDocument],
      })

      // Reset form
      setDocumentName("")
      setDocumentNotes("")
    }
  }

  const handleRemoveDocument = (id: string) => {
    updateData({
      verificationDocuments: data.verificationDocuments?.filter((doc) => doc.id !== id),
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "verified":
        return "Verified"
      case "rejected":
        return "Rejected"
      default:
        return "Pending Review"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Verification Documents</CardTitle>
          <CardDescription>Upload documents to verify your industry professional status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-[#1A1A1A] border-[#FFD700] text-[#FFD700]/80">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verification Required</AlertTitle>
            <AlertDescription>
              To receive an official industry professional status, please provide documentation that verifies your role
              in the industry. This could include industry association memberships, production company registrations, or
              significant film credits.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type</Label>
                <Select value={documentType} onValueChange={(value: any) => setDocumentType(value)}>
                  <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A]">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#282828] border-[#3A3A3A]">
                    <SelectItem value="association">Industry Association</SelectItem>
                    <SelectItem value="company">Company Registration</SelectItem>
                    <SelectItem value="credit">Film Credit</SelectItem>
                    <SelectItem value="other">Other Verification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentName">Document Name</Label>
                <Input
                  id="documentName"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
                  placeholder="e.g. Directors Guild Membership"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentNotes">Additional Notes (Optional)</Label>
              <Textarea
                id="documentNotes"
                value={documentNotes}
                onChange={(e) => setDocumentNotes(e.target.value)}
                className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
                placeholder="Any additional information about this document..."
              />
            </div>

            <div className="bg-[#1A1A1A] border border-dashed border-[#3A3A3A] rounded-lg p-6 flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-gray-500 mb-4" />
              <p className="text-gray-400 mb-2">Drag and drop your document here, or click to browse</p>
              <Button variant="outline" className="border-[#3A3A3A] hover:bg-[#3A3A3A]">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, JPG, PNG (Max 10MB)</p>
            </div>

            <Button
              onClick={handleAddDocument}
              disabled={!documentName.trim()}
              className="w-full bg-[#00BFFF] hover:bg-[#0099CC] text-black"
            >
              Add Document
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>Review your verification documents</CardDescription>
        </CardHeader>
        <CardContent>
          {data.verificationDocuments && data.verificationDocuments.length > 0 ? (
            <div className="space-y-3">
              {data.verificationDocuments.map((doc) => (
                <div key={doc.id} className="bg-[#1A1A1A] rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded bg-[#3A3A3A] flex items-center justify-center mr-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-400 capitalize">{doc.type.replace("_", " ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      {getStatusIcon(doc.status)}
                      <span className="ml-2 text-sm">{getStatusText(doc.status)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="text-gray-400 hover:text-white hover:bg-[#3A3A3A]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-500" />
              <p>No documents uploaded yet</p>
              <p className="text-sm">Add verification documents to establish your industry credentials</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
