// Centralized type definitions and constants

export const ALL_GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Sport",
  "Thriller",
  "War",
  "Western",
  "TV Movie",
] as const
export type MovieGenre = (typeof ALL_GENRES)[number]

export const ALL_LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Japanese",
  "Korean",
  "Hindi",
  "Mandarin",
  "Cantonese",
  "Italian",
  "Russian",
  "Tamil",
  "Telugu",
] as const
export type MovieLanguage = (typeof ALL_LANGUAGES)[number]

export const ALL_STATUSES = ["upcoming", "released", "archived", "draft", "in-production", "post-production"] as const
export type MovieStatus = (typeof ALL_STATUSES)[number]

export const ALL_CERTIFICATIONS = [
  "G",
  "PG",
  "PG-13",
  "R",
  "NC-17",
  "Unrated",
  "TV-MA",
  "TV-14",
  "TV-PG",
  "TV-G",
  "U",
  "U/A",
  "A",
  "S",
] as const
export type MovieCertification = (typeof ALL_CERTIFICATIONS)[number]

export interface IdNamePair {
  id: string
  name: string
}

export interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
}

// Add any other shared types or constants here
