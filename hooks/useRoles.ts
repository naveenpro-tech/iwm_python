/**
 * useRoles Hook
 * Manages user roles and role switching
 */

import { useState, useEffect, useCallback } from "react"
import { getUserRoles, setActiveRole } from "@/lib/api/roles"
import type { RoleInfo, RoleType } from "@/packages/shared/types/roles"

interface UseRolesReturn {
  roles: RoleInfo[]
  activeRole: RoleType | null
  isLoading: boolean
  error: string | null
  switchRole: (role: RoleType) => Promise<void>
  refreshRoles: () => Promise<void>
}

export function useRoles(): UseRolesReturn {
  const [roles, setRoles] = useState<RoleInfo[]>([])
  const [activeRole, setActiveRoleState] = useState<RoleType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch roles on mount
  useEffect(() => {
    refreshRoles()
  }, [])

  const refreshRoles = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check if user is authenticated before making API call
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token")
        if (!token) {
          // User not authenticated, skip API call
          setRoles([])
          setActiveRoleState(null)
          setIsLoading(false)
          return
        }
      }

      const data = await getUserRoles()
      console.log("useRoles - API response:", data)
      console.log("useRoles - roles array:", data.roles)
      console.log("useRoles - roles length:", data.roles?.length)
      setRoles(data.roles)
      setActiveRoleState(data.active_role)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch roles"
      setError(message)
      console.error("Error fetching roles:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const switchRole = useCallback(
    async (role: RoleType) => {
      try {
        setError(null)
        await setActiveRole(role)
        setActiveRoleState(role)
        // Update the active status in roles list
        setRoles((prevRoles) =>
          prevRoles.map((r) => ({
            ...r,
            is_active: r.role === role,
          }))
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to switch role"
        setError(message)
        console.error("Error switching role:", err)
        throw err
      }
    },
    []
  )

  return {
    roles,
    activeRole,
    isLoading,
    error,
    switchRole,
    refreshRoles,
  }
}

