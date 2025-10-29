/**
 * Role Context
 * Provides role state and switching functionality throughout the app
 */

"use client"

import React, { createContext, useContext, ReactNode } from "react"
import { useRoles } from "@/hooks/useRoles"
import type { RoleContextValue, RoleInfo, RoleType } from "@/packages/shared/types/roles"

const RoleContext = createContext<RoleContextValue | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const { roles, activeRole, isLoading, error, switchRole, refreshRoles } = useRoles()

  const value: RoleContextValue = {
    activeRole,
    availableRoles: roles,
    isLoading,
    error,
    switchRole,
    refreshRoles,
  }

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRoleContext(): RoleContextValue {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRoleContext must be used within a RoleProvider")
  }
  return context
}

/**
 * Hook to get only the active role
 */
export function useActiveRole(): RoleType | null {
  const { activeRole } = useRoleContext()
  return activeRole
}

/**
 * Hook to get available roles
 */
export function useAvailableRoles(): RoleInfo[] {
  const { availableRoles } = useRoleContext()
  return availableRoles
}

/**
 * Hook to switch roles
 */
export function useSwitchRole(): (role: RoleType) => Promise<void> {
  const { switchRole } = useRoleContext()
  return switchRole
}

