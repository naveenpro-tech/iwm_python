"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Database, Server, RefreshCw, Zap, AlertTriangle, CheckCircle } from "lucide-react"

// Mock performance data
const initialPerformanceData = {
  serverResponse: {
    current: 120,
    average: 150,
    threshold: 300,
    unit: "ms",
    status: "good" as "good" | "warning" | "critical",
  },
  memoryUsage: {
    current: 42,
    average: 45,
    threshold: 80,
    unit: "%",
    status: "good" as "good" | "warning" | "critical",
  },
  cpuUsage: {
    current: 38,
    average: 40,
    threshold: 75,
    unit: "%",
    status: "good" as "good" | "warning" | "critical",
  },
  databaseQueries: {
    current: 85,
    average: 90,
    threshold: 150,
    unit: "queries/min",
    status: "good" as "good" | "warning" | "critical",
  },
  apiCalls: {
    current: 210,
    average: 200,
    threshold: 400,
    unit: "calls/min",
    status: "good" as "good" | "warning" | "critical",
  },
  activeUsers: {
    current: 1245,
    average: 1100,
    threshold: 2000,
    unit: "users",
    status: "good" as "good" | "warning" | "critical",
  },
}

// Performance history for charts
const performanceHistory = {
  serverResponse: [180, 160, 140, 170, 150, 130, 120],
  memoryUsage: [38, 40, 45, 42, 39, 41, 42],
  cpuUsage: [35, 42, 38, 40, 36, 39, 38],
  databaseQueries: [75, 82, 90, 88, 85, 80, 85],
  apiCalls: [190, 205, 220, 200, 195, 205, 210],
  activeUsers: [980, 1050, 1150, 1200, 1180, 1220, 1245],
}

export function PerformanceMonitor() {
  const [performanceData, setPerformanceData] = useState(initialPerformanceData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [activeTab, setActiveTab] = useState("overview")

  // Simulate refreshing performance data
  const refreshData = () => {
    setIsRefreshing(true)

    // Simulate API call delay
    setTimeout(() => {
      // Generate slightly different values to simulate real-time changes
      const newData = { ...performanceData }

      Object.keys(newData).forEach((key) => {
        const metric = newData[key as keyof typeof newData]
        const variation = Math.random() * 10 - 5 // Random variation between -5 and +5

        // Update current value with random variation
        metric.current = Math.max(0, Math.round(metric.current + variation))

        // Update status based on new value
        if (metric.current > metric.threshold) {
          metric.status = "critical"
        } else if (metric.current > metric.threshold * 0.8) {
          metric.status = "warning"
        } else {
          metric.status = "good"
        }
      })

      setPerformanceData(newData)
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 1000)
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshData, 30000)
    return () => clearInterval(interval)
  }, [performanceData])

  // Get status color
  const getStatusColor = (status: "good" | "warning" | "critical") => {
    switch (status) {
      case "good":
        return "text-green-500"
      case "warning":
        return "text-amber-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  // Get status icon
  const getStatusIcon = (status: "good" | "warning" | "critical") => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  // Calculate progress color
  const getProgressColor = (current: number, threshold: number) => {
    const percentage = (current / threshold) * 100
    if (percentage > 90) return "bg-red-500"
    if (percentage > 70) return "bg-amber-500"
    return "bg-green-500"
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">System Performance</CardTitle>
            <CardDescription>Real-time performance metrics and system health</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</div>
            <Button variant="outline" size="icon" onClick={refreshData} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="server">Server</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key="server-response"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="mr-2 p-2 rounded-full bg-primary/10">
                            <Zap className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Server Response</div>
                            <div className="text-2xl font-bold">
                              {performanceData.serverResponse.current}
                              <span className="text-sm font-normal text-muted-foreground ml-1">
                                {performanceData.serverResponse.unit}
                              </span>
                            </div>
                          </div>
                        </div>
                        {getStatusIcon(performanceData.serverResponse.status)}
                      </div>
                      <Progress
                        value={
                          (performanceData.serverResponse.current / performanceData.serverResponse.threshold) * 100
                        }
                        className={`h-1 ${getProgressColor(performanceData.serverResponse.current, performanceData.serverResponse.threshold)}`}
                      />
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>
                          Avg: {performanceData.serverResponse.average}
                          {performanceData.serverResponse.unit}
                        </span>
                        <span>
                          Threshold: {performanceData.serverResponse.threshold}
                          {performanceData.serverResponse.unit}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  key="memory-usage"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="mr-2 p-2 rounded-full bg-primary/10">
                            <Server className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Memory Usage</div>
                            <div className="text-2xl font-bold">
                              {performanceData.memoryUsage.current}
                              <span className="text-sm font-normal text-muted-foreground ml-1">
                                {performanceData.memoryUsage.unit}
                              </span>
                            </div>
                          </div>
                        </div>
                        {getStatusIcon(performanceData.memoryUsage.status)}
                      </div>
                      <Progress
                        value={(performanceData.memoryUsage.current / performanceData.memoryUsage.threshold) * 100}
                        className={`h-1 ${getProgressColor(performanceData.memoryUsage.current, performanceData.memoryUsage.threshold)}`}
                      />
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>
                          Avg: {performanceData.memoryUsage.average}
                          {performanceData.memoryUsage.unit}
                        </span>
                        <span>
                          Threshold: {performanceData.memoryUsage.threshold}
                          {performanceData.memoryUsage.unit}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  key="database-queries"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="mr-2 p-2 rounded-full bg-primary/10">
                            <Database className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Database Queries</div>
                            <div className="text-2xl font-bold">
                              {performanceData.databaseQueries.current}
                              <span className="text-sm font-normal text-muted-foreground ml-1">
                                {performanceData.databaseQueries.unit}
                              </span>
                            </div>
                          </div>
                        </div>
                        {getStatusIcon(performanceData.databaseQueries.status)}
                      </div>
                      <Progress
                        value={
                          (performanceData.databaseQueries.current / performanceData.databaseQueries.threshold) * 100
                        }
                        className={`h-1 ${getProgressColor(performanceData.databaseQueries.current, performanceData.databaseQueries.threshold)}`}
                      />
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>
                          Avg: {performanceData.databaseQueries.average}
                          {performanceData.databaseQueries.unit}
                        </span>
                        <span>
                          Threshold: {performanceData.databaseQueries.threshold}
                          {performanceData.databaseQueries.unit}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">System Health Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(performanceData).map(([key, metric], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                      >
                        <div className="flex items-center">
                          <Badge variant="outline" className={`mr-2 ${getStatusColor(metric.status)}`}>
                            {metric.status.toUpperCase()}
                          </Badge>
                          <span className="font-medium">
                            {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                          </span>
                        </div>
                        <div className="text-sm">
                          {metric.current} {metric.unit}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="server">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">CPU Usage</span>
                        <span className={`text-sm ${getStatusColor(performanceData.cpuUsage.status)}`}>
                          {performanceData.cpuUsage.current}
                          {performanceData.cpuUsage.unit}
                        </span>
                      </div>
                      <Progress
                        value={performanceData.cpuUsage.current}
                        className={`h-2 ${getProgressColor(performanceData.cpuUsage.current, performanceData.cpuUsage.threshold)}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Memory Usage</span>
                        <span className={`text-sm ${getStatusColor(performanceData.memoryUsage.status)}`}>
                          {performanceData.memoryUsage.current}
                          {performanceData.memoryUsage.unit}
                        </span>
                      </div>
                      <Progress
                        value={performanceData.memoryUsage.current}
                        className={`h-2 ${getProgressColor(performanceData.memoryUsage.current, performanceData.memoryUsage.threshold)}`}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-2">Server Details</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Server Type</span>
                          <span>Vercel Serverless</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Region</span>
                          <span>ap-south-1</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Node.js Version</span>
                          <span>18.x</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Uptime</span>
                          <span>14d 6h 32m</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Last Deployment</span>
                          <span>2024-05-22 09:45</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Build ID</span>
                          <span>bld_8f7e9d3c</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-2">Recent Server Events</div>
                    <div className="space-y-2">
                      {[
                        { time: "14:32:18", event: "Auto-scaling triggered", status: "info" },
                        { time: "13:15:42", event: "Memory usage spike detected", status: "warning" },
                        { time: "12:05:33", event: "Server restarted", status: "info" },
                        { time: "09:45:12", event: "Deployment completed", status: "success" },
                      ].map((event, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 text-sm rounded-md bg-muted/50"
                        >
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                            <span>{event.time}</span>
                            <span className="mx-2">•</span>
                            <span>{event.event}</span>
                          </div>
                          <Badge
                            variant={
                              event.status === "warning"
                                ? "outline"
                                : event.status === "success"
                                  ? "default"
                                  : "secondary"
                            }
                            className={
                              event.status === "warning"
                                ? "text-amber-500"
                                : event.status === "success"
                                  ? ""
                                  : "text-muted-foreground"
                            }
                          >
                            {event.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Database Queries</span>
                        <span className={`text-sm ${getStatusColor(performanceData.databaseQueries.status)}`}>
                          {performanceData.databaseQueries.current}
                          {performanceData.databaseQueries.unit}
                        </span>
                      </div>
                      <Progress
                        value={
                          (performanceData.databaseQueries.current / performanceData.databaseQueries.threshold) * 100
                        }
                        className={`h-2 ${getProgressColor(performanceData.databaseQueries.current, performanceData.databaseQueries.threshold)}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">API Calls</span>
                        <span className={`text-sm ${getStatusColor(performanceData.apiCalls.status)}`}>
                          {performanceData.apiCalls.current}
                          {performanceData.apiCalls.unit}
                        </span>
                      </div>
                      <Progress
                        value={(performanceData.apiCalls.current / performanceData.apiCalls.threshold) * 100}
                        className={`h-2 ${getProgressColor(performanceData.apiCalls.current, performanceData.apiCalls.threshold)}`}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-2">Database Details</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Database Type</span>
                          <span>Supabase PostgreSQL</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Connection Pool</span>
                          <span>20/50 active</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Storage Usage</span>
                          <span>42.8 GB / 100 GB</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Last Backup</span>
                          <span>2024-05-25 04:00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Replication Status</span>
                          <span className="text-green-500">Healthy</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Version</span>
                          <span>PostgreSQL 15.3</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-2">Query Performance</div>
                    <div className="space-y-2">
                      {[
                        { query: "GET /api/movies/popular", time: "42ms", count: "325/hr" },
                        { query: "GET /api/users/profile", time: "38ms", count: "280/hr" },
                        { query: "POST /api/reviews/create", time: "85ms", count: "120/hr" },
                        { query: "GET /api/talent/listings", time: "65ms", count: "95/hr" },
                        { query: "GET /api/cricket/live", time: "28ms", count: "210/hr" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 text-sm rounded-md bg-muted/50"
                        >
                          <div className="font-mono text-xs">{item.query}</div>
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">
                              {item.time}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Active Users</span>
                        <span className={`text-sm ${getStatusColor(performanceData.activeUsers.status)}`}>
                          {performanceData.activeUsers.current.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={(performanceData.activeUsers.current / performanceData.activeUsers.threshold) * 100}
                        className={`h-2 ${getProgressColor(performanceData.activeUsers.current, performanceData.activeUsers.threshold)}`}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Average: {performanceData.activeUsers.average.toLocaleString()}</span>
                        <span>Threshold: {performanceData.activeUsers.threshold.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center">
                      <div className="text-sm font-medium mb-2">User Distribution</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                          <span className="text-xs">Web</span>
                          <Badge variant="outline">68%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                          <span className="text-xs">Mobile</span>
                          <Badge variant="outline">32%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                          <span className="text-xs">Logged In</span>
                          <Badge variant="outline">75%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                          <span className="text-xs">Anonymous</span>
                          <Badge variant="outline">25%</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-2">Active Features</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {[
                        { feature: "Movie Browsing", users: 845, percentage: 68 },
                        { feature: "Reviews", users: 320, percentage: 26 },
                        { feature: "Talent Hub", users: 215, percentage: 17 },
                        { feature: "Cricket Updates", users: 410, percentage: 33 },
                        { feature: "Industry Profiles", users: 180, percentage: 14 },
                        { feature: "Watchlist", users: 290, percentage: 23 },
                      ].map((item, index) => (
                        <div key={index} className="p-2 rounded-md bg-muted/50">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.feature}</span>
                            <span className="text-xs text-muted-foreground">{item.users} users</span>
                          </div>
                          <Progress value={item.percentage} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-2">Geographic Distribution</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { region: "India", users: 865, percentage: 69 },
                        { region: "United States", users: 125, percentage: 10 },
                        { region: "United Kingdom", users: 85, percentage: 7 },
                        { region: "Canada", users: 45, percentage: 4 },
                        { region: "Australia", users: 40, percentage: 3 },
                        { region: "UAE", users: 35, percentage: 3 },
                        { region: "Singapore", users: 25, percentage: 2 },
                        { region: "Other", users: 25, percentage: 2 },
                      ].map((item, index) => (
                        <div key={index} className="p-2 rounded-md bg-muted/50">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.region}</span>
                            <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                          </div>
                          <Progress value={item.percentage} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
