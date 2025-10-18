export type Tokens = { access_token: string; refresh_token: string; token_type: string }
export type User = { id: string; email: string; name: string; avatarUrl?: string | null }

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
}

export function getAccessToken(): string | null {
  const s = storage()
  return s ? s.getItem("access_token") : null
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!useBackend || !apiBase) throw new Error("Backend not enabled")
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  const token = getAccessToken()
  if (token) headers["Authorization"] = `Bearer ${token}`
  const res = await fetch(`${apiBase}/api/v1${path}`, { ...init, headers })
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
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

