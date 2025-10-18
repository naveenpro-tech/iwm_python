import type { Metadata } from "next"
import AnalyticsHeader from "@/components/admin/analytics/analytics-header"
import AnalyticsOverview from "@/components/admin/analytics/analytics-overview"
import DashboardContainer from "@/components/admin/analytics/dashboard-builder/dashboard-container"
import StandardReports from "@/components/admin/analytics/reports/standard-reports"
import IntegrationInfo from "@/components/admin/analytics/shared/integration-info"

export const metadata: Metadata = {
  title: "Analytics & Reporting | Siddu Admin",
  description: "Comprehensive analytics and reporting dashboard for Siddu platform",
}

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <AnalyticsHeader />
      <AnalyticsOverview />
      <DashboardContainer />
      <StandardReports />
      <IntegrationInfo />
    </div>
  )
}
