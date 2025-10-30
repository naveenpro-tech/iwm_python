"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SettingsHeader } from "@/components/settings/settings-header"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { AccountSettings } from "@/components/settings/account-settings"
import { PrivacySettings } from "@/components/settings/privacy-settings"
import { DisplaySettings } from "@/components/settings/display-settings"
import { PreferencesSettings } from "@/components/settings/preferences-settings"
import { NotificationPreferences } from "@/components/settings/notification-preferences"
import { CriticSettings } from "@/components/settings/CriticSettings"
import { TalentSettings } from "@/components/settings/TalentSettings"
import { IndustryProSettings } from "@/components/settings/IndustryProSettings"
import { RoleManagement } from "@/components/settings/RoleManagement"
import { useRoleContext } from "@/context/RoleContext"
import { User, Lock, Eye, Palette, Sliders, Bell, Star, Sparkles, Briefcase, Shield } from "lucide-react"

/**
 * Global Settings Page
 * Provides access to all user settings across multiple sections
 * Includes role-specific settings tabs based on user's available roles
 */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const { availableRoles } = useRoleContext()

  // Determine how many tabs we'll have
  const baseTabCount = 7 // Profile, Account, Privacy, Display, Preferences, Notifications, Roles
  const roleTabCount = availableRoles?.filter(r => ["critic", "talent", "industry"].includes(r.role) && r.enabled).length || 0
  const totalTabCount = baseTabCount + roleTabCount
  const gridCols = totalTabCount <= 7 ? "grid-cols-7" : totalTabCount <= 9 ? "grid-cols-9" : "grid-cols-10"

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <SettingsHeader />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${gridCols} bg-gray-800 border border-gray-700 overflow-x-auto`}>
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

            <TabsTrigger
              value="roles"
              className="flex items-center gap-2 data-[state=active]:bg-gray-700"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Roles</span>
            </TabsTrigger>

            {/* Role-Specific Tabs - Only show if role is enabled */}
            {availableRoles?.some(r => r.role === "critic" && r.enabled) && (
              <TabsTrigger
                value="critic"
                className="flex items-center gap-2 data-[state=active]:bg-gray-700"
              >
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Critic</span>
              </TabsTrigger>
            )}

            {availableRoles?.some(r => r.role === "talent" && r.enabled) && (
              <TabsTrigger
                value="talent"
                className="flex items-center gap-2 data-[state=active]:bg-gray-700"
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Talent</span>
              </TabsTrigger>
            )}

            {availableRoles?.some(r => r.role === "industry" && r.enabled) && (
              <TabsTrigger
                value="industry"
                className="flex items-center gap-2 data-[state=active]:bg-gray-700"
              >
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Industry</span>
              </TabsTrigger>
            )}
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

            <TabsContent value="roles" className="space-y-6">
              <RoleManagement />
            </TabsContent>

            {/* Role-Specific Settings - Only show if role is enabled */}
            {availableRoles?.some(r => r.role === "critic" && r.enabled) && (
              <TabsContent value="critic" className="space-y-6">
                <CriticSettings />
              </TabsContent>
            )}

            {availableRoles?.some(r => r.role === "talent" && r.enabled) && (
              <TabsContent value="talent" className="space-y-6">
                <TalentSettings />
              </TabsContent>
            )}

            {availableRoles?.some(r => r.role === "industry" && r.enabled) && (
              <TabsContent value="industry" className="space-y-6">
                <IndustryProSettings />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  )
}

