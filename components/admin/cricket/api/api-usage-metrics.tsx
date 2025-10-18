"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { AlertCircle, BarChart } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ApiUsageMetrics() {
  // In a real implementation, this would fetch API usage metrics from an API
  const apiUsage = [
    {
      name: "CricAPI",
      used: 8750,
      limit: 10000,
      resetDate: "June 1, 2023",
    },
    {
      name: "Sportsradar",
      used: 4200,
      limit: 5000,
      resetDate: "May 30, 2023",
    },
    {
      name: "Cricket Data Provider",
      used: 950,
      limit: 1000,
      resetDate: "May 28, 2023",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>API Usage Metrics</CardTitle>
          <CardDescription>Monitor your API usage and limits</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href="/admin/cricket/api/usage">
            <BarChart className="h-4 w-4 mr-2" />
            Detailed Usage
          </a>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {apiUsage.map((api, index) => {
          const usagePercentage = Math.round((api.used / api.limit) * 100)
          const isNearLimit = usagePercentage > 85

          return (
            <motion.div
              key={api.name}
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{api.name}</h3>
                <span className={`text-sm ${isNearLimit ? "text-destructive" : ""}`}>
                  {api.used} / {api.limit} calls
                </span>
              </div>
              <Progress value={usagePercentage} className={isNearLimit ? "text-destructive" : ""} />
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Resets on {api.resetDate}</span>
                <span>{usagePercentage}% used</span>
              </div>

              {isNearLimit && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Usage Limit Warning</AlertTitle>
                  <AlertDescription>You are approaching your API usage limit for {api.name}.</AlertDescription>
                </Alert>
              )}
            </motion.div>
          )
        })}
      </CardContent>
    </Card>
  )
}

import { Button } from "@/components/ui/button"
