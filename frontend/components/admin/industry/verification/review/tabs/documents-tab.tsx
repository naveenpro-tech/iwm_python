"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, Download, Eye, FileText, Film } from "lucide-react"

export function DocumentsTab({ id }: { id: string }) {
  // Sample data for verification documents
  const documents = [
    {
      id: "doc-001",
      name: "Government ID Card.jpg",
      type: "identity",
      status: "pending",
      size: "2.4 MB",
      uploadedAt: "2023-05-24T10:30:00Z",
      icon: Image,
    },
    {
      id: "doc-002",
      name: "Professional Certificate.pdf",
      type: "certificate",
      status: "pending",
      size: "1.8 MB",
      uploadedAt: "2023-05-24T10:31:00Z",
      icon: FileText,
    },
    {
      id: "doc-003",
      name: "Industry Association Membership.pdf",
      type: "membership",
      status: "pending",
      size: "3.2 MB",
      uploadedAt: "2023-05-24T10:32:00Z",
      icon: FileText,
    },
    {
      id: "doc-004",
      name: "Award Certificate.pdf",
      type: "award",
      status: "pending",
      size: "1.5 MB",
      uploadedAt: "2023-05-24T10:33:00Z",
      icon: FileText,
    },
    {
      id: "doc-005",
      name: "Showreel.mp4",
      type: "portfolio",
      status: "pending",
      size: "24.8 MB",
      uploadedAt: "2023-05-24T10:34:00Z",
      icon: Film,
    },
  ]

  const [docs, setDocs] = useState(documents)

  const handleStatusChange = (id: string, newStatus: string) => {
    setDocs(docs.map((doc) => (doc.id === id ? { ...doc, status: newStatus } : doc)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-600">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Rejected
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:text-amber-600">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  return (
    <div className="space-y-4 mt-6">
      {docs.map((doc, index) => (
        <motion.div
          key={doc.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <doc.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{doc.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {doc.size} • Uploaded {formatDate(doc.uploadedAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(doc.status)}
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                      onClick={() => handleStatusChange(doc.id, "approved")}
                      title="Approve"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => handleStatusChange(doc.id, "rejected")}
                      title="Reject"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" title="View">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" title="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
