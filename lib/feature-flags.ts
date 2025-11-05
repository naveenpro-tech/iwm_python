/**
 * Feature Flags Utilities
 * 
 * Provides utilities for working with feature flags throughout the application.
 */

import { MobileMenuItem } from "@/components/navigation/mobile-menu-items"

/**
 * Feature key mapping for navigation items
 * Maps menu item IDs to their corresponding feature flag keys
 */
export const FEATURE_KEY_MAP: Record<string, string> = {
  // Core Navigation
  home: "home",
  explore: "explore",
  movies: "movies",
  search: "search",
  
  // Content Features
  "visual-treats": "visual_treats",
  cricket: "cricket",
  "scene-explorer": "scene_explorer",
  awards: "awards",
  festivals: "festivals",
  "box-office": "box_office",
  people: "people",
  
  // Community Features
  pulse: "pulse",
  "talent-hub": "talent_hub",
  industry: "industry_hub",
  
  // Personal Features
  profile: "profile",
  watchlist: "watchlist",
  favorites: "favorites",
  collections: "collections",
  notifications: "notifications",
  
  // Critic Features
  critics: "critics_directory",
  
  // Support Features
  settings: "settings_profile", // Settings page itself
  help: "help_center",
}

/**
 * Filter menu items based on feature flags
 * 
 * @param items - Array of menu items to filter
 * @param flags - Feature flags object
 * @returns Filtered array of menu items
 */
export function filterMenuItemsByFlags(
  items: MobileMenuItem[],
  flags: Record<string, boolean>
): MobileMenuItem[] {
  return items.filter((item) => {
    const featureKey = FEATURE_KEY_MAP[item.id]
    
    // If no feature key mapping exists, show the item by default
    if (!featureKey) {
      return true
    }
    
    // Check if the feature is enabled
    return flags[featureKey] === true
  })
}

/**
 * Check if a feature is enabled
 * 
 * @param featureKey - The feature key to check
 * @param flags - Feature flags object
 * @returns Whether the feature is enabled
 */
export function isFeatureEnabled(
  featureKey: string,
  flags: Record<string, boolean>
): boolean {
  return flags[featureKey] === true
}

/**
 * Get feature key for a route path
 * 
 * @param path - The route path (e.g., "/movies", "/pulse")
 * @returns The feature key or null if not found
 */
export function getFeatureKeyForPath(path: string): string | null {
  // Remove leading slash and get the first segment
  const segment = path.replace(/^\//, "").split("/")[0]
  
  // Map common paths to feature keys
  const pathMap: Record<string, string> = {
    "": "home",
    movies: "movies",
    explore: "explore",
    search: "search",
    "visual-treats": "visual_treats",
    cricket: "cricket",
    "scene-explorer": "scene_explorer",
    awards: "awards",
    festivals: "festivals",
    "box-office": "box_office",
    people: "people",
    pulse: "pulse",
    "talent-hub": "talent_hub",
    industry: "industry_hub",
    profile: "profile",
    watchlist: "watchlist",
    favorites: "favorites",
    collections: "collections",
    notifications: "notifications",
    critics: "critics_directory",
    settings: "settings_profile",
    help: "help_center",
  }
  
  return pathMap[segment] || null
}

/**
 * Filter navigation links based on feature flags
 * 
 * @param links - Array of navigation links
 * @param flags - Feature flags object
 * @returns Filtered array of navigation links
 */
export function filterNavLinksByFlags<T extends { href: string }>(
  links: T[],
  flags: Record<string, boolean>
): T[] {
  return links.filter((link) => {
    const featureKey = getFeatureKeyForPath(link.href)
    
    // If no feature key found, show the link by default
    if (!featureKey) {
      return true
    }
    
    // Check if the feature is enabled
    return flags[featureKey] === true
  })
}

