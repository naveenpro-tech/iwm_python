/**
 * Authentication-related TypeScript types
 * Generated from backend Pydantic models in apps/backend/src/routers/auth.py
 */

/**
 * Basic user response from /api/v1/auth/me endpoint
 */
export interface MeResponse {
  id: string
  email: string
  name: string
  avatarUrl?: string | null
}

/**
 * Enhanced user response from /api/v1/auth/me/enhanced endpoint
 * Includes roles and profile presence information
 */
export interface AuthMeResponse {
  /** Internal database user ID */
  user_id: number

  /** External user identifier (email-based) */
  external_id: string

  /** User's email address */
  email: string

  /** Username derived from email prefix */
  username: string

  /** User's full name */
  name: string

  /** URL to user's avatar image */
  avatar_url?: string | null

  /** List of roles assigned to this user (e.g., ["User", "Critic", "Talent"]) */
  roles: string[]

  /** Whether user has an active CriticProfile */
  has_critic_profile: boolean

  /** Whether user has an active TalentProfile */
  has_talent_profile: boolean

  /** Whether user has an active IndustryProfile */
  has_industry_profile: boolean

  /** User's default role for profile display (from user_role_profiles) */
  default_role?: string | null
}

/**
 * Token response from /api/v1/auth/login and /api/v1/auth/signup endpoints
 */
export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

/**
 * Signup request body
 */
export interface SignupBody {
  email: string
  password: string
  name: string
}

/**
 * Login request body
 */
export interface LoginBody {
  email: string
  password: string
}

/**
 * Refresh token request body
 */
export interface RefreshBody {
  refresh_token: string
}

