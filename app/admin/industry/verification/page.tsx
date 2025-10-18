"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, AlertTriangle, Search, Filter, Calendar, User } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

// Mock data for verification queue
const mockVerificationQueue = [
  {
    id: "prof-1",
    name: "Christopher Nolan",
    title: "Film Director & Producer",
    profilePhoto: "/christopher-nolan.png",
    submittedAt: new Date("2023-05-15"),
    status: "pending",
    documentCount: 3,
  },
  {
    id: "prof-2",
    name: "Greta Gerwig",
    title: "Film Director & Screenwriter",
    profilePhoto: "/woman-director-portrait.png",
    submittedAt: new Date("2023-05-14"),
    status: "pending",
    documentCount: 2,
  },
  {
    id: "prof-3",
    name: "Roger Deakins",
    title: "Cinematographer",
    profilePhoto: "/older-cinematographer.png",
    submittedAt: new Date("2023-05-13"),
    status: "pending",
    documentCount: 4,
  },
  {
    id: "prof-4",
    name: "Jane Smith",
    title: "Production Designer",
    profilePhoto: "/woman-portrait.png",
    submittedAt: new Date("2023-05-12"),
    status: "verified",
    documentCount: 3,
    verifiedAt: new Date("2023-05-14"),
  },
  {
    id: "prof-5",
    name: "Michael Johnson",
    title: "Sound Designer",
    profilePhoto: "/thoughtful-man-portrait.png",
    submittedAt: new Date("2023-05-11"),
    status: "rejected",
    documentCount: 1,
    rejectedAt: new Date("2023-05-13"),
    rejectionReason: "Insufficient documentation provided",
  },
]

export default function VerificationQueuePage() {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Filter and sort the queue based on active filters
  const filteredQueue = mockVerificationQueue
    .filter((item) => {
      // Filter by tab
      if (activeTab === "pending" && item.status !== "pending") return false
      if (activeTab === "verified" && item.status !== "verified") return false
      if (activeTab === "rejected" && item.status !== "rejected") return false

      // Filter by search query
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false

      // Filter by status
      if (statusFilter !== "all" && item.status !== statusFilter) return false

      return true
    })
    .sort((a, b) => {
      // Sort by selected option
      if (sortBy === "newest") {
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      }
      return 0
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20"
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Verification Queue</h1>
          <p className="text-muted-foreground">Review and verify industry professional profiles</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[200px]"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Pending Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {mockVerificationQueue.filter((item) => item.status === "pending").length}
            </p>
            <p className="text-sm text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Verified Profiles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {mockVerificationQueue.filter((item) => item.status === "verified").length}
            </p>
            <p className="text-sm text-muted-foreground">Successfully verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Rejected Profiles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {mockVerificationQueue.filter((item) => item.status === "rejected").length}
            </p>
            <p className="text-sm text-muted-foreground">Verification rejected</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm whitespace-nowrap">Status:</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm whitespace-nowrap">Sort by:</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredQueue.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No verification requests match your filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredQueue.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:border-primary transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={item.profilePhoto || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.title}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Submitted: {item.submittedAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>Documents: {item.documentCount}</span>
                        </div>
                        {item.status === "verified" && item.verifiedAt && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>Verified: {item.verifiedAt.toLocaleDateString()}</span>
                          </div>
                        )}
                        {item.status === "rejected" && item.rejectedAt && (
                          <div className="flex items-center gap-1">
                            <XCircle className="h-3 w-3 text-destructive" />
                            <span>Rejected: {item.rejectedAt.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      {item.status === "pending" ? (
                        <Button asChild>
                          <Link href={`/admin/industry/verification/${item.id}`}>Review</Link>
                        </Button>
                      ) : (
                        <Button variant="outline" asChild>
                          <Link href={`/admin/industry/verification/${item.id}`}>View Details</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                  {item.status === "rejected" && item.rejectionReason && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Reason:</span> {item.rejectionReason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
