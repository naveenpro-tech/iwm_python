"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Camera, Edit, Save, X, Eye, EyeOff, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export function AccountSettings() {
  const [showPassword, setShowPassword] = useState(false)
  const [editMode, setEditMode] = useState(false)

  // Mock user data
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    username: "alexj",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Film enthusiast and critic. Love exploring cinema from around the world.",
    avatar: "/user-avatar-1.png",
  })

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
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="relative">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#1A1A1A]">
            <Image src={userData.avatar || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
          </div>
          <button className="absolute bottom-0 right-0 bg-[#00BFFF] p-2 rounded-full text-white hover:bg-[#00BFFF]/90 transition-colors">
            <Camera size={18} />
          </button>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{userData.name}</h3>
            <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)} className="border-gray-700">
              {editMode ? (
                <>
                  <X size={16} className="mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit size={16} className="mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>

          <p className="text-gray-400 mb-4">@{userData.username}</p>
          <p className="text-sm text-gray-300">{userData.bio}</p>

          {editMode && (
            <div className="mt-4">
              <Button className="bg-[#00BFFF] hover:bg-[#00BFFF]/90">
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      <Separator className="my-6 bg-gray-700" />

      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              disabled={!editMode}
              className="bg-[#333333] border-gray-700"
            />
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={userData.username}
              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
              disabled={!editMode}
              className="bg-[#333333] border-gray-700"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              disabled={!editMode}
              className="bg-[#333333] border-gray-700"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              disabled={!editMode}
              className="bg-[#333333] border-gray-700"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              value={userData.bio}
              onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
              disabled={!editMode}
              rows={3}
              className="w-full rounded-md bg-[#333333] border border-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
            />
          </div>
        </div>
      </motion.div>

      <Separator className="my-6 bg-gray-700" />

      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold mb-4">Security</h3>

        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-[#333333] border-gray-700 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="bg-[#333333] border-gray-700"
            />
          </div>

          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="bg-[#333333] border-gray-700"
            />
          </div>

          <Button className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 mt-2">Update Password</Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Login Notifications</h4>
              <p className="text-sm text-gray-400">Receive alerts when someone logs into your account</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </motion.div>

      <Separator className="my-6 bg-gray-700" />

      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold mb-4">Linked Accounts</h3>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-[#333333] rounded-md">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center mr-3">
                <span className="text-white font-bold">f</span>
              </div>
              <div>
                <h4 className="font-medium">Facebook</h4>
                <p className="text-xs text-gray-400">Not Connected</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-gray-700">
              Connect
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#333333] rounded-md">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center mr-3">
                <span className="text-white font-bold">t</span>
              </div>
              <div>
                <h4 className="font-medium">Twitter</h4>
                <p className="text-xs text-gray-400">Connected as @alexj</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 text-red-500 hover:text-red-400 hover:border-red-400"
            >
              Disconnect
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#333333] rounded-md">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#E4405F] flex items-center justify-center mr-3">
                <span className="text-white font-bold">i</span>
              </div>
              <div>
                <h4 className="font-medium">Instagram</h4>
                <p className="text-xs text-gray-400">Not Connected</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-gray-700">
              Connect
            </Button>
          </div>
        </div>
      </motion.div>

      <Separator className="my-6 bg-gray-700" />

      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold mb-4 text-red-500">Danger Zone</h3>

        <div className="p-4 border border-red-500/30 rounded-md bg-red-500/10">
          <h4 className="font-medium mb-2">Delete Account</h4>
          <p className="text-sm text-gray-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
            <Trash2 size={16} className="mr-2" />
            Delete Account
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
