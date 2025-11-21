// This file already exists and should have the correct export.
// Ensuring it's here for completeness if it was accidentally removed.
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShieldCheck, EyeOff, Users, Lock } from "lucide-react"

interface PrivacySettingsData {
  profileVisibility: "public" | "followers" | "private"
  activitySharing: boolean
  messageRequests: "everyone" | "followers" | "none"
  dataDownloadRequested: boolean
}

const initialSettings: PrivacySettingsData = {
  profileVisibility: "public",
  activitySharing: true,
  messageRequests: "followers",
  dataDownloadRequested: false,
}

export function PrivacySettings() {
  const [settings, setSettings] = useState<PrivacySettingsData>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleSettingChange = (key: keyof PrivacySettingsData, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    console.log("Saving privacy settings:", settings)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    alert("Privacy settings updated!") // Replace with toast
  }

  const handleDataDownload = () => {
    handleSettingChange("dataDownloadRequested", true)
    alert("Data download request submitted. You'll receive an email when it's ready.") // Replace with toast
  }

  return (
    <Card className="bg-gray-800 border-gray-700 text-gray-100">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <ShieldCheck className="h-6 w-6 mr-2 text-sky-400" /> Privacy Settings
        </CardTitle>
        <CardDescription className="text-gray-400">Control your privacy and data sharing preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <Users className="h-5 w-5 mr-2 text-sky-300" />
            Profile Visibility
          </h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="profileVisibility" className="text-gray-300">
              Who can see your profile?
            </Label>
            <Select
              value={settings.profileVisibility}
              onValueChange={(value) => handleSettingChange("profileVisibility", value)}
            >
              <SelectTrigger id="profileVisibility" className="w-[180px] bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="followers">Followers Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-gray-500">
            {settings.profileVisibility === "public" && "Anyone can see your profile, activity, and lists."}
            {settings.profileVisibility === "followers" && "Only users you approve to follow you can see your details."}
            {settings.profileVisibility === "private" &&
              "Your profile is hidden. You'll need to approve follow requests."}
          </p>
        </div>

        <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <EyeOff className="h-5 w-5 mr-2 text-sky-300" />
            Activity Sharing
          </h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="activitySharing" className="text-gray-300">
              Share my watch activity with followers
            </Label>
            <Switch
              id="activitySharing"
              checked={settings.activitySharing}
              onCheckedChange={(checked) => handleSettingChange("activitySharing", checked)}
              className="data-[state=checked]:bg-sky-500"
            />
          </div>
          <p className="text-xs text-gray-500">If enabled, your followers can see movies you've watched or rated.</p>
        </div>

        <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <Lock className="h-5 w-5 mr-2 text-sky-300" />
            Message Requests
          </h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="messageRequests" className="text-gray-300">
              Allow message requests from:
            </Label>
            <Select
              value={settings.messageRequests}
              onValueChange={(value) => handleSettingChange("messageRequests", value)}
            >
              <SelectTrigger id="messageRequests" className="w-[180px] bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select who can message" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="everyone">Everyone</SelectItem>
                <SelectItem value="followers">Followers Only</SelectItem>
                <SelectItem value="none">No One</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-gray-500">Control who can send you direct messages on the platform.</p>
        </div>

        <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-200">Data Management</h3>
          <Button
            variant="outline"
            onClick={handleDataDownload}
            disabled={settings.dataDownloadRequested}
            className="border-sky-500 text-sky-500 hover:bg-sky-500/10 hover:text-sky-400"
          >
            {settings.dataDownloadRequested ? "Download Requested" : "Request My Data"}
          </Button>
          <p className="text-xs text-gray-500">Request a copy of your personal data stored on Siddu.</p>
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-700 pt-6">
        <Button onClick={handleSaveChanges} disabled={isSaving} className="bg-sky-600 hover:bg-sky-500 text-white">
          {isSaving ? "Saving..." : "Save Privacy Settings"}
        </Button>
      </CardFooter>
    </Card>
  )
}
