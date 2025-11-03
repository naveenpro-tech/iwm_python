/**
 * Zod validation schemas for settings
 * Used for form validation in both /settings page and profile settings tab
 */

import * as z from "zod"

/**
 * Profile settings schema
 * Validates profile information (avatar, name, bio, etc.)
 */
export const ProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
    .optional()
    .or(z.literal("")),
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(160, "Bio must be at most 160 characters")
    .optional()
    .or(z.literal("")),
  avatarUrl: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
})

export type ProfileFormData = z.infer<typeof ProfileSchema>

/**
 * Account settings schema
 * Validates account information (email, phone, etc.)
 */
export const AccountSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters")
    .optional(),
  email: z
    .string()
    .email("Invalid email address")
    .optional(),
  phone: z
    .string()
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
})

export type AccountFormData = z.infer<typeof AccountSchema>

/**
 * Password change schema
 * Validates password change fields
 */
export const PasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type PasswordFormData = z.infer<typeof PasswordSchema>

/**
 * Privacy settings schema
 * Validates privacy preferences
 */
export const PrivacySchema = z.object({
  profileVisibility: z
    .enum(["public", "unlisted", "private"])
    .optional(),
  activitySharing: z
    .boolean()
    .optional(),
  messageRequests: z
    .boolean()
    .optional(),
  dataDownloadRequested: z
    .boolean()
    .optional(),
})

export type PrivacyFormData = z.infer<typeof PrivacySchema>

/**
 * Display settings schema
 * Validates display preferences
 */
export const DisplaySchema = z.object({
  theme: z
    .enum(["light", "dark", "system"])
    .optional(),
  fontSize: z
    .enum(["small", "medium", "large"])
    .optional(),
  highContrastMode: z
    .boolean()
    .optional(),
  reduceMotion: z
    .boolean()
    .optional(),
})

export type DisplayFormData = z.infer<typeof DisplaySchema>

/**
 * Preferences settings schema
 * Validates content preferences
 */
export const PreferencesSchema = z.object({
  language: z
    .string()
    .optional(),
  region: z
    .string()
    .optional(),
  hideSpoilers: z
    .boolean()
    .optional(),
  excludedGenres: z
    .array(z.string())
    .optional(),
  contentRating: z
    .string()
    .optional(),
})

export type PreferencesFormData = z.infer<typeof PreferencesSchema>

/**
 * Notification channel schema
 * Validates notification settings for a channel
 */
export const NotificationChannelSchema = z.object({
  inApp: z.boolean().optional(),
  email: z.boolean().optional(),
  push: z.boolean().optional(),
})

/**
 * Notification global settings schema
 * Validates global notification settings
 */
export const NotificationGlobalSchema = z.object({
  emailFrequency: z
    .enum(["daily", "weekly", "monthly", "never"])
    .optional(),
  pushEnabled: z.boolean().optional(),
  emailEnabled: z.boolean().optional(),
  inAppEnabled: z.boolean().optional(),
  dndEnabled: z.boolean().optional(),
  dndStartTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)")
    .optional(),
  dndEndTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)")
    .optional(),
  notificationVolume: z
    .number()
    .min(0, "Volume must be at least 0")
    .max(100, "Volume must be at most 100")
    .optional(),
})

/**
 * Notification preferences schema
 * Validates all notification settings
 */
export const NotificationPrefsSchema = z.object({
  channels: z
    .object({
      social: NotificationChannelSchema.optional(),
      releases: NotificationChannelSchema.optional(),
      system: NotificationChannelSchema.optional(),
      clubs: NotificationChannelSchema.optional(),
      quizzes: NotificationChannelSchema.optional(),
      messages: NotificationChannelSchema.optional(),
      events: NotificationChannelSchema.optional(),
    })
    .optional(),
  global: NotificationGlobalSchema.optional(),
})

export type NotificationPrefsFormData = z.infer<typeof NotificationPrefsSchema>

