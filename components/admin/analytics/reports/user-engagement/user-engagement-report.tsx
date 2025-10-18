"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Filter, RefreshCw, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChartPlaceholder from "../../dashboard-builder/chart-placeholder"
import { DatePickerWithRange } from "../../shared/date-range-picker"
import ExportButton from "../../shared/export-button"

export default function UserEngagementReport() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  // Sample data for export
  const userData = [
    { date: "2025-05-01", total_users: 24500, active_users: 18200, new_users: 450, returning_users: 17750 },
    { date: "2025-05-02", total_users: 24950, active_users: 18500, new_users: 480, returning_users: 18020 },
    { date: "2025-05-03", total_users: 25430, active_users: 19100, new_users: 520, returning_users: 18580 },
    { date: "2025-05-04", total_users: 25950, active_users: 19600, new_users: 490, returning_users: 19110 },
    { date: "2025-05-05", total_users: 26440, active_users: 20100, new_users: 510, returning_users: 19590 },
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
          <ExportButton data={userData} filename="user-engagement-report.csv" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <UserMetricCard title="Total Users" value="26,440" change={7.8} trend="up" />
        <UserMetricCard title="Active Users" value="20,100" change={10.4} trend="up" />
        <UserMetricCard title="New Users" value="510" change={4.1} trend="up" />
        <UserMetricCard title="Retention Rate" value="78.2%" change={2.3} trend="up" />
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">User Growth Trends</CardTitle>
            <Tabs defaultValue="daily">
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ChartPlaceholder title="User Growth" type="line" height={400} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">User Engagement by Time of Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartPlaceholder title="Engagement by Time" type="bar" height={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">User Retention Cohorts</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartPlaceholder title="Retention Cohorts" type="area" height={300} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">User Demographics</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartPlaceholder title="Age Distribution" type="pie" height={300} />
            <ChartPlaceholder title="Geographic Distribution" type="pie" height={300} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">User Activity Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ChartPlaceholder title="Activity Breakdown" type="bar" height={400} />
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface UserMetricCardProps {
  title: string
  value: string
  change: number
  trend: "up" | "down"
}

function UserMetricCard({ title, value, change, trend }: UserMetricCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <div className="flex items-center">
              <div className={`flex items-center text-sm ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
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
                <span>{change}%</span>
              </div>
              <span className="text-sm text-muted-foreground ml-2">vs last period</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
