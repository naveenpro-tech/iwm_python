"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FileText, X, File, Award, FileCheck } from "lucide-react"
import type { ProfileFormData } from "../../types"

interface BiographyDocumentsStepProps {
  data: ProfileFormData
  updateData: (updates: Partial<ProfileFormData>) => void
}

export function BiographyDocumentsStep({ data, updateData }: BiographyDocumentsStepProps) {
  const characterCount = data.biography?.length || 0
  const maxCharacters = 2000

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, this would upload the file to storage
      // For now, we'll just simulate it
      updateData({
        resume: {
          url: URL.createObjectURL(e.target.files[0]),
          uploadedAt: new Date(),
        },
      })
    }
  }

  const handleAdditionalDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files && e.target.files[0]) {
      const newDoc = {
        type: type as "certificate" | "reference" | "award",
        name: e.target.files[0].name,
        url: URL.createObjectURL(e.target.files[0]),
      }

      const docs = data.additionalDocuments || []
      updateData({ additionalDocuments: [...docs, newDoc] })
    }
  }

  const removeDocument = (url: string) => {
    const docs = data.additionalDocuments?.filter((doc) => doc.url !== url) || []
    updateData({ additionalDocuments: docs })
  }

  return (
    <div className="space-y-6">
      {/* Biography */}
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Biography</CardTitle>
          <CardDescription>Tell your story and what makes you unique in the industry</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="biography">Your Story</Label>
              <span className={`text-xs ${characterCount > maxCharacters ? "text-red-400" : "text-gray-400"}`}>
                {characterCount} / {maxCharacters}
              </span>
            </div>
            <Textarea
              id="biography"
              value={data.biography || ""}
              onChange={(e) => updateData({ biography: e.target.value })}
              className="bg-[#1A1A1A] border-[#3A3A3A] min-h-[200px]"
              placeholder="Share your journey, training, inspirations, and what drives your passion for this industry..."
            />
          </div>

          <div className="bg-[#1A1A1A] p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Writing Tips:</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Start with a compelling opening that captures your essence</li>
              <li>• Highlight unique experiences or perspectives you bring</li>
              <li>• Mention notable training or mentors</li>
              <li>• Keep it professional but let your personality shine through</li>
              <li>• End with what you're looking for in future projects</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Resume/CV Upload */}
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Resume / CV</CardTitle>
          <CardDescription>Upload your professional resume or CV</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-[#1A1A1A] rounded-lg border-2 border-dashed border-[#3A3A3A] hover:border-[#00BFFF] transition-colors cursor-pointer p-6">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleResumeUpload}
            />
            <div className="flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-400">Click to upload your resume/CV</p>
              <p className="text-xs text-gray-500 mt-1">PDF preferred, max 5MB</p>
            </div>
          </div>

          {data.resume && (
            <div className="mt-4 bg-[#1A1A1A] p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileCheck className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Resume Uploaded</p>
                  <p className="text-xs text-gray-400">{new Date(data.resume.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateData({ resume: undefined })}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Documents */}
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Additional Documents</CardTitle>
          <CardDescription>Upload certificates, references, or awards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative bg-[#1A1A1A] rounded-lg border border-[#3A3A3A] hover:border-[#00BFFF] transition-colors cursor-pointer p-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleAdditionalDocumentUpload(e, "certificate")}
              />
              <div className="flex flex-col items-center justify-center">
                <File className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-400">Certificates</p>
              </div>
            </div>

            <div className="relative bg-[#1A1A1A] rounded-lg border border-[#3A3A3A] hover:border-[#00BFFF] transition-colors cursor-pointer p-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleAdditionalDocumentUpload(e, "reference")}
              />
              <div className="flex flex-col items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-400">References</p>
              </div>
            </div>

            <div className="relative bg-[#1A1A1A] rounded-lg border border-[#3A3A3A] hover:border-[#00BFFF] transition-colors cursor-pointer p-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleAdditionalDocumentUpload(e, "award")}
              />
              <div className="flex flex-col items-center justify-center">
                <Award className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-400">Awards</p>
              </div>
            </div>
          </div>

          {/* Document List */}
          {data.additionalDocuments && data.additionalDocuments.length > 0 && (
            <div className="space-y-2 mt-4">
              <h4 className="text-sm font-medium">Uploaded Documents</h4>
              <div className="space-y-2">
                {data.additionalDocuments.map((doc, index) => (
                  <div key={index} className="bg-[#1A1A1A] p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {doc.type === "certificate" && <File className="w-4 h-4 text-blue-400" />}
                      {doc.type === "reference" && <FileText className="w-4 h-4 text-green-400" />}
                      {doc.type === "award" && <Award className="w-4 h-4 text-yellow-400" />}
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(doc.url)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
