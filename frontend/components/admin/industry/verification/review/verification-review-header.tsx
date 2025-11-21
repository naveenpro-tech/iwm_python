"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, CheckCircle, XCircle, MessageSquare, AlertCircle, Clock } from "lucide-react"

// Sample data for a verification request
const getVerificationRequest = (id: string) => {
  return {
    id,
    name: "Anurag Kashyap",
    role: "Director",
    company: "Phantom Films",
    submittedAt: "2023-05-24T10:30:00Z",
    status: "pending",
    avatar: "/user-avatar-1.png",
    documents: 5,
    credits: 12,
    email: "anurag.kashyap@example.com",
    phone: "+91 98765 43210",
    website: "https://anuragkashyap.com",
    bio: "Anurag Kashyap is an Indian film director, writer, editor, producer and actor known for his work in Hindi cinema.",
  }
}

export function VerificationReviewHeader({ id }: { id: string }) {
  const request = getVerificationRequest(id)
  const [status, setStatus] = useState(request.status)

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
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  const handleApprove = () => {
    setStatus("approved")
  }

  const handleReject = () => {
    setStatus("rejected")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/industry/verification">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Verification Review</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row gap-6 p-6 rounded-lg border bg-card/50"
      >
        <div className="flex flex-col items-center md:items-start gap-4 md:flex-row">
          <Avatar className="h-20 w-20 border border-border">
            <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.name} />
            <AvatarFallback className="text-2xl">
              {request.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{request.name}</h2>
            <p className="text-muted-foreground">
              {request.role} at {request.company}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {getStatusBadge(status)}
              <div className="text-sm text-muted-foreground">Submitted on {formatDate(request.submittedAt)}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4">
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div>{request.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div>{request.phone}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Website</div>
                <div>{request.website}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Documents</div>
                <div>{request.documents} uploaded</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 md:mt-0 md:ml-auto">
          <Button variant="outline" className="gap-1">
            <MessageSquare className="h-4 w-4" />
            Request Info
          </Button>
          <Button variant="outline" className="gap-1 text-amber-500 border-amber-500 hover:bg-amber-500/10">
            <AlertCircle className="h-4 w-4" />
            Flag
          </Button>
          <Button
            variant="outline"
            className="gap-1 text-red-500 border-red-500 hover:bg-red-500/10"
            onClick={handleReject}
          >
            <XCircle className="h-4 w-4" />
            Reject
          </Button>
          <Button className="gap-1" onClick={handleApprove}>
            <CheckCircle className="h-4 w-4" />
            Approve
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
