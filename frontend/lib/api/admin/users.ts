/**
 * Admin Users API Client
 * API functions for admin user management
 */

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api-client"

// ============================================================================
// TYPES
// ============================================================================

export interface AdminUser {
  id: string
  name: string
  email: string
  roles: string[]
  status: string
  joinedDate: string
  lastLogin?: string
  profileType?: string
  verificationStatus?: string
  accountType?: string
  phoneNumber?: string
  location?: string
}

export interface ListUsersParams {
  search?: string
  role?: string
  status?: string
  page?: number
  limit?: number
}

export interface ListUsersResponse {
  users: AdminUser[]
  total: number
  page: number
  limit: number
}

export interface UserDetailsResponse extends AdminUser {
  bio?: string
  avatarUrl?: string
  bannerUrl?: string
  website?: string
  stats?: {
    reviews: number
    watchlist: number
    favorites: number
    collections: number
    following: number
    followers: number
  }
  activity?: {
    recentReviews: any[]
    recentPulses: any[]
    recentCollections: any[]
  }
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  roles?: string[]
  status?: string
  bio?: string
  location?: string
  phoneNumber?: string
}

export interface BulkUserActionRequest {
  userIds: string[]
  action: "activate" | "suspend" | "delete" | "assignRole" | "removeRole"
  role?: string
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * List all users with search, filter, and pagination
 */
export async function listUsers(params: ListUsersParams = {}): Promise<AdminUser[]> {
  const queryParams = new URLSearchParams()
  
  if (params.search) queryParams.append("search", params.search)
  if (params.role) queryParams.append("role", params.role)
  if (params.status) queryParams.append("status", params.status)
  if (params.page) queryParams.append("page", params.page.toString())
  if (params.limit) queryParams.append("limit", params.limit.toString())

  const url = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
  return apiGet<AdminUser[]>(url)
}

/**
 * Get user details by ID
 */
export async function getUserDetails(userId: string): Promise<UserDetailsResponse> {
  return apiGet<UserDetailsResponse>(`/admin/users/${userId}`)
}

/**
 * Update user information
 */
export async function updateUser(userId: string, data: UpdateUserRequest): Promise<AdminUser> {
  return apiPut<AdminUser>(`/admin/users/${userId}`, data)
}

/**
 * Delete user account
 */
export async function deleteUser(userId: string): Promise<void> {
  return apiDelete(`/admin/users/${userId}`)
}

/**
 * Suspend user account
 */
export async function suspendUser(userId: string, reason?: string): Promise<AdminUser> {
  return apiPost<AdminUser>(`/admin/users/${userId}/suspend`, { reason })
}

/**
 * Activate user account
 */
export async function activateUser(userId: string): Promise<AdminUser> {
  return apiPost<AdminUser>(`/admin/users/${userId}/activate`, {})
}

/**
 * Assign role to user
 */
export async function assignRole(userId: string, role: string): Promise<AdminUser> {
  return apiPost<AdminUser>(`/admin/users/${userId}/roles`, { role })
}

/**
 * Remove role from user
 */
export async function removeRole(userId: string, role: string): Promise<AdminUser> {
  return apiDelete(`/admin/users/${userId}/roles/${role}`)
}

/**
 * Reset user password (admin action)
 */
export async function resetUserPassword(userId: string): Promise<{ temporaryPassword: string }> {
  return apiPost<{ temporaryPassword: string }>(`/admin/users/${userId}/reset-password`, {})
}

/**
 * Get user activity (reviews, pulses, collections)
 */
export async function getUserActivity(userId: string): Promise<UserDetailsResponse["activity"]> {
  return apiGet<UserDetailsResponse["activity"]>(`/admin/users/${userId}/activity`)
}

/**
 * Get user login history
 */
export async function getUserLoginHistory(userId: string): Promise<any[]> {
  return apiGet<any[]>(`/admin/users/${userId}/login-history`)
}

/**
 * Bulk user actions
 */
export async function bulkUserAction(request: BulkUserActionRequest): Promise<{
  success: number
  failed: number
  errors: string[]
}> {
  return apiPost<{
    success: number
    failed: number
    errors: string[]
  }>(`/admin/users/bulk-action`, request)
}

/**
 * Send notification to user
 */
export async function sendUserNotification(
  userId: string,
  notification: {
    title: string
    message: string
    type?: "info" | "warning" | "success" | "error"
  }
): Promise<void> {
  return apiPost(`/admin/users/${userId}/notify`, notification)
}

/**
 * Export users to CSV
 */
export async function exportUsers(params: ListUsersParams = {}): Promise<Blob> {
  const queryParams = new URLSearchParams()
  
  if (params.search) queryParams.append("search", params.search)
  if (params.role) queryParams.append("role", params.role)
  if (params.status) queryParams.append("status", params.status)

  const url = `/admin/users/export${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
  
  // Note: This would need special handling for blob response
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
  
  if (!response.ok) {
    throw new Error("Failed to export users")
  }
  
  return response.blob()
}

