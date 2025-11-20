/**
 * API Configuration
 * 
 * Automatically detects the correct API URL based on the current environment:
 * - If accessing via localhost -> use http://localhost:8000
 * - If accessing via network IP -> use http://<network-ip>:8000
 * - Supports manual override via NEXT_PUBLIC_API_URL environment variable
 */

/**
 * Get the API base URL based on current hostname
 * This allows the app to work both on localhost and network access
 */
export function getApiUrl(): string {
  // Check for environment override first
  const envOverride = (typeof process !== 'undefined' && process.env && (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL)) || ''
  if (envOverride) {
    return envOverride.replace(/\/+$/, '')
  }



  // Client-side: derive from current hostname for local/LAN dev when no env set
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname
    // Fallback for LAN dev: assume backend on same host port 8000
    return `http://${hostname}:8000`
  }

  // Server-side fallback (SSR/build) when no override provided
  return process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
}

/**
 * API URL constant - use this throughout the app
 */
export const API_URL = getApiUrl();

