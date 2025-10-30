"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRoleContext } from "@/context/RoleContext"
import { activateRole, deactivateRole } from "@/utils/api/roles"
import { Loader2, Heart, Star, Sparkles, Briefcase, AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface RoleConfig {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  canDisable: boolean
}

const ROLE_CONFIGS: RoleConfig[] = [
  {
    id: "lover",
    name: "Movie Lover",
    description: "Watch, rate, and review movies. This is your default role.",
    icon: <Heart className="h-5 w-5 text-red-500" />,
    canDisable: false,
  },
  {
    id: "critic",
    name: "Critic",
    description: "Write professional film reviews and analysis.",
    icon: <Star className="h-5 w-5 text-yellow-500" />,
    canDisable: true,
  },
  {
    id: "talent",
    name: "Talent",
    description: "Showcase your portfolio and find opportunities in the film industry.",
    icon: <Sparkles className="h-5 w-5 text-purple-500" />,
    canDisable: true,
  },
  {
    id: "industry",
    name: "Industry Professional",
    description: "Connect with industry professionals, producers, and studios.",
    icon: <Briefcase className="h-5 w-5 text-blue-500" />,
    canDisable: true,
  },
]

export function RoleManagement() {
  const { availableRoles, refreshRoles } = useRoleContext()
  const { toast } = useToast()
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [roleToDeactivate, setRoleToDeactivate] = useState<string | null>(null)

  // Get enabled status for each role
  const getRoleEnabled = (roleId: string): boolean => {
    const role = availableRoles?.find((r) => r.role === roleId)
    return role?.enabled ?? false
  }

  const handleToggleRole = async (roleId: string, currentlyEnabled: boolean) => {
    // If trying to disable, show confirmation dialog
    if (currentlyEnabled) {
      setRoleToDeactivate(roleId)
      return
    }

    // If enabling, proceed directly
    await handleActivateRole(roleId)
  }

  const handleActivateRole = async (roleId: string) => {
    setLoading((prev) => ({ ...prev, [roleId]: true }))

    try {
      await activateRole(roleId)
      await refreshRoles()

      const roleConfig = ROLE_CONFIGS.find((r) => r.id === roleId)
      toast({
        title: "Role Activated",
        description: `${roleConfig?.name} role has been activated. You can now access ${roleConfig?.name} features.`,
      })
    } catch (error: any) {
      console.error("Error activating role:", error)
      toast({
        title: "Activation Failed",
        description: error.message || "Failed to activate role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, [roleId]: false }))
    }
  }

  const handleDeactivateRole = async () => {
    if (!roleToDeactivate) return

    setLoading((prev) => ({ ...prev, [roleToDeactivate]: true }))

    try {
      await deactivateRole(roleToDeactivate)
      await refreshRoles()

      const roleConfig = ROLE_CONFIGS.find((r) => r.id === roleToDeactivate)
      toast({
        title: "Role Deactivated",
        description: `${roleConfig?.name} role has been deactivated. Your data is preserved and you can re-enable it anytime.`,
      })
    } catch (error: any) {
      console.error("Error deactivating role:", error)
      toast({
        title: "Deactivation Failed",
        description: error.message || "Failed to deactivate role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, [roleToDeactivate]: false }))
      setRoleToDeactivate(null)
    }
  }

  return (
    <>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-100">Manage Your Roles</CardTitle>
          <CardDescription className="text-gray-400">
            Choose which roles you want to use. Only enabled roles will appear in your settings and navigation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {ROLE_CONFIGS.map((roleConfig) => {
            const isEnabled = getRoleEnabled(roleConfig.id)
            const isLoading = loading[roleConfig.id]

            return (
              <div
                key={roleConfig.id}
                className="flex items-start justify-between p-4 rounded-lg border border-gray-700 bg-gray-900/50"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">{roleConfig.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`role-${roleConfig.id}`} className="text-base font-semibold text-gray-100">
                        {roleConfig.name}
                      </Label>
                      {!roleConfig.canDisable && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{roleConfig.description}</p>
                    {!roleConfig.canDisable && (
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        This role cannot be disabled
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  ) : (
                    <Switch
                      id={`role-${roleConfig.id}`}
                      checked={isEnabled}
                      onCheckedChange={(checked) => handleToggleRole(roleConfig.id, isEnabled)}
                      disabled={!roleConfig.canDisable || isLoading}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  )}
                </div>
              </div>
            )
          })}

          <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-400">About Role Management</h4>
                <p className="text-sm text-gray-300 mt-1">
                  Enabling a role gives you access to role-specific features and settings. Disabling a role hides it
                  from your interface but preserves all your data. You can re-enable any role at any time.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deactivation Confirmation Dialog */}
      <AlertDialog open={!!roleToDeactivate} onOpenChange={(open) => !open && setRoleToDeactivate(null)}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-100">Deactivate Role?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to deactivate the{" "}
              <span className="font-semibold text-gray-300">
                {ROLE_CONFIGS.find((r) => r.id === roleToDeactivate)?.name}
              </span>{" "}
              role?
              <br />
              <br />
              Your data will be preserved and you can re-enable this role at any time. The role will be hidden from
              your settings and navigation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-gray-100 hover:bg-gray-600">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivateRole}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

