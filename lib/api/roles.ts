/**
 * Role Management API Client
 * Handles role switching and role information retrieval
 */

import { getAuthHeaders } from "@/lib/api-client"
import type { RolesListResponse, ActiveRoleResponse, SetActiveRoleRequest, RoleType } from "@/packages/shared/types/roles"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

/**
 * Get all available roles for the current user
 */
export async function getUserRoles(): Promise<RolesListResponse> {
  const response = await fetch(`${API_BASE}/users/me/roles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch user roles: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get the current active role
 */
export async function getActiveRole(): Promise<ActiveRoleResponse> {
  const response = await fetch(`${API_BASE}/users/me/active-role`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch active role: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Set the active role for the current user
 */
export async function setActiveRole(role: RoleType): Promise<ActiveRoleResponse> {
  const response = await fetch(`${API_BASE}/users/me/active-role`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ role } as SetActiveRoleRequest),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `Failed to set active role: ${response.statusText}`)
  }

  return response.json()
}

