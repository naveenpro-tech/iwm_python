"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, User, Lock, Bell, Trash2, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

interface UserData {
  id: string
  username: string
  displayName: string
  bio: string
  avatarUrl: string
  coverUrl: string
  location: string
  memberSince: string
  isVerified: boolean
  stats: {
    reviews: number
    watchlist: number
    favorites: number
    following: number
    followers: number
  }
}

interface ProfileSettingsProps {
  userData: UserData
}

export function ProfileSettings({ userData }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [formData, setFormData] = useState({
    displayName: userData.displayName,
    username: userData.username,
    bio: userData.bio,
    location: userData.location,
    email: "alex.johnson@example.com", // Mock email
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    reviewComments: true,
    newReleases: true,
    watchlistReleases: true,
    darkMode: true,
    autoplayTrailers: false,
    language: "english",
    region: "us",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggleChange = (name: string, checked: boolean) => {
    setPreferences((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setPreferences((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted", formData)
    // In a real app, this would send the data to an API
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

  return (
    <motion.div className="bg-[#282828] rounded-lg p-6" initial="hidden" animate="visible" variants={containerVariants}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 bg-[#1A1A1A]">
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
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <motion.form onSubmit={handleSubmit} className="space-y-6" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-inter font-medium text-[#E0E0E0] mb-4">Profile Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="displayName" className="text-[#E0E0E0]">
                      Display Name
                    </Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
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
                      value={formData.username}
                      onChange={handleInputChange}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-[#E0E0E0]">
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
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
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0] h-[calc(100%-28px)]"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-inter font-medium text-[#E0E0E0] mb-4">Profile Images</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-[#E0E0E0] mb-2 block">Profile Picture</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-[#1A1A1A]">
                      <Image
                        src={userData.avatarUrl || "/placeholder.svg?height=80&width=80&query=person+silhouette"}
                        alt="Profile picture"
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
                      Change
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-[#E0E0E0] mb-2 block">Cover Photo</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 h-20 rounded-md overflow-hidden bg-[#1A1A1A]">
                      <Image
                        src={userData.coverUrl || "/placeholder.svg?height=80&width=128&query=cinematic+background"}
                        alt="Cover photo"
                        width={128}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
                      Change
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-end">
              <Button type="submit" className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD]">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </motion.div>
          </motion.form>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account">
          <motion.div className="space-y-8" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-inter font-medium text-[#E0E0E0] mb-4">Email Address</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-[#E0E0E0]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]"
                  />
                </div>
                <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
                  Verify Email
                </Button>
              </div>
            </motion.div>

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
                    value={formData.currentPassword}
                    onChange={handleInputChange}
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
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
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
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]"
                  />
                </div>
                <Button className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD]">Update Password</Button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-inter font-medium text-[#E0E0E0] mb-4">Danger Zone</h3>
              <div className="space-y-4 p-4 border border-[#FF4D6D] rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-inter font-medium text-[#E0E0E0]">Delete Account</h4>
                    <p className="text-[#A0A0A0] text-sm">
                      This will permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button variant="destructive" className="bg-[#FF4D6D] hover:bg-[#E03E5C]">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-inter font-medium text-[#E0E0E0]">Log Out Everywhere</h4>
                    <p className="text-[#A0A0A0] text-sm">Log out from all devices except this one</p>
                  </div>
                  <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* Preferences Settings */}
        <TabsContent value="preferences">
          <motion.div className="space-y-8" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-inter font-medium text-[#E0E0E0] mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="text-[#E0E0E0]">
                      Email Notifications
                    </Label>
                    <p className="text-[#A0A0A0] text-sm">Receive email updates about your activity</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => handleToggleChange("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications" className="text-[#E0E0E0]">
                      Push Notifications
                    </Label>
                    <p className="text-[#A0A0A0] text-sm">Receive push notifications on your device</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => handleToggleChange("pushNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reviewComments" className="text-[#E0E0E0]">
                      Review Comments
                    </Label>
                    <p className="text-[#A0A0A0] text-sm">Get notified when someone comments on your reviews</p>
                  </div>
                  <Switch
                    id="reviewComments"
                    checked={preferences.reviewComments}
                    onCheckedChange={(checked) => handleToggleChange("reviewComments", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newReleases" className="text-[#E0E0E0]">
                      New Releases
                    </Label>
                    <p className="text-[#A0A0A0] text-sm">Get notified about new movie releases</p>
                  </div>
                  <Switch
                    id="newReleases"
                    checked={preferences.newReleases}
                    onCheckedChange={(checked) => handleToggleChange("newReleases", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="watchlistReleases" className="text-[#E0E0E0]">
                      Watchlist Releases
                    </Label>
                    <p className="text-[#A0A0A0] text-sm">
                      Get notified when movies in your watchlist become available
                    </p>
                  </div>
                  <Switch
                    id="watchlistReleases"
                    checked={preferences.watchlistReleases}
                    onCheckedChange={(checked) => handleToggleChange("watchlistReleases", checked)}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-inter font-medium text-[#E0E0E0] mb-4">Display</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode" className="text-[#E0E0E0]">
                      Dark Mode
                    </Label>
                    <p className="text-[#A0A0A0] text-sm">Use dark theme for the application</p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={preferences.darkMode}
                    onCheckedChange={(checked) => handleToggleChange("darkMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoplayTrailers" className="text-[#E0E0E0]">
                      Autoplay Trailers
                    </Label>
                    <p className="text-[#A0A0A0] text-sm">Automatically play trailers when viewing movie details</p>
                  </div>
                  <Switch
                    id="autoplayTrailers"
                    checked={preferences.autoplayTrailers}
                    onCheckedChange={(checked) => handleToggleChange("autoplayTrailers", checked)}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-inter font-medium text-[#E0E0E0] mb-4">Regional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="language" className="text-[#E0E0E0]">
                    Language
                  </Label>
                  <Select value={preferences.language} onValueChange={(value) => handleSelectChange("language", value)}>
                    <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="region" className="text-[#E0E0E0]">
                    Region
                  </Label>
                  <Select value={preferences.region} onValueChange={(value) => handleSelectChange("region", value)}>
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

            <motion.div variants={itemVariants} className="flex justify-end">
              <Button className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD]">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
