/**
 * Pulses API Client
 * Handles pulse creation and deletion
 */

import { getAccessToken } from "@/lib/auth"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export interface PulseCreateData {
  contentText: string
  contentMedia?: string[]
  linkedMovieId?: string
  hashtags?: string[]
}

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }
  const token = getAccessToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  return headers
}

/**
 * Create a new pulse
 */
export async function createPulse(data: PulseCreateData) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/pulse`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to create pulse: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error creating pulse:", error)
    throw error
  }
}

/**
 * Delete a pulse
 */
export async function deletePulse(pulseId: string) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/pulse/${pulseId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to delete pulse: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error deleting pulse:", error)
    throw error
  }
}

