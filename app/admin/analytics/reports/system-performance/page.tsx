import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import SystemPerformanceReport from "@/components/admin/analytics/reports/system-performance/system-performance-report"

export const metadata: Metadata = {
  title: "System Performance Report | Analytics | Siddu Admin",
  description: "Detailed system performance metrics and trends for the Siddu platform",
}

export default function SystemPerformanceReportPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <a href="/admin/analytics/reports">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">System Performance Report</h1>
      </div>

      <SystemPerformanceReport />
    </div>
  )
}
