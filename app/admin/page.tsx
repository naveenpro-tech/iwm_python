import { DashboardKPIs } from "@/components/admin/dashboard/dashboard-kpis"
import { ActivityFeed } from "@/components/admin/dashboard/activity-feed"
import { QuickActions } from "@/components/admin/dashboard/quick-actions"
import { AnalyticsSnapshot } from "@/components/admin/dashboard/analytics-snapshot"

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      </div>

      <div className="hidden md:block">
        <DashboardKPIs />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <div className="space-y-4 md:space-y-6">
          <QuickActions />
          <div className="hidden md:block">
            <AnalyticsSnapshot />
          </div>
        </div>
      </div>
    </div>
  )
}
