"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import {
  Activity,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  User,
  Film,
  MessageSquare,
  ThumbsUp,
  Clock,
  LogIn,
  LogOut,
  Settings,
  Calendar,
  Bookmark,
  Share2,
  Flag,
  UserPlus,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"

// Mock user activity data
const userActivities = [
  {
    id: "act_001",
    userId: "user_123",
    username: "cinephile42",
    action: "login",
    details: "Logged in from Mumbai, India",
    timestamp: "2024-05-25 10:15:42",
    ip: "203.0.113.1",
    device: "Mobile - Android",
    status: "success",
  },
  {
    id: "act_002",
    userId: "user_123",
    username: "cinephile42",
    action: "view_movie",
    details: "Viewed movie: Inception",
    timestamp: "2024-05-25 10:18:33",
    ip: "203.0.113.1",
    device: "Mobile - Android",
    status: "success",
  },
  {
    id: "act_003",
    userId: "user_123",
    username: "cinephile42",
    action: "add_watchlist",
    details: "Added to watchlist: Oppenheimer",
    timestamp: "2024-05-25 10:22:15",
    ip: "203.0.113.1",
    device: "Mobile - Android",
    status: "success",
  },
  {
    id: "act_004",
    userId: "user_456",
    username: "filmcritic2024",
    action: "login",
    details: "Logged in from New Delhi, India",
    timestamp: "2024-05-25 09:45:22",
    ip: "203.0.113.2",
    device: "Desktop - Windows",
    status: "success",
  },
  {
    id: "act_005",
    userId: "user_456",
    username: "filmcritic2024",
    action: "post_review",
    details: "Posted review for: Dune: Part Two",
    timestamp: "2024-05-25 09:58:45",
    ip: "203.0.113.2",
    device: "Desktop - Windows",
    status: "success",
  },
  {
    id: "act_006",
    userId: "user_789",
    username: "bollywood_fan",
    action: "login_failed",
    details: "Failed login attempt from Bangalore, India",
    timestamp: "2024-05-25 09:30:12",
    ip: "203.0.113.3",
    device: "Mobile - iOS",
    status: "failed",
  },
  {
    id: "act_007",
    userId: "user_789",
    username: "bollywood_fan",
    action: "login",
    details: "Logged in from Bangalore, India",
    timestamp: "2024-05-25 09:32:18",
    ip: "203.0.113.3",
    device: "Mobile - iOS",
    status: "success",
  },
  {
    id: "act_008",
    userId: "user_789",
    username: "bollywood_fan",
    action: "view_cricket",
    details: "Viewed cricket match: India vs Australia",
    timestamp: "2024-05-25 09:35:42",
    ip: "203.0.113.3",
    device: "Mobile - iOS",
    status: "success",
  },
  {
    id: "act_009",
    userId: "user_321",
    username: "movie_buff",
    action: "register",
    details: "New user registration",
    timestamp: "2024-05-25 08:45:33",
    ip: "203.0.113.4",
    device: "Desktop - macOS",
    status: "success",
  },
  {
    id: "act_010",
    userId: "user_321",
    username: "movie_buff",
    action: "update_profile",
    details: "Updated profile information",
    timestamp: "2024-05-25 08:52:15",
    ip: "203.0.113.4",
    device: "Desktop - macOS",
    status: "success",
  },
  {
    id: "act_011",
    userId: "user_654",
    username: "cinema_lover",
    action: "like_review",
    details: "Liked review for: Barbie",
    timestamp: "2024-05-25 08:30:22",
    ip: "203.0.113.5",
    device: "Mobile - Android",
    status: "success",
  },
  {
    id: "act_012",
    userId: "user_654",
    username: "cinema_lover",
    action: "comment",
    details: "Commented on review for: Barbie",
    timestamp: "2024-05-25 08:33:45",
    ip: "203.0.113.5",
    device: "Mobile - Android",
    status: "success",
  },
  {
    id: "act_013",
    userId: "user_987",
    username: "film_enthusiast",
    action: "report_content",
    details: "Reported review for: Oppenheimer",
    timestamp: "2024-05-25 08:15:33",
    ip: "203.0.113.6",
    device: "Desktop - Linux",
    status: "success",
  },
  {
    id: "act_014",
    userId: "user_987",
    username: "film_enthusiast",
    action: "share",
    details: "Shared movie: Oppenheimer",
    timestamp: "2024-05-25 08:18:22",
    ip: "203.0.113.6",
    device: "Desktop - Linux",
    status: "success",
  },
  {
    id: "act_015",
    userId: "user_123",
    username: "cinephile42",
    action: "logout",
    details: "Logged out",
    timestamp: "2024-05-25 11:05:18",
    ip: "203.0.113.1",
    device: "Mobile - Android",
    status: "success",
  },
]

// Action type display mapping
const actionTypeMap: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  login: {
    label: "Login",
    icon: <LogIn className="h-4 w-4" />,
    color: "bg-green-500/10 text-green-500",
  },
  login_failed: {
    label: "Failed Login",
    icon: <LogIn className="h-4 w-4" />,
    color: "bg-red-500/10 text-red-500",
  },
  logout: {
    label: "Logout",
    icon: <LogOut className="h-4 w-4" />,
    color: "bg-blue-500/10 text-blue-500",
  },
  register: {
    label: "Registration",
    icon: <UserPlus className="h-4 w-4" />,
    color: "bg-purple-500/10 text-purple-500",
  },
  view_movie: {
    label: "View Movie",
    icon: <Film className="h-4 w-4" />,
    color: "bg-blue-500/10 text-blue-500",
  },
  view_cricket: {
    label: "View Cricket",
    icon: <Calendar className="h-4 w-4" />,
    color: "bg-blue-500/10 text-blue-500",
  },
  post_review: {
    label: "Post Review",
    icon: <MessageSquare className="h-4 w-4" />,
    color: "bg-amber-500/10 text-amber-500",
  },
  add_watchlist: {
    label: "Add to Watchlist",
    icon: <Bookmark className="h-4 w-4" />,
    color: "bg-purple-500/10 text-purple-500",
  },
  like_review: {
    label: "Like Review",
    icon: <ThumbsUp className="h-4 w-4" />,
    color: "bg-green-500/10 text-green-500",
  },
  comment: {
    label: "Comment",
    icon: <MessageSquare className="h-4 w-4" />,
    color: "bg-amber-500/10 text-amber-500",
  },
  update_profile: {
    label: "Update Profile",
    icon: <Settings className="h-4 w-4" />,
    color: "bg-blue-500/10 text-blue-500",
  },
  report_content: {
    label: "Report Content",
    icon: <Flag className="h-4 w-4" />,
    color: "bg-red-500/10 text-red-500",
  },
  share: {
    label: "Share Content",
    icon: <Share2 className="h-4 w-4" />,
    color: "bg-green-500/10 text-green-500",
  },
}

export function UserActivityMonitor() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedActionType, setSelectedActionType] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string>("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refreshing data
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  // Filter activities based on active tab, search query, and selected action type
  const filteredActivities = userActivities.filter((activity) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "auth" &&
        (activity.action === "login" ||
          activity.action === "login_failed" ||
          activity.action === "logout" ||
          activity.action === "register")) ||
      (activeTab === "content" &&
        (activity.action === "view_movie" ||
          activity.action === "post_review" ||
          activity.action === "add_watchlist" ||
          activity.action === "like_review" ||
          activity.action === "comment" ||
          activity.action === "report_content" ||
          activity.action === "share")) ||
      (activeTab === "profile" && activity.action === "update_profile") ||
      (activeTab === "failed" && activity.status === "failed")

    const matchesSearch = searchQuery
      ? activity.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.ip.includes(searchQuery)
      : true

    const matchesActionType = selectedActionType ? activity.action === selectedActionType : true

    return matchesTab && matchesSearch && matchesActionType
  })

  // Sort activities based on sort column and direction
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              User Activity Monitor
            </CardTitle>
            <CardDescription>Track and analyze user activities across the platform</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-1 sr-only md:not-sr-only">Refresh</span>
            </Button>
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="content">Content Interaction</SelectItem>
                <SelectItem value="profile">Profile Updates</SelectItem>
                <SelectItem value="failed">Failed Actions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="flex items-center">
              <Activity className="h-4 w-4 mr-1" />
              All Activities
            </TabsTrigger>
            <TabsTrigger value="auth" className="flex items-center">
              <LogIn className="h-4 w-4 mr-1" />
              Authentication
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center">
              <Film className="h-4 w-4 mr-1" />
              Content Interaction
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              Profile Updates
            </TabsTrigger>
            <TabsTrigger value="failed" className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Failed Actions
            </TabsTrigger>
          </TabsList>

          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search user, details, IP..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedActionType || ""} onValueChange={(value) => setSelectedActionType(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Action Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="login_failed">Failed Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="register">Registration</SelectItem>
                  <SelectItem value="view_movie">View Movie</SelectItem>
                  <SelectItem value="view_cricket">View Cricket</SelectItem>
                  <SelectItem value="post_review">Post Review</SelectItem>
                  <SelectItem value="add_watchlist">Add to Watchlist</SelectItem>
                  <SelectItem value="like_review">Like Review</SelectItem>
                  <SelectItem value="comment">Comment</SelectItem>
                  <SelectItem value="update_profile">Update Profile</SelectItem>
                  <SelectItem value="report_content">Report Content</SelectItem>
                  <SelectItem value="share">Share Content</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Advanced Filter
            </Button>
          </div>

          <TabsContent value="all">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("timestamp")}>
                      <div className="flex items-center">
                        Timestamp
                        {sortColumn === "timestamp" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("username")}>
                      <div className="flex items-center">
                        User
                        {sortColumn === "username" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("action")}>
                      <div className="flex items-center">
                        Action
                        {sortColumn === "action" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("ip")}>
                      <div className="flex items-center">
                        IP Address
                        {sortColumn === "ip" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("device")}>
                      <div className="flex items-center">
                        Device
                        {sortColumn === "device" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                      <div className="flex items-center">
                        Status
                        {sortColumn === "status" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedActivities.map((activity, index) => (
                    <motion.tr
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          {activity.timestamp}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="font-medium">{activity.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={actionTypeMap[activity.action]?.color || "bg-muted"}>
                          {actionTypeMap[activity.action]?.icon}
                          <span className="ml-1">{actionTypeMap[activity.action]?.label}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate">{activity.details}</div>
                      </TableCell>
                      <TableCell>{activity.ip}</TableCell>
                      <TableCell>{activity.device}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            activity.status === "success"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500"
                          }
                        >
                          {activity.status === "success" ? "Success" : "Failed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="auth">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("timestamp")}>
                      <div className="flex items-center">
                        Timestamp
                        {sortColumn === "timestamp" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("username")}>
                      <div className="flex items-center">
                        User
                        {sortColumn === "username" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("action")}>
                      <div className="flex items-center">
                        Action
                        {sortColumn === "action" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("ip")}>
                      <div className="flex items-center">
                        IP Address
                        {sortColumn === "ip" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("device")}>
                      <div className="flex items-center">
                        Device
                        {sortColumn === "device" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                      <div className="flex items-center">
                        Status
                        {sortColumn === "status" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedActivities.map((activity, index) => (
                    <motion.tr
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          {activity.timestamp}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="font-medium">{activity.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={actionTypeMap[activity.action]?.color || "bg-muted"}>
                          {actionTypeMap[activity.action]?.icon}
                          <span className="ml-1">{actionTypeMap[activity.action]?.label}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate">{activity.details}</div>
                      </TableCell>
                      <TableCell>{activity.ip}</TableCell>
                      <TableCell>{activity.device}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            activity.status === "success"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500"
                          }
                        >
                          {activity.status === "success" ? "Success" : "Failed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("timestamp")}>
                      <div className="flex items-center">
                        Timestamp
                        {sortColumn === "timestamp" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("username")}>
                      <div className="flex items-center">
                        User
                        {sortColumn === "username" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("action")}>
                      <div className="flex items-center">
                        Action
                        {sortColumn === "action" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("device")}>
                      <div className="flex items-center">
                        Device
                        {sortColumn === "device" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedActivities.map((activity, index) => (
                    <motion.tr
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          {activity.timestamp}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="font-medium">{activity.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={actionTypeMap[activity.action]?.color || "bg-muted"}>
                          {actionTypeMap[activity.action]?.icon}
                          <span className="ml-1">{actionTypeMap[activity.action]?.label}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate">{activity.details}</div>
                      </TableCell>
                      <TableCell>{activity.device}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("timestamp")}>
                      <div className="flex items-center">
                        Timestamp
                        {sortColumn === "timestamp" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("username")}>
                      <div className="flex items-center">
                        User
                        {sortColumn === "username" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("ip")}>
                      <div className="flex items-center">
                        IP Address
                        {sortColumn === "ip" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("device")}>
                      <div className="flex items-center">
                        Device
                        {sortColumn === "device" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedActivities.map((activity, index) => (
                    <motion.tr
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          {activity.timestamp}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="font-medium">{activity.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate">{activity.details}</div>
                      </TableCell>
                      <TableCell>{activity.ip}</TableCell>
                      <TableCell>{activity.device}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="failed">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("timestamp")}>
                      <div className="flex items-center">
                        Timestamp
                        {sortColumn === "timestamp" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("username")}>
                      <div className="flex items-center">
                        User
                        {sortColumn === "username" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("action")}>
                      <div className="flex items-center">
                        Action
                        {sortColumn === "action" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("ip")}>
                      <div className="flex items-center">
                        IP Address
                        {sortColumn === "ip" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("device")}>
                      <div className="flex items-center">
                        Device
                        {sortColumn === "device" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedActivities.map((activity, index) => (
                    <motion.tr
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          {activity.timestamp}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="font-medium">{activity.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={actionTypeMap[activity.action]?.color || "bg-muted"}>
                          {actionTypeMap[activity.action]?.icon}
                          <span className="ml-1">{actionTypeMap[activity.action]?.label}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate">{activity.details}</div>
                      </TableCell>
                      <TableCell>{activity.ip}</TableCell>
                      <TableCell>{activity.device}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
