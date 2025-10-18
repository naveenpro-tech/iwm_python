"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Flag, AlertTriangle, CheckCircle, XCircle, Eye, User, Clock } from "lucide-react"
import { motion } from "framer-motion"

// Mock moderation data
const moderationItems = [
  {
    id: "MOD001",
    type: "review",
    content:
      "This movie is absolutely terrible. The director should be banned from making films. Worst waste of money ever!",
    contentTitle: 'Review for "Oppenheimer"',
    reportReason: "Hate speech",
    status: "flagged",
    user: "rahul.sharma@example.com",
    timestamp: "2024-05-24 10:15:42",
    reports: 3,
  },
  {
    id: "MOD002",
    type: "comment",
    content:
      "You clearly don't understand cinema if you liked this movie. Only pretentious people would enjoy this garbage.",
    contentTitle: 'Comment on "Barbie" review',
    reportReason: "Harassment",
    status: "flagged",
    user: "vikram.singh@example.com",
    timestamp: "2024-05-23 18:30:15",
    reports: 2,
  },
  {
    id: "MOD003",
    type: "review",
    content:
      "This film explores complex themes of identity and existence through a masterful blend of visual storytelling and character development. The director's vision is clearly realized in every frame.",
    contentTitle: 'Review for "Poor Things"',
    reportReason: null,
    status: "pending",
    user: "priya.patel@example.com",
    timestamp: "2024-05-23 14:22:37",
    reports: 0,
  },
  {
    id: "MOD004",
    type: "comment",
    content:
      "I disagree with your assessment. While the cinematography was excellent, I found the pacing to be inconsistent and the third act fell apart.",
    contentTitle: 'Comment on "Dune: Part Two" review',
    reportReason: null,
    status: "pending",
    user: "ananya.desai@example.com",
    timestamp: "2024-05-22 21:05:18",
    reports: 0,
  },
  {
    id: "MOD005",
    type: "review",
    content:
      "This movie contains explicit content that should be flagged. The scenes at 1:24:15 and 1:45:30 are particularly concerning and should be reviewed by the moderation team.",
    contentTitle: 'Review for "Challengers"',
    reportReason: "Inappropriate content",
    status: "flagged",
    user: "deepika.reddy@example.com",
    timestamp: "2024-05-22 16:48:52",
    reports: 5,
  },
  {
    id: "MOD006",
    type: "pulse",
    content:
      "BREAKING: Major studio announces they're shutting down production on the upcoming superhero film due to creative differences with the director.",
    contentTitle: "Siddu Pulse post",
    reportReason: "Misinformation",
    status: "flagged",
    user: "arjun.kapoor@example.com",
    timestamp: "2024-05-21 09:12:33",
    reports: 8,
  },
  {
    id: "MOD007",
    type: "comment",
    content: "Check out my website for free movie downloads! [suspicious link removed]",
    contentTitle: 'Comment on "The Creator" review',
    reportReason: "Spam",
    status: "flagged",
    user: "neha.gupta@example.com",
    timestamp: "2024-05-20 22:37:41",
    reports: 4,
  },
  {
    id: "MOD008",
    type: "review",
    content:
      "A stunning achievement in filmmaking that pushes the boundaries of the medium. The performances are nuanced and the screenplay is tight and focused.",
    contentTitle: 'Review for "Killers of the Flower Moon"',
    reportReason: null,
    status: "pending",
    user: "rajesh.kumar@example.com",
    timestamp: "2024-05-20 15:19:27",
    reports: 0,
  },
]

export function ModerationQueue() {
  const [activeTab, setActiveTab] = useState("all")
  const [contentTypeFilter, setContentTypeFilter] = useState("all")

  // Filter items based on active tab and content type filter
  const filteredItems = moderationItems.filter((item) => {
    // Filter by tab (status)
    if (activeTab !== "all" && item.status !== activeTab) return false

    // Filter by content type
    if (contentTypeFilter !== "all" && item.type !== contentTypeFilter) return false

    return true
  })

  // Get icon based on content type
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "review":
        return MessageSquare
      case "comment":
        return MessageSquare
      case "pulse":
        return AlertTriangle
      default:
        return MessageSquare
    }
  }

  // Get color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "flagged":
        return "bg-red-500/10 text-red-500"
      case "pending":
        return "bg-amber-500/10 text-amber-500"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="flagged">
              Flagged
              <Badge variant="secondary" className="ml-1 bg-red-500/10 text-red-500 hover:bg-red-500/10">
                {moderationItems.filter((item) => item.status === "flagged").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              <Badge variant="secondary" className="ml-1 bg-amber-500/10 text-amber-500 hover:bg-amber-500/10">
                {moderationItems.filter((item) => item.status === "pending").length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Content Types</SelectItem>
              <SelectItem value="review">Reviews</SelectItem>
              <SelectItem value="comment">Comments</SelectItem>
              <SelectItem value="pulse">Pulses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => {
            const ContentTypeIcon = getContentTypeIcon(item.type)
            const statusColor = getStatusColor(item.status)

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-base flex items-center">
                          <ContentTypeIcon size={16} className="mr-2" />
                          {item.contentTitle}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <span className="flex items-center">
                            <User size={12} className="mr-1" />
                            {item.user}
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Clock size={12} className="mr-1" />
                            {item.timestamp}
                          </span>
                          {item.status === "flagged" && (
                            <>
                              <span>•</span>
                              <span className="flex items-center">
                                <Flag size={12} className="mr-1" />
                                {item.reports} reports
                              </span>
                            </>
                          )}
                        </CardDescription>
                      </div>
                      <Badge className={statusColor}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-3 rounded-md text-sm">{item.content}</div>

                    {item.reportReason && (
                      <div className="mt-3 flex items-center text-sm text-muted-foreground">
                        <AlertTriangle size={14} className="mr-2 text-amber-500" />
                        Reported for: <span className="font-medium ml-1">{item.reportReason}</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button variant="outline" size="sm">
                      <Eye size={14} className="mr-2" />
                      View Context
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="destructive" size="sm">
                        <XCircle size={14} className="mr-2" />
                        Reject
                      </Button>
                      <Button variant="default" size="sm">
                        <CheckCircle size={14} className="mr-2" />
                        Approve
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <CheckCircle size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">No items to moderate</h3>
              <p className="text-muted-foreground text-center max-w-md">
                There are no items matching your current filters. Try changing your filters or check back later.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
