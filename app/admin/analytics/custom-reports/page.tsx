import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import CustomReportBuilder from "@/components/admin/analytics/custom-reports/custom-report-builder"

export const metadata: Metadata = {
  title: "Custom Report Builder | Analytics | Siddu Admin",
  description: "Build custom reports for the Siddu platform",
}

export default function CustomReportBuilderPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <a href="/admin/analytics">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Custom Report Builder</h1>
      </div>

      <CustomReportBuilder />
    </div>
  )
}
