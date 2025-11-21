// Centralized type definitions for User Management
export type UserRole = "User" | "Talent" | "Industry Professional" | "Moderator" | "Admin" | "Verified"
export type UserStatus = "Active" | "Suspended" | "Inactive"
export type VerificationStatus = "Verified" | "Unverified" | "Pending" | "Rejected"

export interface User {
  id: string
  name: string
  email: string
  roles: UserRole[]
  status: UserStatus
  joinedDate: string // format YYYY-MM-DD
  lastLogin?: string // ISO string or formatted
  profileType?: "Regular" | "Talent" | "Industry Professional" // Example types
  verificationStatus?: VerificationStatus
  accountType?: string // e.g., Standard, Premium
  phoneNumber?: string
  location?: string
  // Password should not be part of the User object fetched from backend or stored in client state long-term
}

export const ALL_USER_ROLES: UserRole[] = ["User", "Talent", "Industry Professional", "Moderator", "Admin", "Verified"]
export const ALL_USER_STATUSES: UserStatus[] = ["Active", "Suspended", "Inactive"]
export const ALL_VERIFICATION_STATUSES: VerificationStatus[] = ["Verified", "Unverified", "Pending", "Rejected"]
