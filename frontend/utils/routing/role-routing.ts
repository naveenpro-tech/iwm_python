/**
 * Role-Based Profile Routing Utility
 * Determines the appropriate profile route based on the user's active role
 */

import type { RoleType } from "@/packages/shared/types/roles"

/**
 * Returns the appropriate profile route based on the user's active role
 * 
 * @param activeRole - The user's currently active role
 * @param username - The user's username (derived from email or user profile)
 * @returns Profile route path
 * 
 * @example
 * getProfileRouteForRole("critic", "john_doe") // Returns "/critic/john_doe"
 * getProfileRouteForRole("talent", "jane_smith") // Returns "/talent-hub/profile/me"
 * getProfileRouteForRole("lover", "user123") // Returns "/profile/user123"
 */
export function getProfileRouteForRole(
  activeRole: RoleType | string | null | undefined,
  username: string
): string {
  // Fallback to lover if activeRole is missing or invalid
  const role = (activeRole || "lover") as string

  switch (role) {
    case "critic":
      return `/critic/${username}`

    case "talent":
      // Talent hub uses "me" for the current user's profile
      return `/talent-hub/profile/me`

    case "industry":
      // TODO: Replace with `/industry/profile/me` when available
      // For now, redirect to people directory as placeholder
      return `/people`

    case "lover":
    default:
      return `/profile/${username}`
  }
}

/**
 * Get role display name for UI
 */
export function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    lover: "Movie Lover",
    critic: "Critic",
    talent: "Talent",
    industry: "Industry Pro",
    moderator: "Moderator",
    admin: "Admin",
  }
  return roleNames[role] || role
}

/**
 * Get role icon emoji
 */
export function getRoleIcon(role: string): string {
  const roleIcons: Record<string, string> = {
    lover: "❤️",
    critic: "⭐",
    talent: "🎭",
    industry: "💼",
    moderator: "🛡️",
    admin: "👑",
  }
  return roleIcons[role] || "👤"
}

/**
 * Get role color for UI
 */
export function getRoleColor(role: string): string {
  const roleColors: Record<string, string> = {
    lover: "text-red-500",
    critic: "text-yellow-500",
    talent: "text-purple-500",
    industry: "text-green-500",
    moderator: "text-blue-500",
    admin: "text-pink-500",
  }
  return roleColors[role] || "text-gray-500"
}

/**
 * Get role background color for UI
 */
export function getRoleBgColor(role: string): string {
  const roleBgColors: Record<string, string> = {
    lover: "bg-red-500/10",
    critic: "bg-yellow-500/10",
    talent: "bg-purple-500/10",
    industry: "bg-green-500/10",
    moderator: "bg-blue-500/10",
    admin: "bg-pink-500/10",
  }
  return roleBgColors[role] || "bg-gray-500/10"
}

