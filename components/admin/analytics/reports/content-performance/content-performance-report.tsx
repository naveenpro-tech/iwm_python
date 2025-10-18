"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Filter, RefreshCw, Calendar, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import ChartPlaceholder from "../../dashboard-builder/chart-placeholder"
import { DatePickerWithRange } from "../../shared/date-range-picker"
import ExportButton from "../../shared/export-button"

export default function ContentPerformanceReport() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  // Sample data for export
  const contentData = [
    {
      id: 1,
      title: "Inception",
      views: 24892,
      unique_views: 18743,
      avg_rating: 4.8,
      completion_rate: "92%",
      engagement: "High",
    },
    {
      id: 2,
      title: "The Dark Knight",
      views: 18743,
      unique_views: 15621,
      avg_rating: 4.9,
      completion_rate: "95%",
      engagement: "High",
    },
    {
      id: 3,
      title: "Interstellar",
      views: 15621,
      unique_views: 12458,
      avg_rating: 4.7,
      completion_rate: "88%",
      engagement: "Medium",
    },
    {
      id: 4,
      title: "Parasite",
      views: 12458,
      unique_views: 10234,
      avg_rating: 4.6,
      completion_rate: "91%",
      engagement: "High",
    },
    {
      id: 5,
      title: "Oppenheimer",
      views: 28976,
      unique_views: 22345,
      avg_rating: 4.8,
      completion_rate: "94%",
      engagement: "High",
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
          <ExportButton data={contentData} filename="content-performance-report.csv" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ContentMetricCard title="Total Views" value="1.2M" change={15.3} trend="up" />
        <ContentMetricCard title="Avg. Rating" value="4.7" change={0.2} trend="up" />
        <ContentMetricCard title="Completion Rate" value="89%" change={3.5} trend="up" />
        <ContentMetricCard title="Engagement Score" value="8.4" change={0.6} trend="up" />
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Content Performance Trends</CardTitle>
            <Tabs defaultValue="views">
              <TabsList>
                <TabsTrigger value="views">Views</TabsTrigger>
                <TabsTrigger value="ratings">Ratings</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
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
            <CardTitle className="text-lg font-medium">Content by Genre</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartPlaceholder title="Genre Distribution" type="pie" height={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Viewing Time by Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartPlaceholder title="Platform Distribution" type="bar" height={300} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <CardTitle className="text-lg font-medium">Top Performing Content</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search content..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Avg. Rating</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Engagement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentData.map((content, index) => (
                  <motion.tr
                    key={content.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{content.id}</TableCell>
                    <TableCell>{content.title}</TableCell>
                    <TableCell>{content.views.toLocaleString()}</TableCell>
                    <TableCell>{content.avg_rating}</TableCell>
                    <TableCell>{content.completion_rate}</TableCell>
                    <TableCell>
                      <Badge variant={content.engagement === "High" ? "default" : "secondary"}>
                        {content.engagement}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Content Engagement Heatmap</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ChartPlaceholder title="Engagement Heatmap" type="area" height={400} />
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface ContentMetricCardProps {
  title: string
  value: string
  change: number
  trend: "up" | "down"
}

function ContentMetricCard({ title, value, change, trend }: ContentMetricCardProps) {
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
