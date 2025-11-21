import type { Movie } from "@/components/admin/movies/types"
import { ALL_GENRES, ALL_STATUSES } from "@/components/admin/movies/types"
import { ALL_CERTIFICATIONS } from "@/components/types"

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

/**
 * Validate imported movie JSON data
 */
export function validateMovieJSON(data: any): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // Check if data is an object
  if (!data || typeof data !== "object") {
    return {
      isValid: false,
      errors: [{ field: "root", message: "Invalid JSON: Expected an object" }],
      warnings: [],
    }
  }

  // ===== REQUIRED FIELDS =====
  if (!data.title || typeof data.title !== "string" || data.title.trim() === "") {
    errors.push({ field: "title", message: "Title is required and must be a non-empty string" })
  }

  if (!data.status || !ALL_STATUSES.includes(data.status)) {
    errors.push({
      field: "status",
      message: `Status must be one of: ${ALL_STATUSES.join(", ")}`,
    })
  }

  // ===== BASIC INFO VALIDATION =====
  if (data.originalTitle !== undefined && typeof data.originalTitle !== "string") {
    errors.push({ field: "originalTitle", message: "Original title must be a string" })
  }

  if (data.synopsis !== undefined && typeof data.synopsis !== "string") {
    errors.push({ field: "synopsis", message: "Synopsis must be a string" })
  }

  if (data.releaseDate !== undefined) {
    if (typeof data.releaseDate !== "string") {
      errors.push({ field: "releaseDate", message: "Release date must be a string in YYYY-MM-DD format" })
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.releaseDate)) {
      errors.push({ field: "releaseDate", message: "Release date must be in YYYY-MM-DD format" })
    }
  }

  if (data.runtime !== undefined) {
    if (typeof data.runtime !== "number" || data.runtime < 0) {
      errors.push({ field: "runtime", message: "Runtime must be a positive number (minutes)" })
    }
  }

  if (data.sidduScore !== undefined) {
    if (typeof data.sidduScore !== "number" || data.sidduScore < 0 || data.sidduScore > 10) {
      errors.push({ field: "sidduScore", message: "SidduScore must be a number between 0 and 10" })
    }
  }

  // Genres validation
  if (data.genres !== undefined) {
    if (!Array.isArray(data.genres)) {
      errors.push({ field: "genres", message: "Genres must be an array" })
    } else {
      const invalidGenres = data.genres.filter((g: any) => !ALL_GENRES.includes(g))
      if (invalidGenres.length > 0) {
        errors.push({
          field: "genres",
          message: `Invalid genres: ${invalidGenres.join(", ")}. Must be one of: ${ALL_GENRES.join(", ")}`,
        })
      }
    }
  }

  // Languages validation
  if (data.languages !== undefined && !Array.isArray(data.languages)) {
    errors.push({ field: "languages", message: "Languages must be an array" })
  }

  // Certification validation
  if (data.certification !== undefined && !ALL_CERTIFICATIONS.includes(data.certification)) {
    errors.push({
      field: "certification",
      message: `Certification must be one of: ${ALL_CERTIFICATIONS.join(", ")}`,
    })
  }

  // ===== MEDIA VALIDATION =====
  if (data.poster !== undefined && typeof data.poster !== "string") {
    errors.push({ field: "poster", message: "Poster must be a string (URL)" })
  }

  if (data.backdrop !== undefined && typeof data.backdrop !== "string") {
    errors.push({ field: "backdrop", message: "Backdrop must be a string (URL)" })
  }

  if (data.galleryImages !== undefined) {
    if (!Array.isArray(data.galleryImages)) {
      errors.push({ field: "galleryImages", message: "Gallery images must be an array" })
    } else if (!data.galleryImages.every((img: any) => typeof img === "string")) {
      errors.push({ field: "galleryImages", message: "All gallery images must be strings (URLs)" })
    }
  }

  if (data.trailerUrl !== undefined && typeof data.trailerUrl !== "string") {
    errors.push({ field: "trailerUrl", message: "Trailer URL must be a string" })
  }

  if (data.trailerEmbed !== undefined && typeof data.trailerEmbed !== "string") {
    errors.push({ field: "trailerEmbed", message: "Trailer embed must be a string" })
  }

  // ===== CAST & CREW VALIDATION =====
  if (data.cast !== undefined) {
    if (!Array.isArray(data.cast)) {
      errors.push({ field: "cast", message: "Cast must be an array" })
    } else {
      data.cast.forEach((member: any, index: number) => {
        if (!member.name || typeof member.name !== "string") {
          errors.push({ field: `cast[${index}].name`, message: "Cast member name is required" })
        }
        if (!member.character || typeof member.character !== "string") {
          errors.push({ field: `cast[${index}].character`, message: "Cast member character is required" })
        }
      })
    }
  }

  if (data.crew !== undefined) {
    if (!Array.isArray(data.crew)) {
      errors.push({ field: "crew", message: "Crew must be an array" })
    } else {
      data.crew.forEach((member: any, index: number) => {
        if (!member.name || typeof member.name !== "string") {
          errors.push({ field: `crew[${index}].name`, message: "Crew member name is required" })
        }
        if (!member.role || typeof member.role !== "string") {
          errors.push({ field: `crew[${index}].role`, message: "Crew member role is required" })
        }
        if (!member.department || typeof member.department !== "string") {
          errors.push({ field: `crew[${index}].department`, message: "Crew member department is required" })
        }
      })
    }
  }

  // ===== STREAMING VALIDATION =====
  if (data.streamingLinks !== undefined) {
    if (!Array.isArray(data.streamingLinks)) {
      errors.push({ field: "streamingLinks", message: "Streaming links must be an array" })
    } else {
      data.streamingLinks.forEach((link: any, index: number) => {
        if (!link.provider || typeof link.provider !== "string") {
          errors.push({ field: `streamingLinks[${index}].provider`, message: "Provider is required" })
        }
        if (!link.url || typeof link.url !== "string") {
          errors.push({ field: `streamingLinks[${index}].url`, message: "URL is required" })
        }
        if (!link.type || !["subscription", "rent", "buy"].includes(link.type)) {
          errors.push({
            field: `streamingLinks[${index}].type`,
            message: "Type must be: subscription, rent, or buy",
          })
        }
        if (!link.quality || !["SD", "HD", "4K"].includes(link.quality)) {
          errors.push({ field: `streamingLinks[${index}].quality`, message: "Quality must be: SD, HD, or 4K" })
        }
      })
    }
  }

  // ===== AWARDS VALIDATION =====
  if (data.awards !== undefined) {
    if (!Array.isArray(data.awards)) {
      errors.push({ field: "awards", message: "Awards must be an array" })
    } else {
      data.awards.forEach((award: any, index: number) => {
        if (!award.name || typeof award.name !== "string") {
          errors.push({ field: `awards[${index}].name`, message: "Award name is required" })
        }
        if (!award.category || typeof award.category !== "string") {
          errors.push({ field: `awards[${index}].category`, message: "Award category is required" })
        }
        if (!award.year || typeof award.year !== "number") {
          errors.push({ field: `awards[${index}].year`, message: "Award year must be a number" })
        }
        if (!award.status || !["Winner", "Nominee"].includes(award.status)) {
          errors.push({ field: `awards[${index}].status`, message: "Status must be: Winner or Nominee" })
        }
      })
    }
  }

  // ===== TRIVIA VALIDATION =====
  if (data.trivia !== undefined) {
    if (!Array.isArray(data.trivia)) {
      errors.push({ field: "trivia", message: "Trivia must be an array" })
    } else {
      data.trivia.forEach((item: any, index: number) => {
        if (!item.question || typeof item.question !== "string") {
          errors.push({ field: `trivia[${index}].question`, message: "Question is required" })
        }
        if (!item.answer || typeof item.answer !== "string") {
          errors.push({ field: `trivia[${index}].answer`, message: "Answer is required" })
        }
        if (!item.category || typeof item.category !== "string") {
          errors.push({ field: `trivia[${index}].category`, message: "Category is required" })
        }
      })
    }
  }

  // ===== TIMELINE VALIDATION =====
  if (data.timelineEvents !== undefined) {
    if (!Array.isArray(data.timelineEvents)) {
      errors.push({ field: "timelineEvents", message: "Timeline events must be an array" })
    } else {
      data.timelineEvents.forEach((event: any, index: number) => {
        if (!event.title || typeof event.title !== "string") {
          errors.push({ field: `timelineEvents[${index}].title`, message: "Event title is required" })
        }
        if (!event.date || typeof event.date !== "string") {
          errors.push({ field: `timelineEvents[${index}].date`, message: "Event date is required" })
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
          errors.push({ field: `timelineEvents[${index}].date`, message: "Date must be in YYYY-MM-DD format" })
        }
        if (!event.category || typeof event.category !== "string") {
          errors.push({ field: `timelineEvents[${index}].category`, message: "Event category is required" })
        }
      })
    }
  }

  // ===== WARNINGS (non-critical) =====
  if (!data.poster) {
    warnings.push({ field: "poster", message: "No poster image provided" })
  }

  if (!data.synopsis || data.synopsis.length < 50) {
    warnings.push({ field: "synopsis", message: "Synopsis is missing or too short (recommended: 100+ characters)" })
  }

  if (!data.cast || data.cast.length === 0) {
    warnings.push({ field: "cast", message: "No cast members provided" })
  }

  if (!data.crew || data.crew.length === 0) {
    warnings.push({ field: "crew", message: "No crew members provided" })
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Sanitize and prepare movie data for import
 * Adds missing IDs and default values
 */
export function sanitizeMovieData(data: any): Partial<Movie> {
  const sanitized: any = { ...data }

  // Generate IDs for nested items if missing
  if (sanitized.cast) {
    sanitized.cast = sanitized.cast.map((member: any, index: number) => ({
      ...member,
      id: member.id || `cast-${Date.now()}-${index}`,
      order: member.order !== undefined ? member.order : index + 1,
    }))
  }

  if (sanitized.crew) {
    sanitized.crew = sanitized.crew.map((member: any, index: number) => ({
      ...member,
      id: member.id || `crew-${Date.now()}-${index}`,
    }))
  }

  if (sanitized.streamingLinks) {
    sanitized.streamingLinks = sanitized.streamingLinks.map((link: any, index: number) => ({
      ...link,
      id: link.id || `stream-${Date.now()}-${index}`,
      verified: link.verified !== undefined ? link.verified : false,
    }))
  }

  if (sanitized.awards) {
    sanitized.awards = sanitized.awards.map((award: any, index: number) => ({
      ...award,
      id: award.id || `award-${Date.now()}-${index}`,
    }))
  }

  if (sanitized.trivia) {
    sanitized.trivia = sanitized.trivia.map((item: any, index: number) => ({
      ...item,
      id: item.id || `trivia-${Date.now()}-${index}`,
    }))
  }

  if (sanitized.timelineEvents) {
    sanitized.timelineEvents = sanitized.timelineEvents.map((event: any, index: number) => ({
      ...event,
      id: event.id || `timeline-${Date.now()}-${index}`,
    }))
  }

  // Set defaults for required fields
  if (!sanitized.isPublished) sanitized.isPublished = false
  if (!sanitized.isArchived) sanitized.isArchived = false
  if (!sanitized.genres) sanitized.genres = []
  if (!sanitized.importedFrom) sanitized.importedFrom = "JSON"

  return sanitized
}

