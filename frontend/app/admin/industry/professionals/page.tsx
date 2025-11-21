import { ProfessionalsHeader } from "@/components/admin/industry/professionals/professionals-header"
import { ProfessionalsTable } from "@/components/admin/industry/professionals/professionals-table"

export default function ProfessionalsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ProfessionalsHeader />
      <ProfessionalsTable />
    </div>
  )
}
