"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle, CheckCircle, Database, RefreshCw, Clock, FileArchive, Shield, Download } from "lucide-react"
import { motion } from "framer-motion"

// Mock database health data
const databaseHealth = {
  healthScore: 92,
  connectionStatus: "connected", // connected, degraded, disconnected
  lastChecked: "2024-05-25 11:45:22",
  responseTime: 28, // ms
  activeConnections: 24,
  maxConnections: 100,
  uptime: "99.98%",
  storage: {
    total: 500, // GB
    used: 215, // GB
    tables: 48,
    indexes: 124,
    largestTable: {
      name: "movie_metadata",
      size: 45.2, // GB
    },
  },
  performance: {
    averageQueryTime: 18, // ms
    slowQueries: 3,
    cachedQueries: 78,
    recentSlowQueries: [
      {
        query: "SELECT * FROM movie_reviews WHERE rating > 4.5 ORDER BY created_at DESC",
        time: 1240,
        timestamp: "2024-05-25 10:12:33",
      },
      {
        query: "SELECT m.*, r.* FROM movies m JOIN reviews r ON m.id = r.movie_id WHERE m.release_date > '2023-01-01'",
        time: 980,
        timestamp: "2024-05-25 09:45:12",
      },
      {
        query: "SELECT * FROM user_activity WHERE created_at > NOW() - INTERVAL '24 hours'",
        time: 850,
        timestamp: "2024-05-25 08:30:45",
      },
    ],
  },
  backup: {
    lastSuccessful: "2024-05-25 04:00:00",
    status: "success", // success, failed, in_progress
    frequency: "Daily",
    retentionPeriod: "30 days",
    backupSize: 185, // GB
    backupLocation: "AWS S3",
    recentBackups: [
      { timestamp: "2024-05-25 04:00:00", status: "success", size: 185 },
      { timestamp: "2024-05-24 04:00:00", status: "success", size: 184 },
      { timestamp: "2024-05-23 04:00:00", status: "success", size: 183 },
      { timestamp: "2024-05-22 04:00:00", status: "failed", size: 0 },
      { timestamp: "2024-05-21 04:00:00", status: "success", size: 182 },
    ],
  },
  migration: {
    lastMigration: "2024-05-20 14:30:00",
    status: "success", // success, failed, in_progress
    version: "v2.4.5",
    recentMigrations: [
      { version: "v2.4.5", timestamp: "2024-05-20 14:30:00", status: "success", changes: 12 },
      { version: "v2.4.4", timestamp: "2024-05-10 11:15:00", status: "success", changes: 8 },
      { version: "v2.4.3", timestamp: "2024-04-28 09:45:00", status: "failed", changes: 15 },
      { version: "v2.4.3", timestamp: "2024-04-27 16:30:00", status: "failed", changes: 15 },
      { version: "v2.4.2", timestamp: "2024-04-15 10:20:00", status: "success", changes: 5 },
    ],
  },
  replication: {
    status: "healthy", // healthy, degraded, failed
    lag: 0.5, // seconds
    replicas: 2,
    replicaDetails: [
      { id: "replica-1", status: "healthy", lag: 0.2, region: "us-east-1" },
      { id: "replica-2", status: "healthy", lag: 0.5, region: "eu-west-1" },
    ],
  },
  integrityChecks: {
    lastCheck: "2024-05-24 02:00:00",
    status: "passed", // passed, failed, in_progress
    issues: 0,
    checkDetails: [
      { name: "Foreign Key Constraints", status: "passed" },
      { name: "Index Corruption", status: "passed" },
      { name: "Orphaned Records", status: "passed" },
      { name: "Data Consistency", status: "passed" },
    ],
  },
}

export function DatabaseDiagnostics() {
  const [isRunningCheck, setIsRunningCheck] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [healthData, setHealthData] = useState(databaseHealth)

  // Simulate running an integrity check
  const runIntegrityCheck = () => {
    setIsRunningCheck(true)

    // Simulate a check that takes 3 seconds
    setTimeout(() => {
      setIsRunningCheck(false)

      // Update the last check time
      setHealthData((prev) => ({
        ...prev,
        integrityChecks: {
          ...prev.integrityChecks,
          lastCheck: new Date().toISOString().replace("T", " ").substring(0, 19),
          status: "passed",
        },
      }))
    }, 3000)
  }

  // Get color based on health score
  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-amber-500"
    return "text-red-500"
  }

  // Get background color based on health score
  const getHealthBgColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 70) return "bg-amber-500"
    return "bg-red-500"
  }

  const getHealthStrokeColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-amber-500"
    return "text-red-500"
  }

  // Get status badge for connection status
  const getConnectionBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Connected
          </Badge>
        )
      case "degraded":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
            Degraded
          </Badge>
        )
      case "disconnected":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500">
            Disconnected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Get status badge for backup status
  const getBackupBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Success
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500">
            Failed
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
            In Progress
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Get status badge for migration status
  const getMigrationBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Success
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500">
            Failed
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
            In Progress
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Get status badge for replication status
  const getReplicationBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Healthy
          </Badge>
        )
      case "degraded":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
            Degraded
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500">
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Get status badge for integrity check status
  const getIntegrityBadge = (status: string) => {
    switch (status) {
      case "passed":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Passed
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500">
            Failed
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
            In Progress
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card className="shadow-lg border-border/40">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Database Diagnostics
            </CardTitle>
            <CardDescription>Monitor database health and performance</CardDescription>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={runIntegrityCheck} disabled={isRunningCheck}>
                    {isRunningCheck ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Run Integrity Check
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Run a comprehensive database integrity check</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="px-2">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh database metrics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="migration">Migration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Health Score */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative flex items-center justify-center">
                      <svg className="w-24 h-24">
                        <circle
                          className="text-muted-foreground/20"
                          strokeWidth="6"
                          stroke="currentColor"
                          fill="transparent"
                          r="36"
                          cx="48"
                          cy="48"
                        />
                        <motion.circle
                          initial={{ strokeDashoffset: 226 }}
                          animate={{
                            strokeDashoffset: 226 - (226 * healthData.healthScore) / 100,
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={getHealthStrokeColor(healthData.healthScore)}
                          strokeWidth="6"
                          strokeDasharray="226"
                          stroke="currentColor"
                          fill="transparent"
                          r="36"
                          cx="48"
                          cy="48"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className={`text-2xl font-bold ${getHealthColor(healthData.healthScore)}`}>
                          {healthData.healthScore}
                        </span>
                        <span className="text-xs text-muted-foreground">Health Score</span>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="text-sm font-medium">Database Health</div>
                      <div className="text-xs text-muted-foreground">Last checked: {healthData.lastChecked}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Connection Status */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col h-full">
                    <div className="text-sm font-medium mb-2">Connection Status</div>
                    <div className="flex items-center mb-4">
                      <div
                        className={`h-3 w-3 rounded-full mr-2 ${
                          healthData.connectionStatus === "connected"
                            ? "bg-green-500"
                            : healthData.connectionStatus === "degraded"
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                      ></div>
                      {getConnectionBadge(healthData.connectionStatus)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Response Time:</div>
                      <div className="font-medium">{healthData.responseTime} ms</div>

                      <div className="text-muted-foreground">Active Connections:</div>
                      <div className="font-medium">
                        {healthData.activeConnections} / {healthData.maxConnections}
                      </div>

                      <div className="text-muted-foreground">Uptime:</div>
                      <div className="font-medium">{healthData.uptime}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col h-full">
                    <div className="text-sm font-medium mb-2">Quick Stats</div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Storage Used:</div>
                      <div className="font-medium">
                        {healthData.storage.used} / {healthData.storage.total} GB
                      </div>

                      <div className="text-muted-foreground">Tables:</div>
                      <div className="font-medium">{healthData.storage.tables}</div>

                      <div className="text-muted-foreground">Indexes:</div>
                      <div className="font-medium">{healthData.storage.indexes}</div>

                      <div className="text-muted-foreground">Avg. Query Time:</div>
                      <div className="font-medium">{healthData.performance.averageQueryTime} ms</div>

                      <div className="text-muted-foreground">Last Backup:</div>
                      <div className="font-medium">
                        {new Date(healthData.backup.lastSuccessful).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Replication Status */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Replication Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div
                      className={`h-3 w-3 rounded-full mr-2 ${
                        healthData.replication.status === "healthy"
                          ? "bg-green-500"
                          : healthData.replication.status === "degraded"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    {getReplicationBadge(healthData.replication.status)}
                    <div className="ml-auto text-sm">{healthData.replication.replicas} replicas</div>
                  </div>

                  <div className="space-y-3">
                    {healthData.replication.replicaDetails.map((replica, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full mr-2 ${
                              replica.status === "healthy"
                                ? "bg-green-500"
                                : replica.status === "degraded"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                          ></div>
                          <div className="text-sm">{replica.id}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">{replica.region}</div>
                        <div className="text-sm font-medium">{replica.lag} s lag</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Integrity Checks */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Integrity Checks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div
                      className={`h-3 w-3 rounded-full mr-2 ${
                        healthData.integrityChecks.status === "passed"
                          ? "bg-green-500"
                          : healthData.integrityChecks.status === "in_progress"
                            ? "bg-blue-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    {getIntegrityBadge(healthData.integrityChecks.status)}
                    <div className="ml-auto text-sm">
                      Last check: {new Date(healthData.integrityChecks.lastCheck).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {healthData.integrityChecks.checkDetails.map((check, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="text-sm">{check.name}</div>
                        <div>
                          {check.status === "passed" ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : check.status === "in_progress" ? (
                            <Clock className="h-4 w-4 text-blue-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Query Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold">{healthData.performance.averageQueryTime} ms</div>
                    <div className="text-sm text-muted-foreground">Average Query Time</div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold">{healthData.performance.slowQueries}</div>
                    <div className="text-sm text-muted-foreground">Slow Queries (>500ms)</div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold">{healthData.performance.cachedQueries}%</div>
                    <div className="text-sm text-muted-foreground">Query Cache Hit Rate</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Recent Slow Queries</div>
                  <div className="space-y-3">
                    {healthData.performance.recentSlowQueries.map((query, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-amber-500">{query.time} ms</div>
                          <div className="text-xs text-muted-foreground">{query.timestamp}</div>
                        </div>
                        <code className="text-xs bg-background rounded px-2 py-1 block overflow-x-auto">
                          {query.query}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Query Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">Query distribution chart would appear here</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">Performance trends chart would appear here</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="storage" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Storage Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <div className="text-sm">
                        {healthData.storage.used} GB used of {healthData.storage.total} GB
                      </div>
                      <div className="text-sm font-medium">
                        {Math.round((healthData.storage.used / healthData.storage.total) * 100)}%
                      </div>
                    </div>
                    <Progress value={(healthData.storage.used / healthData.storage.total) * 100} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{healthData.storage.tables}</div>
                      <div className="text-sm text-muted-foreground">Tables</div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{healthData.storage.indexes}</div>
                      <div className="text-sm text-muted-foreground">Indexes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Largest Tables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="text-sm font-medium">{healthData.storage.largestTable.name}</div>
                      <div className="text-sm">{healthData.storage.largestTable.size} GB</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="text-sm font-medium">user_activity</div>
                      <div className="text-sm">32.8 GB</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="text-sm font-medium">movie_reviews</div>
                      <div className="text-sm">28.5 GB</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="text-sm font-medium">cricket_match_data</div>
                      <div className="text-sm">22.3 GB</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="text-sm font-medium">talent_profiles</div>
                      <div className="text-sm">18.7 GB</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Storage Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <div className="text-muted-foreground text-sm">Storage growth chart would appear here</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-2">
                      {healthData.backup.status === "success" ? (
                        <CheckCircle className="h-10 w-10 text-green-500" />
                      ) : healthData.backup.status === "in_progress" ? (
                        <div className="animate-spin h-10 w-10 border-2 border-blue-500 border-t-transparent rounded-full" />
                      ) : (
                        <AlertCircle className="h-10 w-10 text-red-500" />
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">Last Backup Status</div>
                      <div>{getBackupBadge(healthData.backup.status)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col h-full">
                    <div className="text-sm font-medium mb-2">Backup Details</div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Last Successful:</div>
                      <div className="font-medium">{healthData.backup.lastSuccessful}</div>

                      <div className="text-muted-foreground">Frequency:</div>
                      <div className="font-medium">{healthData.backup.frequency}</div>

                      <div className="text-muted-foreground">Retention:</div>
                      <div className="font-medium">{healthData.backup.retentionPeriod}</div>

                      <div className="text-muted-foreground">Size:</div>
                      <div className="font-medium">{healthData.backup.backupSize} GB</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col h-full">
                    <div className="text-sm font-medium mb-2">Backup Location</div>

                    <div className="flex items-center bg-muted p-3 rounded-lg">
                      <FileArchive className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div className="text-sm">{healthData.backup.backupLocation}</div>
                    </div>

                    <div className="mt-4 text-xs text-muted-foreground">
                      Backups are encrypted and stored in multiple regions for redundancy.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Backups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {healthData.backup.recentBackups.map((backup, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center">
                        {backup.status === "success" ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        ) : backup.status === "in_progress" ? (
                          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                        )}
                        <div className="text-sm">{backup.timestamp}</div>
                      </div>

                      <div className="flex items-center">
                        <div className="text-sm mr-4">{backup.size > 0 ? `${backup.size} GB` : "N/A"}</div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="migration" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Migration Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div
                      className={`h-3 w-3 rounded-full mr-2 ${
                        healthData.migration.status === "success"
                          ? "bg-green-500"
                          : healthData.migration.status === "in_progress"
                            ? "bg-blue-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    {getMigrationBadge(healthData.migration.status)}
                    <div className="ml-auto text-sm">Version: {healthData.migration.version}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div className="text-muted-foreground">Last Migration:</div>
                    <div className="font-medium">{healthData.migration.lastMigration}</div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium mb-2">Migration Notes</div>
                    <div className="text-sm">
                      Latest migration added indexes to improve query performance on movie search and user activity
                      tables.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Database Version History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {healthData.migration.recentMigrations.map((migration, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center">
                          {migration.status === "success" ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : migration.status === "in_progress" ? (
                            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                          )}
                          <div>
                            <div className="text-sm font-medium">{migration.version}</div>
                            <div className="text-xs text-muted-foreground">{migration.timestamp}</div>
                          </div>
                        </div>

                        <div className="text-sm">{migration.changes} changes</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending Migrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-6 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">No pending migrations</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          Last updated: {healthData.lastChecked}
        </div>
      </CardFooter>
    </Card>
  )
}
