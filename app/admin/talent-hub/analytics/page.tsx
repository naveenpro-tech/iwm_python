import { AnalyticsHeader } from "@/components/admin/talent-hub/analytics/analytics-header"
import { AnalyticsOverview } from "@/components/admin/talent-hub/analytics/analytics-overview"
import { ProfilesGrowthChart } from "@/components/admin/talent-hub/analytics/profiles-growth-chart"
import { CastingCallsChart } from "@/components/admin/talent-hub/analytics/casting-calls-chart"
import { TopTalentTable } from "@/components/admin/talent-hub/analytics/top-talent-table"
import { TopCastingCallsTable } from "@/components/admin/talent-hub/analytics/top-casting-calls-table"
import { GeographicDistribution } from "@/components/admin/talent-hub/analytics/geographic-distribution"
import { RoleDistribution } from "@/components/admin/talent-hub/analytics/role-distribution"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AnalyticsHeader />
      <AnalyticsOverview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfilesGrowthChart />
        <CastingCallsChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopTalentTable />
        <TopCastingCallsTable />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GeographicDistribution />
        <RoleDistribution />
      </div>
    </div>
  )
}
