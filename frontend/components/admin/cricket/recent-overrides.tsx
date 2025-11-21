"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

export function RecentOverrides() {
  // In a real implementation, this would fetch data from an API
  const overrides = [
    {
      id: "override-1",
      match: "IND vs AUS",
      user: {
        name: "Admin User",
        avatar: "/australian-outback-landscape.png",
      },
      action: "Updated score to 245/6",
      timestamp: "10 minutes ago",
    },
    {
      id: "override-2",
      match: "CSK vs MI",
      user: {
        name: "Content Editor",
        avatar: "/CE-abstract-geometric.png",
      },
      action: "Changed bowler to Bumrah",
      timestamp: "25 minutes ago",
    },
    {
      id: "override-3",
      match: "ENG vs WI",
      user: {
        name: "Admin User",
        avatar: "/australian-outback-landscape.png",
      },
      action: "Updated match status to Delayed",
      timestamp: "1 hour ago",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Overrides</CardTitle>
        <CardDescription>Manual updates to cricket data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {overrides.map((override, index) => (
          <motion.div
            key={override.id}
            className="flex items-start space-x-4 p-3 rounded-lg bg-card hover:bg-accent/50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Avatar>
              <AvatarImage src={override.user.avatar || "/placeholder.svg"} alt={override.user.name} />
              <AvatarFallback>{override.user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">{override.match}</p>
              <p className="text-sm">{override.action}</p>
              <p className="text-xs text-muted-foreground">
                {override.timestamp} by {override.user.name}
              </p>
            </div>
          </motion.div>
        ))}
        <motion.a
          href="/admin/cricket/audit-log"
          className="block text-center text-sm text-primary hover:underline mt-2"
          whileHover={{ scale: 1.05 }}
        >
          View full audit log
        </motion.a>
      </CardContent>
    </Card>
  )
}
