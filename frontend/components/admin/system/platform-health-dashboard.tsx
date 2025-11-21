"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Server,
  Clock,
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  BarChart3,
  Shield,
  Link,
  Eye,
  Zap,
  AlertCircle,
  TrendingDown,
  Minus,
} from "lucide-react"

// Mock platform health data
const platformHealth = {
  overallScore: 92,
  lastUpdated: "2024-05-25 11:45:22",
  issues: {
    critical: 0,
    high: 2,
    medium: 5,
    low: 8,
  },
  services: {
    api: { status: "healthy", responseTime: 124, uptime: "99.98%" },
    database: { status: "healthy", responseTime: 28, uptime: "99.99%" },
    storage: { status: "degraded", responseTime: 156, uptime: "99.95%" },
    search: { status: "degraded", responseTime: 245, uptime: "99.90%" },
    auth: { status: "healthy", responseTime: 85, uptime: "100%" },
    cdn: { status: "healthy", responseTime: 42, uptime: "99.99%" },
  },
  performance: {
    serverResponseTime: 124, // ms
    clientLoadTime: 1.8, // seconds
    timeToInteractive: 2.2, // seconds
    firstContentfulPaint: 0.9, // seconds
    largestContentfulPaint: 1.4, // seconds
    cumulativeLayoutShift: 0.02,
  },
  resources: {
    cpu: 42, // percentage
    memory: 58, // percentage
    disk: 68, // percentage
    network: 35, // percentage
  },
  brokenLinks: {
    total: 15,
    internal: 6,
    external: 9,
    byPage: [
      { page: "/movies/inception", count: 3 },
      { page: "/cricket/schedule", count: 2 },
      { page: "/talent-hub", count: 2 },
      { page: "/pulse", count: 1 },
    ],
  },
  accessibility: {
    score: 86,
    issues: {
      critical: 0,
      serious: 2,
      moderate: 5,
      minor: 8,
    },
    byCategory: [
      { category: "Color contrast", count: 4 },
      { category: "Missing alt text", count: 3 },
      { category: "ARIA attributes", count: 2 },
      { category: "Keyboard navigation", count: 1 },
    ],
  },
  security: {
    score: 94,
    lastScan: "2024-05-24 08:30:00",
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 2,
      low: 5,
    },
  },
  recentEvents: [
    {
      event: "Storage Service Degraded",
      timestamp: "2024-05-25 10:15:42",
      status: "warning",
      description: "Storage service is experiencing increased latency",
    },
    {
      event: "Search Service Degraded",
      timestamp: "2024-05-25 09:30:18",
      status: "warning",
      description: "Search indexing is delayed, affecting search results",
    },
    {
      event: "Database Backup Completed",
      timestamp: "2024-05-25 04:00:00",
      status: "success",
      description: "Automated daily backup completed successfully",
    },
    {
      event: "CDN Cache Purged",
      timestamp: "2024-05-25 03:15:22",
      status: "success",
      description: "Scheduled CDN cache purge completed",
    },
    {
      event: "System Update Deployed",
      timestamp: "2024-05-24 22:30:00",
      status: "success",
      description: "Version 2.4.5 deployed successfully",
    },
  ],
}

export function PlatformHealthDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [healthData, setHealthData] = useState(platformHealth)

  // Simulate refreshing data
  const refreshData = () => {
    setIsRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)
      // In a real app, you would fetch updated data
    }, 1500)
  }

  // Get color based on health score
  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-amber-500"
    return "text-red-500"
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "down":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Get performance score color
  const getPerformanceColor = (metric: string, value: number) => {
    const thresholds: { [key: string]: { good: number; warning: number } } = {
      serverResponseTime: { good: 200, warning: 500 },
      clientLoadTime: { good: 2, warning: 4 },
      timeToInteractive: { good: 3, warning: 5 },
      firstContentfulPaint: { good: 1, warning: 2 },
      largestContentfulPaint: { good: 2, warning: 4 },
      cumulativeLayoutShift: { good: 0.1, warning: 0.25 },
    }

    const threshold = thresholds[metric]
    if (!threshold) return ""

    if (value <= threshold.good) return "text-green-500"
    if (value <= threshold.warning) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <Card className="shadow-lg border-border/40">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Platform Health Dashboard
            </CardTitle>
            <CardDescription>Monitor system performance and health metrics</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">Last updated: {healthData.lastUpdated}</div>
            <Button variant="outline" size="icon" onClick={refreshData} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center">
              <Server className="h-4 w-4 mr-1" />
              Services
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center">
              <Cpu className="h-4 w-4 mr-1" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Issues
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm font-medium">Overall Health</div>
                        <div className={`text-3xl font-bold ${getHealthColor(healthData.overallScore)}`}>
                          {healthData.overallScore}%
                        </div>
                      </div>
                      <div
                        className={`p-2 rounded-full ${healthData.overallScore >= 90 ? "bg-green-500/10" : healthData.overallScore >= 70 ? "bg-amber-500/10" : "bg-red-500/10"}`}
                      >
                        <Activity className={`h-5 w-5 ${getHealthColor(healthData.overallScore)}`} />
                      </div>
                    </div>
                    <Progress value={healthData.overallScore} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-2">
                      {healthData.issues.critical + healthData.issues.high} critical issues
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm font-medium">Active Issues</div>
                        <div className="text-3xl font-bold">
                          {healthData.issues.critical +
                            healthData.issues.high +
                            healthData.issues.medium +
                            healthData.issues.low}
                        </div>
                      </div>
                      <div className="p-2 rounded-full bg-amber-500/10">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-red-500">Critical</span>
                        <span>{healthData.issues.critical}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-orange-500">High</span>
                        <span>{healthData.issues.high}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-500">Medium</span>
                        <span>{healthData.issues.medium}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm font-medium">Avg Response Time</div>
                        <div className="text-3xl font-bold">
                          {healthData.performance.serverResponseTime}
                          <span className="text-sm font-normal text-muted-foreground ml-1">ms</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-full bg-blue-500/10">
                        <Clock className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-500">
                      <TrendingDown className="h-3 w-3" />
                      <span>12% faster than last week</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm font-medium">Security Score</div>
                        <div className={`text-3xl font-bold ${getHealthColor(healthData.security.score)}`}>
                          {healthData.security.score}%
                        </div>
                      </div>
                      <div className="p-2 rounded-full bg-green-500/10">
                        <Shield className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">Last scan: {healthData.security.lastScan}</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Service Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(healthData.services).map(([service, data]) => (
                      <div key={service} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(data.status)}
                          <span className="font-medium capitalize">{service}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">{data.responseTime}ms</span>
                          <Badge variant="outline" className="text-xs">
                            {data.uptime}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Recent Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {healthData.recentEvents.slice(0, 5).map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="flex items-start p-2 rounded-md hover:bg-muted/50"
                      >
                        <div className="mr-2 mt-0.5">
                          {event.status === "success" ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : event.status === "warning" ? (
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium text-sm">{event.event}</span>
                            <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(healthData.services).map(([service, data]) => (
                <Card key={service}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="capitalize">{service}</span>
                      {getStatusIcon(data.status)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Response Time</span>
                          <span
                            className={`text-sm font-medium ${data.responseTime > 200 ? "text-amber-500" : "text-green-500"}`}
                          >
                            {data.responseTime}ms
                          </span>
                        </div>
                        <Progress value={Math.min((data.responseTime / 500) * 100, 100)} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Uptime</span>
                          <span className="text-sm font-medium">{data.uptime}</span>
                        </div>
                        <Progress value={Number.parseFloat(data.uptime)} className="h-2" />
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Status</span>
                          <Badge
                            variant="outline"
                            className={
                              data.status === "healthy"
                                ? "bg-green-500/10 text-green-500"
                                : data.status === "degraded"
                                  ? "bg-amber-500/10 text-amber-500"
                                  : "bg-red-500/10 text-red-500"
                            }
                          >
                            {data.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Service Dependencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-md bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">External APIs</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        All Operational
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>TMDB API</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>OMDB API</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>DeepSeek AI</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                        <span>Where to Watch</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Core Web Vitals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">First Contentful Paint (FCP)</span>
                        <span
                          className={`text-sm font-medium ${getPerformanceColor("firstContentfulPaint", healthData.performance.firstContentfulPaint)}`}
                        >
                          {healthData.performance.firstContentfulPaint}s
                        </span>
                      </div>
                      <Progress
                        value={Math.min((healthData.performance.firstContentfulPaint / 3) * 100, 100)}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Largest Contentful Paint (LCP)</span>
                        <span
                          className={`text-sm font-medium ${getPerformanceColor("largestContentfulPaint", healthData.performance.largestContentfulPaint)}`}
                        >
                          {healthData.performance.largestContentfulPaint}s
                        </span>
                      </div>
                      <Progress
                        value={Math.min((healthData.performance.largestContentfulPaint / 4) * 100, 100)}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Cumulative Layout Shift (CLS)</span>
                        <span
                          className={`text-sm font-medium ${getPerformanceColor("cumulativeLayoutShift", healthData.performance.cumulativeLayoutShift)}`}
                        >
                          {healthData.performance.cumulativeLayoutShift}
                        </span>
                      </div>
                      <Progress
                        value={Math.min((healthData.performance.cumulativeLayoutShift / 0.25) * 100, 100)}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Time to Interactive (TTI)</span>
                        <span
                          className={`text-sm font-medium ${getPerformanceColor("timeToInteractive", healthData.performance.timeToInteractive)}`}
                        >
                          {healthData.performance.timeToInteractive}s
                        </span>
                      </div>
                      <Progress
                        value={Math.min((healthData.performance.timeToInteractive / 5) * 100, 100)}
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Load Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Server Response Time</span>
                        <span
                          className={`text-sm font-medium ${getPerformanceColor("serverResponseTime", healthData.performance.serverResponseTime)}`}
                        >
                          {healthData.performance.serverResponseTime}ms
                        </span>
                      </div>
                      <Progress
                        value={Math.min((healthData.performance.serverResponseTime / 500) * 100, 100)}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Client Load Time</span>
                        <span
                          className={`text-sm font-medium ${getPerformanceColor("clientLoadTime", healthData.performance.clientLoadTime)}`}
                        >
                          {healthData.performance.clientLoadTime}s
                        </span>
                      </div>
                      <Progress
                        value={Math.min((healthData.performance.clientLoadTime / 5) * 100, 100)}
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Performance Tips</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li className="flex items-start">
                        <span className="mr-1">•</span>
                        <span>Enable browser caching for static assets</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1">•</span>
                        <span>Optimize images with next-gen formats (WebP, AVIF)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1">•</span>
                        <span>Implement lazy loading for below-the-fold content</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Performance History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/50 rounded-md">
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Performance history chart would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Cpu className="h-4 w-4 mr-2" />
                    CPU Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{healthData.resources.cpu}%</div>
                      <Progress value={healthData.resources.cpu} className="h-3 mt-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Cores</span>
                        <div className="font-medium">8 vCPUs</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Load Average</span>
                        <div className="font-medium">0.65</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Memory Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{healthData.resources.memory}%</div>
                      <Progress value={healthData.resources.memory} className="h-3 mt-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total</span>
                        <div className="font-medium">32 GB</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Used</span>
                        <div className="font-medium">18.6 GB</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Disk Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{healthData.resources.disk}%</div>
                      <Progress value={healthData.resources.disk} className="h-3 mt-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total</span>
                        <div className="font-medium">500 GB</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Used</span>
                        <div className="font-medium">340 GB</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Wifi className="h-4 w-4 mr-2" />
                    Network Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{healthData.resources.network}%</div>
                      <Progress value={healthData.resources.network} className="h-3 mt-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Inbound</span>
                        <div className="font-medium">45 Mbps</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Outbound</span>
                        <div className="font-medium">85 Mbps</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Resource Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-md bg-muted/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Web Servers</span>
                      <span className="text-sm text-muted-foreground">8 instances</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-xs">
                      <div>CPU: 35%</div>
                      <div>Memory: 45%</div>
                      <div>Disk: 25%</div>
                      <div>Network: 40%</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-md bg-muted/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Database Servers</span>
                      <span className="text-sm text-muted-foreground">3 instances</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-xs">
                      <div>CPU: 55%</div>
                      <div>Memory: 70%</div>
                      <div>Disk: 80%</div>
                      <div>Network: 25%</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-md bg-muted/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Worker Nodes</span>
                      <span className="text-sm text-muted-foreground">12 instances</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-xs">
                      <div>CPU: 40%</div>
                      <div>Memory: 50%</div>
                      <div>Disk: 35%</div>
                      <div>Network: 20%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Link className="h-4 w-4 mr-2" />
                    Broken Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Broken Links</span>
                      <span className="text-2xl font-bold text-amber-500">{healthData.brokenLinks.total}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 rounded-md bg-muted/50">
                        <div className="font-medium">Internal</div>
                        <div className="text-xl">{healthData.brokenLinks.internal}</div>
                      </div>
                      <div className="p-2 rounded-md bg-muted/50">
                        <div className="font-medium">External</div>
                        <div className="text-xl">{healthData.brokenLinks.external}</div>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <h4 className="text-sm font-medium mb-2">Top Pages with Broken Links</h4>
                      <div className="space-y-1">
                        {healthData.brokenLinks.byPage.map((page, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span className="text-muted-foreground truncate">{page.page}</span>
                            <Badge variant="outline" className="text-xs">
                              {page.count} links
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Accessibility Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Accessibility Score</span>
                      <span className={`text-2xl font-bold ${getHealthColor(healthData.accessibility.score)}`}>
                        {healthData.accessibility.score}%
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 rounded-md bg-muted/50">
                        <div className="font-medium text-red-500">Critical</div>
                        <div className="text-xl">{healthData.accessibility.issues.critical}</div>
                      </div>
                      <div className="p-2 rounded-md bg-muted/50">
                        <div className="font-medium text-orange-500">Serious</div>
                        <div className="text-xl">{healthData.accessibility.issues.serious}</div>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <h4 className="text-sm font-medium mb-2">Issues by Category</h4>
                      <div className="space-y-1">
                        {healthData.accessibility.byCategory.map((category, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{category.category}</span>
                            <Badge variant="outline" className="text-xs">
                              {category.count} issues
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Active Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                        <span className="font-medium">Storage Service Degraded</span>
                      </div>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                        High Priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Storage service is experiencing increased latency. This may affect file uploads and media loading.
                    </p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Started: 2024-05-25 10:15:42</span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                        <span className="font-medium">Search Indexing Delayed</span>
                      </div>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                        High Priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Search indexing is experiencing delays. New content may not appear in search results immediately.
                    </p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Started: 2024-05-25 09:30:18</span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                      <Shield className="h-12 w-12 text-green-500" />
                    </div>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getHealthColor(healthData.security.score)}`}>
                        {healthData.security.score}%
                      </div>
                      <div className="text-sm text-muted-foreground">Security Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Vulnerabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-red-500">Critical</span>
                      <span className="font-medium">{healthData.security.vulnerabilities.critical}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-orange-500">High</span>
                      <span className="font-medium">{healthData.security.vulnerabilities.high}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-amber-500">Medium</span>
                      <span className="font-medium">{healthData.security.vulnerabilities.medium}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-yellow-500">Low</span>
                      <span className="font-medium">{healthData.security.vulnerabilities.low}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Security Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SSL Certificate</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Valid
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Firewall</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">DDoS Protection</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">2FA</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Enforced
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Security Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Update Dependencies</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          2 dependencies have known security vulnerabilities. Update to the latest versions.
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Enable Rate Limiting</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Implement rate limiting on API endpoints to prevent abuse.
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
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
