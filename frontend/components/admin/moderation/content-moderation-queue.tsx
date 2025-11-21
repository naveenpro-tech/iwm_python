"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Shield,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Flag,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Film,
  User,
  Calendar,
  ArrowUpDown,
  MoreHorizontal,
  RefreshCw,
  UserX,
  History,
  Edit,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react"

// Mock moderation queue items
const moderationItems = [
  {
    id: "mod_001",
    contentType: "review",
    contentId: "review_123",
    title: "Review of Inception",
    excerpt: "This movie is absolutely terrible and the director should be ashamed...",
    reportReason: "hate_speech",
    reportCount: 5,
    reportedBy: "user_456",
    reportedAt: "2024-05-25 10:15:42",
    status: "pending",
    priority: "high",
    assignedTo: null,
    author: {
      id: "author_123",
      name: "FilmCritic2024",
      avatar: "/user-avatar-1.png",
      joinDate: "2023-01-15",
      previousViolations: 2,
    },
    reports: [
      {
        id: "report_1",
        reason: "Hate Speech",
        details: "This review contains offensive language targeting the director's ethnicity.",
        timestamp: "2024-05-25 09:30:18",
        reportedBy: "user_789",
      },
      {
        id: "report_2",
        reason: "Harassment",
        details: "Personal attacks against the director and cast.",
        timestamp: "2024-05-25 09:45:22",
        reportedBy: "user_456",
      },
      {
        id: "report_3",
        reason: "Hate Speech",
        details: "Offensive language and slurs.",
        timestamp: "2024-05-25 10:05:33",
        reportedBy: "user_234",
      },
    ],
    fullContent:
      "This movie is absolutely terrible and the director should be ashamed. Christopher Nolan has completely lost his touch and is clearly just cashing in on his name at this point. The actors were clearly just there for the paycheck. Anyone who enjoys this garbage has no taste in cinema whatsoever. The special effects were a joke and the plot made no sense. I've seen student films with better production value. Nolan should retire and stop polluting the industry with his pretentious nonsense.",
  },
  {
    id: "mod_002",
    contentType: "comment",
    contentId: "comment_789",
    title: "Comment on Oppenheimer",
    excerpt: "I completely disagree with your analysis. You clearly don't understand cinema if you think...",
    reportReason: "harassment",
    reportCount: 2,
    reportedBy: "user_123",
    reportedAt: "2024-05-25 09:30:18",
    status: "pending",
    priority: "medium",
    assignedTo: null,
    author: {
      id: "author_456",
      name: "CinemaExpert",
      avatar: "/user-avatar-2.png",
      joinDate: "2022-11-05",
      previousViolations: 0,
    },
    reports: [
      {
        id: "report_4",
        reason: "Harassment",
        details: "This comment is attacking the reviewer personally rather than discussing the film.",
        timestamp: "2024-05-25 09:15:18",
        reportedBy: "user_123",
      },
      {
        id: "report_5",
        reason: "Harassment",
        details: "Personal attack on another user.",
        timestamp: "2024-05-25 09:25:42",
        reportedBy: "user_567",
      },
    ],
    fullContent:
      "I completely disagree with your analysis. You clearly don't understand cinema if you think Oppenheimer is anything less than a masterpiece. Your review reads like it was written by someone who only watches Marvel movies. Maybe stick to reviewing content that's more your speed, like children's cartoons. People like you are the reason why thoughtful cinema is becoming rare.",
  },
  {
    id: "mod_003",
    contentType: "pulse",
    contentId: "pulse_456",
    title: "Pulse about upcoming Marvel movie",
    excerpt: "Exclusive insider information: The next Marvel movie will feature [redacted] as the villain...",
    reportReason: "misinformation",
    reportCount: 3,
    reportedBy: "user_789",
    reportedAt: "2024-05-24 22:45:33",
    status: "pending",
    priority: "low",
    assignedTo: null,
    author: {
      id: "author_789",
      name: "MarvelInsider",
      avatar: "/user-avatar-3.png",
      joinDate: "2023-05-20",
      previousViolations: 1,
    },
    reports: [
      {
        id: "report_6",
        reason: "Misinformation",
        details: "This pulse contains false information about upcoming Marvel projects.",
        timestamp: "2024-05-24 22:30:18",
        reportedBy: "user_789",
      },
    ],
    fullContent:
      "Exclusive insider information: The next Marvel movie will feature Tom Cruise as Doctor Doom. I have a source at Marvel Studios who confirmed this casting. They've been keeping it under wraps but it's definitely happening. The movie will be announced at Comic-Con next month. #MarvelLeaks #DoctorDoom",
  },
  {
    id: "mod_004",
    contentType: "profile",
    contentId: "profile_321",
    title: "User Profile: FilmCritic2024",
    excerpt: "Profile contains inappropriate content in bio and potentially fake credentials...",
    reportReason: "impersonation",
    reportCount: 1,
    reportedBy: "user_654",
    reportedAt: "2024-05-24 18:12:05",
    status: "in_review",
    priority: "medium",
    assignedTo: "admin_002",
    author: {
      id: "author_123",
      name: "FilmCritic2024",
      avatar: "/user-avatar-1.png",
      joinDate: "2023-01-15",
      previousViolations: 2,
    },
    reports: [
      {
        id: "report_7",
        reason: "Impersonation",
        details: "This user is claiming to be a professional film critic but has no verifiable credentials.",
        timestamp: "2024-05-24 18:12:05",
        reportedBy: "user_654",
      },
    ],
    fullContent:
      "Professional Film Critic with 15 years of experience. Former writer for The New York Times and Variety. Winner of multiple journalism awards. Currently accepting paid review opportunities.",
  },
  {
    id: "mod_005",
    contentType: "review",
    contentId: "review_987",
    title: "Review of Barbie",
    excerpt: "This movie promotes harmful stereotypes and contains inappropriate content for children...",
    reportReason: "inappropriate",
    reportCount: 4,
    reportedBy: "user_321",
    reportedAt: "2024-05-24 15:45:33",
    status: "approved",
    priority: "medium",
    assignedTo: "admin_001",
    resolvedAt: "2024-05-24 16:30:45",
    resolution: "no_violation",
    author: {
      id: "author_321",
      name: "MovieBuff42",
      avatar: "/user-avatar-4.png",
      joinDate: "2022-08-10",
      previousViolations: 0,
    },
    reports: [
      {
        id: "report_8",
        reason: "Inappropriate Content",
        details: "This review discusses themes that are not appropriate for a movie marketed to children.",
        timestamp: "2024-05-24 15:30:33",
        reportedBy: "user_321",
      },
    ],
    fullContent:
      "While Barbie has been marketed as a family-friendly film, I found several themes and scenes to be inappropriate for younger viewers. The movie tackles complex social issues that may be difficult for children to process. Additionally, some of the humor is clearly aimed at adults. Parents should be aware that this isn't just a simple doll movie, but rather a social commentary that requires maturity to fully understand and appreciate.",
  },
  {
    id: "mod_006",
    contentType: "comment",
    contentId: "comment_654",
    title: "Comment on Dune: Part Two",
    excerpt: "The special effects were clearly stolen from [competitor film]. This is copyright infringement...",
    reportReason: "copyright",
    reportCount: 1,
    reportedBy: "user_987",
    reportedAt: "2024-05-24 14:30:22",
    status: "rejected",
    priority: "low",
    assignedTo: "admin_003",
    resolvedAt: "2024-05-24 15:15:33",
    resolution: "violation",
    action: "removed",
    author: {
      id: "author_654",
      name: "SciFiFan",
      avatar: "/user-avatar-5.png",
      joinDate: "2023-03-22",
      previousViolations: 1,
    },
    reports: [
      {
        id: "report_9",
        reason: "Copyright Violation",
        details: "This comment makes false accusations about copyright infringement.",
        timestamp: "2024-05-24 14:30:22",
        reportedBy: "user_987",
      },
    ],
    fullContent:
      "The special effects in Dune: Part Two were clearly stolen from Star Wars: The Rise of Skywalker. Several sequences are almost identical, just with different coloring. This is blatant copyright infringement and Legendary Pictures should be sued. I've compiled side-by-side comparisons that prove this theft. Denis Villeneuve is a fraud who can't create original visuals.",
  },
  {
    id: "mod_007",
    contentType: "pulse",
    contentId: "pulse_321",
    title: "Pulse about actor controversy",
    excerpt: "Breaking news: Famous actor caught in scandal involving [sensitive content]...",
    reportReason: "sensitive",
    reportCount: 8,
    reportedBy: "user_456",
    reportedAt: "2024-05-24 12:15:45",
    status: "pending",
    priority: "high",
    assignedTo: null,
    author: {
      id: "author_321",
      name: "CelebGossip",
      avatar: "/user-avatar-6.png",
      joinDate: "2023-07-15",
      previousViolations: 3,
    },
    reports: [
      {
        id: "report_10",
        reason: "Sensitive Content",
        details: "This pulse contains unverified allegations about a celebrity's personal life.",
        timestamp: "2024-05-24 12:10:45",
        reportedBy: "user_456",
      },
    ],
    fullContent:
      "Breaking news: Famous actor Tom Hanks caught in scandal involving tax evasion and offshore accounts. My sources tell me federal investigators are preparing charges. This could end his career. #CelebScandal #TomHanks #Exclusive",
  },
  {
    id: "mod_008",
    contentType: "casting_call",
    contentId: "casting_789",
    title: "Casting Call for independent film",
    excerpt: "Looking for actors aged 18-25 for independent film. Payment details and contact information...",
    reportReason: "scam",
    reportCount: 2,
    reportedBy: "user_123",
    reportedAt: "2024-05-24 11:15:22",
    status: "in_review",
    priority: "high",
    assignedTo: "admin_002",
    author: {
      id: "author_789",
      name: "IndieFilmmaker",
      avatar: "/user-avatar-7.png",
      joinDate: "2024-01-05",
      previousViolations: 0,
    },
    reports: [
      {
        id: "report_11",
        reason: "Potential Scam",
        details: "This casting call asks for payment from actors and has suspicious contact information.",
        timestamp: "2024-05-24 11:10:22",
        reportedBy: "user_123",
      },
    ],
    fullContent:
      "Looking for actors aged 18-25 for independent film 'Midnight Dreams'. Shooting in Los Angeles, June 2024. Roles available for lead and supporting characters. Payment: Actors must pay a $200 registration fee to secure audition slot. This covers administrative costs. Contact: midnightdreamsfilm@gmail.com or WhatsApp +1-555-123-4567. Send headshots and resume. Great opportunity for exposure and IMDB credit!",
  },
]

// Report reason display mapping
const reportReasonMap: Record<string, { label: string; color: string }> = {
  hate_speech: { label: "Hate Speech", color: "bg-red-500/10 text-red-500" },
  harassment: { label: "Harassment", color: "bg-red-500/10 text-red-500" },
  misinformation: { label: "Misinformation", color: "bg-amber-500/10 text-amber-500" },
  impersonation: { label: "Impersonation", color: "bg-purple-500/10 text-purple-500" },
  inappropriate: { label: "Inappropriate Content", color: "bg-amber-500/10 text-amber-500" },
  copyright: { label: "Copyright Violation", color: "bg-blue-500/10 text-blue-500" },
  sensitive: { label: "Sensitive Content", color: "bg-amber-500/10 text-amber-500" },
  scam: { label: "Potential Scam", color: "bg-red-500/10 text-red-500" },
}

// Content type display mapping
const contentTypeMap: Record<string, { label: string; icon: React.ReactNode }> = {
  review: { label: "Review", icon: <MessageSquare className="h-4 w-4" /> },
  comment: { label: "Comment", icon: <MessageSquare className="h-4 w-4" /> },
  pulse: { label: "Pulse", icon: <Film className="h-4 w-4" /> },
  profile: { label: "Profile", icon: <User className="h-4 w-4" /> },
  casting_call: { label: "Casting Call", icon: <Calendar className="h-4 w-4" /> },
}

export function ContentModerationQueue() {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null)
  const [selectedReportReason, setSelectedReportReason] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string | null>("reportedAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [violationType, setViolationType] = useState<string>("none")
  const [actionType, setActionType] = useState<string>("none")
  const [moderationNotes, setModerationNotes] = useState("")
  const [notifyUser, setNotifyUser] = useState(true)
  const [activeReportTab, setActiveReportTab] = useState("content")
  const [showFullContent, setShowFullContent] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleReview = (item: any) => {
    setSelectedItem(item)
    setViolationType("none")
    setActionType("none")
    setModerationNotes("")
    setNotifyUser(true)
    setActiveReportTab("content")
    setShowFullContent(false)
    setIsReviewDialogOpen(true)
  }

  const handleApprove = async () => {
    setIsProcessing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update the item in the list
    const updatedItems = moderationItems.map((item) => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          status: "approved",
          resolvedAt: new Date().toLocaleString(),
          resolution: "no_violation",
          assignedTo: "admin_001", // Current user
        }
      }
      return item
    })

    // Close dialog and reset state
    setIsProcessing(false)
    setIsReviewDialogOpen(false)
  }

  const handleReject = async () => {
    setIsProcessing(true)

    // Validate required fields
    if (violationType === "none") {
      alert("Please select a violation type")
      setIsProcessing(false)
      return
    }

    if (actionType === "none") {
      alert("Please select an action to take")
      setIsProcessing(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update the item in the list
    const updatedItems = moderationItems.map((item) => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          status: "rejected",
          resolvedAt: new Date().toLocaleString(),
          resolution: "violation",
          action: actionType,
          assignedTo: "admin_001", // Current user
        }
      }
      return item
    })

    // Close dialog and reset state
    setIsProcessing(false)
    setIsReviewDialogOpen(false)
  }

  const handleViewHistory = () => {
    setIsHistoryDialogOpen(true)
  }

  // Filter items based on active tab, search query, and selected filters
  const filteredItems = moderationItems.filter((item) => {
    const matchesTab =
      (activeTab === "pending" && (item.status === "pending" || item.status === "in_review")) ||
      (activeTab === "resolved" && (item.status === "approved" || item.status === "rejected")) ||
      activeTab === "all"

    const matchesSearch = searchQuery
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    const matchesContentType = selectedContentType ? item.contentType === selectedContentType : true
    const matchesReportReason = selectedReportReason ? item.reportReason === selectedReportReason : true

    return matchesTab && matchesSearch && matchesContentType && matchesReportReason
  })

  // Sort items based on sort column and direction
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  return (
    <Card className="border-[#3A3A3A] bg-[#1E1E1E]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center text-[#E0E0E0]">
              <Shield className="h-5 w-5 mr-2 text-[#00BFFF]" />
              Content Moderation Queue
            </CardTitle>
            <CardDescription className="text-[#A0A0A0]">Review and moderate reported content</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-[180px] bg-[#2A2A2A] border-[#3A3A3A] text-[#E0E0E0]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                <SelectItem value="pending" className="text-[#E0E0E0]">
                  Pending Review
                </SelectItem>
                <SelectItem value="resolved" className="text-[#E0E0E0]">
                  Resolved
                </SelectItem>
                <SelectItem value="all" className="text-[#E0E0E0]">
                  All Items
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 bg-[#2A2A2A]">
            <TabsTrigger
              value="pending"
              className="flex items-center data-[state=active]:bg-[#3A3A3A] data-[state=active]:text-[#E0E0E0]"
            >
              <Clock className="h-4 w-4 mr-1" />
              Pending Review ({moderationItems.filter((i) => i.status === "pending" || i.status === "in_review").length}
              )
            </TabsTrigger>
            <TabsTrigger
              value="resolved"
              className="flex items-center data-[state=active]:bg-[#3A3A3A] data-[state=active]:text-[#E0E0E0]"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Resolved ({moderationItems.filter((i) => i.status === "approved" || i.status === "rejected").length})
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="flex items-center data-[state=active]:bg-[#3A3A3A] data-[state=active]:text-[#E0E0E0]"
            >
              <Shield className="h-4 w-4 mr-1" />
              All Items ({moderationItems.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#A0A0A0]" />
                <Input
                  placeholder="Search content..."
                  className="pl-8 bg-[#2A2A2A] border-[#3A3A3A] text-[#E0E0E0]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={selectedContentType || ""}
                onValueChange={(value) => setSelectedContentType(value || null)}
              >
                <SelectTrigger className="w-[150px] bg-[#2A2A2A] border-[#3A3A3A] text-[#E0E0E0]">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                  <SelectItem value="" className="text-[#E0E0E0]">
                    All Types
                  </SelectItem>
                  <SelectItem value="review" className="text-[#E0E0E0]">
                    Reviews
                  </SelectItem>
                  <SelectItem value="comment" className="text-[#E0E0E0]">
                    Comments
                  </SelectItem>
                  <SelectItem value="pulse" className="text-[#E0E0E0]">
                    Pulses
                  </SelectItem>
                  <SelectItem value="profile" className="text-[#E0E0E0]">
                    Profiles
                  </SelectItem>
                  <SelectItem value="casting_call" className="text-[#E0E0E0]">
                    Casting Calls
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={selectedReportReason || ""}
                onValueChange={(value) => setSelectedReportReason(value || null)}
              >
                <SelectTrigger className="w-[180px] bg-[#2A2A2A] border-[#3A3A3A] text-[#E0E0E0]">
                  <SelectValue placeholder="Report Reason" />
                </SelectTrigger>
                <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                  <SelectItem value="" className="text-[#E0E0E0]">
                    All Reasons
                  </SelectItem>
                  <SelectItem value="hate_speech" className="text-[#E0E0E0]">
                    Hate Speech
                  </SelectItem>
                  <SelectItem value="harassment" className="text-[#E0E0E0]">
                    Harassment
                  </SelectItem>
                  <SelectItem value="misinformation" className="text-[#E0E0E0]">
                    Misinformation
                  </SelectItem>
                  <SelectItem value="impersonation" className="text-[#E0E0E0]">
                    Impersonation
                  </SelectItem>
                  <SelectItem value="inappropriate" className="text-[#E0E0E0]">
                    Inappropriate Content
                  </SelectItem>
                  <SelectItem value="copyright" className="text-[#E0E0E0]">
                    Copyright Violation
                  </SelectItem>
                  <SelectItem value="sensitive" className="text-[#E0E0E0]">
                    Sensitive Content
                  </SelectItem>
                  <SelectItem value="scam" className="text-[#E0E0E0]">
                    Potential Scam
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
              <Filter className="h-4 w-4 mr-1" />
              Advanced Filter
            </Button>
          </div>

          <TabsContent value="pending">
            <div className="rounded-md border border-[#3A3A3A]">
              <Table>
                <TableHeader className="bg-[#2A2A2A]">
                  <TableRow className="hover:bg-[#3A3A3A] border-[#3A3A3A]">
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("priority")}>
                      <div className="flex items-center">
                        Priority
                        {sortColumn === "priority" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("contentType")}>
                      <div className="flex items-center">
                        Type
                        {sortColumn === "contentType" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("title")}>
                      <div className="flex items-center">
                        Content
                        {sortColumn === "title" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("reportReason")}>
                      <div className="flex items-center">
                        Report Reason
                        {sortColumn === "reportReason" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("reportCount")}>
                      <div className="flex items-center">
                        Reports
                        {sortColumn === "reportCount" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("reportedAt")}>
                      <div className="flex items-center">
                        Reported At
                        {sortColumn === "reportedAt" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("status")}>
                      <div className="flex items-center">
                        Status
                        {sortColumn === "status" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right text-[#A0A0A0]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedItems.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="hover:bg-[#2A2A2A] border-[#3A3A3A]"
                    >
                      <TableCell className="text-[#E0E0E0]">
                        <Badge
                          variant="outline"
                          className={
                            item.priority === "high"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : item.priority === "medium"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          }
                        >
                          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#E0E0E0]">
                        <div className="flex items-center">
                          {contentTypeMap[item.contentType]?.icon}
                          <span className="ml-1">{contentTypeMap[item.contentType]?.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#E0E0E0]">
                        <div className="max-w-[300px]">
                          <div className="font-medium truncate">{item.title}</div>
                          <div className="text-xs text-[#A0A0A0] truncate">{item.excerpt}</div>
                          <div className="text-xs text-[#A0A0A0] mt-1 flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {item.author.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={reportReasonMap[item.reportReason]?.color}>
                          <Flag className="h-3 w-3 mr-1" />
                          {reportReasonMap[item.reportReason]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-[#3A3A3A] text-[#E0E0E0] border-[#4A4A4A]">
                          {item.reportCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#E0E0E0]">{item.reportedAt}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            item.status === "pending"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : item.status === "in_review"
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                : item.status === "approved"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : "bg-red-500/10 text-red-500 border-red-500/20"
                          }
                        >
                          {item.status === "pending" ? (
                            <Clock className="h-3 w-3 mr-1" />
                          ) : item.status === "in_review" ? (
                            <Eye className="h-3 w-3 mr-1" />
                          ) : item.status === "approved" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {item.status === "pending"
                            ? "Pending"
                            : item.status === "in_review"
                              ? "In Review"
                              : item.status === "approved"
                                ? "Approved"
                                : "Rejected"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReview(item)}
                            className="text-[#E0E0E0] hover:bg-[#3A3A3A] hover:text-[#00BFFF]"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#E0E0E0] hover:bg-[#3A3A3A] hover:text-[#00BFFF]"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                              <DropdownMenuItem
                                className="text-[#E0E0E0] focus:bg-[#3A3A3A] focus:text-[#00BFFF]"
                                onClick={() => handleViewHistory()}
                              >
                                <History className="h-4 w-4 mr-2" />
                                View History
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[#E0E0E0] focus:bg-[#3A3A3A] focus:text-[#00BFFF]">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Content
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-[#3A3A3A]" />
                              <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 focus:text-red-500">
                                <UserX className="h-4 w-4 mr-2" />
                                Ban User
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
          </TabsContent>

          <TabsContent value="resolved">
            <div className="rounded-md border border-[#3A3A3A]">
              <Table>
                <TableHeader className="bg-[#2A2A2A]">
                  <TableRow className="hover:bg-[#3A3A3A] border-[#3A3A3A]">
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("contentType")}>
                      <div className="flex items-center">
                        Type
                        {sortColumn === "contentType" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("title")}>
                      <div className="flex items-center">
                        Content
                        {sortColumn === "title" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("reportReason")}>
                      <div className="flex items-center">
                        Report Reason
                        {sortColumn === "reportReason" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("reportCount")}>
                      <div className="flex items-center">
                        Reports
                        {sortColumn === "reportCount" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("resolvedAt")}>
                      <div className="flex items-center">
                        Resolved At
                        {sortColumn === "resolvedAt" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("status")}>
                      <div className="flex items-center">
                        Resolution
                        {sortColumn === "status" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("action")}>
                      <div className="flex items-center">
                        Action
                        {sortColumn === "action" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right text-[#A0A0A0]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedItems.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="hover:bg-[#2A2A2A] border-[#3A3A3A]"
                    >
                      <TableCell className="text-[#E0E0E0]">
                        <div className="flex items-center">
                          {contentTypeMap[item.contentType]?.icon}
                          <span className="ml-1">{contentTypeMap[item.contentType]?.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#E0E0E0]">
                        <div className="max-w-[300px]">
                          <div className="font-medium truncate">{item.title}</div>
                          <div className="text-xs text-[#A0A0A0] truncate">{item.excerpt}</div>
                          <div className="text-xs text-[#A0A0A0] mt-1 flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {item.author.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={reportReasonMap[item.reportReason]?.color}>
                          <Flag className="h-3 w-3 mr-1" />
                          {reportReasonMap[item.reportReason]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-[#3A3A3A] text-[#E0E0E0] border-[#4A4A4A]">
                          {item.reportCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#E0E0E0]">{item.resolvedAt}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            item.status === "approved"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-red-500/10 text-red-500 border-red-500/20"
                          }
                        >
                          {item.status === "approved" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {item.status === "approved" ? "Approved" : "Rejected"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.resolution === "violation" ? (
                          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                            {item.action === "removed" ? "Content Removed" : "Warning Issued"}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            No Violation Found
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReview(item)}
                            className="text-[#E0E0E0] hover:bg-[#3A3A3A] hover:text-[#00BFFF]"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#E0E0E0] hover:bg-[#3A3A3A] hover:text-[#00BFFF]"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                              <DropdownMenuItem
                                className="text-[#E0E0E0] focus:bg-[#3A3A3A] focus:text-[#00BFFF]"
                                onClick={() => handleViewHistory()}
                              >
                                <History className="h-4 w-4 mr-2" />
                                View History
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[#E0E0E0] focus:bg-[#3A3A3A] focus:text-[#00BFFF]">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Content
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-[#3A3A3A]" />
                              <DropdownMenuItem className="text-[#E0E0E0] focus:bg-[#3A3A3A] focus:text-[#00BFFF]">
                                <Edit className="h-4 w-4 mr-2" />
                                Revise Decision
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
          </TabsContent>

          <TabsContent value="all">
            <div className="rounded-md border border-[#3A3A3A]">
              <Table>
                <TableHeader className="bg-[#2A2A2A]">
                  <TableRow className="hover:bg-[#3A3A3A] border-[#3A3A3A]">
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("priority")}>
                      <div className="flex items-center">
                        Priority
                        {sortColumn === "priority" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("contentType")}>
                      <div className="flex items-center">
                        Type
                        {sortColumn === "contentType" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("title")}>
                      <div className="flex items-center">
                        Content
                        {sortColumn === "title" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("reportReason")}>
                      <div className="flex items-center">
                        Report Reason
                        {sortColumn === "reportReason" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("reportedAt")}>
                      <div className="flex items-center">
                        Reported At
                        {sortColumn === "reportedAt" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-[#A0A0A0]" onClick={() => handleSort("status")}>
                      <div className="flex items-center">
                        Status
                        {sortColumn === "status" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right text-[#A0A0A0]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedItems.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="hover:bg-[#2A2A2A] border-[#3A3A3A]"
                    >
                      <TableCell className="text-[#E0E0E0]">
                        <Badge
                          variant="outline"
                          className={
                            item.priority === "high"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : item.priority === "medium"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          }
                        >
                          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#E0E0E0]">
                        <div className="flex items-center">
                          {contentTypeMap[item.contentType]?.icon}
                          <span className="ml-1">{contentTypeMap[item.contentType]?.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#E0E0E0]">
                        <div className="max-w-[300px]">
                          <div className="font-medium truncate">{item.title}</div>
                          <div className="text-xs text-[#A0A0A0] truncate">{item.excerpt}</div>
                          <div className="text-xs text-[#A0A0A0] mt-1 flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {item.author.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={reportReasonMap[item.reportReason]?.color}>
                          <Flag className="h-3 w-3 mr-1" />
                          {reportReasonMap[item.reportReason]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#E0E0E0]">{item.reportedAt}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            item.status === "pending"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : item.status === "in_review"
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                : item.status === "approved"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : "bg-red-500/10 text-red-500 border-red-500/20"
                          }
                        >
                          {item.status === "pending" ? (
                            <Clock className="h-3 w-3 mr-1" />
                          ) : item.status === "in_review" ? (
                            <Eye className="h-3 w-3 mr-1" />
                          ) : item.status === "approved" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {item.status === "pending"
                            ? "Pending"
                            : item.status === "in_review"
                              ? "In Review"
                              : item.status === "approved"
                                ? "Approved"
                                : "Rejected"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReview(item)}
                            className="text-[#E0E0E0] hover:bg-[#3A3A3A] hover:text-[#00BFFF]"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {item.status === "pending" || item.status === "in_review" ? "Review" : "View"}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#E0E0E0] hover:bg-[#3A3A3A] hover:text-[#00BFFF]"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                              <DropdownMenuItem
                                className="text-[#E0E0E0] focus:bg-[#3A3A3A] focus:text-[#00BFFF]"
                                onClick={() => handleViewHistory()}
                              >
                                <History className="h-4 w-4 mr-2" />
                                View History
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[#E0E0E0] focus:bg-[#3A3A3A] focus:text-[#00BFFF]">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Content
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-[#3A3A3A]" />
                              {item.status === "pending" || item.status === "in_review" ? (
                                <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 focus:text-red-500">
                                  <UserX className="h-4 w-4 mr-2" />
                                  Ban User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-[#E0E0E0] focus:bg-[#3A3A3A] focus:text-[#00BFFF]">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Revise Decision
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        {selectedItem && (
          <DialogContent className="max-w-4xl bg-[#1E1E1E] border-[#3A3A3A] text-[#E0E0E0]">
            <DialogHeader>
              <DialogTitle className="text-[#E0E0E0] flex items-center">
                <Shield className="h-5 w-5 mr-2 text-[#00BFFF]" />
                Review Reported Content
              </DialogTitle>
              <DialogDescription className="text-[#A0A0A0]">
                Review the reported content and take appropriate moderation action.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-[#A0A0A0]">Content Type</div>
                  <div className="flex items-center mt-1 text-[#E0E0E0]">
                    {contentTypeMap[selectedItem.contentType]?.icon}
                    <span className="ml-1 font-medium">
                      {contentTypeMap[selectedItem.contentType]?.label}: {selectedItem.title}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    selectedItem.priority === "high"
                      ? "bg-red-500/10 text-red-500 border-red-500/20"
                      : selectedItem.priority === "medium"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  }
                >
                  {selectedItem.priority.charAt(0).toUpperCase() + selectedItem.priority.slice(1)} Priority
                </Badge>
              </div>

              <Tabs value={activeReportTab} onValueChange={setActiveReportTab} className="w-full">
                <TabsList className="bg-[#2A2A2A] w-full">
                  <TabsTrigger
                    value="content"
                    className="flex-1 data-[state=active]:bg-[#3A3A3A] data-[state=active]:text-[#E0E0E0]"
                  >
                    Content
                  </TabsTrigger>
                  <TabsTrigger
                    value="reports"
                    className="flex-1 data-[state=active]:bg-[#3A3A3A] data-[state=active]:text-[#E0E0E0]"
                  >
                    Reports ({selectedItem.reports.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="user"
                    className="flex-1 data-[state=active]:bg-[#3A3A3A] data-[state=active]:text-[#E0E0E0]"
                  >
                    User Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="decision"
                    className="flex-1 data-[state=active]:bg-[#3A3A3A] data-[state=active]:text-[#E0E0E0]"
                  >
                    Decision
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-[#E0E0E0]">Reported Content</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFullContent(!showFullContent)}
                        className="text-[#A0A0A0] hover:text-[#00BFFF] hover:bg-[#3A3A3A]"
                      >
                        {showFullContent ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Show Full Content
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="rounded-md border border-[#3A3A3A] p-4 bg-[#2A2A2A]">
                      <div className="flex items-center mb-3">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={selectedItem.author.avatar || "/placeholder.svg"}
                            alt={selectedItem.author.name}
                          />
                          <AvatarFallback>{selectedItem.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-[#E0E0E0]">{selectedItem.author.name}</div>
                          <div className="text-xs text-[#A0A0A0]">Posted on {selectedItem.reportedAt}</div>
                        </div>
                      </div>
                      <div className="text-[#E0E0E0] whitespace-pre-wrap">
                        {showFullContent ? selectedItem.fullContent : selectedItem.excerpt}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#E0E0E0]">Content Context</Label>
                    <div className="rounded-md border border-[#3A3A3A] p-4 bg-[#2A2A2A]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-[#E0E0E0]">
                          {selectedItem.contentType === "review" && "Movie Review"}
                          {selectedItem.contentType === "comment" && "Comment on Review"}
                          {selectedItem.contentType === "pulse" && "Pulse Post"}
                          {selectedItem.contentType === "profile" && "User Profile"}
                          {selectedItem.contentType === "casting_call" && "Casting Call"}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#A0A0A0] border-[#3A3A3A] hover:bg-[#3A3A3A] hover:text-[#00BFFF]"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Original
                        </Button>
                      </div>
                      <div className="text-sm text-[#A0A0A0]">
                        {selectedItem.contentType === "review" &&
                          "Review of the movie Inception posted in the reviews section."}
                        {selectedItem.contentType === "comment" &&
                          "Comment on a review of Oppenheimer in the discussion thread."}
                        {selectedItem.contentType === "pulse" &&
                          "Pulse post about upcoming Marvel movie shared on the platform."}
                        {selectedItem.contentType === "profile" && "User profile information visible to other users."}
                        {selectedItem.contentType === "casting_call" &&
                          "Casting call posted in the talent hub section."}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reports" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[#E0E0E0]">Report Summary</Label>
                    <div className="rounded-md border border-[#3A3A3A] p-4 bg-[#2A2A2A]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Badge variant="outline" className={reportReasonMap[selectedItem.reportReason]?.color}>
                            <Flag className="h-3 w-3 mr-1" />
                            {reportReasonMap[selectedItem.reportReason]?.label}
                          </Badge>
                          <span className="ml-2 text-[#A0A0A0]">
                            {selectedItem.reportCount} {selectedItem.reportCount === 1 ? "report" : "reports"}
                          </span>
                        </div>
                        <span className="text-xs text-[#A0A0A0]">First reported: {selectedItem.reportedAt}</span>
                      </div>
                      <div className="text-sm text-[#A0A0A0]">
                        This content has been reported multiple times for{" "}
                        {reportReasonMap[selectedItem.reportReason]?.label.toLowerCase()}. The most common complaint is
                        that it contains offensive language and personal attacks.
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#E0E0E0]">Individual Reports</Label>
                    <div className="space-y-3">
                      {selectedItem.reports.map((report: any, index: number) => (
                        <div key={report.id} className="rounded-md border border-[#3A3A3A] p-4 bg-[#2A2A2A]">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-[#E0E0E0]">{report.reason}</div>
                            <div className="text-xs text-[#A0A0A0]">Reported: {report.timestamp}</div>
                          </div>
                          <div className="text-sm text-[#E0E0E0] mb-2">{report.details}</div>
                          <div className="text-xs text-[#A0A0A0] flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            Reported by: {report.reportedBy}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="user" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[#E0E0E0]">User Information</Label>
                    <div className="rounded-md border border-[#3A3A3A] p-4 bg-[#2A2A2A]">
                      <div className="flex items-start">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage
                            src={selectedItem.author.avatar || "/placeholder.svg"}
                            alt={selectedItem.author.name}
                          />
                          <AvatarFallback>{selectedItem.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-[#E0E0E0]">{selectedItem.author.name}</div>
                              <div className="text-sm text-[#A0A0A0]">Member since {selectedItem.author.joinDate}</div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[#A0A0A0] border-[#3A3A3A] hover:bg-[#3A3A3A] hover:text-[#00BFFF]"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View Profile
                            </Button>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-[#A0A0A0]">Previous Violations</div>
                              <div className="font-medium text-[#E0E0E0]">
                                {selectedItem.author.previousViolations}
                                {selectedItem.author.previousViolations > 0 && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 bg-amber-500/10 text-amber-500 border-amber-500/20"
                                  >
                                    {selectedItem.author.previousViolations > 2 ? "High Risk" : "Warning"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-[#A0A0A0]">Account Status</div>
                              <div className="font-medium text-[#E0E0E0]">
                                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                  Active
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#E0E0E0]">Recent Activity</Label>
                    <div className="rounded-md border border-[#3A3A3A] p-4 bg-[#2A2A2A]">
                      <div className="text-sm text-[#A0A0A0] mb-3">Last 30 days activity summary</div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-[#E0E0E0]">Reviews Posted</div>
                          <div className="text-sm text-[#E0E0E0]">12</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-[#E0E0E0]">Comments Posted</div>
                          <div className="text-sm text-[#E0E0E0]">47</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-[#E0E0E0]">Pulses Posted</div>
                          <div className="text-sm text-[#E0E0E0]">8</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-[#E0E0E0]">Reports Against User</div>
                          <div className="text-sm text-[#E0E0E0]">
                            3
                            {selectedItem.author.previousViolations > 0 && (
                              <Badge
                                variant="outline"
                                className="ml-2 bg-amber-500/10 text-amber-500 border-amber-500/20"
                              >
                                Concerning
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3 text-[#A0A0A0] hover:text-[#00BFFF] hover:bg-[#3A3A3A]"
                        onClick={() => handleViewHistory()}
                      >
                        <History className="h-4 w-4 mr-1" />
                        View Full History
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="decision" className="mt-4 space-y-4">
                  {selectedItem.status === "approved" || selectedItem.status === "rejected" ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[#E0E0E0]">Resolution</Label>
                        <div className="rounded-md border border-[#3A3A3A] p-4 bg-[#2A2A2A] space-y-2">
                          <div className="flex justify-between">
                            <div>
                              <div className="text-sm text-[#A0A0A0]">Resolved By</div>
                              <div className="font-medium text-[#E0E0E0]">{selectedItem.assignedTo}</div>
                            </div>
                            <div>
                              <div className="text-sm text-[#A0A0A0]">Resolved At</div>
                              <div className="font-medium text-[#E0E0E0]">{selectedItem.resolvedAt}</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-[#A0A0A0]">Decision</div>
                            <Badge
                              variant="outline"
                              className={
                                selectedItem.status === "approved"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : "bg-red-500/10 text-red-500 border-red-500/20"
                              }
                            >
                              {selectedItem.status === "approved" ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {selectedItem.status === "approved" ? "Approved" : "Rejected"}
                            </Badge>
                          </div>
                          {selectedItem.resolution && (
                            <div>
                              <div className="text-sm text-[#A0A0A0]">Finding</div>
                              <Badge
                                variant="outline"
                                className={
                                  selectedItem.resolution === "violation"
                                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                                    : "bg-green-500/10 text-green-500 border-green-500/20"
                                }
                              >
                                {selectedItem.resolution === "violation" ? "Violation Found" : "No Violation"}
                              </Badge>
                            </div>
                          )}
                          {selectedItem.action && (
                            <div>
                              <div className="text-sm text-[#A0A0A0]">Action Taken</div>
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                                {selectedItem.action === "removed"
                                  ? "Content Removed"
                                  : selectedItem.action === "warning"
                                    ? "Warning Issued"
                                    : "No Action"}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsReviewDialogOpen(false)}
                          className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
                        >
                          Close
                        </Button>
                        <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
                          <Edit className="h-4 w-4 mr-1" />
                          Revise Decision
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="violation-type">Violation Type (if any)</Label>
                        <Select value={violationType} onValueChange={setViolationType}>
                          <SelectTrigger id="violation-type" className="bg-[#2A2A2A] border-[#3A3A3A] text-[#E0E0E0]">
                            <SelectValue placeholder="Select violation type" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                            <SelectItem value="none" className="text-[#E0E0E0]">
                              No Violation
                            </SelectItem>
                            <SelectItem value="hate_speech" className="text-[#E0E0E0]">
                              Hate Speech
                            </SelectItem>
                            <SelectItem value="harassment" className="text-[#E0E0E0]">
                              Harassment
                            </SelectItem>
                            <SelectItem value="misinformation" className="text-[#E0E0E0]">
                              Misinformation
                            </SelectItem>
                            <SelectItem value="impersonation" className="text-[#E0E0E0]">
                              Impersonation
                            </SelectItem>
                            <SelectItem value="inappropriate" className="text-[#E0E0E0]">
                              Inappropriate Content
                            </SelectItem>
                            <SelectItem value="copyright" className="text-[#E0E0E0]">
                              Copyright Violation
                            </SelectItem>
                            <SelectItem value="sensitive" className="text-[#E0E0E0]">
                              Sensitive Content
                            </SelectItem>
                            <SelectItem value="scam" className="text-[#E0E0E0]">
                              Scam
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="action">Action to Take</Label>
                        <Select value={actionType} onValueChange={setActionType}>
                          <SelectTrigger id="action" className="bg-[#2A2A2A] border-[#3A3A3A] text-[#E0E0E0]">
                            <SelectValue placeholder="Select action" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                            <SelectItem value="none" className="text-[#E0E0E0]">
                              No Action
                            </SelectItem>
                            <SelectItem value="remove" className="text-[#E0E0E0]">
                              Remove Content
                            </SelectItem>
                            <SelectItem value="warn" className="text-[#E0E0E0]">
                              Issue Warning
                            </SelectItem>
                            <SelectItem value="suspend" className="text-[#E0E0E0]">
                              Suspend User
                            </SelectItem>
                            <SelectItem value="ban" className="text-[#E0E0E0]">
                              Ban User
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Moderation Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Add notes about this moderation decision..."
                          className="min-h-[100px] bg-[#2A2A2A] border-[#3A3A3A] text-[#E0E0E0]"
                          value={moderationNotes}
                          onChange={(e) => setModerationNotes(e.target.value)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="notify-user">Notify User</Label>
                          <p className="text-sm text-[#A0A0A0]">Send notification about this decision</p>
                        </div>
                        <Switch id="notify-user" checked={notifyUser} onCheckedChange={setNotifyUser} />
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter>
              {selectedItem.status === "pending" || selectedItem.status === "in_review" ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsReviewDialogOpen(false)}
                    className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Reject Content
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="bg-[#00BFFF] hover:bg-[#0099CC] text-black"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Approve Content
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsReviewDialogOpen(false)}
                  className="bg-[#00BFFF] hover:bg-[#0099CC] text-black"
                >
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-3xl bg-[#1E1E1E] border-[#3A3A3A] text-[#E0E0E0]">
          <DialogHeader>
            <DialogTitle className="text-[#E0E0E0] flex items-center">
              <History className="h-5 w-5 mr-2 text-[#00BFFF]" />
              User Moderation History
            </DialogTitle>
            <DialogDescription className="text-[#A0A0A0]">
              {selectedItem?.author.name}'s previous violations and moderation actions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage
                    src={selectedItem?.author.avatar || "/placeholder.svg"}
                    alt={selectedItem?.author.name}
                  />
                  <AvatarFallback>{selectedItem?.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-[#E0E0E0]">{selectedItem?.author.name}</div>
                  <div className="text-sm text-[#A0A0A0]">Member since {selectedItem?.author.joinDate}</div>
                </div>
              </div>
              <Badge
                variant="outline"
                className={
                  selectedItem?.author.previousViolations > 2
                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                    : selectedItem?.author.previousViolations > 0
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : "bg-green-500/10 text-green-500 border-green-500/20"
                }
              >
                {selectedItem?.author.previousViolations > 2
                  ? "High Risk User"
                  : selectedItem?.author.previousViolations > 0
                    ? "Warning Status"
                    : "Good Standing"}
              </Badge>
            </div>

            <div className="rounded-md border border-[#3A3A3A] overflow-hidden">
              <Table>
                <TableHeader className="bg-[#2A2A2A]">
                  <TableRow className="hover:bg-[#3A3A3A] border-[#3A3A3A]">
                    <TableHead className="text-[#A0A0A0]">Date</TableHead>
                    <TableHead className="text-[#A0A0A0]">Content Type</TableHead>
                    <TableHead className="text-[#A0A0A0]">Violation</TableHead>
                    <TableHead className="text-[#A0A0A0]">Action Taken</TableHead>
                    <TableHead className="text-[#A0A0A0]">Moderator</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-[#2A2A2A] border-[#3A3A3A]">
                    <TableCell className="text-[#E0E0E0]">2024-04-15</TableCell>
                    <TableCell className="text-[#E0E0E0]">Comment</TableCell>
                    <TableCell className="text-[#E0E0E0]">
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                        Harassment
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#E0E0E0]">Content Removed, Warning Issued</TableCell>
                    <TableCell className="text-[#E0E0E0]">admin_001</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-[#2A2A2A] border-[#3A3A3A]">
                    <TableCell className="text-[#E0E0E0]">2024-03-22</TableCell>
                    <TableCell className="text-[#E0E0E0]">Review</TableCell>
                    <TableCell className="text-[#E0E0E0]">
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                        Inappropriate Content
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#E0E0E0]">Content Removed</TableCell>
                    <TableCell className="text-[#E0E0E0]">admin_003</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-[#2A2A2A] border-[#3A3A3A]">
                    <TableCell className="text-[#E0E0E0]">2024-02-10</TableCell>
                    <TableCell className="text-[#E0E0E0]">Pulse</TableCell>
                    <TableCell className="text-[#E0E0E0]">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        No Violation
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#E0E0E0]">Content Approved</TableCell>
                    <TableCell className="text-[#E0E0E0]">admin_002</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="notes" className="border-[#3A3A3A]">
                <AccordionTrigger className="text-[#E0E0E0] hover:text-[#00BFFF] hover:no-underline">
                  Admin Notes
                </AccordionTrigger>
                <AccordionContent className="text-[#A0A0A0]">
                  <div className="space-y-3">
                    <div className="border-l-2 border-[#3A3A3A] pl-3">
                      <div className="text-xs text-[#A0A0A0]">2024-04-15 by admin_001</div>
                      <div className="text-sm text-[#E0E0E0] mt-1">
                        User has been warned about harassment. Any further violations may result in a temporary
                        suspension.
                      </div>
                    </div>
                    <div className="border-l-2 border-[#3A3A3A] pl-3">
                      <div className="text-xs text-[#A0A0A0]">2024-03-22 by admin_003</div>
                      <div className="text-sm text-[#E0E0E0] mt-1">
                        First violation. User was cooperative and understood the issue with their content.
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsHistoryDialogOpen(false)}
              className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
            >
              Close
            </Button>
            <Button className="bg-[#00BFFF] hover:bg-[#0099CC] text-black">
              <ExternalLink className="h-4 w-4 mr-1" />
              View Full Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
