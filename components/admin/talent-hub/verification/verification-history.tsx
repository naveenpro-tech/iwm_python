"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle2, XCircle, Flag, Clock } from "lucide-react"

// Mock data for verification history
const verificationHistory = [
  {
    id: 1,
    name: "Karan Malhotra",
    role: "Actor",
    avatar: "/user-avatar-1.png",
    status: "approved",
    timestamp: "2 hours ago",
    verifiedBy: "Admin",
  },
  {
    id: 2,
    name: "Meera Desai",
    role: "Cinematographer",
    avatar: "/user-avatar-7.png",
    status: "rejected",
    timestamp: "3 hours ago",
    verifiedBy: "Admin",
  },
  {
    id: 3,
    name: "Arjun Kapoor",
    role: "Actor",
    avatar: "/rajkummar-rao-portrait.png",
    status: "approved",
    timestamp: "5 hours ago",
    verifiedBy: "Admin",
  },
  {
    id: 4,
    name: "Sanjay Mehta",
    role: "Director",
    avatar: "/user-avatar-3.png",
    status: "approved",
    timestamp: "6 hours ago",
    verifiedBy: "Admin",
  },
  {
    id: 5,
    name: "Pooja Reddy",
    role: "Sound Designer",
    avatar: "/user-avatar-4.png",
    status: "flagged",
    timestamp: "8 hours ago",
    verifiedBy: "Admin",
  },
  {
    id: 6,
    name: "Vikram Singh",
    role: "Director",
    avatar: "/user-avatar-6.png",
    status: "approved",
    timestamp: "10 hours ago",
    verifiedBy: "Admin",
  },
]

export function VerificationHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Recent verification decisions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {verificationHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center gap-3"
            >
              <Avatar className="h-10 w-10 border border-border">
                <AvatarImage src={item.avatar || "/placeholder.svg"} alt={item.name} />
                <AvatarFallback>{item.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{item.role}</span>
                  <span className="mx-1">•</span>
                  <Clock size={12} className="mr-1" />
                  <span>{item.timestamp}</span>
                </div>
              </div>
              {item.status === "approved" && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle2 size={12} className="mr-1" /> Approved
                </Badge>
              )}
              {item.status === "rejected" && (
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                  <XCircle size={12} className="mr-1" /> Rejected
                </Badge>
              )}
              {item.status === "flagged" && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                  <Flag size={12} className="mr-1" /> Flagged
                </Badge>
              )}
            </motion.div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-4">
          View All History
        </Button>
      </CardContent>
    </Card>
  )
}
