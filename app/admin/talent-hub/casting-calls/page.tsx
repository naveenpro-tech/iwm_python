import { CastingCallsHeader } from "@/components/admin/talent-hub/casting-calls/casting-calls-header"
import { CastingCallsTable } from "@/components/admin/talent-hub/casting-calls/casting-calls-table"
import { CastingCallsFilters } from "@/components/admin/talent-hub/casting-calls/casting-calls-filters"

export default function CastingCallsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CastingCallsHeader />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 lg:w-72">
          <CastingCallsFilters />
        </div>
        <div className="flex-1">
          <CastingCallsTable />
        </div>
      </div>
    </div>
  )
}
