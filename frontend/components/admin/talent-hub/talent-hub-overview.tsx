"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Clock, UserCheck, FileText, Flag, ShieldCheck, Award, MessageSquare, AlertTriangle } from "lucide-react"

// Mock activity data
const activities = [
  {
    id: 1,
    type: "profile",
    action: "New talent profile created",
    subject: "Arjun Kapoor",
    timestamp: "5 minutes ago",
    icon: UserCheck,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: 2,
    type: "verification",
    action: "Profile verification approved",
    subject: "Deepika Padukone",
    timestamp: "15 minutes ago",
    icon: ShieldCheck,
    color: "bg-green-500/10 text-green-500",
  },
  {
    id: 3,
    type: "casting",
    action: "New casting call posted",
    subject: "Supporting Role in 'Midnight Mystery'",
    timestamp: "45 minutes ago",
    icon: FileText,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    id: 4,
    type: "report",
    action: "Profile reported",
    subject: "Fake profile claiming to be Aamir Khan",
    timestamp: "1 hour ago",
    icon: Flag,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    id: 5,
    type: "profile",
    action: "Portfolio updated",
    subject: "Rajkummar Rao",
    timestamp: "2 hours ago",
    icon: UserCheck,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: 6,
    type: "verification",
    action: "Verification documents submitted",
    subject: "Taapsee Pannu",
    timestamp: "3 hours ago",
    icon: Award,
    color: "bg-indigo-500/10 text-indigo-500",
  },
  {
    id: 7,
    type: "casting",
    action: "Casting call application received",
    subject: "Lead Role in 'Desert Storm'",
    timestamp: "4 hours ago",
    icon: FileText,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    id: 8,
    type: "report",
    action: "Casting call reported as scam",
    subject: "Suspicious Bollywood Feature Film",
    timestamp: "5 hours ago",
    icon: AlertTriangle,
    color: "bg-red-500/10 text-red-500",
  },
  {
    id: 9,
    type: "message",
    action: "New message in casting call",
    subject: "Question about 'Mumbai Nights' audition",
    timestamp: "6 hours ago",
    icon: MessageSquare,
    color: "bg-cyan-500/10 text-cyan-500",
  },
]

export function TalentHubOverview() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredActivities =
    activeTab === "all" ? activities : activities.filter((activity) => activity.type === activeTab)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Talent Hub Activity</CardTitle>
        <CardDescription>Recent activity in the talent hub</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="profile">Profiles</TabsTrigger>
            <TabsTrigger value="casting">Casting Calls</TabsTrigger>
            <TabsTrigger value="verification">Verifications</TabsTrigger>
            <TabsTrigger value="report">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="m-0">
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-full ${activity.color} mt-0.5`}>
                    <activity.icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground truncate">{activity.subject}</p>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                    <Clock size={12} className="mr-1" />
                    {activity.timestamp}
                  </div>
                </motion.div>
              ))}
            </div>

            <Button variant="ghost" className="w-full mt-4">
              View All Activity
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
