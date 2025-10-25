export type Tokens = { access_token: string; refresh_token: string; token_type: string }
export type User = {
  id: string
  email: string
  name: string
  username?: string
  avatarUrl?: string | null
}

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL
const useBackend = process.env.NEXT_PUBLIC_ENABLE_BACKEND === "true" && !!apiBase

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

