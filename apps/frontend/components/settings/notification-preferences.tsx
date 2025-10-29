"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const NOTIFICATION_CHANNELS = [
  { id: "social", label: "Social Activity", description: "Likes, comments, and follows" },
  { id: "releases", label: "New Releases", description: "Upcoming movie releases" },
  { id: "system", label: "System", description: "Important system notifications" },
  { id: "clubs", label: "Clubs", description: "Club activity and invitations" },
  { id: "quizzes", label: "Quizzes", description: "Quiz results and challenges" },
  { id: "messages", label: "Messages", description: "Direct messages" },
  { id: "events", label: "Events", description: "Event updates and reminders" },
]

export function NotificationPreferences() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [notifications, setNotifications] = useState({
    emailFrequency: "weekly",
    pushEnabled: true,
    emailEnabled: true,
    inAppEnabled: true,
    dndEnabled: false,
    dndStartTime: "22:00",
    dndEndTime: "08:00",
    channels: {
      social: { inApp: true, email: true, push: true },
      releases: { inApp: true, email: true, push: true },
      system: { inApp: true, email: false, push: false },
      clubs: { inApp: true, email: true, push: false },
      quizzes: { inApp: true, email: false, push: false },
      messages: { inApp: true, email: true, push: true },
      events: { inApp: true, email: true, push: true },
    },
  })

  const handleGlobalChange = (key: string, value: any) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const handleChannelChange = (channelId: string, type: string, checked: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channelId]: {
          ...prev.channels[channelId as keyof typeof prev.channels],
          [type]: checked,
        },
      },
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Notification preferences updated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification preferences.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700 text-gray-100">
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription className="text-gray-400">
          Control how and when you receive notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Global Settings */}
        <div className="space-y-4 pb-6 border-b border-gray-700">
          <h3 className="font-semibold">Global Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emailFrequency" className="text-gray-300">
                Email Frequency
              </Label>
              <Select
                value={notifications.emailFrequency}
                onValueChange={(value) => handleGlobalChange("emailFrequency", value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pushEnabled"
                checked={notifications.pushEnabled}
                onCheckedChange={(checked) => handleGlobalChange("pushEnabled", checked)}
                className="border-gray-600"
              />
              <Label htmlFor="pushEnabled" className="text-gray-300 cursor-pointer">
                Enable push notifications
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="emailEnabled"
                checked={notifications.emailEnabled}
                onCheckedChange={(checked) => handleGlobalChange("emailEnabled", checked)}
                className="border-gray-600"
              />
              <Label htmlFor="emailEnabled" className="text-gray-300 cursor-pointer">
                Enable email notifications
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="inAppEnabled"
                checked={notifications.inAppEnabled}
                onCheckedChange={(checked) => handleGlobalChange("inAppEnabled", checked)}
                className="border-gray-600"
              />
              <Label htmlFor="inAppEnabled" className="text-gray-300 cursor-pointer">
                Enable in-app notifications
              </Label>
            </div>
          </div>
        </div>

        {/* Channel Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold">Notification Channels</h3>

          {NOTIFICATION_CHANNELS.map((channel) => (
            <div key={channel.id} className="space-y-2 pb-4 border-b border-gray-700 last:border-0">
              <div>
                <p className="font-medium text-sm">{channel.label}</p>
                <p className="text-xs text-gray-400">{channel.description}</p>
              </div>

              <div className="flex gap-4 ml-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${channel.id}-inApp`}
                    checked={notifications.channels[channel.id as keyof typeof notifications.channels]?.inApp || false}
                    onCheckedChange={(checked) =>
                      handleChannelChange(channel.id, "inApp", checked as boolean)
                    }
                    className="border-gray-600"
                  />
                  <Label htmlFor={`${channel.id}-inApp`} className="text-gray-300 cursor-pointer text-sm">
                    In-App
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${channel.id}-email`}
                    checked={notifications.channels[channel.id as keyof typeof notifications.channels]?.email || false}
                    onCheckedChange={(checked) =>
                      handleChannelChange(channel.id, "email", checked as boolean)
                    }
                    className="border-gray-600"
                  />
                  <Label htmlFor={`${channel.id}-email`} className="text-gray-300 cursor-pointer text-sm">
                    Email
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${channel.id}-push`}
                    checked={notifications.channels[channel.id as keyof typeof notifications.channels]?.push || false}
                    onCheckedChange={(checked) =>
                      handleChannelChange(channel.id, "push", checked as boolean)
                    }
                    className="border-gray-600"
                  />
                  <Label htmlFor={`${channel.id}-push`} className="text-gray-300 cursor-pointer text-sm">
                    Push
                  </Label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-sky-600 hover:bg-sky-500 text-white gap-2"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

