"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import Link from "next/link"
import { CheckCircle, XCircle, AlertCircle, Clock, ExternalLink } from "lucide-react"

const verificationRequests = [
  {
    id: "vr-001",
    name: "Anurag Kashyap",
    role: "Director",
    company: "Phantom Films",
    submittedAt: "2023-05-24T10:30:00Z",
    avatar: "/christopher-nolan.png",
    status: "pending",
  },
  {
    id: "vr-002",
    name: "Zoya Akhtar",
    role: "Director",
    company: "Tiger Baby Films",
    submittedAt: "2023-05-23T14:45:00Z",
    avatar: "/user-avatar-1.png",
    status: "pending",
  },
  {
    id: "vr-003",
    name: "Siddharth Roy Kapur",
    role: "Producer",
    company: "Roy Kapur Films",
    submittedAt: "2023-05-22T09:15:00Z",
    avatar: "/user-avatar-2.png",
    status: "pending",
  },
  {
    id: "vr-004",
    name: "Vikramaditya Motwane",
    role: "Director",
    company: "Andolan Films",
    submittedAt: "2023-05-21T16:20:00Z",
    avatar: "/user-avatar-3.png",
    status: "pending",
  },
  {
    id: "vr-005",
    name: "Karan Johar",
    role: "Director & Producer",
    company: "Dharma Productions",
    submittedAt: "2023-05-20T11:10:00Z",
    avatar: "/user-avatar-4.png",
    status: "pending",
  },
]

export function RecentVerificationRequests() {
  const [requests, setRequests] = useState(verificationRequests)

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

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    setRequests(requests.map((request) => (request.id === id ? { ...request, status: newStatus } : request)))
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
      case "flagged":
        return (
          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            Flagged
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Verification Requests</CardTitle>
        <Link href="/admin/industry/verification">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            View All
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.name} />
                  <AvatarFallback>
                    {request.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{request.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {request.role} at {request.company}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs text-muted-foreground hidden md:block">
                  Submitted {getTimeAgo(request.submittedAt)}
                </div>
                {getStatusBadge(request.status)}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                    onClick={() => handleStatusChange(request.id, "approved")}
                    title="Approve"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={() => handleStatusChange(request.id, "rejected")}
                    title="Reject"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                  <Link href={`/admin/industry/verification/${request.id}`}>
                    <Button variant="outline" size="sm" className="h-8">
                      Review
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
