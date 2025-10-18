"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { type User, type UserRole, ALL_USER_ROLES } from "./types"
import { Mail, UserIcon, Key } from "lucide-react"

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onUserAdded: (newUser: User) => void
}

export function AddUserModal({ isOpen, onClose, onUserAdded }: AddUserModalProps) {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(["User"])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      // Reset form on open
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setSelectedRoles(["User"])
      setErrors({})
    }
  }, [isOpen])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = "Name is required."
    if (!email.trim()) {
      newErrors.email = "Email is required."
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid."
    }
    if (!password) {
      newErrors.password = "Password is required."
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters."
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match."
    }
    if (selectedRoles.length === 0) {
      newErrors.roles = "At least one role must be selected."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    // Simulate API call
    toast({
      title: "Adding User...",
      description: "Please wait while we create the new user account.",
    })

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
      const newUser: User = {
        id: `USR${Math.floor(Math.random() * 900) + 100}`, // Generate a mock ID
        name,
        email,
        roles: selectedRoles,
        status: "Active", // Default status
        joinedDate: new Date().toISOString().split("T")[0], // Today's date
      }
      onUserAdded(newUser)
      toast({
        title: "User Added Successfully!",
        description: `${name} has been added to the system.`,
        variant: "default",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error Adding User",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRoleChange = (role: UserRole) => {
    setSelectedRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent asChild onEscapeKeyDown={onClose} className="sm:max-w-lg bg-background">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account and assign initial roles.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Siddu P."
                      className="pl-10"
                    />
                  </div>
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="pl-10"
                    />
                  </div>
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10"
                      />
                    </div>
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10"
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Roles</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 border rounded-md">
                    {ALL_USER_ROLES.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={`role-${role}`}
                          checked={selectedRoles.includes(role)}
                          onCheckedChange={() => handleRoleChange(role)}
                        />
                        <Label htmlFor={`role-${role}`} className="font-normal text-sm">
                          {role}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.roles && <p className="text-sm text-destructive">{errors.roles}</p>}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Save User</Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
