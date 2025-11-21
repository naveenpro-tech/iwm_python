/**
 * Settings-related TypeScript types
 * Matches backend Pydantic models in apps/backend/src/models.py
 */

/**
 * Profile settings section
 * Contains user profile information (avatar, name, bio, etc.)
 */
export interface ProfileSettings {
  username?: string
  fullName?: string
  bio?: string
  avatarUrl?: string | null
}

/**
 * Account settings section
 * Contains account information (email, phone, etc.)
 */
export interface AccountSettings {
  name?: string
  email?: string
  phone?: string | null
}

/**
 * Privacy settings section
 * Controls profile visibility and data sharing
 */
export interface PrivacySettings {
  profileVisibility?: "public" | "unlisted" | "private"
  activitySharing?: boolean
  messageRequests?: boolean
  dataDownloadRequested?: boolean
}

/**
 * Display settings section
 * Controls UI appearance and accessibility
 */
export interface DisplaySettings {
  theme?: "light" | "dark" | "system"
  fontSize?: "small" | "medium" | "large"
  highContrastMode?: boolean
  reduceMotion?: boolean
}

/**
 * Preferences settings section
 * User content preferences and filters
 */
export interface PreferencesSettings {
  language?: string
  region?: string
  hideSpoilers?: boolean
  excludedGenres?: string[]
  contentRating?: string
}

/**
 * Notification channel settings
 * Controls notification delivery for a specific channel
 */
export interface NotificationChannel {
  inApp?: boolean
  email?: boolean
  push?: boolean
}

/**
 * Global notification settings
 * Controls overall notification behavior
 */
export interface NotificationGlobalSettings {
  emailFrequency?: "daily" | "weekly" | "monthly" | "never"
  pushEnabled?: boolean
  emailEnabled?: boolean
  inAppEnabled?: boolean
  dndEnabled?: boolean
  dndStartTime?: string
  dndEndTime?: string
  notificationVolume?: number
}

/**
 * Notification preferences
 * Contains channel-specific and global notification settings
 */
export interface NotificationPreferences {
  channels?: {
    social?: NotificationChannel
    releases?: NotificationChannel
    system?: NotificationChannel
    clubs?: NotificationChannel
    quizzes?: NotificationChannel
    messages?: NotificationChannel
    events?: NotificationChannel
  }
  global?: NotificationGlobalSettings
}

/**
 * All settings sections combined
 */
export interface AllSettings {
  profile?: ProfileSettings
  account?: AccountSettings
  privacy?: PrivacySettings
  display?: DisplaySettings
  preferences?: PreferencesSettings
  notifications?: NotificationPreferences
}

/**
 * API response for getting settings
 */
export interface GetSettingsResponse {
  profile: ProfileSettings
  account: AccountSettings
  privacy: PrivacySettings
  display: DisplaySettings
  preferences: PreferencesSettings
  notifications: NotificationPreferences
}

/**
 * API request for updating settings
 */
export interface UpdateSettingsRequest {
  profile?: ProfileSettings
  account?: AccountSettings
  privacy?: PrivacySettings
  display?: DisplaySettings
  preferences?: PreferencesSettings
  notifications?: NotificationPreferences
}

/**
 * API response for updating settings
 */
export interface UpdateSettingsResponse {
  success: boolean
  message?: string
  data?: AllSettings
}

