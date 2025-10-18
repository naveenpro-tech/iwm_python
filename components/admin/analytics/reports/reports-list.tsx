"use client"

import type React from "react"

import { motion } from "framer-motion"
import { BarChart, Users, Activity, LineChart, PieChart, Clock, Search, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface ReportCardProps {
  title: string
  description: string
  category: string
  status: "available" | "coming-soon"
  icon: React.ReactNode
  href: string
  delay: number
}

function ReportCard({ title, description, category, status, icon, href, delay }: ReportCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.05 }}
    >
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">{icon}</div>
              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription className="text-xs">{category}</CardDescription>
              </div>
            </div>
            <Badge variant={status === "available" ? "default" : "secondary"}>
              {status === "available" ? "Available" : "Coming Soon"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardContent>
        <CardFooter>
          <Button
            variant={status === "available" ? "default" : "secondary"}
            size="sm"
            className="ml-auto"
            disabled={status !== "available"}
            asChild={status === "available"}
          >
            {status === "available" ? <a href={href}>View Report</a> : <span>Notify Me</span>}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default function ReportsList() {
  const reports = [
    {
      title: "User Growth Trends",
      description: "Track user acquisition, retention, and churn rates over time with detailed breakdowns.",
      category: "User Engagement",
      status: "available" as const,
      icon: <Users className="h-5 w-5 text-primary" />,
      href: "/admin/analytics/reports/user-engagement",
      delay: 0,
    },
    {
      title: "Content Performance Analysis",
      description: "Analyze views, ratings, and engagement metrics for movies and other content types.",
      category: "Content Performance",
      status: "available" as const,
      icon: <BarChart className="h-5 w-5 text-primary" />,
      href: "/admin/analytics/reports/content-performance",
      delay: 1,
    },
    {
      title: "System Health Dashboard",
      description: "Monitor platform health, response times, errors, and overall system stability.",
      category: "System Performance",
      status: "available" as const,
      icon: <Activity className="h-5 w-5 text-primary" />,
      href: "/admin/analytics/reports/system-performance",
      delay: 2,
    },
    {
      title: "User Behavior Patterns",
      description: "Discover how users navigate through the platform and interact with content.",
      category: "User Engagement",
      status: "coming-soon" as const,
      icon: <LineChart className="h-5 w-5 text-primary" />,
      href: "#",
      delay: 3,
    },
    {
      title: "Content Category Distribution",
      description: "Visualize the distribution of content across different categories and genres.",
      category: "Content Performance",
      status: "coming-soon" as const,
      icon: <PieChart className="h-5 w-5 text-primary" />,
      href: "#",
      delay: 4,
    },
    {
      title: "Peak Usage Analysis",
      description: "Identify peak usage times and optimize resource allocation accordingly.",
      category: "System Performance",
      status: "coming-soon" as const,
      icon: <Clock className="h-5 w-5 text-primary" />,
      href: "#",
      delay: 5,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reports..." className="pl-8" />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          <span>Filter</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report, index) => (
          <ReportCard key={index} {...report} />
        ))}
      </div>
    </div>
  )
}
