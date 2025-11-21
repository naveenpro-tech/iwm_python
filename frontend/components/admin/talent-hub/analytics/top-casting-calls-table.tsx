"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle2, Users, TrendingUp } from "lucide-react"

// Mock data for top casting calls
const topCastingCalls = [
  {
    id: 1,
    title: "Lead Role in 'Desert Storm'",
    company: "Dharma Productions",
    applicants: 24,
    views: 1850,
    trend: "+18%",
  },
  {
    id: 2,
    title: "Supporting Cast for 'Midnight Mystery'",
    company: "Red Chillies Entertainment",
    applicants: 18,
    views: 1420,
    trend: "+12%",
  },
  {
    id: 3,
    title: "Dancers for Music Video",
    company: "T-Series",
    applicants: 56,
    views: 1380,
    trend: "+22%",
  },
  {
    id: 4,
    title: "Lead Actress for Romantic Comedy",
    company: "Karan Johar Productions",
    applicants: 41,
    views: 1240,
    trend: "+9%",
  },
  {
    id: 5,
    title: "Stunt Performers for Action Film",
    company: "YRF Action",
    applicants: 19,
    views: 980,
    trend: "+7%",
  },
]

export function TopCastingCallsTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Top Casting Calls</CardTitle>
          <CardDescription>Most viewed and applied casting calls this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCastingCalls.map((call, index) => (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 + 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{call.title}</p>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      <CheckCircle2 size={12} className="mr-1" /> Active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{call.company}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium flex items-center justify-end">
                    <Users size={14} className="mr-1 text-purple-500" />
                    {call.applicants} / {call.views.toLocaleString()} views
                  </div>
                  <div className="text-xs text-green-500 flex items-center justify-end">
                    {call.trend}
                    <TrendingUp size={12} className="ml-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4">
            View All Casting Calls
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
