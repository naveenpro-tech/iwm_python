"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, RefreshCw, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "./shared/date-range-picker"

export default function AnalyticsHeader() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <motion.div
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/admin/analytics/custom-reports")}
          >
            <span className="hidden md:inline mr-2">Custom Reports</span>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <DatePickerWithRange />

        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh Data</span>
        </Button>

        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Export Dashboard</span>
        </Button>
      </div>
    </motion.div>
  )
}
