"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Shield, Bell, Palette, Globe } from "lucide-react"
import { SettingsHeader } from "@/components/settings/settings-header"
import { SettingsSidebar } from "@/components/settings/settings-sidebar"
import { AccountSettings } from "@/components/settings/account-settings"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { PrivacySettings } from "@/components/settings/privacy-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { DisplaySettings } from "@/components/settings/display-settings"
import { PreferencesSettings } from "@/components/settings/preferences-settings"

const settingsCategories = [
  { id: "account", label: "Account", icon: User },
  { id: "profile", label: "Profile", icon: User },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "display", label: "Display", icon: Palette },
  { id: "preferences", label: "Preferences", icon: Globe },
]

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState("account")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const renderSettingsContent = () => {
    switch (activeCategory) {
      case "account":
        return <AccountSettings onUnsavedChanges={setHasUnsavedChanges} />
      case "profile":
        return <ProfileSettings onUnsavedChanges={setHasUnsavedChanges} />
      case "privacy":
        return <PrivacySettings onUnsavedChanges={setHasUnsavedChanges} />
      case "notifications":
        return <NotificationSettings onUnsavedChanges={setHasUnsavedChanges} />
      case "display":
        return <DisplaySettings onUnsavedChanges={setHasUnsavedChanges} />
      case "preferences":
        return <PreferencesSettings onUnsavedChanges={setHasUnsavedChanges} />
      default:
        return <AccountSettings onUnsavedChanges={setHasUnsavedChanges} />
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-[#1A1A1A] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SettingsHeader hasUnsavedChanges={hasUnsavedChanges} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <SettingsSidebar
            categories={settingsCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <div className="flex-1">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderSettingsContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
