import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReportsList from "@/components/admin/analytics/reports/reports-list"

export const metadata: Metadata = {
  title: "Standard Reports | Analytics | Siddu Admin",
  description: "Browse and access standard reports for the Siddu platform",
}

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <a href="/admin/analytics">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Standard Reports</h1>
      </div>

      <ReportsList />
    </div>
  )
}
