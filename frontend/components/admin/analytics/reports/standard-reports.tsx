"use client"

import { motion } from "framer-motion"
import { ArrowRight, BarChart, Users, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function StandardReports() {
  const reports = [
    {
      title: "User Engagement",
      description: "Track user acquisition, retention, and engagement metrics",
      icon: <Users className="h-5 w-5 text-primary" />,
      href: "/admin/analytics/reports/user-engagement",
      delay: 0,
    },
    {
      title: "Content Performance",
      description: "Analyze content views, ratings, and engagement metrics",
      icon: <BarChart className="h-5 w-5 text-primary" />,
      href: "/admin/analytics/reports/content-performance",
      delay: 1,
    },
    {
      title: "System Performance",
      description: "Monitor platform health, response times, and errors",
      icon: <Activity className="h-5 w-5 text-primary" />,
      href: "/admin/analytics/reports/system-performance",
      delay: 2,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Standard Reports</h2>
        <Button variant="outline" size="sm" asChild>
          <a href="/admin/analytics/reports">
            <span>View All Reports</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reports.map((report, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: report.delay * 0.1 + 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {report.icon}
                  </div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{report.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto" asChild>
                  <a href={report.href}>
                    <span>View Report</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
