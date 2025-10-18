"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, CheckCircle, HardDrive, Clock, Activity } from "lucide-react"
import { motion } from "framer-motion"

export function DatabaseStatus() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Database Status</CardTitle>
              <CardDescription>Current database health and metrics</CardDescription>
            </div>
            <Button variant="outline" size="icon">
              <RefreshCw size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-3 rounded-md">
              <div className="flex items-center mb-2">
                <CheckCircle size={16} className="text-green-500 mr-2" />
                <span className="font-medium">Status</span>
              </div>
              <div className="text-sm">Healthy</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-md">
              <div className="flex items-center mb-2">
                <Clock size={16} className="text-muted-foreground mr-2" />
                <span className="font-medium">Uptime</span>
              </div>
              <div className="text-sm">14 days, 6 hours</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-md">
              <div className="flex items-center mb-2">
                <Activity size={16} className="text-muted-foreground mr-2" />
                <span className="font-medium">Response Time</span>
              </div>
              <div className="text-sm">42ms</div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium">Storage Usage</div>
                <div className="text-sm text-muted-foreground">68%</div>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium">Connection Pool</div>
                <div className="text-sm text-muted-foreground">42%</div>
              </div>
              <Progress value={42} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium">CPU Usage</div>
                <div className="text-sm text-muted-foreground">23%</div>
              </div>
              <Progress value={23} className="h-2" />
            </div>
          </div>

          <div className="pt-2">
            <div className="text-sm font-medium mb-2">Recent Backups</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md text-sm">
                <div className="flex items-center">
                  <HardDrive size={14} className="mr-2 text-muted-foreground" />
                  <span>Daily Backup</span>
                </div>
                <div className="text-xs text-muted-foreground">Today, 04:00 AM</div>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md text-sm">
                <div className="flex items-center">
                  <HardDrive size={14} className="mr-2 text-muted-foreground" />
                  <span>Weekly Backup</span>
                </div>
                <div className="text-xs text-muted-foreground">Sunday, 02:00 AM</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
