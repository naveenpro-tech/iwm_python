"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  UserIcon as UserIconLucide,
  Mail,
  Calendar,
  Shield,
  Activity,
  Key,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Edit3,
  Save,
  X,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import {
  type User,
  type UserRole,
  type UserStatus,
  type VerificationStatus,
  ALL_USER_ROLES,
  ALL_USER_STATUSES,
  ALL_VERIFICATION_STATUSES,
} from "./types"
import { ConfirmationModal } from "@/components/shared/confirmation-modal"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

// Mock user data - in a real app, this would be fetched based on the userId
const mockUsersData: Record<string, User> = {
  USR001: {
    id: "USR001",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    roles: ["User"],
    status: "Active",
    joinedDate: "2023-05-12",
    lastLogin: "2024-05-28 10:15:00",
    profileType: "Regular",
    verificationStatus: "Unverified",
    accountType: "Standard",
    phoneNumber: "+91 98765 43210",
    location: "Mumbai, India",
  },
  USR005: {
    id: "USR005",
    name: "Arjun Kapoor",
    email: "arjun.kapoor@example.com",
    roles: ["User", "Talent", "Verified"],
    status: "Active",
    joinedDate: "2023-09-14",
    lastLogin: "2024-05-24 14:32:18",
    profileType: "Talent",
    verificationStatus: "Verified",
    accountType: "Standard",
    phoneNumber: "+91 98765 43210",
    location: "Mumbai, India",
  },
  USR009: {
    id: "USR009",
    name: "Sanjay Mehta",
    email: "sanjay.mehta@example.com",
    roles: ["User", "Admin"],
    status: "Active",
    joinedDate: "2024-01-15",
    lastLogin: "2024-05-29 09:00:00",
    profileType: "Regular",
    verificationStatus: "Verified",
    accountType: "Premium",
    phoneNumber: "+91 99887 76655",
    location: "Delhi, India",
  },
}

export function UserDetailView({ userId }: { userId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [initialUser, setInitialUser] = useState<User | null>(null) // To reset on cancel
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [confirmModalProps, setConfirmModalProps] = useState({ title: "", description: "", onConfirm: () => {} })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    // Simulate fetching user data
    setTimeout(() => {
      const fetchedUser = mockUsersData[userId] || mockUsersData["USR005"] // Fallback to a default mock
      if (fetchedUser) {
        setUser({ ...fetchedUser, roles: [...fetchedUser.roles] }) // Ensure roles array is a new instance for editing
        setInitialUser({ ...fetchedUser, roles: [...fetchedUser.roles] })
      } else {
        toast({
          title: "User not found",
          description: `User with ID ${userId} could not be loaded.`,
          variant: "destructive",
        })
        router.push("/admin/users") // Redirect if user not found
      }
      setIsLoading(false)
    }, 500)
  }, [userId, router, toast])

  const handleInputChange = (field: keyof User, value: any) => {
    setUser((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleRoleToggle = (role: UserRole) => {
    if (!user) return
    const newRoles = user.roles.includes(role) ? user.roles.filter((r) => r !== role) : [...user.roles, role]
    // Ensure 'User' role is always present if it's the only one being removed, or by policy
    if (newRoles.length === 0 && role === "User" && user.roles.includes("User")) {
      // Optionally prevent removing the last 'User' role or re-add it
      setUser((prev) => (prev ? { ...prev, roles: ["User"] } : null))
      toast({
        title: "Cannot remove 'User' role",
        description: "A user must have at least the 'User' role.",
        variant: "default",
      })
      return
    }
    setUser((prev) => (prev ? { ...prev, roles: newRoles } : null))
  }

  const handleSave = async () => {
    if (!user) return
    toast({ title: "Saving Changes...", description: "Please wait while we update the user details." })
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      // In a real app, you would send 'user' data to your backend
      setInitialUser({ ...user, roles: [...user.roles] }) // Update initial state to current saved state
      setIsEditing(false)
      toast({ title: "Changes Saved!", description: `${user.name}'s details have been updated successfully.` })
    } catch (error) {
      toast({
        title: "Error Saving Changes",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancelEdit = () => {
    if (initialUser) {
      setUser({ ...initialUser, roles: [...initialUser.roles] }) // Reset to initial state
    }
    setIsEditing(false)
  }

  const handleResetPassword = () => {
    if (!user) return
    setConfirmModalProps({
      title: "Reset Password",
      description: `Are you sure you want to send a password reset link to ${user.email}?`,
      onConfirm: async () => {
        setIsConfirmModalOpen(false)
        toast({ title: "Sending Reset Link...", description: "Please wait." })
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          toast({
            title: "Password Reset Link Sent!",
            description: `An email has been sent to ${user.email} with instructions.`,
          })
        } catch (error) {
          toast({
            title: "Error Sending Link",
            description: "Could not send reset link. Please try again.",
            variant: "destructive",
          })
        }
      },
    })
    setIsConfirmModalOpen(true)
  }

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-96">
        <Clock size={32} className="animate-spin text-primary" />
        <p className="ml-2">Loading user details...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="mb-4 pl-0 hover:bg-transparent hover:text-primary"
        onClick={() => router.back()}
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Users
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:col-span-1"
        >
          <Card className="overflow-hidden">
            <CardHeader className="text-center items-center bg-muted/30 p-6">
              <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/50 flex items-center justify-center mb-3 ring-2 ring-primary/30">
                <UserIconLucide size={40} className="text-primary" />
                {user.verificationStatus === "Verified" && (
                  <CheckCircle
                    size={20}
                    className="absolute bottom-0 right-0 text-green-500 bg-background rounded-full p-0.5"
                  />
                )}
              </div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-center flex-wrap gap-2">
                {user.roles.map((role) => {
                  let variant: "default" | "outline" | "secondary" | "destructive" = "secondary"
                  if (role === "Admin") variant = "destructive"
                  else if (role === "Moderator") variant = "default"
                  else if (role === "Verified") variant = "outline"
                  return (
                    <Badge key={role} variant={variant} className="text-xs">
                      {role}
                    </Badge>
                  )
                })}
              </div>

              <div className="pt-3 space-y-2 text-sm">
                <div className="flex items-center">
                  <Mail size={14} className="mr-2 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2 text-muted-foreground" />
                  <span>Joined {user.joinedDate}</span>
                </div>
                <div className="flex items-center">
                  <Activity size={14} className="mr-2 text-muted-foreground" />
                  <span>Last active {user.lastLogin || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <Shield size={14} className="mr-2 text-muted-foreground" />
                  <span>Status: </span>
                  <Badge
                    variant={user.status === "Active" ? "default" : "secondary"}
                    className={cn(
                      "ml-1 text-xs",
                      user.status === "Active" && "bg-green-500/20 text-green-700 dark:text-green-400",
                      user.status === "Suspended" && "bg-amber-500/20 text-amber-700 dark:text-amber-400",
                      user.status === "Inactive" && "bg-slate-500/20 text-slate-700 dark:text-slate-400",
                    )}
                  >
                    {user.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 border-t">
              <Button variant="outline" className="w-full" onClick={handleResetPassword}>
                <Key size={14} className="mr-2" /> Reset Password
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="md:col-span-2"
        >
          <Tabs defaultValue="details">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="details">User Details</TabsTrigger>
                <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
              </TabsList>
              {!isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit3 size={14} className="mr-2" /> Edit User
                </Button>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-2 mb-4 p-3 border rounded-md bg-muted/30">
                <Button variant="outline" onClick={handleCancelEdit} size="sm">
                  <X size={14} className="mr-2" /> Cancel
                </Button>
                <Button onClick={handleSave} size="sm">
                  <Save size={14} className="mr-2" /> Save Changes
                </Button>
              </div>
            )}

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>User's personal details and account information</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={user.name}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={user.phoneNumber || ""}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={user.location || ""}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="accountType">Account Type</Label>
                    <Select
                      disabled={!isEditing}
                      value={user.accountType}
                      onValueChange={(value) => handleInputChange("accountType", value)}
                    >
                      <SelectTrigger id="accountType">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="Professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="status">Account Status</Label>
                    <Select
                      disabled={!isEditing}
                      value={user.status}
                      onValueChange={(value: UserStatus) => handleInputChange("status", value)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_USER_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>User's profile type and verification status</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="profileType">Profile Type</Label>
                    <Select
                      disabled={!isEditing}
                      value={user.profileType}
                      onValueChange={(value) => handleInputChange("profileType", value)}
                    >
                      <SelectTrigger id="profileType">
                        <SelectValue placeholder="Select profile type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="Talent">Talent</SelectItem>
                        <SelectItem value="Industry Professional">Industry Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="verificationStatus">Verification Status</Label>
                    <Select
                      disabled={!isEditing}
                      value={user.verificationStatus}
                      onValueChange={(value: VerificationStatus) => handleInputChange("verificationStatus", value)}
                    >
                      <SelectTrigger id="verificationStatus">
                        <SelectValue placeholder="Select verification status" />
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_VERIFICATION_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roles">
              <Card>
                <CardHeader>
                  <CardTitle>Roles & Permissions</CardTitle>
                  <CardDescription>Manage user roles. Permissions are derived from roles.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-2 block font-medium">Assigned Roles</Label>
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map((role) => (
                        <Badge
                          key={role}
                          variant={role === "Admin" ? "destructive" : "secondary"}
                          className="px-3 py-1 text-sm flex items-center"
                        >
                          {role}
                          {isEditing &&
                            role !== "User" && ( // Prevent removing 'User' role directly if it's a base role
                              <button
                                className="ml-2 opacity-60 hover:opacity-100"
                                onClick={() => handleRoleToggle(role)}
                              >
                                <XCircle size={14} />
                              </button>
                            )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {isEditing && (
                    <div className="pt-4 border-t">
                      <Label className="mb-2 block font-medium">Modify Roles</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 border rounded-md">
                        {ALL_USER_ROLES.map((role) => (
                          <div key={role} className="flex items-center space-x-2">
                            <Checkbox
                              id={`role-detail-${role}`}
                              checked={user.roles.includes(role)}
                              onCheckedChange={() => handleRoleToggle(role)}
                              disabled={role === "User" && user.roles.includes("User") && user.roles.length === 1} // Example: prevent unchecking 'User' if it's the only role
                            />
                            <Label htmlFor={`role-detail-${role}`} className="font-normal text-sm">
                              {role}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="pt-4 border-t">
                    <Label className="mb-2 block font-medium">Permission Groups (Informational)</Label>
                    <div className="text-sm text-muted-foreground">
                      Permissions are automatically granted based on assigned roles. Specific permission configuration
                      might be available in a dedicated 'System Roles' section.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Recent user activity and system events (mock data)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { action: "User logged in", timestamp: "2024-05-24 14:32:18", ip: "103.25.xx.xx" },
                    { action: "Profile updated", timestamp: "2024-05-22 10:15:42", ip: "103.25.xx.xx" },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border"
                    >
                      <div className="p-2 rounded-full bg-primary/10 text-primary mt-0.5">
                        <Activity size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{activity.action}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                          <Calendar size={12} className="mr-1" />
                          {activity.timestamp}
                          <span className="mx-1.5">•</span>
                          <Key size={12} className="mr-1" />
                          IP: {activity.ip}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" disabled>
                    View Full Activity Log (Coming Soon)
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={confirmModalProps.title}
        description={confirmModalProps.description}
        onConfirm={confirmModalProps.onConfirm}
        confirmButtonVariant={confirmModalProps.title.toLowerCase().includes("delete") ? "destructive" : "default"}
      />
    </div>
  )
}
