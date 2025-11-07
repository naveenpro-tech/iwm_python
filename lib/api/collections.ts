/**
 * Collections API Client
 * Handles collection CRUD operations
 */

import { getAccessToken } from "@/lib/auth"
import { getApiUrl } from "@/lib/api-config"

const API_BASE = getApiUrl()

export interface CollectionCreateData {
  title: string
  description?: string
  isPublic: boolean
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
 * Create a new collection
 */
export async function createCollection(data: CollectionCreateData) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/collections`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to create collection: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error creating collection:", error)
    throw error
  }
}

/**
 * Add a movie to a collection
 */
export async function addMovieToCollection(collectionId: string, movieId: string) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/collections/${collectionId}/movies`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ movieId }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to add movie to collection: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error adding movie to collection:", error)
    throw error
  }
}

/**
 * Remove a movie from a collection
 */
export async function removeMovieFromCollection(collectionId: string, movieId: string) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/collections/${collectionId}/movies/${movieId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to remove movie from collection: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error removing movie from collection:", error)
    throw error
  }
}

/**
 * Get a single collection by ID
 */
export async function getCollection(collectionId: string) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/collections/${collectionId}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to fetch collection: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching collection:", error)
    throw error
  }
}

/**
 * Get user's collections
 */
export async function getUserCollections(userId?: string) {
  try {
    const params = new URLSearchParams()
    if (userId) params.set("userId", userId)

    const response = await fetch(`${API_BASE}/api/v1/collections?${params.toString()}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to fetch collections: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching collections:", error)
    throw error
  }
}

/**
 * Delete a collection
 */
export async function deleteCollection(collectionId: string) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/collections/${collectionId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to delete collection: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error deleting collection:", error)
    throw error
  }
}

/**
 * Like or unlike a collection (toggle)
 */
export async function likeCollection(collectionId: string) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/collections/${collectionId}/like`, {
      method: "POST",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to like collection: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error liking collection:", error)
    throw error
  }
}

