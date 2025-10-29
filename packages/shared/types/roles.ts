/**
 * Role-related TypeScript types
 * Matches backend models in apps/backend/src/models.py
 */

/**
 * Role type enum
 * Represents the different roles a user can have
 */
export type RoleType = "lover" | "critic" | "talent" | "industry" | "moderator"

/**
 * Profile visibility enum
 * Controls who can see a user's profile
 */
export type ProfileVisibility = "public" | "unlisted" | "private"

/**
 * User role profile
 * Represents a user's profile for a specific role
 */
export interface UserRoleProfile {
  id: number
  user_id: number
  role_type: RoleType
  enabled: boolean
  visibility: ProfileVisibility
  is_default: boolean
  handle: string
  created_at: string
  updated_at: string
}

/**
 * Talent profile
 * Extended profile for users with talent/actor role
 */
export interface TalentProfile {
  id: number
  user_id: number
  role_profile_id: number
  display_name: string
  bio: string
  profile_image_url?: string | null
  cover_image_url?: string | null
  years_active_start?: number | null
  years_active_end?: number | null
  height?: string | null
  ethnicity?: string | null
  skills?: string[]
  languages?: string[]
  union_affiliations?: string[]
  portfolio_url?: string | null
  reel_url?: string | null
  created_at: string
  updated_at: string
}

/**
 * Industry profile
 * Extended profile for users with industry (producer/director) role
 */
export interface IndustryProfile {
  id: number
  user_id: number
  role_profile_id: number
  display_name: string
  bio: string
  profile_image_url?: string | null
  cover_image_url?: string | null
  company_name?: string | null
  company_website?: string | null
  position?: string | null
  years_in_industry?: number | null
  specializations?: string[]
  notable_works?: string[]
  awards?: string[]
  portfolio_url?: string | null
  created_at: string
  updated_at: string
}

/**
 * Critic profile
 * Extended profile for users with critic role
 */
export interface CriticProfile {
  id: number
  user_id: number
  role_profile_id: number
  display_name: string
  bio: string
  profile_image_url?: string | null
  cover_image_url?: string | null
  verification_status: "unverified" | "pending" | "verified" | "rejected"
  verification_date?: string | null
  publication_name?: string | null
  publication_url?: string | null
  years_reviewing?: number | null
  specializations?: string[]
  notable_reviews?: string[]
  awards?: string[]
  portfolio_url?: string | null
  created_at: string
  updated_at: string
}

/**
 * Role profile response
 * Used in API responses for role profiles
 */
export interface RoleProfileResponse {
  id: number
  role_type: RoleType
  enabled: boolean
  visibility: ProfileVisibility
  is_default: boolean
  handle: string
  created_at: string
  updated_at: string
}

/**
 * Role profile list response
 * Used in API responses for listing role profiles
 */
export interface RoleProfileListResponse {
  roles: RoleProfileResponse[]
  total: number
}

/**
 * Update role profile request
 * Used in API requests to update role profile
 */
export interface UpdateRoleProfileRequest {
  enabled?: boolean
  visibility?: ProfileVisibility
  is_default?: boolean
  handle?: string
}

/**
 * Activate role request
 * Used in API requests to activate a role
 */
export interface ActivateRoleRequest {
  role_type: RoleType
  handle: string
  visibility?: ProfileVisibility
}

/**
 * Deactivate role request
 * Used in API requests to deactivate a role
 */
export interface DeactivateRoleRequest {
  role_type: RoleType
}

/**
 * All role profiles combined
 */
export interface AllRoleProfiles {
  user_roles: UserRoleProfile[]
  talent_profile?: TalentProfile | null
  industry_profile?: IndustryProfile | null
  critic_profile?: CriticProfile | null
}

/**
 * Role information with metadata (for role switcher)
 */
export interface RoleInfo {
  role: RoleType
  name: string
  description: string
  icon?: string | null
  is_active: boolean
}

/**
 * Response from GET /api/v1/users/me/roles
 */
export interface RolesListResponse {
  roles: RoleInfo[]
  active_role: RoleType | null
}

/**
 * Request body for POST /api/v1/users/me/active-role
 */
export interface SetActiveRoleRequest {
  role: RoleType
}

/**
 * Response from GET/POST /api/v1/users/me/active-role
 */
export interface ActiveRoleResponse {
  active_role: RoleType
  role_name: string
  role_description: string
  role_icon?: string | null
}

/**
 * Role context value
 */
export interface RoleContextValue {
  activeRole: RoleType | null
  availableRoles: RoleInfo[]
  isLoading: boolean
  error: string | null
  switchRole: (role: RoleType) => Promise<void>
  refreshRoles: () => Promise<void>
}
