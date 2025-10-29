"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, User, Lock, Bell, Trash2, LogOut, AlertCircle, RotateCcw, Loader2, Check, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import {
  getProfileSettings,
  updateProfileSettings,
  getPreferences,
  updatePreferences,
  getAccountSettings,
  updateAccountSettings,
  getDisplaySettings,
  updateDisplaySettings,
  getPrivacySettings,
  updatePrivacySettings
} from "@/lib/api/settings"

interface ProfileSettingsProps {
  userId: string
}

export function ProfileSettings({ userId }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Profile Settings
  const [profileData, setProfileData] = useState({
    username: "",
    fullName: "",
    bio: "",
    avatarUrl: "",
  })

  // Account Settings
  const [accountData, setAccountData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    bio: "",
  })

  // Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Preferences
  const [preferences, setPreferences] = useState({
    language: "en",
    region: "us",
    hideSpoilers: true,
    excludedGenres: [],
    contentRating: "all",
  })

  // Display Settings
  const [displaySettings, setDisplaySettings] = useState({
    theme: "dark",
    fontSize: "medium",
    highContrastMode: false,
    reduceMotion: false,
  })

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    activitySharing: true,
    messageRequests: "everyone",
    dataDownloadRequested: false,
  })

  // Fetch all settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [profile, account, prefs, display, privacy] = await Promise.all([
          getProfileSettings(),
          getAccountSettings(),
          getPreferences(),
          getDisplaySettings(),
          getPrivacySettings(),
        ])

        // Update profile settings
        if (profile) {
          setProfileData({
            username: profile.username || "",
            fullName: profile.fullName || "",
            bio: profile.bio || "",
            avatarUrl: profile.avatarUrl || "",
          })
        }

        // Update account settings
        if (account) {
          setAccountData({
            name: account.name || "",
            email: account.email || "",
            phone: account.phone || "",
            avatar: account.avatar || "",
            bio: account.bio || "",
          })
        }

        // Update preferences
        if (prefs) {
          setPreferences({
            language: prefs.language || "en",
            region: prefs.region || "us",
            hideSpoilers: prefs.hideSpoilers !== false,
            excludedGenres: prefs.excludedGenres || [],
            contentRating: prefs.contentRating || "all",
          })
        }

        // Update display settings
        if (display) {
          setDisplaySettings({
            theme: display.theme || "dark",
            fontSize: display.fontSize || "medium",
            highContrastMode: display.highContrastMode || false,
            reduceMotion: display.reduceMotion || false,
          })
        }

        // Update privacy settings
        if (privacy) {
          setPrivacySettings({
            profileVisibility: privacy.profileVisibility || "public",
            activitySharing: privacy.activitySharing !== false,
            messageRequests: privacy.messageRequests || "everyone",
            dataDownloadRequested: privacy.dataDownloadRequested || false,
          })
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err)
        setError(err instanceof Error ? err.message : "Failed to load settings")
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchSettings()
    }
  }, [userId])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAccountData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePreferenceChange = (name: string, value: any) => {
    setPreferences((prev) => ({ ...prev, [name]: value }))
  }

  const handleDisplayChange = (name: string, value: any) => {
    setDisplaySettings((prev) => ({ ...prev, [name]: value }))
  }

  const handlePrivacyChange = (name: string, value: any) => {
    setPrivacySettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      await updateProfileSettings(profileData)
      setSuccessMessage("Profile settings saved successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error("Failed to save profile settings:", err)
      setError(err instanceof Error ? err.message : "Failed to save profile settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      await updateAccountSettings(accountData)
      setSuccessMessage("Account settings saved successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error("Failed to save account settings:", err)
      setError(err instanceof Error ? err.message : "Failed to save account settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      await updateAccountSettings({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      setSuccessMessage("Password changed successfully!")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error("Failed to change password:", err)
      setError(err instanceof Error ? err.message : "Failed to change password")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      await updatePreferences(preferences)
      setSuccessMessage("Preferences saved successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error("Failed to save preferences:", err)
      setError(err instanceof Error ? err.message : "Failed to save preferences")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDisplaySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      await updateDisplaySettings(displaySettings)
      setSuccessMessage("Display settings saved successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error("Failed to save display settings:", err)
      setError(err instanceof Error ? err.message : "Failed to save display settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePrivacySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      await updatePrivacySettings(privacySettings)
      setSuccessMessage("Privacy settings saved successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error("Failed to save privacy settings:", err)
      setError(err instanceof Error ? err.message : "Failed to save privacy settings")
    } finally {
      setIsSaving(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  if (isLoading) {
    return (
      <div className="bg-[#282828] rounded-lg p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00BFFF] animate-spin mr-2" />
        <span className="text-[#E0E0E0] font-dmsans">Loading settings...</span>
      </div>
    )
  }

  return (
    <motion.div className="bg-[#282828] rounded-lg p-6" initial="hidden" animate="visible" variants={containerVariants}>
      {error && (
        <div className="mb-6 p-4 bg-[#FF4D6D]/10 border border-[#FF4D6D] rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#FF4D6D] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[#FF4D6D] font-dmsans text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 mt-2 px-3 py-1 bg-[#FF4D6D] text-[#000] rounded text-sm hover:bg-[#FF6B7F] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Retry
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-[#00BFFF]/10 border border-[#00BFFF] rounded-lg flex items-center gap-3">
          <Check className="w-5 h-5 text-[#00BFFF]" />
          <p className="text-[#00BFFF] font-dmsans text-sm">{successMessage}</p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6 bg-[#1A1A1A]">
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#3A3A3A] data-[state=active]:text-[#E0E0E0]">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-[#3A3A3A] data-[state=active]:text-[#E0E0E0]">
            <Lock className="w-4 h-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="data-[state=active]:bg-[#3A3A3A] data-[state=active]:text-[#E0E0E0]"
          >
            <Bell className="w-4 h-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger
            value="display"
            className="data-[state=active]:bg-[#3A3A3A] data-[state=active]:text-[#E0E0E0]"
          >
            <Eye className="w-4 h-4 mr-2" />
            Display
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            className="data-[state=active]:bg-[#3A3A3A] data-[state=active]:text-[#E0E0E0]"
          >
            <Lock className="w-4 h-4 mr-2" />
            Privacy
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <motion.form onSubmit={handleProfileSubmit} className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-inter font-medium text-[#E0E0E0] mb-4">Profile Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-[#E0E0E0]">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="username" className="text-[#E0E0E0]">
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio" className="text-[#E0E0E0]">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0] h-[calc(100%-28px)]"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account">
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            <motion.form onSubmit={handleAccountSubmit} className="space-y-8">
              <motion.div variants={itemVariants}>
                <h3 className="text-lg font-inter font-medium text-[#E0E0E0] mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-[#E0E0E0]">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={accountData.name}
                      onChange={handleAccountChange}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#E0E0E0]">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={accountData.email}
                      onChange={handleAccountChange}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-[#E0E0E0]">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={accountData.phone}
                      onChange={handleAccountChange}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Account Info
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.form>

            <motion.form onSubmit={handlePasswordSubmit} className="space-y-8">
              <motion.div variants={itemVariants}>
                <h3 className="text-lg font-inter font-medium text-[#E0E0E0] mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-[#E0E0E0]">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-[#E0E0E0]">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-[#E0E0E0]">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="showPassword"
                      checked={showPassword}
                      onCheckedChange={setShowPassword}
                    />
                    <Label htmlFor="showPassword" className="text-[#A0A0A0] text-sm">
                      Show passwords
                    </Label>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.form>
          </motion.div>
        </TabsContent>

        {/* Preferences Settings */}
        <TabsContent value="preferences">
          <motion.form onSubmit={handlePreferencesSubmit} className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-inter font-medium text-[#E0E0E0] mb-4">Regional Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="language" className="text-[#E0E0E0]">
                    Language
                  </Label>
                  <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange("language", value)}>
                    <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="region" className="text-[#E0E0E0]">
                    Region
                  </Label>
                  <Select value={preferences.region} onValueChange={(value) => handlePreferenceChange("region", value)}>
                    <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="in">India</SelectItem>
                      <SelectItem value="jp">Japan</SelectItem>
                      <SelectItem value="global">Global</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-inter font-medium text-[#E0E0E0] mb-4">Content Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="hideSpoilers" className="text-[#E0E0E0]">
                      Hide Spoilers
                    </Label>
                    <p className="text-[#A0A0A0] text-sm">Hide spoiler content in reviews and discussions</p>
                  </div>
                  <Switch
                    id="hideSpoilers"
                    checked={preferences.hideSpoilers}
                    onCheckedChange={(checked) => handlePreferenceChange("hideSpoilers", checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="contentRating" className="text-[#E0E0E0]">
                    Content Rating
                  </Label>
                  <Select value={preferences.contentRating} onValueChange={(value) => handlePreferenceChange("contentRating", value)}>
                    <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pg">PG</SelectItem>
                      <SelectItem value="pg13">PG-13</SelectItem>
                      <SelectItem value="r">R</SelectItem>
                      <SelectItem value="nc17">NC-17</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display">
          <motion.form onSubmit={handleDisplaySubmit} className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-inter font-medium text-[#E0E0E0] mb-4">Display Options</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme" className="text-[#E0E0E0]">
                    Theme
                  </Label>
                  <Select value={displaySettings.theme} onValueChange={(value) => handleDisplayChange("theme", value)}>
                    <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fontSize" className="text-[#E0E0E0]">
                    Font Size
                  </Label>
                  <Select value={displaySettings.fontSize} onValueChange={(value) => handleDisplayChange("fontSize", value)}>
                    <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="highContrast" className="text-[#E0E0E0]">
                      High Contrast Mode
                    </Label>
                    <p className="text-[#A0A0A0] text-sm">Increase contrast for better readability</p>
                  </div>
                  <Switch
                    id="highContrast"
                    checked={displaySettings.highContrastMode}
                    onCheckedChange={(checked) => handleDisplayChange("highContrastMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reduceMotion" className="text-[#E0E0E0]">
                      Reduce Motion
                    </Label>
                    <p className="text-[#A0A0A0] text-sm">Minimize animations and transitions</p>
                  </div>
                  <Switch
                    id="reduceMotion"
                    checked={displaySettings.reduceMotion}
                    onCheckedChange={(checked) => handleDisplayChange("reduceMotion", checked)}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Display Settings
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <motion.form onSubmit={handlePrivacySubmit} className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-inter font-medium text-[#E0E0E0] mb-4">Privacy Controls</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profileVisibility" className="text-[#E0E0E0]">
                    Profile Visibility
                  </Label>
                  <Select value={privacySettings.profileVisibility} onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}>
                    <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="followers">Followers Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="activitySharing" className="text-[#E0E0E0]">
                      Activity Sharing
                    </Label>
                    <p className="text-[#A0A0A0] text-sm">Allow others to see your activity</p>
                  </div>
                  <Switch
                    id="activitySharing"
                    checked={privacySettings.activitySharing}
                    onCheckedChange={(checked) => handlePrivacyChange("activitySharing", checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="messageRequests" className="text-[#E0E0E0]">
                    Message Requests
                  </Label>
                  <Select value={privacySettings.messageRequests} onValueChange={(value) => handlePrivacyChange("messageRequests", value)}>
                    <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                      <SelectValue placeholder="Select who can message" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                      <SelectItem value="everyone">Everyone</SelectItem>
                      <SelectItem value="followers">Followers Only</SelectItem>
                      <SelectItem value="none">No One</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Privacy Settings
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
