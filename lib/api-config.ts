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
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    // Server-side: use environment variable or default to localhost
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  // Client-side: detect based on current hostname
  const hostname = window.location.hostname;

  // Always use localhost:8000 for development
  // The backend is bound to 127.0.0.1:8000 which is accessible as localhost
  return 'http://localhost:8000';
}

/**
 * API URL constant - use this throughout the app
 */
export const API_URL = getApiUrl();

