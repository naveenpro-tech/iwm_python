"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle2, Star, TrendingUp } from "lucide-react"

// Mock data for top talent
const topTalent = [
  {
    id: 1,
    name: "Arjun Kapoor",
    role: "Actor",
    avatar: "/rajkummar-rao-portrait.png",
    profileViews: 1245,
    trend: "+12%",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Actress",
    avatar: "/user-avatar-5.png",
    profileViews: 980,
    trend: "+8%",
  },
  {
    id: 3,
    name: "Vikram Singh",
    role: "Director",
    avatar: "/user-avatar-6.png",
    profileViews: 865,
    trend: "+15%",
  },
  {
    id: 4,
    name: "Meera Desai",
    role: "Cinematographer",
    avatar: "/user-avatar-7.png",
    profileViews: 720,
    trend: "+5%",
  },
  {
    id: 5,
    name: "Rahul Khanna",
    role: "Producer",
    avatar: "/user-avatar-8.png",
    profileViews: 685,
    trend: "+9%",
  },
]

export function TopTalentTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Top Talent Profiles</CardTitle>
          <CardDescription>Most viewed talent profiles this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topTalent.map((talent, index) => (
              <motion.div
                key={talent.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 + 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                  {index + 1}
                </div>
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={talent.avatar || "/placeholder.svg"} alt={talent.name} />
                  <AvatarFallback>{talent.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{talent.name}</p>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      <CheckCircle2 size={12} className="mr-1" /> Verified
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{talent.role}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium flex items-center justify-end">
                    <Star size={14} className="mr-1 text-amber-500" />
                    {talent.profileViews.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-500 flex items-center justify-end">
                    {talent.trend}
                    <TrendingUp size={12} className="ml-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4">
            View All Talent
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
