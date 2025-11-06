/**
 * Role Management API Client
 * Handles API calls for role-specific profile management
 */

import { getAccessToken } from "@/lib/auth"
import { getApiUrl } from "@/lib/api-config"

const API_BASE_URL = () => getApiUrl()

/**
 * Fetch role-specific profile data
 */
export async function getRoleProfile(roleType: string): Promise<any> {
  try {
    const token = getAccessToken()
    if (!token) {
      throw new Error("Not authenticated")
    }

    const response = await fetch(`${API_BASE_URL()}/api/v1/roles/${roleType}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || `Failed to fetch ${roleType} profile`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${roleType} profile:`, error)
    throw error
  }
}

/**
 * Update role-specific profile data
 */
export async function updateRoleProfile(roleType: string, data: any): Promise<any> {
  try {
    const token = getAccessToken()
    if (!token) {
      throw new Error("Not authenticated")
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/roles/${roleType}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || `Failed to update ${roleType} profile`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error updating ${roleType} profile:`, error)
    throw error
  }
}

/**
 * Get all user roles
 */
export async function getUserRoles(): Promise<any> {
  try {
    const token = getAccessToken()
    if (!token) {
      throw new Error("Not authenticated")
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/roles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || "Failed to fetch roles")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching roles:", error)
    throw error
  }
}

/**
 * Activate a role for the current user
 * @param roleType - The role type to activate (e.g., 'critic', 'talent', 'industry')
 * @param handle - Optional custom handle for the role
 * @returns Promise with activation response
 */
export async function activateRole(roleType: string, handle?: string): Promise<any> {
  try {
    const token = getAccessToken()
    if (!token) {
      throw new Error("Not authenticated")
    }

    const response = await fetch(`${API_BASE_URL()}/api/v1/roles/${roleType}/activate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ handle: handle || null }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || `Failed to activate ${roleType} role`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error activating ${roleType} role:`, error)
    throw error
  }
}

/**
 * Deactivate a role for the current user
 * @param roleType - The role type to deactivate (e.g., 'critic', 'talent', 'industry')
 * @returns Promise with deactivation response
 */
export async function deactivateRole(roleType: string): Promise<any> {
  try {
    const token = getAccessToken()
    if (!token) {
      throw new Error("Not authenticated")
    }

    const response = await fetch(`${API_BASE_URL()}/api/v1/roles/${roleType}/deactivate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || `Failed to deactivate ${roleType} role`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error deactivating ${roleType} role:`, error)
    throw error
  }
}

