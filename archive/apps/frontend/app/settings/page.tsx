"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SettingsHeader } from "@/components/settings/settings-header"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { AccountSettings } from "@/components/settings/account-settings"
import { PrivacySettings } from "@/components/settings/privacy-settings"
import { DisplaySettings } from "@/components/settings/display-settings"
import { PreferencesSettings } from "@/components/settings/preferences-settings"
import { NotificationPreferences } from "@/components/settings/notification-preferences"
import { User, Lock, Eye, Palette, Sliders, Bell } from "lucide-react"

/**
 * Global Settings Page
 * Provides access to all user settings across multiple sections
 */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <SettingsHeader />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800 border border-gray-700">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 data-[state=active]:bg-gray-700"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>

            <TabsTrigger
              value="account"
              className="flex items-center gap-2 data-[state=active]:bg-gray-700"
            >
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>

            <TabsTrigger
              value="privacy"
              className="flex items-center gap-2 data-[state=active]:bg-gray-700"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>

            <TabsTrigger
              value="display"
              className="flex items-center gap-2 data-[state=active]:bg-gray-700"
            >
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Display</span>
            </TabsTrigger>

            <TabsTrigger
              value="preferences"
              className="flex items-center gap-2 data-[state=active]:bg-gray-700"
            >
              <Sliders className="h-4 w-4" />
              <span className="hidden sm:inline">Prefs</span>
            </TabsTrigger>

            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2 data-[state=active]:bg-gray-700"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notify</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-8 space-y-6">
            <TabsContent value="profile" className="space-y-6">
              <ProfileSettings />
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <AccountSettings />
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <PrivacySettings />
            </TabsContent>

            <TabsContent value="display" className="space-y-6">
              <DisplaySettings />
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <PreferencesSettings />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <NotificationPreferences />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

