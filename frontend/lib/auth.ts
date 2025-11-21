export type Tokens = { access_token: string; refresh_token: string; token_type: string }
export type User = {
  id: string
  email: string
  name: string
  username?: string
  avatarUrl?: string | null
}

import { getApiUrl } from "@/lib/api-config"

function getApiBase(): string {
  // Delegate to centralized resolver which handles env and localhost/LAN logic
  return getApiUrl()
}

function getUseBackend(): boolean {
  // Always enable backend if we have an API URL
  // This fixes the issue where the env var wasn't being picked up
  return !!getApiBase()
}

function storage() {
  if (typeof window === "undefined") return null
  return window.localStorage
}

export function storeTokens(t: Tokens) {
  const s = storage()
  if (!s) return
  s.setItem("access_token", t.access_token)
  s.setItem("refresh_token", t.refresh_token)

  // Also store in cookies for middleware
  if (typeof document !== "undefined") {
    // Set access token cookie (expires in 30 minutes)
    document.cookie = `access_token=${t.access_token}; path=/; max-age=1800; SameSite=Lax`
    // Set refresh token cookie (expires in 7 days)
    document.cookie = `refresh_token=${t.refresh_token}; path=/; max-age=604800; SameSite=Lax`
  }
}

export function getAccessToken(): string | null {
  const s = storage()
  return s ? s.getItem("access_token") : null
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAccessToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  return headers
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const apiBase = getApiBase()
  const useBackend = getUseBackend()
  if (!useBackend || !apiBase) throw new Error("Backend not enabled")
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  const token = getAccessToken()
  if (token) headers["Authorization"] = `Bearer ${token}`
  const res = await fetch(`${apiBase}/api/v1${path}`, { ...init, headers, cache: "no-store" })
  if (!res.ok) {
    // Try to get error message from response
    let errorMessage = `Request failed: ${res.status}`
    try {
      const errorData = await res.json()
      if (errorData.detail) {
        errorMessage = errorData.detail
      }
    } catch {
      // If JSON parsing fails, use status text
      errorMessage = res.statusText || errorMessage
    }
    throw new Error(errorMessage)
  }
  return (await res.json()) as T
}

export async function signup(email: string, password: string, name: string): Promise<Tokens> {
  const tokens = await request<Tokens>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  })
  storeTokens(tokens)
  return tokens
}

export async function login(email: string, password: string): Promise<Tokens> {
  const tokens = await request<Tokens>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
  storeTokens(tokens)
  return tokens
}

export async function me(): Promise<User> {
  return await request<User>("/auth/me")
}

/**
 * Get the current authenticated user
 * Alias for me() function for consistency with other API clients
 */
export async function getCurrentUser(): Promise<User> {
  return await me()
}

export function logout() {
  const s = storage()
  if (!s) return
  s.removeItem("access_token")
  s.removeItem("refresh_token")

  // Also remove cookies
  if (typeof document !== "undefined") {
    document.cookie = "access_token=; path=/; max-age=0"
    document.cookie = "refresh_token=; path=/; max-age=0"
  }
}

export function isAuthenticated(): boolean {
  return !!getAccessToken()
}

/**
 * Check if current user has admin role
 * This checks the JWT token for admin role in role_profiles
 */
export function hasAdminRole(): boolean {
  if (typeof window === "undefined") return false

  const token = getAccessToken()
  if (!token) return false

  try {
    // Import jwtDecode dynamically to avoid SSR issues
    const { jwtDecode } = require("jwt-decode")
    const decoded = jwtDecode<any>(token)

    // Check if user has admin role in their role_profiles
    return decoded?.role_profiles?.some(
      (role: any) => role.role_type === "admin" && role.enabled
    ) ?? false
  } catch {
    return false
  }
}

