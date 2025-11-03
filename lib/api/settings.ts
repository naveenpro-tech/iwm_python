/**
 * Settings API Client
 * Handles all user settings API calls
 */

import { getAuthHeaders } from "@/lib/api-client"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

// Type definitions
export interface ProfileSettings {
  username?: string
  fullName?: string
  bio?: string
  avatarUrl?: string
}

export interface AccountSettings {
  name?: string
  email?: string
  phone?: string
  avatar?: string
  bio?: string
  currentPassword?: string
  newPassword?: string
}

export interface DisplaySettings {
  theme?: "dark" | "light" | "auto"
  fontSize?: "small" | "medium" | "large"
  highContrastMode?: boolean
  reduceMotion?: boolean
}

export interface PrivacySettings {
  profileVisibility?: "public" | "followers" | "private"
  activitySharing?: boolean
  messageRequests?: "everyone" | "followers" | "none"
  dataDownloadRequested?: boolean
}

export interface Preferences {
  language?: string
  region?: string
  hideSpoilers?: boolean
  excludedGenres?: string[]
  contentRating?: string
}

/**
 * Get all user settings
 */
export async function getAllSettings() {
  try {
    const response = await fetch(`${API_BASE}/api/v1/settings/`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch settings: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching all settings:", error)
    throw error
  }
}

/**
 * Update all user settings
 */
export async function updateAllSettings(data: Record<string, any>) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/settings/`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to update settings: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error updating all settings:", error)
    throw error
  }
}

/**
 * Get profile settings
 */
export async function getProfileSettings() {
  try {
    const response = await fetch(`${API_BASE}/api/v1/settings/profile`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch profile settings: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching profile settings:", error)
    throw error
  }
}

/**
 * Update profile settings
 */
export async function updateProfileSettings(data: Record<string, any>) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/settings/profile`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to update profile settings: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error updating profile settings:", error)
    throw error
  }
}

/**
 * Get account settings
 */
export async function getAccountSettings() {
  try {
    const response = await fetch(`${API_BASE}/api/v1/settings/account`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch account settings: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching account settings:", error)
    throw error
  }
}

/**
 * Update account settings
 */
export async function updateAccountSettings(data: Record<string, any>) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/settings/account`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to update account settings: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error updating account settings:", error)
    throw error
  }
}

/**
 * Get preferences
 */
export async function getPreferences() {
  try {
    const response = await fetch(`${API_BASE}/api/v1/settings/preferences`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch preferences: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching preferences:", error)
    throw error
  }
}

/**
 * Update preferences
 */
export async function updatePreferences(data: Record<string, any>) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/settings/preferences`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to update preferences: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error updating preferences:", error)
    throw error
  }
}

/**
 * Get privacy settings
 */
export async function getPrivacySettings() {
  try {
    const response = await fetch(`${API_BASE}/api/v1/settings/privacy`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch privacy settings: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching privacy settings:", error)
    throw error
  }
}

/**
 * Update privacy settings
 */
export async function updatePrivacySettings(data: Record<string, any>) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/settings/privacy`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to update privacy settings: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error updating privacy settings:", error)
    throw error
  }
}

/**
 * Get display settings for the current user
 */
export async function getDisplaySettings(): Promise<DisplaySettings> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/settings/display`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch display settings: ${response.statusText}`)
    }

    const data = await response.json()
    return data.display || {}
  } catch (error) {
    console.error("Error fetching display settings:", error)
    throw error
  }
}

/**
 * Update display settings for the current user
 */
export async function updateDisplaySettings(settings: Partial<DisplaySettings>): Promise<DisplaySettings> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/settings/display`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to update display settings: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error updating display settings:", error)
    throw error
  }
}

