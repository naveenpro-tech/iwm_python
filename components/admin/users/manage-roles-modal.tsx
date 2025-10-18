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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { type User, type UserRole, ALL_USER_ROLES } from "./types"
import { X } from "lucide-react"

interface ManageRolesModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onRolesUpdated: (userId: string, updatedRoles: UserRole[]) => void
}

export function ManageRolesModal({ isOpen, onClose, user, onRolesUpdated }: ManageRolesModalProps) {
  const { toast } = useToast()
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([])

  useEffect(() => {
    if (user && isOpen) {
      setSelectedRoles(user.roles)
    }
  }, [user, isOpen])

  if (!user) return null

  const handleRoleChange = (role: UserRole) => {
    setSelectedRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]))
  }

  const handleSubmit = async () => {
    // Simulate API call
    toast({
      title: "Updating Roles...",
      description: `Please wait while we update roles for ${user.name}.`,
    })
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
      onRolesUpdated(user.id, selectedRoles)
      toast({
        title: "Roles Updated Successfully!",
        description: `Roles for ${user.name} have been updated.`,
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error Updating Roles",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent asChild onEscapeKeyDown={onClose} className="sm:max-w-md bg-background">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle>Manage Roles for {user.name}</DialogTitle>
                <DialogDescription>Select the roles for this user. Current email: {user.email}</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <Label className="text-sm font-medium">Current Roles:</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedRoles.length > 0 ? (
                      selectedRoles.map((role) => (
                        <Badge key={role} variant="secondary" className="flex items-center">
                          {role}
                          <button
                            onClick={() => handleRoleChange(role)}
                            className="ml-1.5 opacity-75 hover:opacity-100"
                          >
                            <X size={12} />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No roles assigned.</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Available Roles:</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 p-2 border rounded-md max-h-60 overflow-y-auto">
                    {ALL_USER_ROLES.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={`manage-role-${role}`}
                          checked={selectedRoles.includes(role)}
                          onCheckedChange={() => handleRoleChange(role)}
                        />
                        <Label htmlFor={`manage-role-${role}`} className="font-normal text-sm">
                          {role}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Save Changes</Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
