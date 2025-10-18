import { SettingsHeader } from "@/components/admin/talent-hub/settings/settings-header"
import { GeneralSettings } from "@/components/admin/talent-hub/settings/general-settings"
import { VerificationSettings } from "@/components/admin/talent-hub/settings/verification-settings"
import { CastingCallSettings } from "@/components/admin/talent-hub/settings/casting-call-settings"
import { NotificationSettings } from "@/components/admin/talent-hub/settings/notification-settings"
import { PrivacySettings } from "@/components/admin/talent-hub/settings/privacy-settings"

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SettingsHeader />
      <div className="grid grid-cols-1 gap-6">
        <GeneralSettings />
        <VerificationSettings />
        <CastingCallSettings />
        <NotificationSettings />
        <PrivacySettings />
      </div>
    </div>
  )
}
