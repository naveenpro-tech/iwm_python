"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Bug,
  Lightbulb,
  Wrench,
  User,
  Calendar,
  Tag,
  MessageSquare,
  X,
} from "lucide-react"

// Mock issues data
const issues = [
  {
    id: "ISSUE-001",
    title: "Search API returning 500 error intermittently",
    description:
      "The search API is occasionally returning 500 errors when searching for certain keywords. This is affecting the search functionality on the platform.",
    status: "open",
    priority: "high",
    category: "bug",
    assignee: "Rahul Kumar",
    createdAt: "2024-05-24 15:30:22",
    updatedAt: "2024-05-25 10:15:42",
    comments: 5,
  },
  {
    id: "ISSUE-002",
    title: "Add support for regional content filtering",
    description:
      "Users have requested the ability to filter content based on region/language. This would improve the user experience for international users.",
    status: "in_progress",
    priority: "medium",
    category: "feature",
    assignee: "Priya Sharma",
    createdAt: "2024-05-23 12:45:33",
    updatedAt: "2024-05-25 09:30:18",
    comments: 3,
  },
  {
    id: "ISSUE-003",
    title: "Mobile navigation menu not working on iOS",
    description:
      "Users on iOS devices are reporting that the mobile navigation menu is not opening when tapped. This is affecting mobile usability.",
    status: "open",
    priority: "high",
    category: "bug",
    assignee: "Unassigned",
    createdAt: "2024-05-25 08:45:12",
    updatedAt: "2024-05-25 08:45:12",
    comments: 0,
  },
  {
    id: "ISSUE-004",
    title: "Optimize database queries for movie listings",
    description:
      "The movie listings page is loading slowly due to inefficient database queries. This needs to be optimized for better performance.",
    status: "in_progress",
    priority: "medium",
    category: "improvement",
    assignee: "Vikram Singh",
    createdAt: "2024-05-22 16:30:45",
    updatedAt: "2024-05-24 14:20:33",
    comments: 7,
  },
  {
    id: "ISSUE-005",
    title: "Implement dark mode for admin dashboard",
    description:
      "Add dark mode support for the admin dashboard to reduce eye strain and improve usability in low-light environments.",
    status: "open",
    priority: "low",
    category: "feature",
    assignee: "Unassigned",
    createdAt: "2024-05-24 11:15:22",
    updatedAt: "2024-05-24 11:15:22",
    comments: 2,
  },
  {
    id: "ISSUE-006",
    title: "Fix broken links in movie details pages",
    description:
      "Several broken links have been detected in the movie details pages. These need to be fixed to improve user experience and SEO.",
    status: "resolved",
    priority: "medium",
    category: "bug",
    assignee: "Ananya Desai",
    createdAt: "2024-05-21 09:45:33",
    updatedAt: "2024-05-24 16:30:45",
    comments: 4,
  },
  {
    id: "ISSUE-007",
    title: "Add pagination to search results",
    description:
      "Currently, search results are limited to 20 items with no pagination. This makes it difficult for users to browse through all results.",
    status: "resolved",
    priority: "medium",
    category: "improvement",
    assignee: "Rahul Kumar",
    createdAt: "2024-05-20 14:20:33",
    updatedAt: "2024-05-23 12:45:33",
    comments: 3,
  },
]

export function IssueTracker() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null)
  const [isNewIssueDialogOpen, setIsNewIssueDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<any>(null)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleViewIssue = (issue: any) => {
    setSelectedIssue(issue)
    setIsDetailDialogOpen(true)
  }

  // Filter issues based on active tab, search query, and filters
  const filteredIssues = issues.filter((issue) => {
    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "open" && issue.status === "open") ||
      (activeTab === "in_progress" && issue.status === "in_progress") ||
      (activeTab === "resolved" && issue.status === "resolved")

    // Filter by search query
    const matchesSearch = searchQuery
      ? issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.id.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    // Filter by category
    const matchesCategory = selectedCategory ? issue.category === selectedCategory : true

    // Filter by priority
    const matchesPriority = selectedPriority ? issue.priority === selectedPriority : true

    return matchesTab && matchesSearch && matchesCategory && matchesPriority
  })

  // Sort issues based on sort column and direction
  const sortedIssues = [...filteredIssues].sort((a, b) => {
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Issue Tracker
            </CardTitle>
            <CardDescription>Track and manage internal tasks and issues</CardDescription>
          </div>
          <Dialog open={isNewIssueDialogOpen} onOpenChange={setIsNewIssueDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                New Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Issue</DialogTitle>
                <DialogDescription>Fill in the details to create a new issue or task.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="issue-title">Title</Label>
                  <Input id="issue-title" placeholder="Enter issue title" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue-description">Description</Label>
                  <Textarea
                    id="issue-description"
                    placeholder="Describe the issue in detail..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issue-category">Category</Label>
                    <Select>
                      <SelectTrigger id="issue-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bug">Bug</SelectItem>
                        <SelectItem value="feature">Feature</SelectItem>
                        <SelectItem value="improvement">Improvement</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issue-priority">Priority</Label>
                    <Select>
                      <SelectTrigger id="issue-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue-assignee">Assignee</Label>
                  <Select>
                    <SelectTrigger id="issue-assignee">
                      <SelectValue placeholder="Assign to..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned_value">Unassigned</SelectItem>
                      <SelectItem value="rahul_value">Rahul Kumar</SelectItem>
                      <SelectItem value="priya_value">Priya Sharma</SelectItem>
                      <SelectItem value="vikram_value">Vikram Singh</SelectItem>
                      <SelectItem value="ananya_value">Ananya Desai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewIssueDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewIssueDialogOpen(false)}>Create Issue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory || ""} onValueChange={(value) => setSelectedCategory(value || null)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="improvement">Improvement</SelectItem>
                <SelectItem value="task">Task</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPriority || ""} onValueChange={(value) => setSelectedPriority(value || null)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            Advanced Filter
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="flex items-center">
              All Issues
              <Badge variant="secondary" className="ml-1">
                {issues.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="open" className="flex items-center">
              Open
              <Badge variant="secondary" className="ml-1 bg-red-500/10 text-red-500 hover:bg-red-500/10">
                {issues.filter((issue) => issue.status === "open").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="in_progress" className="flex items-center">
              In Progress
              <Badge variant="secondary" className="ml-1 bg-amber-500/10 text-amber-500 hover:bg-amber-500/10">
                {issues.filter((issue) => issue.status === "in_progress").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="resolved" className="flex items-center">
              Resolved
              <Badge variant="secondary" className="ml-1 bg-green-500/10 text-green-500 hover:bg-green-500/10">
                {issues.filter((issue) => issue.status === "resolved").length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
                    <div className="flex items-center">
                      ID
                      {sortColumn === "id" && (
                        <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
                    <div className="flex items-center">
                      Title
                      {sortColumn === "title" && (
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
                  <TableHead className="cursor-pointer" onClick={() => handleSort("priority")}>
                    <div className="flex items-center">
                      Priority
                      {sortColumn === "priority" && (
                        <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                    <div className="flex items-center">
                      Category
                      {sortColumn === "category" && (
                        <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("assignee")}>
                    <div className="flex items-center">
                      Assignee
                      {sortColumn === "assignee" && (
                        <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("updatedAt")}>
                    <div className="flex items-center">
                      Updated
                      {sortColumn === "updatedAt" && (
                        <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedIssues.map((issue, index) => (
                  <motion.tr
                    key={issue.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewIssue(issue)}
                  >
                    <TableCell className="font-mono text-xs">{issue.id}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <span className="truncate max-w-[300px]">{issue.title}</span>
                        {issue.comments > 0 && (
                          <Badge variant="outline" className="ml-2">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {issue.comments}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          issue.status === "open"
                            ? "bg-red-500/10 text-red-500"
                            : issue.status === "in_progress"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-green-500/10 text-green-500"
                        }
                      >
                        {issue.status === "open" ? (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        ) : issue.status === "in_progress" ? (
                          <Clock className="h-3 w-3 mr-1" />
                        ) : (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {issue.status === "open" ? "Open" : issue.status === "in_progress" ? "In Progress" : "Resolved"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          issue.priority === "low"
                            ? "bg-green-500/10 text-green-500"
                            : issue.priority === "medium"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-red-500/10 text-red-500"
                        }
                      >
                        {issue.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          issue.category === "bug"
                            ? "bg-red-500/10 text-red-500"
                            : issue.category === "feature"
                              ? "bg-blue-500/10 text-blue-500"
                              : issue.category === "improvement"
                                ? "bg-purple-500/10 text-purple-500"
                                : "bg-green-500/10 text-green-500"
                        }
                      >
                        {issue.category === "bug" ? (
                          <Bug className="h-3 w-3 mr-1" />
                        ) : issue.category === "feature" ? (
                          <Lightbulb className="h-3 w-3 mr-1" />
                        ) : (
                          <Wrench className="h-3 w-3 mr-1" />
                        )}
                        {issue.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {issue.assignee === "Unassigned" ? (
                        <span className="text-muted-foreground">Unassigned</span>
                      ) : (
                        issue.assignee
                      )}
                    </TableCell>
                    <TableCell>{issue.updatedAt}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                        Edit
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </Tabs>

        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          {selectedIssue && (
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{selectedIssue.id}</span>
                      <Badge
                        variant="outline"
                        className={
                          selectedIssue.status === "open"
                            ? "bg-red-500/10 text-red-500"
                            : selectedIssue.status === "in_progress"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-green-500/10 text-green-500"
                        }
                      >
                        {selectedIssue.status === "open"
                          ? "Open"
                          : selectedIssue.status === "in_progress"
                            ? "In Progress"
                            : "Resolved"}
                      </Badge>
                    </div>
                    <DialogTitle className="mt-2">{selectedIssue.title}</DialogTitle>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsDetailDialogOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      Priority
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        selectedIssue.priority === "low"
                          ? "bg-green-500/10 text-green-500"
                          : selectedIssue.priority === "medium"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-red-500/10 text-red-500"
                      }
                    >
                      {selectedIssue.priority}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      Category
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        selectedIssue.category === "bug"
                          ? "bg-red-500/10 text-red-500"
                          : selectedIssue.category === "feature"
                            ? "bg-blue-500/10 text-blue-500"
                            : selectedIssue.category === "improvement"
                              ? "bg-purple-500/10 text-purple-500"
                              : "bg-green-500/10 text-green-500"
                      }
                    >
                      {selectedIssue.category === "bug" ? (
                        <Bug className="h-3 w-3 mr-1" />
                      ) : selectedIssue.category === "feature" ? (
                        <Lightbulb className="h-3 w-3 mr-1" />
                      ) : (
                        <Wrench className="h-3 w-3 mr-1" />
                      )}
                      {selectedIssue.category}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Assignee
                    </div>
                    <div>
                      {selectedIssue.assignee === "Unassigned" ? (
                        <span className="text-muted-foreground">Unassigned</span>
                      ) : (
                        selectedIssue.assignee
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Timeline
                  </div>
                  <div className="text-sm">
                    Created: {selectedIssue.createdAt} • Updated: {selectedIssue.updatedAt}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Description</div>
                  <div className="p-4 rounded-md bg-muted/50">{selectedIssue.description}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Comments ({selectedIssue.comments})
                  </div>
                  {selectedIssue.comments > 0 ? (
                    <div className="space-y-3">
                      {[...Array(selectedIssue.comments)].map((_, index) => (
                        <div key={index} className="p-3 rounded-md bg-muted/50">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium text-sm">
                              {["Rahul Kumar", "Priya Sharma", "Vikram Singh", "Ananya Desai"][index % 4]}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(new Date(selectedIssue.updatedAt).getTime() - index * 3600000).toLocaleString()}
                            </div>
                          </div>
                          <p className="text-sm">
                            {
                              [
                                "I've started investigating this issue. Will update soon.",
                                "This seems to be related to the recent API changes.",
                                "I can reproduce this on my end. Working on a fix.",
                                "Fixed in the latest deployment. Please verify.",
                                "This is a high priority issue that needs immediate attention.",
                              ][index % 5]
                            }
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-md bg-muted/50 text-center text-muted-foreground">No comments yet</div>
                  )}

                  <div className="pt-2">
                    <Textarea placeholder="Add a comment..." className="min-h-[100px]" />
                  </div>
                </div>
              </div>

              <DialogFooter className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Select defaultValue={selectedIssue.status}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue={selectedIssue.assignee === "Unassigned" ? "" : selectedIssue.assignee}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Reassign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      <SelectItem value="Rahul Kumar">Rahul Kumar</SelectItem>
                      <SelectItem value="Priya Sharma">Priya Sharma</SelectItem>
                      <SelectItem value="Vikram Singh">Vikram Singh</SelectItem>
                      <SelectItem value="Ananya Desai">Ananya Desai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </CardContent>
    </Card>
  )
}
