import { IndustryProfessionalOverview } from "@/components/admin/industry/industry-professional-overview"
import { RecentVerificationRequests } from "@/components/admin/industry/recent-verification-requests"
import { ProfessionalsByCategory } from "@/components/admin/industry/professionals-by-category"
import { VerificationMetrics } from "@/components/admin/industry/verification-metrics"
import { QuickActions } from "@/components/admin/industry/quick-actions"

export default function IndustryProfessionalDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Industry Professional Management</h1>
      </div>

      <IndustryProfessionalOverview />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <RecentVerificationRequests />
          <ProfessionalsByCategory />
        </div>
        <div className="space-y-6">
          <VerificationMetrics />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
