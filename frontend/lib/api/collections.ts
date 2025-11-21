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

export interface CollectionUpdateData {
  title?: string
  description?: string
  isPublic?: boolean
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
 * Update a collection
 */
export async function updateCollection(collectionId: string, data: CollectionUpdateData) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/collections/${collectionId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to update collection: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error updating collection:", error)
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

/**
 * Import a collection (creates a copy for the current user)
 */
export async function importCollection(collectionId: string) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/collections/${collectionId}/import`, {
      method: "POST",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to import collection: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error importing collection:", error)
    throw error
  }
}

/**
 * Get all public collections
 */
export async function getPublicCollections(limit = 50) {
  try {
    const params = new URLSearchParams()
    params.set("isPublic", "true")
    params.set("limit", limit.toString())

    const response = await fetch(`${API_BASE}/api/v1/collections?${params.toString()}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to fetch public collections: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching public collections:", error)
    throw error
  }
}

/**
 * Get popular collections (sorted by followers/likes)
 */
export async function getPopularCollections(limit = 20) {
  try {
    const data = await getPublicCollections(limit)
    // Sort by followers count (most liked first)
    const items = Array.isArray(data) ? data : data?.items || []
    return items.sort((a: any, b: any) => (b.followers || 0) - (a.followers || 0))
  } catch (error) {
    console.error("Error fetching popular collections:", error)
    throw error
  }
}

/**
 * Get featured collections (top liked collections)
 */
export async function getFeaturedCollections(limit = 10) {
  try {
    const data = await getPublicCollections(limit)
    // For now, featured = most popular. Can be enhanced with admin curation later
    const items = Array.isArray(data) ? data : data?.items || []
    return items
      .sort((a: any, b: any) => (b.followers || 0) - (a.followers || 0))
      .slice(0, limit)
  } catch (error) {
    console.error("Error fetching featured collections:", error)
    throw error
  }
}
