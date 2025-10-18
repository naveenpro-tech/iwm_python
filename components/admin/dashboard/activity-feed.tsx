"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import {
  Clock,
  User,
  Film,
  MessageSquare,
  Flag,
  ShieldCheck,
  UserCheck,
  Briefcase,
  HelpCircleIcon,
  Zap,
  Settings,
} from "lucide-react"

// Enhanced Mock activity data
const activities = [
  {
    id: 1,
    type: "user",
    action: "New user registered",
    subject: "Priya Sharma",
    timestamp: "2m ago",
    icon: User,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: 2,
    type: "moderation",
    action: "Review approved",
    subject: 'Review for "Oppenheimer"',
    timestamp: "15m ago",
    icon: ShieldCheck,
    color: "bg-green-500/10 text-green-500",
  },
  {
    id: 3,
    type: "content",
    action: "New movie added",
    subject: "Dune: Part Two",
    timestamp: "45m ago",
    icon: Film,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    id: 4,
    type: "moderation",
    action: "Comment flagged",
    subject: 'Comment on "Barbie" review',
    timestamp: "1h ago",
    icon: Flag,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    id: 5,
    type: "talent",
    action: "New talent profile created",
    subject: "Arjun Kapoor",
    timestamp: "2h ago",
    icon: UserCheck,
    color: "bg-teal-500/10 text-teal-500",
  },
  {
    id: 6,
    type: "industry",
    action: "Industry profile verified",
    subject: "Anurag Kashyap",
    timestamp: "3h ago",
    icon: Briefcase,
    color: "bg-indigo-500/10 text-indigo-500",
  },
  {
    id: 7,
    type: "quiz",
    action: "New quiz published",
    subject: "Sci-Fi Movie Trivia",
    timestamp: "3h ago",
    icon: HelpCircleIcon,
    color: "bg-rose-500/10 text-rose-500",
  },
  {
    id: 8,
    type: "system",
    action: "Database backup successful",
    subject: "Nightly backup routine",
    timestamp: "4h ago",
    icon: Settings,
    color: "bg-slate-500/10 text-slate-500",
  },
  {
    id: 9,
    type: "optimization",
    action: "Image assets optimized",
    subject: "Reduced load times by 15%",
    timestamp: "5h ago",
    icon: Zap,
    color: "bg-lime-500/10 text-lime-500",
  },
  {
    id: 10,
    type: "content",
    action: "New review submitted",
    subject: 'Review for "Poor Things"',
    timestamp: "6h ago",
    icon: MessageSquare,
    color: "bg-pink-500/10 text-pink-500",
  },
]

export function ActivityFeed() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredActivities =
    activeTab === "all" ? activities : activities.filter((activity) => activity.type === activeTab)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Activity Feed</CardTitle>
        <CardDescription>Recent activity across the platform</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="flex-grow flex flex-col">
          <TabsList className="mb-4 grid w-full grid-cols-3 sm:grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="user">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="talent">Talent</TabsTrigger>
            <TabsTrigger value="industry">Industry</TabsTrigger>
            <TabsTrigger value="quiz">Quizzes</TabsTrigger>
            {/* Add more tabs as needed, e.g., system, optimization */}
          </TabsList>

          <TabsContent value={activeTab} className="m-0 flex-grow">
            <ScrollArea className="h-[350px] md:h-[400px] pr-3">
              <div className="space-y-3">
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className={`p-1.5 rounded-full ${activity.color} mt-0.5`}>
                        <activity.icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.subject}</p>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                        <Clock size={12} className="mr-1" />
                        {activity.timestamp}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-10">No activities in this category.</div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          <Button variant="ghost" className="w-full mt-4 text-sm">
            View All Activity
          </Button>
        </Tabs>
      </CardContent>
    </Card>
  )
}
