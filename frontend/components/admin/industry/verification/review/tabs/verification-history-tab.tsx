"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Clock, MessageSquare, User } from "lucide-react"

export function VerificationHistoryTab({ id }: { id: string }) {
  // Sample data for verification history
  const verificationHistory = [
    {
      id: "hist-001",
      action: "Verification Request Submitted",
      timestamp: "2023-05-24T10:30:00Z",
      user: "Anurag Kashyap",
      userType: "professional",
      details: "Initial verification request submitted with 5 documents and 12 filmography credits.",
      status: "pending",
    },
    {
      id: "hist-002",
      action: "Documents Reviewed",
      timestamp: "2023-05-25T14:15:00Z",
      user: "Admin User",
      userType: "admin",
      details: "All documents have been reviewed. 4 approved, 1 flagged for further verification.",
      status: "in-progress",
    },
    {
      id: "hist-003",
      action: "Additional Information Requested",
      timestamp: "2023-05-25T14:20:00Z",
      user: "Admin User",
      userType: "admin",
      details: "Requested additional proof for Government ID verification.",
      status: "info-requested",
    },
    {
      id: "hist-004",
      action: "Additional Information Provided",
      timestamp: "2023-05-26T09:45:00Z",
      user: "Anurag Kashyap",
      userType: "professional",
      details: "Uploaded additional verification document as requested.",
      status: "info-provided",
    },
    {
      id: "hist-005",
      action: "Filmography Credits Verified",
      timestamp: "2023-05-27T11:30:00Z",
      user: "Admin User",
      userType: "admin",
      details: "All 12 filmography credits have been verified against industry databases.",
      status: "approved",
    },
    {
      id: "hist-006",
      action: "Social Media Profiles Verified",
      timestamp: "2023-05-27T13:20:00Z",
      user: "Admin User",
      userType: "admin",
      details: "All 5 social media profiles have been verified as authentic.",
      status: "approved",
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
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
            <Clock className="w-3.5 h-3.5 mr-1" />
            Pending
          </Badge>
        )
      case "in-progress":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-600">
            <Clock className="w-3.5 h-3.5 mr-1" />
            In Progress
          </Badge>
        )
      case "info-requested":
        return (
          <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 hover:text-purple-600">
            <MessageSquare className="w-3.5 h-3.5 mr-1" />
            Info Requested
          </Badge>
        )
      case "info-provided":
        return (
          <Badge className="bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 hover:text-cyan-600">
            <MessageSquare className="w-3.5 h-3.5 mr-1" />
            Info Provided
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Verification Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6 border-l border-border">
            {verificationHistory.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="mb-8 last:mb-0 relative"
              >
                <div className="absolute -left-[25px] p-1 rounded-full bg-background border border-border">
                  {event.userType === "admin" ? (
                    <User className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4 text-secondary" />
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                  <div className="font-medium">{event.action}</div>
                  <div className="text-sm text-muted-foreground">{formatDate(event.timestamp)}</div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <div className="text-sm">
                    By: {event.user}
                    <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                      {event.userType === "admin" ? "Admin" : "Professional"}
                    </span>
                  </div>
                  <div>{getStatusBadge(event.status)}</div>
                </div>
                <div className="text-sm text-muted-foreground bg-card/50 p-3 rounded-md border border-border">
                  {event.details}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
