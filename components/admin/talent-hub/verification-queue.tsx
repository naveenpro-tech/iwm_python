"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Clock } from "lucide-react"

const verificationQueue = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Actress",
    avatar: "/user-avatar-5.png",
    waiting: "2 days",
  },
  {
    id: 2,
    name: "Rahul Khanna",
    role: "Director",
    avatar: "/user-avatar-6.png",
    waiting: "3 days",
  },
  {
    id: 3,
    name: "Ananya Patel",
    role: "Screenwriter",
    avatar: "/user-avatar-7.png",
    waiting: "4 days",
  },
]

export function VerificationQueue() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Verification Queue</CardTitle>
        <CardDescription>Pending profile verifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {verificationQueue.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-10 w-10 border border-border">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                <AvatarFallback>{profile.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{profile.name}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{profile.role}</span>
                  <span className="mx-1">•</span>
                  <Clock size={12} className="mr-1" />
                  <span>Waiting {profile.waiting}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500">
                  <CheckCircle size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                  <XCircle size={16} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-4">
          View All Verifications
        </Button>
      </CardContent>
    </Card>
  )
}
