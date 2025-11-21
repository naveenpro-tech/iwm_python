"use client"

import dynamic from "next/dynamic"

const PlatformHealthDashboard = dynamic(
  () => import("@/components/admin/system/platform-health-dashboard").then((mod) => mod.PlatformHealthDashboard),
  { ssr: false },
)
const SystemSettings = dynamic(
  () => import("@/components/admin/system/system-settings").then((mod) => mod.SystemSettings),
  { ssr: false },
)
const DatabaseDiagnostics = dynamic(
  () => import("@/components/admin/system/database-diagnostics").then((mod) => mod.DatabaseDiagnostics),
  { ssr: false },
)
const ApiKeyManagement = dynamic(
  () => import("@/components/admin/system/api-key-management").then((mod) => mod.ApiKeyManagement),
  { ssr: false },
)
const N8nWorkflowIntegration = dynamic(
  () => import("@/components/admin/system/n8n-workflow-integration").then((mod) => mod.N8nWorkflowIntegration),
  { ssr: false },
)
const NotificationSystem = dynamic(
  () => import("@/components/admin/system/notification-system").then((mod) => mod.NotificationSystem),
  { ssr: false },
)
const BrokenLinkDetector = dynamic(
  () => import("@/components/admin/system/broken-link-detector").then((mod) => mod.BrokenLinkDetector),
  { ssr: false },
)
const IssueTracker = dynamic(() => import("@/components/admin/system/issue-tracker").then((mod) => mod.IssueTracker), {
  ssr: false,
})
const ScheduledTasksManager = dynamic(
  () => import("@/components/admin/system/scheduled-tasks-manager").then((mod) => mod.ScheduledTasksManager),
  { ssr: false },
)
const FeatureManagement = dynamic(
  () => import("@/components/admin/system/feature-management").then((mod) => mod.FeatureManagement),
  { ssr: false },
)

export default function SystemPage() {
  return (
    <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">System Management</h1>

      <div className="space-y-6 md:space-y-8">
        <FeatureManagement />
        <div className="hidden md:block">
          <PlatformHealthDashboard />
        </div>
        <SystemSettings />
        <div className="hidden md:block">
          <DatabaseDiagnostics />
        </div>
        <ApiKeyManagement />
        <div className="hidden md:block">
          <N8nWorkflowIntegration />
        </div>
        <NotificationSystem />
        <div className="hidden md:block">
          <BrokenLinkDetector />
        </div>
        <IssueTracker />
        <div className="hidden md:block">
          <ScheduledTasksManager />
        </div>
      </div>
    </div>
  )
}
