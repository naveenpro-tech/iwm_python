"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User,
  Film,
  Link2,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Eye,
  FileCheck,
  FileBadge,
  FileWarning,
  Calendar,
  Building,
} from "lucide-react"
import Image from "next/image"

interface VerificationReviewInterfaceProps {
  profileId: string
}

export default function VerificationReviewInterface({ profileId }: VerificationReviewInterfaceProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [decision, setDecision] = useState<"approve" | "reject" | "more-info" | null>(null)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [previewDocument, setPreviewDocument] = useState<{ title: string; url: string } | null>(null)

  // Mock profile data
  const profile = {
    id: profileId,
    name: "Christopher Nolan",
    officialTitle: "Film Director & Producer",
    email: "christopher.nolan@example.com",
    phone: "+1 (555) 123-4567",
    submissionDate: new Date("2023-11-10T14:30:00"),
    status: "pending",
    documents: [
      {
        id: "doc-1",
        type: "identity",
        title: "Passport",
        uploadDate: new Date("2023-11-08T09:15:00"),
        status: "pending",
        url: "/passport-document.png",
      },
      {
        id: "doc-2",
        type: "professional",
        title: "Directors Guild Membership",
        uploadDate: new Date("2023-11-08T09:20:00"),
        status: "pending",
        url: "/generic-membership-card.png",
      },
      {
        id: "doc-3",
        type: "awards",
        title: "Academy Award Certificate",
        uploadDate: new Date("2023-11-08T09:25:00"),
        status: "pending",
        url: "/award-certificate.png",
      },
    ],
    companyAffiliations: [
      {
        id: "company-1",
        name: "Warner Bros. Pictures",
        role: "Director",
        startDate: "2002-01-01",
        current: true,
        verified: true,
      },
      {
        id: "company-2",
        name: "Syncopy Films",
        role: "Founder & Producer",
        startDate: "2001-01-01",
        current: true,
        verified: true,
      },
    ],
    filmography: [
      {
        id: "film-1",
        title: "Oppenheimer",
        role: "Director",
        year: "2023",
        verified: true,
      },
      {
        id: "film-2",
        title: "Tenet",
        role: "Director",
        year: "2020",
        verified: true,
      },
      {
        id: "film-3",
        title: "Dunkirk",
        role: "Director",
        year: "2017",
        verified: true,
      },
    ],
    socialMedia: [
      {
        platform: "twitter",
        url: "https://twitter.com/example",
      },
    ],
    verificationHistory: [
      {
        id: "history-1",
        date: new Date("2023-11-10T15:30:00"),
        action: "Submitted for verification",
        by: "User",
      },
    ],
  }

  const handleOpenPreview = (document: { title: string; url: string }) => {
    setPreviewDocument(document)
    setIsPreviewDialogOpen(true)
  }

  const handleSubmitDecision = () => {
    if (!decision) return
    setIsConfirmDialogOpen(true)
  }

  const handleConfirmDecision = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsConfirmDialogOpen(false)
      // In a real app, you would redirect or show a success message
      console.log("Decision submitted:", decision, "Notes:", notes)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Verification Review</h1>
          <p className="text-muted-foreground">Review verification documents and make a decision</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-amber-500 border-amber-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending Review
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Submitted {profile.submissionDate.toLocaleDateString()}
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
                <Image
                  src="/christopher-nolan.png"
                  alt={profile.name}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.officialTitle}</p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.companyAffiliations[0]?.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Film className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.filmography.length} credits</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="filmography">Filmography</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verification Summary</CardTitle>
              <CardDescription>Overview of submitted verification documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                          <FileBadge className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Identity Documents</h3>
                          <p className="text-sm text-muted-foreground">1 document pending review</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                          <FileCheck className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Professional Documents</h3>
                          <p className="text-sm text-muted-foreground">1 document pending review</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                          <FileWarning className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Awards & Recognition</h3>
                          <p className="text-sm text-muted-foreground">1 document pending review</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Company Affiliations</h3>
                  <div className="space-y-3">
                    {profile.companyAffiliations.map((company) => (
                      <div key={company.id} className="flex items-start justify-between bg-muted/30 p-3 rounded-md">
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="font-medium">{company.name}</h4>
                            {company.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{company.role}</p>
                          <p className="text-xs text-muted-foreground">
                            Since {new Date(company.startDate).getFullYear()}
                            {company.current ? " - Present" : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Filmography</h3>
                  <div className="space-y-3">
                    {profile.filmography.map((film) => (
                      <div key={film.id} className="flex items-start justify-between bg-muted/30 p-3 rounded-md">
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="font-medium">
                              {film.title} ({film.year})
                            </h4>
                            {film.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{film.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="identity" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileBadge className="h-5 w-5 mr-2 text-amber-600" />
                Identity Verification
              </CardTitle>
              <CardDescription>Review identity documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.documents
                  .filter((doc) => doc.type === "identity")
                  .map((document) => (
                    <div key={document.id} className="flex items-start justify-between bg-muted/30 p-4 rounded-md">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-muted rounded overflow-hidden relative flex-shrink-0">
                          <Image
                            src={document.url || "/placeholder.svg"}
                            alt={document.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{document.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Uploaded on {document.uploadDate.toLocaleDateString()}
                          </p>
                          <Badge
                            variant="outline"
                            className={
                              document.status === "approved"
                                ? "text-green-500 border-green-500"
                                : document.status === "rejected"
                                  ? "text-red-500 border-red-500"
                                  : "text-amber-500 border-amber-500"
                            }
                          >
                            {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleOpenPreview(document)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileCheck className="h-5 w-5 mr-2 text-blue-600" />
                Professional Verification
              </CardTitle>
              <CardDescription>Review professional credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.documents
                  .filter((doc) => doc.type === "professional")
                  .map((document) => (
                    <div key={document.id} className="flex items-start justify-between bg-muted/30 p-4 rounded-md">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-muted rounded overflow-hidden relative flex-shrink-0">
                          <Image
                            src={document.url || "/placeholder.svg"}
                            alt={document.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{document.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Uploaded on {document.uploadDate.toLocaleDateString()}
                          </p>
                          <Badge
                            variant="outline"
                            className={
                              document.status === "approved"
                                ? "text-green-500 border-green-500"
                                : document.status === "rejected"
                                  ? "text-red-500 border-red-500"
                                  : "text-amber-500 border-amber-500"
                            }
                          >
                            {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleOpenPreview(document)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filmography" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Film className="h-5 w-5 mr-2 text-purple-600" />
                Filmography Verification
              </CardTitle>
              <CardDescription>Review filmography and credits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.filmography.map((film) => (
                  <div key={film.id} className="flex items-start justify-between bg-muted/30 p-4 rounded-md">
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-medium">
                          {film.title} ({film.year})
                        </h4>
                        {film.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{film.role}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="sm" className="h-8">
                          <Link2 className="h-3 w-3 mr-1" />
                          IMDB
                        </Button>
                        <Button variant="outline" size="sm" className="h-8">
                          <Link2 className="h-3 w-3 mr-1" />
                          Wikipedia
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-green-500 border-green-500">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-red-500 border-red-500">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                Verification History
              </CardTitle>
              <CardDescription>Timeline of verification activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.verificationHistory.map((event) => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{event.action}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{event.date.toLocaleString()}</span>
                        <span>•</span>
                        <span>By {event.by}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Verification Decision</CardTitle>
          <CardDescription>Make a decision on this verification request</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RadioGroup value={decision || ""} onValueChange={(value) => setDecision(value as any)}>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="approve" id="approve" />
                  <Label htmlFor="approve" className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-2 text-green-500" />
                    Approve Verification
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reject" id="reject" />
                  <Label htmlFor="reject" className="flex items-center">
                    <ThumbsDown className="h-4 w-4 mr-2 text-red-500" />
                    Reject Verification
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="more-info" id="more-info" />
                  <Label htmlFor="more-info" className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                    Request More Information
                  </Label>
                </div>
              </div>
            </RadioGroup>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes or feedback about this verification request..."
                rows={4}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSubmitDecision} disabled={!decision}>
            Submit Decision
          </Button>
        </CardFooter>
      </Card>

      {/* Document Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] sm:max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{previewDocument?.title}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[500px] bg-muted rounded-md overflow-hidden">
            {previewDocument && (
              <Image
                src={previewDocument.url || "/placeholder.svg"}
                alt={previewDocument.title}
                fill
                className="object-contain"
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Decision</DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              {decision === "approve" ? "approve" : decision === "reject" ? "reject" : "request more information for"}{" "}
              this verification request?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {decision === "approve" && (
              <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">Approve Verification</p>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    This profile will be marked as verified and will receive a verification badge.
                  </p>
                </div>
              </div>
            )}

            {decision === "reject" && (
              <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-300">Reject Verification</p>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    This profile will not be verified and the user will be notified of the rejection.
                  </p>
                </div>
              </div>
            )}

            {decision === "more-info" && (
              <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-300">Request More Information</p>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    The user will be notified to provide additional information for verification.
                  </p>
                </div>
              </div>
            )}

            {notes && (
              <div className="mt-4">
                <p className="text-sm font-medium">Notes:</p>
                <p className="text-sm text-muted-foreground mt-1">{notes}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDecision}
              disabled={isSubmitting}
              variant={decision === "approve" ? "default" : decision === "reject" ? "destructive" : "outline"}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                "Confirm Decision"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
