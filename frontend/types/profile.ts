/**
 * Profile Types
 * TypeScript interfaces for user profile, collections, watchlist, and favorites
 */

// ============================================================================
// USER DATA TYPES
// ============================================================================

export interface UserStats {
  reviews: number
  watchlist: number
  favorites: number
  collections: number
  following: number
  followers: number
}

export interface UserData {
  id: string
  username: string
  displayName: string
  bio: string
  avatarUrl: string
  coverUrl: string
  location: string
  memberSince: string
  isVerified: boolean
  stats: UserStats
}

// ============================================================================
// COLLECTION TYPES
// ============================================================================

export interface CollectionMovie {
  id: string
  title: string
  posterUrl: string
  year: string
  genres: string[]
  sidduScore?: number
  runtime?: string
  director?: string
}

export interface UserCollection {
  id: string
  title: string
  description: string
  coverImage: string // URL for single cover or generated collage
  movieCount: number
  isPublic: boolean
  createdAt: string
  updatedAt: string
  movies: CollectionMovie[]
  tags?: string[]
}

export interface CreateCollectionInput {
  title: string
  description: string
  isPublic: boolean
  movieIds?: string[]
}

export interface EditCollectionInput {
  id: string
  title: string
  description: string
  isPublic: boolean
}

// ============================================================================
// WATCHLIST TYPES
// ============================================================================

export type WatchlistPriority = "high" | "medium" | "low"
export type ReleaseStatus = "released" | "upcoming"

export interface WatchlistMovie {
  id: string
  title: string
  posterUrl: string
  year: string
  genres: string[]
  addedDate: string
  releaseStatus: ReleaseStatus
  sidduScore?: number
  priority?: WatchlistPriority
  notes?: string
  runtime?: string
  director?: string
}

export interface WatchlistFilters {
  search: string
  sortBy: "recent" | "title" | "release" | "score"
  releaseStatus: "all" | "released" | "upcoming"
  priority: "all" | "high" | "medium" | "low"
}

// ============================================================================
// FAVORITES TYPES
// ============================================================================

export interface FavoriteMovie {
  id: string
  title: string
  posterUrl: string
  year: string
  genres: string[]
  addedDate: string
  sidduScore?: number
  userRating: number // 1-5 stars
  reviewId?: string
  runtime?: string
  director?: string
}

export interface FavoritesFilters {
  search: string
  sortBy: "recent" | "title" | "rating" | "score" | "year"
  genre: string
}

// ============================================================================
// VIEW MODE TYPES
// ============================================================================

export type ViewMode = "grid" | "list"

// ============================================================================
// MODAL STATE TYPES
// ============================================================================

export interface CollectionModalState {
  isOpen: boolean
  mode: "create" | "edit" | "delete" | null
  collection?: UserCollection
}

export interface AddToCollectionModalState {
  isOpen: boolean
  movieId?: string
  movieTitle?: string
}

// ============================================================================
// QUICK ACTION TYPES
// ============================================================================

export interface QuickAction {
  id: string
  label: string
  icon: string
  color: string
  onClick: () => void
}

// ============================================================================
// PROFILE SECTION TYPES
// ============================================================================

export type ProfileSection = 
  | "overview" 
  | "reviews" 
  | "watchlist" 
  | "favorites" 
  | "collections"
  | "history" 
  | "settings"

// ============================================================================
// API RESPONSE TYPES (for future backend integration)
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// ============================================================================
// FORM VALIDATION TYPES
// ============================================================================

export interface ValidationError {
  field: string
  message: string
}

export interface FormState {
  isSubmitting: boolean
  errors: ValidationError[]
  isDirty: boolean
}

// ============================================================================
// COLLECTION FORM TYPES
// ============================================================================

export interface CollectionFormData {
  title: string
  description: string
  isPublic: boolean
  selectedMovies: CollectionMovie[]
}

export interface CollectionFormErrors {
  title?: string
  description?: string
  general?: string
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  UserStats,
  UserData,
  CollectionMovie,
  UserCollection,
  CreateCollectionInput,
  EditCollectionInput,
  WatchlistPriority,
  ReleaseStatus,
  WatchlistMovie,
  WatchlistFilters,
  FavoriteMovie,
  FavoritesFilters,
  ViewMode,
  CollectionModalState,
  AddToCollectionModalState,
  QuickAction,
  ProfileSection,
  ApiResponse,
  PaginatedResponse,
  ValidationError,
  FormState,
  CollectionFormData,
  CollectionFormErrors,
}

