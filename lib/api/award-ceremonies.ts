/**
 * Award Ceremonies API Client
 *
 * Provides functions to fetch award ceremonies data from the backend API.
 * Supports filtering by country, language, and category type.
 * Implements caching to avoid repeated API calls.
 */

import { getApiUrl } from "@/lib/api-config"

const API_BASE = getApiUrl()

export interface AwardCeremony {
  id: number
  external_id: string
  name: string
  short_name: string | null
  description: string | null
  logo_url: string | null
  background_image_url: string | null
  current_year: number | null
  next_ceremony_date: string | null
  country: string | null
  language: string | null
  category_type: string | null
  prestige_level: string | null
  established_year: number | null
  is_active: boolean | null
  display_order: number | null
}

export interface AwardCeremoniesListResponse {
  ceremonies: AwardCeremony[]
  total: number
  limit: number
  offset: number
}

export interface AwardCeremoniesStatsResponse {
  total_ceremonies: number
  by_country: Record<string, number>
  by_language: Record<string, number>
  by_category_type: Record<string, number>
  by_prestige_level: Record<string, number>
}

export interface FetchAwardCeremoniesParams {
  country?: string
  language?: string
  category_type?: string
  prestige_level?: string
  is_active?: boolean
  limit?: number
  offset?: number
}

// In-memory cache for award ceremonies
let ceremoniesCache: AwardCeremony[] | null = null
let cacheTimestamp: number | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Fetch award ceremonies from the API with optional filtering
 */
export async function fetchAwardCeremonies(
  params: FetchAwardCeremoniesParams = {}
): Promise<AwardCeremoniesListResponse> {
  const queryParams = new URLSearchParams()
  
  if (params.country) queryParams.append("country", params.country)
  if (params.language) queryParams.append("language", params.language)
  if (params.category_type) queryParams.append("category_type", params.category_type)
  if (params.prestige_level) queryParams.append("prestige_level", params.prestige_level)
  if (params.is_active !== undefined) queryParams.append("is_active", String(params.is_active))
  if (params.limit) queryParams.append("limit", String(params.limit))
  if (params.offset) queryParams.append("offset", String(params.offset))

  const url = `${API_BASE}/api/v1/award-ceremonies?${queryParams.toString()}`
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch award ceremonies: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetch all award ceremonies with caching
 * This is useful for dropdowns and selectors where we want to load all ceremonies once
 */
export async function fetchAllAwardCeremonies(
  forceRefresh: boolean = false
): Promise<AwardCeremony[]> {
  const now = Date.now()
  
  // Return cached data if available and not expired
  if (
    !forceRefresh &&
    ceremoniesCache &&
    cacheTimestamp &&
    now - cacheTimestamp < CACHE_DURATION
  ) {
    return ceremoniesCache
  }

  // Fetch all ceremonies (limit=100 should be enough)
  const response = await fetchAwardCeremonies({ limit: 100, is_active: true })
  
  // Update cache
  ceremoniesCache = response.ceremonies
  cacheTimestamp = now
  
  return response.ceremonies
}

/**
 * Fetch award ceremonies statistics
 */
export async function fetchAwardCeremoniesStats(): Promise<AwardCeremoniesStatsResponse> {
  const url = `${API_BASE}/api/v1/award-ceremonies/stats`
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch award ceremonies stats: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetch a single award ceremony by external_id
 */
export async function fetchAwardCeremony(externalId: string): Promise<AwardCeremony> {
  const url = `${API_BASE}/api/v1/award-ceremonies/${externalId}`
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch award ceremony: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get unique countries from award ceremonies
 */
export function getUniqueCountries(ceremonies: AwardCeremony[]): string[] {
  const countries = new Set<string>()
  ceremonies.forEach((ceremony) => {
    if (ceremony.country) {
      countries.add(ceremony.country)
    }
  })
  return Array.from(countries).sort()
}

/**
 * Get unique languages from award ceremonies
 */
export function getUniqueLanguages(ceremonies: AwardCeremony[]): string[] {
  const languages = new Set<string>()
  ceremonies.forEach((ceremony) => {
    if (ceremony.language) {
      languages.add(ceremony.language)
    }
  })
  return Array.from(languages).sort()
}

/**
 * Get unique category types from award ceremonies
 */
export function getUniqueCategoryTypes(ceremonies: AwardCeremony[]): string[] {
  const types = new Set<string>()
  ceremonies.forEach((ceremony) => {
    if (ceremony.category_type) {
      types.add(ceremony.category_type)
    }
  })
  return Array.from(types).sort()
}

/**
 * Filter ceremonies by multiple criteria
 */
export function filterCeremonies(
  ceremonies: AwardCeremony[],
  filters: {
    country?: string
    language?: string
    category_type?: string
    search?: string
  }
): AwardCeremony[] {
  return ceremonies.filter((ceremony) => {
    // Country filter
    if (filters.country && filters.country !== "All" && ceremony.country !== filters.country) {
      return false
    }
    
    // Language filter
    if (filters.language && filters.language !== "All" && ceremony.language !== filters.language) {
      return false
    }
    
    // Category type filter
    if (filters.category_type && filters.category_type !== "All" && ceremony.category_type !== filters.category_type) {
      return false
    }
    
    // Search filter (name or short_name)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const nameMatch = ceremony.name.toLowerCase().includes(searchLower)
      const shortNameMatch = ceremony.short_name?.toLowerCase().includes(searchLower)
      if (!nameMatch && !shortNameMatch) {
        return false
      }
    }
    
    return true
  })
}

/**
 * Get prestige badge color based on prestige level
 */
export function getPrestigeBadgeColor(prestigeLevel: string | null): string {
  switch (prestigeLevel) {
    case "national":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20"
    case "international":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "state":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "industry":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20"
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }
}

/**
 * Get prestige badge label
 */
export function getPrestigeBadgeLabel(prestigeLevel: string | null): string {
  if (!prestigeLevel) return "Unknown"
  return prestigeLevel.charAt(0).toUpperCase() + prestigeLevel.slice(1)
}

/**
 * Clear the ceremonies cache (useful when data is updated)
 */
export function clearCeremoniesCache(): void {
  ceremoniesCache = null
  cacheTimestamp = null
}

