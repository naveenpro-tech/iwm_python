import type { Metadata } from "next"
import { LiveScoreHeader } from "@/components/admin/cricket/live-score/live-score-header"
import { LiveScoreForm } from "@/components/admin/cricket/live-score/live-score-form"
import { LiveScorePreview } from "@/components/admin/cricket/live-score/live-score-preview"
import { LiveScoreAuditLog } from "@/components/admin/cricket/live-score/live-score-audit-log"

export const metadata: Metadata = {
  title: "Live Score Override | Siddu Admin",
  description: "Manually update live cricket scores",
}

export default function LiveScoreOverridePage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
      <LiveScoreHeader matchId={params.id} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LiveScoreForm matchId={params.id} />
          <LiveScoreAuditLog matchId={params.id} />
        </div>
        <div>
          <LiveScorePreview matchId={params.id} />
        </div>
      </div>
    </div>
  )
}
