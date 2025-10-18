"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import Link from "next/link"
import { CheckCircle, XCircle, Clock, MoreVertical, Eye, MessageSquare, AlertCircle, FileText } from "lucide-react"

// Sample data for verification requests
const verificationRequests = [
  {
    id: "vr-001",
    name: "Anurag Kashyap",
    role: "Director",
    company: "Phantom Films",
    submittedAt: "2023-05-24T10:30:00Z",
    status: "pending",
    avatar: "/user-avatar-1.png",
    documents: 5,
    credits: 12,
  },
  {
    id: "vr-002",
    name: "Zoya Akhtar",
    role: "Director",
    company: "Tiger Baby Films",
    submittedAt: "2023-05-23T14:45:00Z",
    status: "pending",
    avatar: "/user-avatar-2.png",
    documents: 3,
    credits: 8,
  },
  {
    id: "vr-003",
    name: "Siddharth Roy Kapur",
    role: "Producer",
    company: "Roy Kapur Films",
    submittedAt: "2023-05-22T09:15:00Z",
    status: "pending",
    avatar: "/user-avatar-3.png",
    documents: 4,
    credits: 15,
  },
  {
    id: "vr-004",
    name: "Vikramaditya Motwane",
    role: "Director",
    company: "Andolan Films",
    submittedAt: "2023-05-21T16:20:00Z",
    status: "pending",
    avatar: "/user-avatar-4.png",
    documents: 6,
    credits: 7,
  },
  {
    id: "vr-005",
    name: "Karan Johar",
    role: "Director & Producer",
    company: "Dharma Productions",
    submittedAt: "2023-05-20T11:10:00Z",
    status: "pending",
    avatar: "/user-avatar-5.png",
    documents: 8,
    credits: 24,
  },
  {
    id: "vr-006",
    name: "Imtiaz Ali",
    role: "Director",
    company: "Window Seat Films",
    submittedAt: "2023-05-19T13:25:00Z",
    status: "pending",
    avatar: "/user-avatar-6.png",
    documents: 4,
    credits: 9,
  },
  {
    id: "vr-007",
    name: "Vishal Bhardwaj",
    role: "Director & Composer",
    company: "VB Pictures",
    submittedAt: "2023-05-18T15:40:00Z",
    status: "pending",
    avatar: "/user-avatar-7.png",
    documents: 7,
    credits: 14,
  },
  {
    id: "vr-008",
    name: "Dibakar Banerjee",
    role: "Director",
    company: "Dibakar Banerjee Productions",
    submittedAt: "2023-05-17T09:50:00Z",
    status: "pending",
    avatar: "/user-avatar-8.png",
    documents: 5,
    credits: 8,
  },
  {
    id: "vr-009",
    name: "Farhan Akhtar",
    role: "Director & Actor",
    company: "Excel Entertainment",
    submittedAt: "2023-05-16T14:15:00Z",
    status: "pending",
    avatar: "/user-avatar-9.png",
    documents: 9,
    credits: 18,
  },
  {
    id: "vr-010",
    name: "Kabir Khan",
    role: "Director",
    company: "Kabir Khan Films",
    submittedAt: "2023-05-15T11:30:00Z",
    status: "pending",
    avatar: "/christopher-nolan.png",
    documents: 6,
    credits: 10,
  },
]

export function VerificationQueue() {
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
      default:
        return null
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request, index) => (
            <motion.tr
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-b"
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.name} />
                    <AvatarFallback>
                      {request.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>{request.name}</div>
                </div>
              </TableCell>
              <TableCell>{request.role}</TableCell>
              <TableCell>{request.company}</TableCell>
              <TableCell>{getTimeAgo(request.submittedAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{request.documents}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{request.credits}</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link href={`/admin/industry/verification/${request.id}`}>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Request More Info
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Flag for Review
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
