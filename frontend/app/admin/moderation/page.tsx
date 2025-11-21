import { ContentModerationQueue } from "@/components/admin/moderation/content-moderation-queue"
import { UserActivityMonitor } from "@/components/admin/users/user-activity-monitor"

export default function ModerationPage() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Content Moderation</h1>

      <div className="grid grid-cols-1 gap-8">
        <ContentModerationQueue />
        <UserActivityMonitor />
      </div>
    </div>
  )
}
