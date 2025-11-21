import { TalentHubOverview } from "@/components/admin/talent-hub/talent-hub-overview"
import { TalentHubStats } from "@/components/admin/talent-hub/talent-hub-stats"
import { TalentHubActions } from "@/components/admin/talent-hub/talent-hub-actions"
import { RecentTalentProfiles } from "@/components/admin/talent-hub/recent-talent-profiles"
import { RecentCastingCalls } from "@/components/admin/talent-hub/recent-casting-calls"
import { VerificationQueue } from "@/components/admin/talent-hub/verification-queue"

export default function TalentHubManagementPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Talent Hub Management</h1>
      </div>

      <TalentHubStats />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <TalentHubOverview />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentTalentProfiles />
            <RecentCastingCalls />
          </div>
        </div>
        <div className="space-y-6">
          <TalentHubActions />
          <VerificationQueue />
        </div>
      </div>
    </div>
  )
}
