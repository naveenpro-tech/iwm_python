"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Bell,
  Send,
  Users,
  Filter,
  Search,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Mail,
  MessageSquare,
  Smartphone,
  Globe,
  ArrowUpDown,
  Eye,
  Edit,
  Code,
  Download,
  BarChart3,
  Info,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"

// Mock notification templates
const notificationTemplates = [
  {
    id: "template_001",
    name: "Welcome Email",
    type: "email",
    subject: "Welcome to Siddu Global Entertainment Hub",
    body: "Hello {{name}},\n\nWelcome to Siddu Global Entertainment Hub! We're excited to have you join our community of film enthusiasts and cricket fans.\n\nGet started by exploring our curated collections of global masterpieces and setting up your profile.\n\nBest regards,\nThe Siddu Team",
    variables: ["name", "email"],
    lastUpdated: "2024-05-20 14:30:22",
    status: "active",
    category: "user",
    usageCount: 1245,
  },
  {
    id: "template_002",
    name: "Password Reset",
    type: "email",
    subject: "Reset Your Password - Siddu Global",
    body: "Hello {{name}},\n\nWe received a request to reset your password. Click the link below to set a new password:\n\n{{reset_link}}\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe Siddu Team",
    variables: ["name", "email", "reset_link"],
    lastUpdated: "2024-05-21 09:45:33",
    status: "active",
    category: "user",
    usageCount: 876,
  },
  {
    id: "template_003",
    name: "New Movie Release",
    type: "push",
    subject: "New Release: {{movie_title}}",
    body: "{{movie_title}} is now available on Siddu Global! Directed by {{director}}, this {{genre}} film has received critical acclaim. Watch it now!",
    variables: ["movie_title", "director", "genre"],
    lastUpdated: "2024-05-22 16:30:45",
    status: "active",
    category: "content",
    usageCount: 3542,
  },
  {
    id: "template_004",
    name: "Cricket Match Reminder",
    type: "push",
    subject: "Upcoming Match: {{team1}} vs {{team2}}",
    body: "Don't miss the exciting match between {{team1}} and {{team2}} starting in {{time_until}} at {{venue}}. Set a reminder now!",
    variables: ["team1", "team2", "time_until", "venue"],
    lastUpdated: "2024-05-23 12:45:33",
    status: "active",
    category: "cricket",
    usageCount: 2156,
  },
  {
    id: "template_005",
    name: "Comment Reply Notification",
    type: "in_app",
    subject: "{{user}} replied to your comment",
    body: '{{user}} replied to your comment on {{content_title}}: "{{reply_text}}"',
    variables: ["user", "content_title", "reply_text"],
    lastUpdated: "2024-05-24 11:15:22",
    status: "active",
    category: "social",
    usageCount: 5421,
  },
  {
    id: "template_006",
    name: "Weekly Digest",
    type: "email",
    subject: "Your Weekly Siddu Digest",
    body: "Hello {{name}},\n\nHere's your weekly digest of what's happening on Siddu Global:\n\nNew Releases: {{new_releases}}\nUpcoming Cricket Matches: {{upcoming_matches}}\nTrending Discussions: {{trending_discussions}}\n\nEnjoy your week!\nThe Siddu Team",
    variables: ["name", "new_releases", "upcoming_matches", "trending_discussions"],
    lastUpdated: "2024-05-24 15:45:33",
    status: "active",
    category: "digest",
    usageCount: 8754,
  },
  {
    id: "template_007",
    name: "Account Verification",
    type: "email",
    subject: "Verify Your Siddu Global Account",
    body: "Hello {{name}},\n\nPlease verify your email address by clicking the link below:\n\n{{verification_link}}\n\nThis link will expire in 24 hours.\n\nBest regards,\nThe Siddu Team",
    variables: ["name", "email", "verification_link"],
    lastUpdated: "2024-05-25 08:45:12",
    status: "inactive",
    category: "user",
    usageCount: 0,
  },
  {
    id: "template_008",
    name: "New Follower Alert",
    type: "in_app",
    subject: "{{follower_name}} started following you",
    body: "{{follower_name}} is now following you on Siddu Global. Check out their profile!",
    variables: ["follower_name", "follower_profile_url"],
    lastUpdated: "2024-05-24 09:30:15",
    status: "active",
    category: "social",
    usageCount: 3254,
  },
  {
    id: "template_009",
    name: "Review Liked Notification",
    type: "in_app",
    subject: "{{user}} liked your review",
    body: "{{user}} liked your review of {{movie_title}}",
    variables: ["user", "movie_title"],
    lastUpdated: "2024-05-23 14:20:33",
    status: "active",
    category: "social",
    usageCount: 4521,
  },
  {
    id: "template_010",
    name: "Content Removed",
    type: "email",
    subject: "Your Content Has Been Removed",
    body: "Hello {{name}},\n\nYour {{content_type}} has been removed because it violates our community guidelines. Specifically, it violates our policy on {{violation_type}}.\n\nIf you believe this is a mistake, you can appeal this decision.\n\nBest regards,\nThe Siddu Team",
    variables: ["name", "content_type", "violation_type"],
    lastUpdated: "2024-05-22 11:30:45",
    status: "active",
    category: "moderation",
    usageCount: 124,
  },
]

// Mock notification logs
const notificationLogs = [
  {
    id: "log_001",
    template: "Welcome Email",
    recipient: "user123@example.com",
    type: "email",
    status: "delivered",
    sentAt: "2024-05-25 10:15:42",
    openedAt: "2024-05-25 10:30:18",
  },
  {
    id: "log_002",
    template: "New Movie Release",
    recipient: "user456@example.com",
    type: "push",
    status: "delivered",
    sentAt: "2024-05-25 09:30:18",
    openedAt: "2024-05-25 09:45:33",
  },
  {
    id: "log_003",
    template: "Password Reset",
    recipient: "user789@example.com",
    type: "email",
    status: "delivered",
    sentAt: "2024-05-24 22:45:33",
    openedAt: null,
  },
  {
    id: "log_004",
    template: "Cricket Match Reminder",
    recipient: "user234@example.com",
    type: "push",
    status: "failed",
    sentAt: "2024-05-24 18:12:05",
    openedAt: null,
  },
  {
    id: "log_005",
    template: "Comment Reply Notification",
    recipient: "user567@example.com",
    type: "in_app",
    status: "delivered",
    sentAt: "2024-05-24 15:45:33",
    openedAt: "2024-05-24 16:30:45",
  },
  {
    id: "log_006",
    template: "Weekly Digest",
    recipient: "user890@example.com",
    type: "email",
    status: "delivered",
    sentAt: "2024-05-24 14:30:22",
    openedAt: "2024-05-24 18:45:33",
  },
  {
    id: "log_007",
    template: "Account Verification",
    recipient: "user321@example.com",
    type: "email",
    status: "bounced",
    sentAt: "2024-05-24 12:15:45",
    openedAt: null,
  },
  {
    id: "log_008",
    template: "New Movie Release",
    recipient: "user654@example.com",
    type: "push",
    status: "delivered",
    sentAt: "2024-05-24 11:15:22",
    openedAt: null,
  },
  {
    id: "log_009",
    template: "Comment Reply Notification",
    recipient: "user987@example.com",
    type: "in_app",
    status: "delivered",
    sentAt: "2024-05-24 09:45:33",
    openedAt: "2024-05-24 10:15:22",
  },
  {
    id: "log_010",
    template: "Welcome Email",
    recipient: "user432@example.com",
    type: "email",
    status: "delivered",
    sentAt: "2024-05-23 16:45:33",
    openedAt: "2024-05-23 17:30:45",
  },
]

// Mock delivery stats
const deliveryStats = {
  total: 12458,
  delivered: 11245,
  failed: 987,
  bounced: 226,
  opened: 8754,
  clicked: 4521,
  byType: {
    email: 6542,
    push: 3254,
    inApp: 2662,
  },
  byStatus: {
    delivered: 11245,
    failed: 987,
    bounced: 226,
  },
  byTemplate: [
    { name: "Welcome Email", count: 1245 },
    { name: "Weekly Digest", count: 8754 },
    { name: "New Movie Release", count: 3542 },
    { name: "Comment Reply Notification", count: 5421 },
    { name: "Cricket Match Reminder", count: 2156 },
  ],
  deliveryRate: 90.3, // percentage
  openRate: 70.2, // percentage
  clickRate: 36.3, // percentage
}

export function NotificationSystem() {
  const [activeTab, setActiveTab] = useState("templates")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isSendingBulk, setIsSendingBulk] = useState(false)
  const [showCodeView, setShowCodeView] = useState(false)
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null)

  // Form states for new template
  const [newTemplateName, setNewTemplateName] = useState("")
  const [newTemplateType, setNewTemplateType] = useState("email")
  const [newTemplateSubject, setNewTemplateSubject] = useState("")
  const [newTemplateBody, setNewTemplateBody] = useState("")
  const [newTemplateVariables, setNewTemplateVariables] = useState("")
  const [newTemplateCategory, setNewTemplateCategory] = useState("user")
  const [newTemplateStatus, setNewTemplateStatus] = useState(true)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handlePreview = (template: any) => {
    setSelectedTemplate(template)
    setIsPreviewDialogOpen(true)
    setShowCodeView(false)
  }

  const handleTest = (template: any) => {
    setSelectedTemplate(template)
    setIsTestDialogOpen(true)
    setTestResult(null)
  }

  const handleSendTest = () => {
    setIsSending(true)
    setTestResult(null)

    // Simulate sending
    setTimeout(() => {
      setIsSending(false)
      // Randomly succeed or fail for demo purposes
      setTestResult(Math.random() > 0.2 ? "success" : "error")
    }, 1500)
  }

  const handleSendBulkNotification = () => {
    setIsSendingBulk(true)

    // Simulate sending
    setTimeout(() => {
      setIsSendingBulk(false)
      // Show success message or handle in UI
    }, 2500)
  }

  const handleCreateTemplate = () => {
    // In a real app, you would create a new template
    setIsNewTemplateDialogOpen(false)

    // Reset form
    setNewTemplateName("")
    setNewTemplateType("email")
    setNewTemplateSubject("")
    setNewTemplateBody("")
    setNewTemplateVariables("")
    setNewTemplateCategory("user")
    setNewTemplateStatus(true)
  }

  // Filter templates based on search query, selected type, and category
  const filteredTemplates = notificationTemplates.filter((template) => {
    const matchesSearch = searchQuery
      ? template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.body.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchesType = selectedType ? template.type === selectedType : true
    const matchesCategory = selectedCategory ? template.category === selectedCategory : true
    return matchesSearch && matchesType && matchesCategory
  })

  // Filter logs based on search query and selected type
  const filteredLogs = notificationLogs.filter((log) => {
    const matchesSearch = searchQuery
      ? log.template.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.recipient.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchesType = selectedType ? log.type === selectedType : true
    return matchesSearch && matchesType
  })

  // Sort templates based on sort column and direction
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
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

  // Sort logs based on sort column and direction
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  return (
    <Card className="shadow-lg border-border/40">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notification System
            </CardTitle>
            <CardDescription>Manage notification templates and delivery settings</CardDescription>
          </div>
          <div className="flex gap-2">
            {activeTab === "templates" && (
              <Dialog open={isNewTemplateDialogOpen} onOpenChange={setIsNewTemplateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    New Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Notification Template</DialogTitle>
                    <DialogDescription>Create a new notification template for various channels.</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-name">Template Name</Label>
                      <Input
                        id="template-name"
                        placeholder="e.g., Welcome Email"
                        value={newTemplateName}
                        onChange={(e) => setNewTemplateName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-type">Notification Type</Label>
                      <Select value={newTemplateType} onValueChange={setNewTemplateType}>
                        <SelectTrigger id="template-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="push">Push Notification</SelectItem>
                          <SelectItem value="in_app">In-App Notification</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-category">Category</Label>
                      <Select value={newTemplateCategory} onValueChange={setNewTemplateCategory}>
                        <SelectTrigger id="template-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User Account</SelectItem>
                          <SelectItem value="content">Content Updates</SelectItem>
                          <SelectItem value="social">Social Interactions</SelectItem>
                          <SelectItem value="cricket">Cricket Updates</SelectItem>
                          <SelectItem value="digest">Digest & Summaries</SelectItem>
                          <SelectItem value="moderation">Moderation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-subject">Subject</Label>
                      <Input
                        id="template-subject"
                        placeholder="Notification subject or title"
                        value={newTemplateSubject}
                        onChange={(e) => setNewTemplateSubject(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-body">Body</Label>
                      <Textarea
                        id="template-body"
                        placeholder="Notification content..."
                        className="min-h-[150px] font-mono text-sm"
                        value={newTemplateBody}
                        onChange={(e) => setNewTemplateBody(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Use {{ variable_name }} syntax for dynamic content. Example: Hello {{ name }}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-variables">Variables (comma-separated)</Label>
                      <Input
                        id="template-variables"
                        placeholder="name, email, reset_link"
                        value={newTemplateVariables}
                        onChange={(e) => setNewTemplateVariables(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="template-active">Active</Label>
                        <p className="text-sm text-muted-foreground">Enable this notification template</p>
                      </div>
                      <Switch id="template-active" checked={newTemplateStatus} onCheckedChange={setNewTemplateStatus} />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewTemplateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateTemplate}
                      disabled={!newTemplateName || !newTemplateSubject || !newTemplateBody}
                    >
                      Create Template
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {activeTab === "send" && (
              <Button onClick={handleSendBulkNotification} disabled={isSendingBulk}>
                {isSendingBulk ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-1" />
                    Send Notification
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="templates" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="templates" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Delivery Logs
            </TabsTrigger>
            <TabsTrigger value="send" className="flex items-center">
              <Send className="h-4 w-4 mr-1" />
              Send Notification
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab === "templates" ? "templates" : "logs"}...`}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedType(null)}
                className={selectedType === null ? "bg-primary text-primary-foreground" : ""}
              >
                All Types
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedType("email")}
                className={selectedType === "email" ? "bg-primary text-primary-foreground" : ""}
              >
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedType("push")}
                className={selectedType === "push" ? "bg-primary text-primary-foreground" : ""}
              >
                <Smartphone className="h-4 w-4 mr-1" />
                Push
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedType("in_app")}
                className={selectedType === "in_app" ? "bg-primary text-primary-foreground" : ""}
              >
                <Globe className="h-4 w-4 mr-1" />
                In-App
              </Button>

              {activeTab === "templates" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                    className={selectedCategory === null ? "bg-primary text-primary-foreground" : ""}
                  >
                    All Categories
                  </Button>
                  <Select value={selectedCategory || ""} onValueChange={(value) => setSelectedCategory(value || null)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="user">User Account</SelectItem>
                      <SelectItem value="content">Content Updates</SelectItem>
                      <SelectItem value="social">Social Interactions</SelectItem>
                      <SelectItem value="cricket">Cricket Updates</SelectItem>
                      <SelectItem value="digest">Digest & Summaries</SelectItem>
                      <SelectItem value="moderation">Moderation</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Advanced Filter
            </Button>
          </div>

          <TabsContent value="templates">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                      <div className="flex items-center">
                        Name
                        {sortColumn === "name" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
                      <div className="flex items-center">
                        Type
                        {sortColumn === "type" && (
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
                    <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort("subject")}>
                      <div className="flex items-center">
                        Subject
                        {sortColumn === "subject" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hidden lg:table-cell"
                      onClick={() => handleSort("lastUpdated")}
                    >
                      <div className="flex items-center">
                        Last Updated
                        {sortColumn === "lastUpdated" && (
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
                  {sortedTemplates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No templates found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    <AnimatePresence>
                      {sortedTemplates.map((template, index) => (
                        <motion.tr
                          key={template.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <TableCell className="font-medium">
                            <div>
                              <div>{template.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {template.usageCount.toLocaleString()} sent
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                template.type === "email"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : template.type === "push"
                                    ? "bg-purple-500/10 text-purple-500"
                                    : "bg-green-500/10 text-green-500"
                              }
                            >
                              {template.type === "email" ? (
                                <Mail className="h-3 w-3 mr-1" />
                              ) : template.type === "push" ? (
                                <Smartphone className="h-3 w-3 mr-1" />
                              ) : (
                                <Globe className="h-3 w-3 mr-1" />
                              )}
                              {template.type === "email" ? "Email" : template.type === "push" ? "Push" : "In-App"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate hidden md:table-cell">
                            {template.subject}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{template.lastUpdated}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                template.status === "active"
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-red-500/10 text-red-500"
                              }
                            >
                              {template.status === "active" ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {template.status === "active" ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" onClick={() => handlePreview(template)}>
                                      <Eye className="h-4 w-4 mr-1" />
                                      Preview
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Preview template</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" onClick={() => handleTest(template)}>
                                      <Send className="h-4 w-4 mr-1" />
                                      Test
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Send test notification</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4 mr-1" />
                                      Edit
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit template</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("template")}>
                      <div className="flex items-center">
                        Template
                        {sortColumn === "template" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("recipient")}>
                      <div className="flex items-center">
                        Recipient
                        {sortColumn === "recipient" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
                      <div className="flex items-center">
                        Type
                        {sortColumn === "type" && (
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
                    <TableHead className="cursor-pointer" onClick={() => handleSort("sentAt")}>
                      <div className="flex items-center">
                        Sent At
                        {sortColumn === "sentAt" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort("openedAt")}>
                      <div className="flex items-center">
                        Opened At
                        {sortColumn === "openedAt" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No logs found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    <AnimatePresence>
                      {sortedLogs.map((log, index) => (
                        <motion.tr
                          key={log.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <TableCell className="font-medium">{log.template}</TableCell>
                          <TableCell>{log.recipient}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                log.type === "email"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : log.type === "push"
                                    ? "bg-purple-500/10 text-purple-500"
                                    : "bg-green-500/10 text-green-500"
                              }
                            >
                              {log.type === "email" ? (
                                <Mail className="h-3 w-3 mr-1" />
                              ) : log.type === "push" ? (
                                <Smartphone className="h-3 w-3 mr-1" />
                              ) : (
                                <Globe className="h-3 w-3 mr-1" />
                              )}
                              {log.type === "email" ? "Email" : log.type === "push" ? "Push" : "In-App"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                log.status === "delivered"
                                  ? "bg-green-500/10 text-green-500"
                                  : log.status === "failed"
                                    ? "bg-red-500/10 text-red-500"
                                    : "bg-amber-500/10 text-amber-500"
                              }
                            >
                              {log.status === "delivered" ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : log.status === "failed" ? (
                                <XCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <AlertTriangle className="h-3 w-3 mr-1" />
                              )}
                              {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.sentAt}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {log.openedAt ? (
                              log.openedAt
                            ) : (
                              <span className="text-muted-foreground text-sm">Not opened</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="ghost" size="sm">
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Resend
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="send">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Send Notification</CardTitle>
                <CardDescription>Send a notification to users or user segments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notification-template">Notification Template</Label>
                  <Select>
                    <SelectTrigger id="notification-template">
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTemplates
                        .filter((t) => t.status === "active")
                        .map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notification-audience">Audience</Label>
                  <Select>
                    <SelectTrigger id="notification-audience">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="active">Active Users</SelectItem>
                      <SelectItem value="inactive">Inactive Users (30+ days)</SelectItem>
                      <SelectItem value="new">New Users (Last 7 days)</SelectItem>
                      <SelectItem value="premium">Premium Subscribers</SelectItem>
                      <SelectItem value="custom">Custom Segment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="notification-custom-segment">Custom Segment (Optional)</Label>
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-1" />
                      User Segments
                    </Button>
                  </div>
                  <Textarea
                    id="notification-custom-segment"
                    placeholder="SQL query or segment definition..."
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Define a custom segment using SQL or select from predefined segments
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notification-schedule">Schedule (Optional)</Label>
                  <div className="flex gap-2">
                    <Select defaultValue="now">
                      <SelectTrigger id="notification-schedule">
                        <SelectValue placeholder="Send timing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="now">Send Immediately</SelectItem>
                        <SelectItem value="scheduled">Schedule for Later</SelectItem>
                        <SelectItem value="recurring">Recurring</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="datetime-local" className="flex-1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Template Variables</Label>
                  <div className="rounded-md border p-4 space-y-2">
                    <p className="text-sm text-muted-foreground mb-2">
                      Define values for template variables or use dynamic values
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="var-name">name</Label>
                        <Input id="var-name" placeholder="{{user.name}}" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="var-email">email</Label>
                        <Input id="var-email" placeholder="{{user.email}}" />
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Variable
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notification-track">Track Opens and Clicks</Label>
                    <p className="text-sm text-muted-foreground">Monitor engagement with this notification</p>
                  </div>
                  <Switch id="notification-track" defaultChecked />
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <Button variant="outline">Preview</Button>
                  <Button variant="outline">Save as Draft</Button>
                  <Button onClick={handleSendBulkNotification} disabled={isSendingBulk}>
                    {isSendingBulk ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-1" />
                        Send Notification
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold">{deliveryStats.deliveryRate}%</div>
                    <div className="text-sm text-muted-foreground">Delivery Rate</div>
                    <div className="w-full mt-2">
                      <Progress value={deliveryStats.deliveryRate} className="h-2" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {deliveryStats.delivered.toLocaleString()} of {deliveryStats.total.toLocaleString()} delivered
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold">{deliveryStats.openRate}%</div>
                    <div className="text-sm text-muted-foreground">Open Rate</div>
                    <div className="w-full mt-2">
                      <Progress value={deliveryStats.openRate} className="h-2" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {deliveryStats.opened.toLocaleString()} of {deliveryStats.delivered.toLocaleString()} opened
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold">{deliveryStats.clickRate}%</div>
                    <div className="text-sm text-muted-foreground">Click Rate</div>
                    <div className="w-full mt-2">
                      <Progress value={deliveryStats.clickRate} className="h-2" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {deliveryStats.clicked.toLocaleString()} of {deliveryStats.opened.toLocaleString()} clicked
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Notifications by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">Notification type chart would appear here</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                      <div className="text-lg font-bold">{deliveryStats.byType.email.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Email</div>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                      <div className="text-lg font-bold">{deliveryStats.byType.push.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Push</div>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                      <div className="text-lg font-bold">{deliveryStats.byType.inApp.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">In-App</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Delivery Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">Delivery status chart would appear here</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                      <div className="text-lg font-bold">{deliveryStats.byStatus.delivered.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Delivered</div>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                      <div className="text-lg font-bold">{deliveryStats.byStatus.failed.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Failed</div>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                      <div className="text-lg font-bold">{deliveryStats.byStatus.bounced.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Bounced</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Top Templates by Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveryStats.byTemplate.map((template, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-48 font-medium truncate">{template.name}</div>
                      <div className="flex-1 mx-4">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${(template.count / Math.max(...deliveryStats.byTemplate.map((t) => t.count))) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-20 text-right">{template.count.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Template Preview Dialog */}
        <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
          {selectedTemplate && (
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Template Preview: {selectedTemplate.name}</DialogTitle>
                <DialogDescription>Preview how this notification will appear to recipients.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCodeView(!showCodeView)}
                    className="gap-1.5"
                  >
                    {showCodeView ? <Eye className="h-4 w-4" /> : <Code className="h-4 w-4" />}
                    {showCodeView ? "Preview View" : "Code View"}
                  </Button>
                </div>

                {showCodeView ? (
                  <div className="space-y-2">
                    <Label>Template Code</Label>
                    <div className="p-3 rounded-md bg-muted/50 font-mono text-sm overflow-auto">
                      <pre className="whitespace-pre-wrap">{`{
  "id": "${selectedTemplate.id}",
  "name": "${selectedTemplate.name}",
  "type": "${selectedTemplate.type}",
  "subject": "${selectedTemplate.subject}",
  "body": ${JSON.stringify(selectedTemplate.body)},
  "variables": ${JSON.stringify(selectedTemplate.variables)},
  "status": "${selectedTemplate.status}"
}`}</pre>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Badge
                        variant="outline"
                        className={
                          selectedTemplate.type === "email"
                            ? "bg-blue-500/10 text-blue-500"
                            : selectedTemplate.type === "push"
                              ? "bg-purple-500/10 text-purple-500"
                              : "bg-green-500/10 text-green-500"
                        }
                      >
                        {selectedTemplate.type === "email" ? (
                          <Mail className="h-3 w-3 mr-1" />
                        ) : selectedTemplate.type === "push" ? (
                          <Smartphone className="h-3 w-3 mr-1" />
                        ) : (
                          <Globe className="h-3 w-3 mr-1" />
                        )}
                        {selectedTemplate.type === "email"
                          ? "Email"
                          : selectedTemplate.type === "push"
                            ? "Push"
                            : "In-App"}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <div className="p-3 rounded-md bg-muted/50">{selectedTemplate.subject}</div>
                    </div>

                    <div className="space-y-2">
                      <Label>Body</Label>
                      <div className="p-3 rounded-md bg-muted/50 whitespace-pre-wrap">{selectedTemplate.body}</div>
                    </div>

                    <div className="space-y-2">
                      <Label>Variables</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedTemplate.variables.map((variable: string) => (
                          <Badge key={variable} variant="outline">
                            {`{{${variable}}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedTemplate.type === "email" && (
                      <div className="pt-4">
                        <Button variant="outline" className="w-full">
                          <Eye className="h-4 w-4 mr-1" />
                          View HTML Preview
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsPreviewDialogOpen(false)
                    handleTest(selectedTemplate)
                  }}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Send Test
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>

        {/* Test Notification Dialog */}
        <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
          {selectedTemplate && (
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Send Test: {selectedTemplate.name}</DialogTitle>
                <DialogDescription>Send a test notification to verify the template.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {selectedTemplate.type === "email" && (
                  <div className="space-y-2">
                    <Label htmlFor="test-email">Test Email Address</Label>
                    <Input id="test-email" type="email" placeholder="your@email.com" />
                  </div>
                )}

                {selectedTemplate.type === "push" && (
                  <div className="space-y-2">
                    <Label htmlFor="test-device">Test Device</Label>
                    <Select defaultValue="current">
                      <SelectTrigger id="test-device">
                        <SelectValue placeholder="Select device" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">Current Device</SelectItem>
                        <SelectItem value="android">Test Android Device</SelectItem>
                        <SelectItem value="ios">Test iOS Device</SelectItem>
                        <SelectItem value="all">All Test Devices</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedTemplate.type === "in_app" && (
                  <div className="space-y-2">
                    <Label htmlFor="test-user">Test User</Label>
                    <Select defaultValue="current">
                      <SelectTrigger id="test-user">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">Current User</SelectItem>
                        <SelectItem value="test1">Test User 1</SelectItem>
                        <SelectItem value="test2">Test User 2</SelectItem>
                        <SelectItem value="admin">Admin User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Test Variables</Label>
                  <div className="rounded-md border p-3 space-y-2">
                    {selectedTemplate.variables.map((variable: string) => (
                      <div key={variable} className="space-y-1">
                        <Label htmlFor={`var-${variable}`} className="text-xs">
                          {variable}
                        </Label>
                        <Input
                          id={`var-${variable}`}
                          placeholder={`Value for ${variable}`}
                          defaultValue={variable === "name" ? "Test User" : ""}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {testResult && (
                  <div className={`p-3 rounded-md ${testResult === "success" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                    <div className="flex items-center">
                      {testResult === "success" ? (
                        <CheckCircle className={`h-4 w-4 mr-2 text-green-500`} />
                      ) : (
                        <XCircle className={`h-4 w-4 mr-2 text-red-500`} />
                      )}
                      <span className={testResult === "success" ? "text-green-500" : "text-red-500"}>
                        {testResult === "success"
                          ? "Test notification sent successfully!"
                          : "Failed to send test notification. Please try again."}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTestDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendTest} disabled={isSending}>
                  {isSending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-1" />
                      Send Test
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <Info className="h-4 w-4 mr-1" />
          {activeTab === "templates"
            ? `${notificationTemplates.length} templates available`
            : activeTab === "logs"
              ? `Showing ${sortedLogs.length} of ${notificationLogs.length} logs`
              : activeTab === "analytics"
                ? `Data updated as of ${new Date().toLocaleString()}`
                : "Configure notification settings in the Settings tab"}
        </div>
        <div className="flex gap-2">
          {activeTab === "templates" && (
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export Templates
            </Button>
          )}
          {activeTab === "logs" && (
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export Logs
            </Button>
          )}
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
