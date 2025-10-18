"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle2, Clock, AlertCircle, Users } from "lucide-react"

const recentCastingCalls = [
  {
    id: 1,
    title: "Lead Role in 'Desert Storm'",
    company: "Dharma Productions",
    location: "Mumbai, India",
    status: "active",
    applicants: 24,
    posted: "1 day ago",
  },
  {
    id: 2,
    title: "Supporting Cast for 'Midnight Mystery'",
    company: "Red Chillies Entertainment",
    location: "Delhi, India",
    status: "active",
    applicants: 18,
    posted: "2 days ago",
  },
  {
    id: 3,
    title: "Voice Actor for Animated Feature",
    company: "Yash Raj Films",
    location: "Remote",
    status: "under review",
    applicants: 7,
    posted: "3 days ago",
  },
  {
    id: 4,
    title: "Extras for Period Drama",
    company: "Excel Entertainment",
    location: "Jaipur, India",
    status: "flagged",
    applicants: 32,
    posted: "5 days ago",
  },
]

export function RecentCastingCalls() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Casting Calls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentCastingCalls.map((call, index) => (
            <motion.div
              key={call.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="bg-primary/10 text-primary p-2 rounded-md mt-0.5">
                <Users size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium truncate">{call.title}</p>
                  {call.status === "active" && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      <CheckCircle2 size={12} className="mr-1" /> Active
                    </Badge>
                  )}
                  {call.status === "under review" && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      <Clock size={12} className="mr-1" /> Under Review
                    </Badge>
                  )}
                  {call.status === "flagged" && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                      <AlertCircle size={12} className="mr-1" /> Flagged
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {call.company} • {call.location}
                </p>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>{call.applicants} applicants</span>
                  <span className="mx-2">•</span>
                  <span>Posted {call.posted}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="shrink-0">
                View
              </Button>
            </motion.div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-4">
          View All Casting Calls
        </Button>
      </CardContent>
    </Card>
  )
}
