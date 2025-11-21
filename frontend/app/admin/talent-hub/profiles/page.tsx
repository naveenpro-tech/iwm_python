import { TalentProfilesHeader } from "@/components/admin/talent-hub/profiles/talent-profiles-header"
import { TalentProfilesTable } from "@/components/admin/talent-hub/profiles/talent-profiles-table"
import { TalentProfilesFilters } from "@/components/admin/talent-hub/profiles/talent-profiles-filters"

export default function TalentProfilesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <TalentProfilesHeader />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 lg:w-72">
          <TalentProfilesFilters />
        </div>
        <div className="flex-1">
          <TalentProfilesTable />
        </div>
      </div>
    </div>
  )
}
