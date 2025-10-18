"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"

const recentProfiles = [
  {
    id: 1,
    name: "Arjun Kapoor",
    role: "Actor",
    location: "Mumbai, India",
    status: "verified",
    avatar: "/rajkummar-rao-portrait.png",
    created: "2 hours ago",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Actress",
    location: "Delhi, India",
    status: "pending",
    avatar: "/user-avatar-5.png",
    created: "3 hours ago",
  },
  {
    id: 3,
    name: "Vikram Singh",
    role: "Director",
    location: "Bangalore, India",
    status: "verified",
    avatar: "/user-avatar-6.png",
    created: "5 hours ago",
  },
  {
    id: 4,
    name: "Meera Desai",
    role: "Cinematographer",
    location: "Chennai, India",
    status: "flagged",
    avatar: "/user-avatar-7.png",
    created: "8 hours ago",
  },
]

export function RecentTalentProfiles() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Talent Profiles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentProfiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-12 w-12 border border-border">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                <AvatarFallback>{profile.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{profile.name}</p>
                  {profile.status === "verified" && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      <CheckCircle2 size={12} className="mr-1" /> Verified
                    </Badge>
                  )}
                  {profile.status === "pending" && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      <Clock size={12} className="mr-1" /> Pending
                    </Badge>
                  )}
                  {profile.status === "flagged" && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                      <AlertCircle size={12} className="mr-1" /> Flagged
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {profile.role} • {profile.location}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Created {profile.created}</p>
              </div>
              <Button variant="ghost" size="sm" className="shrink-0">
                View
              </Button>
            </motion.div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-4">
          View All Profiles
        </Button>
      </CardContent>
    </Card>
  )
}
