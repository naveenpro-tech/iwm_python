"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

interface LiveScoreAuditLogProps {
  matchId: string
}

export function LiveScoreAuditLog({ matchId }: LiveScoreAuditLogProps) {
  // In a real implementation, this would fetch audit log data from an API
  const auditLogs = [
    {
      id: "log-1",
      user: {
        name: "Admin User",
        avatar: "/australian-outback-landscape.png",
      },
      action: "Updated CSK score to 145/6",
      timestamp: "2 minutes ago",
    },
    {
      id: "log-2",
      user: {
        name: "Content Editor",
        avatar: "/CE-abstract-geometric.png",
      },
      action: "Updated MS Dhoni's score to 28 runs",
      timestamp: "5 minutes ago",
    },
    {
      id: "log-3",
      user: {
        name: "Admin User",
        avatar: "/australian-outback-landscape.png",
      },
      action: "Added new batsman: Ravindra Jadeja",
      timestamp: "8 minutes ago",
    },
    {
      id: "log-4",
      user: {
        name: "System",
        avatar: "/abstract-sy-typography.png",
      },
      action: "Auto-updated from API: Bumrah's bowling figures",
      timestamp: "10 minutes ago",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log</CardTitle>
        <CardDescription>Recent changes to this match data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
        {auditLogs.map((log, index) => (
          <motion.div
            key={log.id}
            className="flex items-start space-x-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Avatar>
              <AvatarImage src={log.user.avatar || "/placeholder.svg"} alt={log.user.name} />
              <AvatarFallback>{log.user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">{log.action}</p>
              <p className="text-xs text-muted-foreground">
                {log.timestamp} by {log.user.name}
              </p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
