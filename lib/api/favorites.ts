/**
 * Favorites API Client
 * Handles adding and removing favorites
 */

import { getAccessToken } from "@/lib/auth"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export interface FavoriteCreateData {
  type: "movie" | "person" | "scene"
  movieId?: string
  personId?: string
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
 * Add an item to favorites
 */
export async function addToFavorites(data: FavoriteCreateData) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/favorites`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to add to favorites: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error adding to favorites:", error)
    throw error
  }
}

/**
 * Remove an item from favorites
 */
export async function removeFromFavorites(favoriteId: string) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/favorites/${favoriteId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to remove from favorites: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error removing from favorites:", error)
    throw error
  }
}

/**
 * Get all favorites for the current user
 */
export async function getFavorites(
  page: number = 1,
  limit: number = 20,
  type: string = "movie"
) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (type && type !== "all") {
      params.append("type", type)
    }

    const response = await fetch(`${API_BASE}/api/v1/favorites?${params}`, {
      method: "GET",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to fetch favorites: ${response.statusText}`)
    }

    const data = await response.json()
    // API returns a list directly, not an object with items
    return Array.isArray(data) ? data : (data.items || [])
  } catch (error) {
    console.error("Error fetching favorites:", error)
    throw error
  }
}

/**
 * Get a single favorite by ID
 */
export async function getFavoriteById(favoriteId: string) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/favorites/${favoriteId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to fetch favorite: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching favorite:", error)
    throw error
  }
}
