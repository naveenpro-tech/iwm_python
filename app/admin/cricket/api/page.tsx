import type { Metadata } from "next"
import { ApiManagementHeader } from "@/components/admin/cricket/api/api-management-header"
import { ApiKeysList } from "@/components/admin/cricket/api/api-keys-list"
import { ApiSyncStatus } from "@/components/admin/cricket/api/api-sync-status"
import { ApiUsageMetrics } from "@/components/admin/cricket/api/api-usage-metrics"

export const metadata: Metadata = {
  title: "Cricket API Management | Siddu Admin",
  description: "Manage external cricket data API integrations",
}

export default function ApiManagementPage() {
  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
      <ApiManagementHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ApiKeysList />
          <ApiUsageMetrics />
        </div>
        <div>
          <ApiSyncStatus />
        </div>
      </div>
    </div>
  )
}
