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
import { CheckCircle, XCircle, AlertCircle, Clock, MoreVertical, Eye, Edit, Trash, Flag, Shield } from "lucide-react"

// Sample data for industry professionals
const professionals = [
  {
    id: "prof-001",
    name: "Christopher Nolan",
    role: "Director",
    company: "Syncopy Films",
    verificationStatus: "verified",
    lastActivity: "2023-05-24T10:30:00Z",
    avatar: "/christopher-nolan.png",
  },
  {
    id: "prof-002",
    name: "Anurag Kashyap",
    role: "Director",
    company: "Phantom Films",
    verificationStatus: "pending",
    lastActivity: "2023-05-23T14:45:00Z",
    avatar: "/user-avatar-1.png",
  },
  {
    id: "prof-003",
    name: "Zoya Akhtar",
    role: "Director",
    company: "Tiger Baby Films",
    verificationStatus: "verified",
    lastActivity: "2023-05-22T09:15:00Z",
    avatar: "/user-avatar-2.png",
  },
  {
    id: "prof-004",
    name: "Siddharth Roy Kapur",
    role: "Producer",
    company: "Roy Kapur Films",
    verificationStatus: "verified",
    lastActivity: "2023-05-21T16:20:00Z",
    avatar: "/user-avatar-3.png",
  },
  {
    id: "prof-005",
    name: "Vikramaditya Motwane",
    role: "Director",
    company: "Andolan Films",
    verificationStatus: "flagged",
    lastActivity: "2023-05-20T11:10:00Z",
    avatar: "/user-avatar-4.png",
  },
  {
    id: "prof-006",
    name: "Karan Johar",
    role: "Director & Producer",
    company: "Dharma Productions",
    verificationStatus: "verified",
    lastActivity: "2023-05-19T13:25:00Z",
    avatar: "/user-avatar-5.png",
  },
  {
    id: "prof-007",
    name: "Imtiaz Ali",
    role: "Director",
    company: "Window Seat Films",
    verificationStatus: "rejected",
    lastActivity: "2023-05-18T15:40:00Z",
    avatar: "/user-avatar-6.png",
  },
  {
    id: "prof-008",
    name: "Vishal Bhardwaj",
    role: "Director & Composer",
    company: "VB Pictures",
    verificationStatus: "verified",
    lastActivity: "2023-05-17T09:50:00Z",
    avatar: "/user-avatar-7.png",
  },
  {
    id: "prof-009",
    name: "Dibakar Banerjee",
    role: "Director",
    company: "Dibakar Banerjee Productions",
    verificationStatus: "pending",
    lastActivity: "2023-05-16T14:15:00Z",
    avatar: "/user-avatar-8.png",
  },
  {
    id: "prof-010",
    name: "Farhan Akhtar",
    role: "Director & Actor",
    company: "Excel Entertainment",
    verificationStatus: "verified",
    lastActivity: "2023-05-15T11:30:00Z",
    avatar: "/user-avatar-9.png",
  },
]

export function ProfessionalsTable() {
  const [data, setData] = useState(professionals)

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-600">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Verified
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Verification Status</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((professional, index) => (
            <motion.tr
              key={professional.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-b"
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={professional.avatar || "/placeholder.svg"} alt={professional.name} />
                    <AvatarFallback>
                      {professional.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>{professional.name}</div>
                </div>
              </TableCell>
              <TableCell>{professional.role}</TableCell>
              <TableCell>{professional.company}</TableCell>
              <TableCell>{getStatusBadge(professional.verificationStatus)}</TableCell>
              <TableCell>{getTimeAgo(professional.lastActivity)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href={`/admin/industry/professionals/${professional.id}`}>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/admin/industry/professionals/${professional.id}/edit`}>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                      <Flag className="h-4 w-4 mr-2" />
                      Flag Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Shield className="h-4 w-4 mr-2" />
                      Verification
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500 focus:text-red-500">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Profile
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
