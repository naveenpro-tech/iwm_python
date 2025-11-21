"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Film, Users, BookOpen, Mail, MessageSquare, Calendar, Info, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function NotificationSettings() {
  const [emailFrequency, setEmailFrequency] = useState("daily")
  const [pushEnabled, setPushEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [inAppEnabled, setInAppEnabled] = useState(true)
  const [dndEnabled, setDndEnabled] = useState(false)
  const [dndStartTime, setDndStartTime] = useState("22:00")
  const [dndEndTime, setDndEndTime] = useState("08:00")
  const [notificationVolume, setNotificationVolume] = useState(70)
  const [isSaving, setIsSaving] = useState(false)

  // Mock notification categories with their settings
  const [categories, setCategories] = useState([
    { id: "social", name: "Social", icon: Users, inApp: true, email: true, push: true },
    { id: "releases", name: "Releases", icon: Film, inApp: true, email: true, push: true },
    { id: "system", name: "System", icon: Bell, inApp: true, email: false, push: false },
    { id: "clubs", name: "Clubs", icon: Users, inApp: true, email: true, push: false },
    { id: "quizzes", name: "Quizzes", icon: BookOpen, inApp: true, email: false, push: false },
    { id: "messages", name: "Messages", icon: MessageSquare, inApp: true, email: true, push: true },
    { id: "events", name: "Events", icon: Calendar, inApp: true, email: true, push: true },
  ])

  const toggleCategoryChannel = (categoryId: string, channel: "inApp" | "email" | "push") => {
    setCategories(
      categories.map((category) =>
        category.id === categoryId ? { ...category, [channel]: !category[channel] } : category,
      ),
    )
  }

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  const resetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset all notification settings to defaults?")) {
      setEmailFrequency("daily")
      setPushEnabled(true)
      setEmailEnabled(true)
      setInAppEnabled(true)
      setDndEnabled(false)
      setDndStartTime("22:00")
      setDndEndTime("08:00")
      setNotificationVolume(70)
      setCategories([
        { id: "social", name: "Social", icon: Users, inApp: true, email: true, push: true },
        { id: "releases", name: "Releases", icon: Film, inApp: true, email: true, push: true },
        { id: "system", name: "System", icon: Bell, inApp: true, email: false, push: false },
        { id: "clubs", name: "Clubs", icon: Users, inApp: true, email: true, push: false },
        { id: "quizzes", name: "Quizzes", icon: BookOpen, inApp: true, email: false, push: false },
        { id: "messages", name: "Messages", icon: MessageSquare, inApp: true, email: true, push: true },
        { id: "events", name: "Events", icon: Calendar, inApp: true, email: true, push: true },
      ])
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Notification Settings</h2>
          <Button onClick={handleSave} className="bg-[#00BFFF] hover:bg-[#00A3DD]" disabled={isSaving}>
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="channels" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="channels">Notification Channels</TabsTrigger>
          <TabsTrigger value="categories">Notification Categories</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="channels">
          <motion.div variants={containerVariants} className="space-y-6">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5 text-[#00BFFF]" />
                    In-App Notifications
                  </CardTitle>
                  <CardDescription>Control how notifications appear within the Siddu platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable In-App Notifications</Label>
                      <p className="text-sm text-gray-400">Receive notifications while using the platform</p>
                    </div>
                    <Switch checked={inAppEnabled} onCheckedChange={setInAppEnabled} />
                  </div>

                  <Separator className="my-4 bg-gray-700" />

                  <div className="space-y-4">
                    <Label>Notification Sound Volume</Label>
                    <div className="flex items-center gap-4">
                      <Bell className="h-4 w-4 text-gray-400" />
                      <Slider
                        value={[notificationVolume]}
                        max={100}
                        step={1}
                        className="flex-1"
                        onValueChange={(value) => setNotificationVolume(value[0])}
                        disabled={!inAppEnabled}
                      />
                      <span className="w-12 text-right text-sm">{notificationVolume}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="mr-2 h-5 w-5 text-[#00BFFF]" />
                    Email Notifications
                  </CardTitle>
                  <CardDescription>Manage how often you receive email notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Email Notifications</Label>
                      <p className="text-sm text-gray-400">Receive notifications via email</p>
                    </div>
                    <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
                  </div>

                  <Separator className="my-4 bg-gray-700" />

                  <div className="space-y-2">
                    <Label>Email Digest Frequency</Label>
                    <Select value={emailFrequency} onValueChange={setEmailFrequency} disabled={!emailEnabled}>
                      <SelectTrigger className="bg-[#333333] border-gray-700">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#333333] border-gray-700">
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Digest</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-400 mt-1">
                      {emailFrequency === "realtime" && "You'll receive emails immediately for each notification."}
                      {emailFrequency === "daily" && "You'll receive a daily summary of all your notifications."}
                      {emailFrequency === "weekly" && "You'll receive a weekly summary of all your notifications."}
                      {emailFrequency === "never" && "You won't receive any email notifications."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5 text-[#00BFFF]" />
                    Push Notifications
                  </CardTitle>
                  <CardDescription>Control mobile and desktop push notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Push Notifications</Label>
                      <p className="text-sm text-gray-400">
                        Receive notifications on your devices when you're not using the platform
                      </p>
                    </div>
                    <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
                  </div>

                  <Separator className="my-4 bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Do Not Disturb</Label>
                      <p className="text-sm text-gray-400">Mute notifications during specific hours</p>
                    </div>
                    <Switch checked={dndEnabled} onCheckedChange={setDndEnabled} disabled={!pushEnabled} />
                  </div>

                  {dndEnabled && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Select value={dndStartTime} onValueChange={setDndStartTime}>
                          <SelectTrigger className="bg-[#333333] border-gray-700">
                            <SelectValue placeholder="Start time" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#333333] border-gray-700">
                            {Array.from({ length: 24 }).map((_, i) => (
                              <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                                {`${i.toString().padStart(2, "0")}:00`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Select value={dndEndTime} onValueChange={setDndEndTime}>
                          <SelectTrigger className="bg-[#333333] border-gray-700">
                            <SelectValue placeholder="End time" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#333333] border-gray-700">
                            {Array.from({ length: 24 }).map((_, i) => (
                              <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                                {`${i.toString().padStart(2, "0")}:00`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="categories">
          <motion.div variants={containerVariants} className="space-y-6">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Notification Categories</CardTitle>
                  <CardDescription>Choose which types of notifications you want to receive and how</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 mb-2 px-4">
                      <div className="col-span-1 font-medium">Category</div>
                      <div className="text-center font-medium">In-App</div>
                      <div className="text-center font-medium">Email</div>
                      <div className="text-center font-medium">Push</div>
                    </div>

                    <Separator className="bg-gray-700" />

                    {categories.map((category) => (
                      <div key={category.id}>
                        <div className="grid grid-cols-4 gap-4 items-center py-2 px-4">
                          <div className="col-span-1 flex items-center gap-2">
                            <category.icon className="h-5 w-5 text-[#00BFFF]" />
                            <span>{category.name}</span>
                          </div>
                          <div className="flex justify-center">
                            <Switch
                              checked={category.inApp}
                              onCheckedChange={() => toggleCategoryChannel(category.id, "inApp")}
                              disabled={!inAppEnabled}
                            />
                          </div>
                          <div className="flex justify-center">
                            <Switch
                              checked={category.email}
                              onCheckedChange={() => toggleCategoryChannel(category.id, "email")}
                              disabled={!emailEnabled}
                            />
                          </div>
                          <div className="flex justify-center">
                            <Switch
                              checked={category.push}
                              onCheckedChange={() => toggleCategoryChannel(category.id, "push")}
                              disabled={!pushEnabled}
                            />
                          </div>
                        </div>
                        <Separator className="bg-gray-700" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="preferences">
          <motion.div variants={containerVariants} className="space-y-6">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>General Preferences</CardTitle>
                  <CardDescription>Additional notification settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Unread Badge</Label>
                      <p className="text-sm text-gray-400">Display a badge with the number of unread notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator className="my-2 bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notification Sounds</Label>
                      <p className="text-sm text-gray-400">Play sounds for new notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator className="my-2 bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Desktop Notifications</Label>
                      <p className="text-sm text-gray-400">Show browser notifications when the tab is not active</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator className="my-2 bg-gray-700" />

                  <div className="space-y-2">
                    <Label>Auto-Clear Notifications</Label>
                    <Select defaultValue="never">
                      <SelectTrigger className="bg-[#333333] border-gray-700">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#333333] border-gray-700">
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="read">When Read</SelectItem>
                        <SelectItem value="1day">After 1 Day</SelectItem>
                        <SelectItem value="1week">After 1 Week</SelectItem>
                        <SelectItem value="1month">After 1 Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-red-400">
                    <Info className="mr-2 h-5 w-5" />
                    Reset Notification Settings
                  </CardTitle>
                  <CardDescription>Reset all notification settings to their default values</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={resetToDefaults}>
                    Reset to Defaults
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
