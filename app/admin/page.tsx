import { DashboardKPIs } from "@/components/admin/dashboard/dashboard-kpis"
import { ActivityFeed } from "@/components/admin/dashboard/activity-feed"
import { QuickActions } from "@/components/admin/dashboard/quick-actions"
import { AnalyticsSnapshot } from "@/components/admin/dashboard/analytics-snapshot"

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      </div>

      <DashboardKPIs />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <AnalyticsSnapshot />
        </div>
      </div>
    </div>
  )
}
