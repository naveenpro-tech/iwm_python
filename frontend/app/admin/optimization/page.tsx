import { PerformanceMonitor } from "@/components/admin/performance/performance-monitor"
import { BatchOperationsPanel } from "@/components/admin/batch-operations/batch-operations-panel"
import { AdvancedSearch } from "@/components/admin/search/advanced-search"
import { AccessibilityChecker } from "@/components/admin/accessibility/accessibility-checker"

export default function OptimizationPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">System Optimization</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <PerformanceMonitor />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BatchOperationsPanel />
          <AccessibilityChecker />
        </div>
        <AdvancedSearch />
      </div>
    </div>
  )
}
