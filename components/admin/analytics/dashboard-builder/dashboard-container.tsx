"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, LayoutGrid, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChartPlaceholder from "./chart-placeholder"
import DataTable from "./data-table"
import MetricCard from "./metric-card"
import GeoVisualization from "./geo-visualization"

export default function DashboardContainer() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            <span>Add Widget</span>
          </Button>
          <Button variant="outline" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Card className={isExpanded ? "min-h-[800px]" : "min-h-[600px]"}>
        <CardHeader className="pb-0">
          <Tabs defaultValue="overview">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="sm">
                <LayoutGrid className="h-4 w-4 mr-2" />
                <span>Customize Layout</span>
              </Button>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder title="User Growth" type="line" height={300} />
            <ChartPlaceholder title="Content Engagement" type="bar" height={300} />
            <div className="lg:col-span-2">
              <DataTable />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard title="Active Users" value="8,942" change={5.7} trend="up" />
              <MetricCard title="New Reviews" value="1,286" change={12.3} trend="up" />
              <MetricCard title="Avg. Session" value="8m 12s" change={-2.1} trend="down" />
              <MetricCard title="Bounce Rate" value="24.8%" change={-3.6} trend="up" />
            </div>
            <GeoVisualization />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
