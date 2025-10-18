"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trash, Save, Eye, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import DataSourceSelector from "./data-source-selector"
import FilterBuilder from "./filter-builder"
import ChartPlaceholder from "../dashboard-builder/chart-placeholder"
import DataTable from "../dashboard-builder/data-table"

export default function CustomReportBuilder() {
  const [activeTab, setActiveTab] = useState("design")
  const [reportName, setReportName] = useState("New Custom Report")
  const [selectedDataSource, setSelectedDataSource] = useState("")
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([])
  const [visualizationType, setVisualizationType] = useState("table")

  const handleMetricToggle = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== metric))
    } else {
      setSelectedMetrics([...selectedMetrics, metric])
    }
  }

  const handleDimensionToggle = (dimension: string) => {
    if (selectedDimensions.includes(dimension)) {
      setSelectedDimensions(selectedDimensions.filter((d) => d !== dimension))
    } else {
      setSelectedDimensions([...selectedDimensions, dimension])
    }
  }

  const handleSaveReport = () => {
    // Simulate saving
    alert(`Report "${reportName}" saved successfully!`)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <CardTitle className="text-xl">Report Configuration</CardTitle>
              <CardDescription>
                Design your custom report by selecting data sources, metrics, and visualizations
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Trash className="h-4 w-4 mr-2" />
                <span>Clear</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSaveReport}>
                <Save className="h-4 w-4 mr-2" />
                <span>Save</span>
              </Button>
              <Button size="sm">
                <Eye className="h-4 w-4 mr-2" />
                <span>Preview</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="design" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-name">Report Name</Label>
                    <Input id="report-name" value={reportName} onChange={(e) => setReportName(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Data Source</Label>
                    <DataSourceSelector value={selectedDataSource} onChange={setSelectedDataSource} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Visualization Type</Label>
                    <Select value={visualizationType} onValueChange={setVisualizationType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visualization type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="table">Table</SelectItem>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Range</Label>
                    <Select defaultValue="last30days">
                      <SelectTrigger>
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="last7days">Last 7 Days</SelectItem>
                        <SelectItem value="last30days">Last 30 Days</SelectItem>
                        <SelectItem value="thisMonth">This Month</SelectItem>
                        <SelectItem value="lastMonth">Last Month</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {selectedDataSource && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Metrics</Label>
                    <Card>
                      <CardContent className="p-4 space-y-2">
                        {getMetricsForDataSource(selectedDataSource).map((metric) => (
                          <div key={metric.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`metric-${metric.id}`}
                              checked={selectedMetrics.includes(metric.id)}
                              onCheckedChange={() => handleMetricToggle(metric.id)}
                            />
                            <Label htmlFor={`metric-${metric.id}`} className="text-sm font-normal cursor-pointer">
                              {metric.name}
                            </Label>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <Label>Dimensions</Label>
                    <Card>
                      <CardContent className="p-4 space-y-2">
                        {getDimensionsForDataSource(selectedDataSource).map((dimension) => (
                          <div key={dimension.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`dimension-${dimension.id}`}
                              checked={selectedDimensions.includes(dimension.id)}
                              onCheckedChange={() => handleDimensionToggle(dimension.id)}
                            />
                            <Label htmlFor={`dimension-${dimension.id}`} className="text-sm font-normal cursor-pointer">
                              {dimension.name}
                            </Label>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {selectedDataSource && (
                <div className="space-y-4">
                  <Label>Filters</Label>
                  <FilterBuilder dataSource={selectedDataSource} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="preview" className="space-y-6 mt-6">
              {selectedDataSource ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{reportName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {visualizationType === "table" ? (
                        <DataTable />
                      ) : (
                        <ChartPlaceholder title={reportName} type={visualizationType as any} height={400} />
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">Select a data source to preview your report</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="export" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Export Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <Select defaultValue="csv">
                      <SelectTrigger>
                        <SelectValue placeholder="Select export format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Schedule Export</Label>
                    <Select defaultValue="once">
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">One-time Export</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4">
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      <span>Export Now</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Helper functions to get metrics and dimensions based on data source
function getMetricsForDataSource(dataSource: string) {
  switch (dataSource) {
    case "users":
      return [
        { id: "total_users", name: "Total Users" },
        { id: "active_users", name: "Active Users" },
        { id: "new_users", name: "New Users" },
        { id: "returning_users", name: "Returning Users" },
        { id: "avg_session_duration", name: "Avg. Session Duration" },
        { id: "bounce_rate", name: "Bounce Rate" },
      ]
    case "content":
      return [
        { id: "views", name: "Views" },
        { id: "unique_views", name: "Unique Views" },
        { id: "avg_rating", name: "Average Rating" },
        { id: "total_ratings", name: "Total Ratings" },
        { id: "completion_rate", name: "Completion Rate" },
        { id: "share_count", name: "Share Count" },
      ]
    case "system":
      return [
        { id: "response_time", name: "Response Time" },
        { id: "error_rate", name: "Error Rate" },
        { id: "uptime", name: "Uptime" },
        { id: "api_calls", name: "API Calls" },
        { id: "server_load", name: "Server Load" },
        { id: "memory_usage", name: "Memory Usage" },
      ]
    default:
      return []
  }
}

function getDimensionsForDataSource(dataSource: string) {
  switch (dataSource) {
    case "users":
      return [
        { id: "date", name: "Date" },
        { id: "device", name: "Device" },
        { id: "country", name: "Country" },
        { id: "age_group", name: "Age Group" },
        { id: "gender", name: "Gender" },
        { id: "user_type", name: "User Type" },
      ]
    case "content":
      return [
        { id: "date", name: "Date" },
        { id: "content_type", name: "Content Type" },
        { id: "genre", name: "Genre" },
        { id: "release_year", name: "Release Year" },
        { id: "director", name: "Director" },
        { id: "language", name: "Language" },
      ]
    case "system":
      return [
        { id: "date", name: "Date" },
        { id: "server", name: "Server" },
        { id: "endpoint", name: "Endpoint" },
        { id: "browser", name: "Browser" },
        { id: "os", name: "Operating System" },
        { id: "status_code", name: "Status Code" },
      ]
    default:
      return []
  }
}
