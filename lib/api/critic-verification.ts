/**
 * Critic Verification API Client
 * Handles critic verification application workflow
 */

import { apiGet, apiPost, apiPut } from "@/lib/api-client"

export interface PlatformLink {
  platform: string
  url: string
}

export interface CriticApplicationData {
  requested_username: string
  requested_display_name: string
  bio: string
  platform_links: PlatformLink[]
  sample_review_urls: string[]
  metrics?: Record<string, any>
  other_platforms?: Record<string, any>
}

export interface CriticApplicationResponse {
  id: number
  external_id: string
  user_id: number
  requested_username: string
  requested_display_name: string
  bio: string
  platform_links: PlatformLink[]
  sample_review_urls: string[]
  metrics?: Record<string, any>
  other_platforms?: Record<string, any>
  status: "pending" | "approved" | "rejected"
  admin_notes?: string
  rejection_reason?: string
  reviewed_by?: number
  reviewed_at?: string
  submitted_at: string
}

/**
 * Submit a critic verification application
 */
export async function submitCriticApplication(
  data: CriticApplicationData
): Promise<CriticApplicationResponse> {
  return apiPost<CriticApplicationResponse>("/api/v1/critic-verification", data)
}

/**
 * Get current user's critic application
 */
export async function getMyApplication(): Promise<CriticApplicationResponse> {
  return apiGet<CriticApplicationResponse>("/api/v1/critic-verification/my-application")
}

/**
 * Check if user has a pending or approved application
 */
export async function checkApplicationStatus(): Promise<{
  has_application: boolean
  status?: "pending" | "approved" | "rejected"
  application?: CriticApplicationResponse
}> {
  try {
    const application = await getMyApplication()
    return {
      has_application: true,
      status: application.status as any,
      application,
    }
  } catch (error: any) {
    if (error.message?.includes("404") || error.message?.includes("No application")) {
      return { has_application: false }
    }
    throw error
  }
}

/**
 * List all applications (admin only)
 */
export async function listApplications(
  statusFilter?: string,
  limit: number = 50,
  offset: number = 0
): Promise<CriticApplicationResponse[]> {
  const params = new URLSearchParams()
  if (statusFilter) params.append("status_filter", statusFilter)
  params.append("limit", limit.toString())
  params.append("offset", offset.toString())

  return apiGet<CriticApplicationResponse[]>(
    `/api/v1/critic-verification/admin/applications?${params.toString()}`
  )
}

/**
 * Approve a critic application (admin only)
 */
export async function approveCriticApplication(
  applicationId: number,
  adminNotes?: string
): Promise<CriticApplicationResponse> {
  return apiPut<CriticApplicationResponse>(
    `/api/v1/critic-verification/admin/applications/${applicationId}`,
    {
      status: "approved",
      admin_notes: adminNotes,
    }
  )
}

/**
 * Reject a critic application (admin only)
 */
export async function rejectCriticApplication(
  applicationId: number,
  rejectionReason: string,
  adminNotes?: string
): Promise<CriticApplicationResponse> {
  return apiPut<CriticApplicationResponse>(
    `/api/v1/critic-verification/admin/applications/${applicationId}`,
    {
      status: "rejected",
      rejection_reason: rejectionReason,
      admin_notes: adminNotes,
    }
  )
}

