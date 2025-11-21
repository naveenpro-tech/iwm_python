"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileBadge, FileCheck, FileWarning, Info, CheckCircle, AlertCircle, HelpCircle } from "lucide-react"
import VerificationDocumentUploader from "../document-upload/verification-document-uploader"

interface VerificationStepProps {
  onNext: () => void
  onBack: () => void
}

export default function VerificationStepEnhanced({ onNext, onBack }: VerificationStepProps) {
  const [activeTab, setActiveTab] = useState("identity")
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, boolean>>({
    identity: false,
    professional: false,
    awards: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDocumentUpload = (documentType: string, file: File) => {
    console.log(`Uploaded ${documentType} document:`, file.name)
    setUploadedDocuments((prev) => ({ ...prev, [documentType]: true }))
  }

  const handleDocumentRemove = (documentType: string) => {
    console.log(`Removed ${documentType} document`)
    setUploadedDocuments((prev) => ({ ...prev, [documentType]: false }))
  }

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      onNext()
    }, 2000)
  }

  const isNextDisabled = !uploadedDocuments.identity || !uploadedDocuments.professional

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold">Verification Documents</h2>
        <p className="text-muted-foreground mt-1">
          Please provide documents to verify your identity and professional status
        </p>
      </div>

      <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/30">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 dark:text-amber-400">
                Your verification documents are securely stored and only accessed by our verification team. They will
                not be publicly visible on your profile.
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-400 mt-2">
                Verification typically takes 2-3 business days. You'll receive an email notification once your profile
                is verified.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="identity" className="relative">
            Identity
            {uploadedDocuments.identity && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-green-500">
                <CheckCircle className="h-3 w-3 text-white" />
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="professional" className="relative">
            Professional
            {uploadedDocuments.professional && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-green-500">
                <CheckCircle className="h-3 w-3 text-white" />
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="awards" className="relative">
            Awards
            {uploadedDocuments.awards && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-green-500">
                <CheckCircle className="h-3 w-3 text-white" />
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <FileBadge className="h-5 w-5 mr-2 text-blue-500" />
                Identity Verification
              </CardTitle>
              <CardDescription>Please provide a government-issued ID to verify your identity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <VerificationDocumentUploader
                  documentType="id"
                  title="Government-Issued ID"
                  description="Upload a passport, driver's license, or national ID card"
                  acceptedFormats=".jpg,.jpeg,.png,.pdf"
                  maxSize={10}
                  required={true}
                  onUpload={(file) => handleDocumentUpload("identity", file)}
                  onRemove={() => handleDocumentRemove("identity")}
                />

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                    Acceptable Documents
                  </h4>
                  <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                    <li>• Passport</li>
                    <li>• Driver's License</li>
                    <li>• National ID Card</li>
                    <li>• Residence Permit</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <FileCheck className="h-5 w-5 mr-2 text-green-500" />
                Professional Verification
              </CardTitle>
              <CardDescription>
                Please provide documents that verify your professional status in the film industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <VerificationDocumentUploader
                  documentType="professional"
                  title="Professional Credentials"
                  description="Upload guild membership, industry association card, or professional credentials"
                  acceptedFormats=".jpg,.jpeg,.png,.pdf"
                  maxSize={10}
                  required={true}
                  onUpload={(file) => handleDocumentUpload("professional", file)}
                  onRemove={() => handleDocumentRemove("professional")}
                />

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                    Acceptable Documents
                  </h4>
                  <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                    <li>• Guild Membership Card (DGA, PGA, WGA, SAG-AFTRA, etc.)</li>
                    <li>• Industry Association Membership</li>
                    <li>• Studio/Production Company ID</li>
                    <li>• Professional License or Certification</li>
                    <li>• Contract or Pay Stub (with sensitive information redacted)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="awards" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <FileWarning className="h-5 w-5 mr-2 text-yellow-500" />
                Awards & Recognitions
              </CardTitle>
              <CardDescription>
                Optional: Upload documents related to awards or recognitions you've received
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <VerificationDocumentUploader
                  documentType="awards"
                  title="Awards Documentation"
                  description="Upload award certificates, nomination letters, or press coverage"
                  acceptedFormats=".jpg,.jpeg,.png,.pdf"
                  maxSize={10}
                  required={false}
                  onUpload={(file) => handleDocumentUpload("awards", file)}
                  onRemove={() => handleDocumentRemove("awards")}
                />

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium flex items-center">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    This step is optional
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    While not required, providing award documentation can expedite your verification process and enhance
                    your profile's credibility.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="flex justify-between items-center pt-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="flex items-center gap-2">
          {!isNextDisabled ? (
            <div className="flex items-center text-green-500 text-sm mr-2">
              <CheckCircle className="h-4 w-4 mr-1" />
              Required documents uploaded
            </div>
          ) : (
            <div className="flex items-center text-amber-500 text-sm mr-2">
              <AlertCircle className="h-4 w-4 mr-1" />
              Required documents missing
            </div>
          )}
          <Button onClick={handleSubmit} disabled={isNextDisabled || isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
