"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Filter, RefreshCw, Calendar, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import ChartPlaceholder from "../../dashboard-builder/chart-placeholder"
import { DatePickerWithRange } from "../../shared/date-range-picker"
import ExportButton from "../../shared/export-button"

export default function SystemPerformanceReport() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  // Sample data for export
  const systemData = [
    {
      date: "2025-05-01",
      response_time: 120,
      error_rate: 0.2,
      uptime: 99.98,
      api_calls: 1250000,
      server_load: 42,
      memory_usage: 68,
    },
    {
      date: "2025-05-02",
      response_time: 118,
      error_rate: 0.18,
      uptime: 99.99,
      api_calls: 1320000,
      server_load: 45,
      memory_usage: 70,
    },
    {
      date: "2025-05-03",
      response_time: 125,
      error_rate: 0.25,
      uptime: 99.95,
      api_calls: 1180000,
      server_load: 48,
      memory_usage: 72,
    },
    {
      date: "2025-05-04",
      response_time: 115,
      error_rate: 0.15,
      uptime: 100,
      api_calls: 1420000,
      server_load: 52,
      memory_usage: 75,
    },
    {
      date: "2025-05-05",
      response_time: 110,
      error_rate: 0.12,
      uptime: 99.99,
      api_calls: 1380000,
      server_load: 47,
      memory_usage: 71,
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <DatePickerWithRange />

          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Schedule</span>
          </Button>
          <ExportButton data={systemData} filename="system-performance-report.csv" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SystemMetricCard
          title="Uptime"
          value="99.98%"
          change={0.01}
          trend="up"
          status="healthy"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <SystemMetricCard
          title="Response Time"
          value="110ms"
          change={-4.3}
          trend="down"
          status="healthy"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <SystemMetricCard
          title="Error Rate"
          value="0.12%"
          change={-0.03}
          trend="down"
          status="healthy"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <SystemMetricCard
          title="API Calls"
          value="1.38M"
          change={-2.8}
          trend="down"
          status="warning"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">System Performance Trends</CardTitle>
            <Tabs defaultValue="response">
              <TabsList>
                <TabsTrigger value="response">Response Time</TabsTrigger>
                <TabsTrigger value="errors">Error Rate</TabsTrigger>
                <TabsTrigger value="load">Server Load</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ChartPlaceholder title="Performance Trends" type="line" height={400} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Resource Utilization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">CPU Usage</span>
                <span className="text-sm font-medium">47%</span>
              </div>
              <Progress value={47} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Memory Usage</span>
                <span className="text-sm font-medium">71%</span>
              </div>
              <Progress value={71} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Disk I/O</span>
                <span className="text-sm font-medium">38%</span>
              </div>
              <Progress value={38} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Network Bandwidth</span>
                <span className="text-sm font-medium">62%</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Error Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartPlaceholder title="Error Types" type="pie" height={300} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">API Performance</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ChartPlaceholder title="API Response Times" type="bar" height={400} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Geographic Response Times</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[400px]">
            <div className="relative h-full w-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">Geographic visualization will be available with MCP integration</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface SystemMetricCardProps {
  title: string
  value: string
  change: number
  trend: "up" | "down"
  status: "healthy" | "warning" | "critical"
  icon: React.ReactNode
}

function SystemMetricCard({ title, value, change, trend, status, icon }: SystemMetricCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "healthy":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-green-500"
    }
  }

  const isTrendGood = title === "Response Time" || title === "Error Rate" ? trend === "down" : trend === "up"

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{title}</p>
              <div className={getStatusColor()}>{icon}</div>
            </div>
            <p className="text-3xl font-bold">{value}</p>
            <div className="flex items-center">
              <div className={`flex items-center text-sm ${isTrendGood ? "text-green-500" : "text-red-500"}`}>
                {trend === "up" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                )}
                <span>{Math.abs(change)}%</span>
              </div>
              <span className="text-sm text-muted-foreground ml-2">vs last period</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
