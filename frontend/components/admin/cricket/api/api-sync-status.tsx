"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { AlertCircle, Check, Clock, RefreshCw } from "lucide-react"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ApiSyncStatus() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle")

  // In a real implementation, this would fetch sync status from an API
  const syncData = {
    lastSync: "Today, 10:30 AM",
    nextScheduledSync: "Today, 2:30 PM",
    syncItems: [
      { name: "Matches", status: "synced", count: 156 },
      { name: "Teams", status: "synced", count: 24 },
      { name: "Players", status: "synced", count: 432 },
      { name: "Series", status: "pending", count: 8 },
    ],
  }

  const handleForceSync = () => {
    setIsSyncing(true)

    // Simulate API call
    setTimeout(() => {
      setSyncStatus("success")
      setIsSyncing(false)

      // Reset after some time
      setTimeout(() => {
        setSyncStatus("idle")
      }, 3000)
    }, 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "synced":
        return <Badge className="bg-green-500">Synced</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync Status</CardTitle>
        <CardDescription>Data synchronization with external APIs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium">Last Sync</p>
            <p className="text-sm text-muted-foreground">{syncData.lastSync}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-sm font-medium">Next Scheduled</p>
            <p className="text-sm text-muted-foreground">{syncData.nextScheduledSync}</p>
          </div>
        </div>

        <div className="space-y-2">
          {syncData.syncItems.map((item, index) => (
            <motion.div
              key={item.name}
              className="flex justify-between items-center p-2 rounded-md bg-secondary"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item.name}</span>
                {getStatusBadge(item.status)}
              </div>
              <span className="text-sm">{item.count} items</span>
            </motion.div>
          ))}
        </div>

        {syncStatus === "success" && (
          <Alert variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
            <Check className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Data synchronized successfully!</AlertDescription>
          </Alert>
        )}

        {syncStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to synchronize data. Please try again.</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Button variant="default" className="w-full" onClick={handleForceSync} disabled={isSyncing}>
            {isSyncing ? (
              <>
                <motion.div
                  className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Force Sync Now
              </>
            )}
          </Button>
          <Button variant="outline" className="w-full">
            <Clock className="mr-2 h-4 w-4" />
            View Sync History
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
