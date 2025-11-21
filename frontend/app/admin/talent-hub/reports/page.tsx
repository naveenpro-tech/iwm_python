import { ReportsHeader } from "@/components/admin/talent-hub/reports/reports-header"
import { ReportsTable } from "@/components/admin/talent-hub/reports/reports-table"
import { ReportsSummary } from "@/components/admin/talent-hub/reports/reports-summary"

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ReportsHeader />
      <ReportsSummary />
      <ReportsTable />
    </div>
  )
}
