import { VerificationHeader } from "@/components/admin/talent-hub/verification/verification-header"
import { VerificationQueue } from "@/components/admin/talent-hub/verification/verification-queue"
import { VerificationStats } from "@/components/admin/talent-hub/verification/verification-stats"
import { VerificationHistory } from "@/components/admin/talent-hub/verification/verification-history"

export default function VerificationPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <VerificationHeader />
      <VerificationStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VerificationQueue />
        </div>
        <div>
          <VerificationHistory />
        </div>
      </div>
    </div>
  )
}
