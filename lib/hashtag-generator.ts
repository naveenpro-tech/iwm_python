/**
 * Generate movie-specific hashtags for social media sharing
 */

export interface MovieHashtagOptions {
  title: string
  year?: number | string
  genres?: string[]
  director?: string
  maxHashtags?: number
}

/**
 * Convert a string to a URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "") // Remove spaces
    .replace(/-+/g, "") // Remove hyphens
}

/**
 * Generate movie-specific hashtags
 * @example
 * generateMovieHashtags({
 *   title: "Inception",
 *   year: 2010,
 *   genres: ["Sci-Fi", "Thriller"],
 *   director: "Christopher Nolan"
 * })
 * // Returns: ["Inception", "Inception2010", "InceptionMovie", "SciFi", "Thriller", "ChristopherNolan"]
 */
export function generateMovieHashtags(options: MovieHashtagOptions): string[] {
  const {
    title,
    year,
    genres = [],
    director,
    maxHashtags = 10,
  } = options

  const hashtags: Set<string> = new Set()

  // 1. Movie title hashtag
  const titleSlug = slugify(title)
  if (titleSlug) {
    hashtags.add(titleSlug)
  }

  // 2. Movie title + year
  if (year) {
    hashtags.add(`${titleSlug}${year}`)
  }

  // 3. Movie title + "Movie"
  if (titleSlug) {
    hashtags.add(`${titleSlug}Movie`)
  }

  // 4. Genre hashtags
  genres.forEach((genre) => {
    const genreSlug = slugify(genre)
    if (genreSlug) {
      hashtags.add(genreSlug)
    }
  })

  // 5. Director hashtag
  if (director) {
    const directorSlug = slugify(director)
    if (directorSlug) {
      hashtags.add(directorSlug)
    }
  }

  // 6. Generic movie hashtags
  hashtags.add("Movie")
  hashtags.add("Film")
  hashtags.add("Cinema")

  // 7. Year-based hashtag
  if (year) {
    hashtags.add(`Movies${year}`)
  }

  // Convert to array and limit to maxHashtags
  return Array.from(hashtags)
    .slice(0, maxHashtags)
    .map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1)) // Capitalize first letter
}

/**
 * Generate trending movie hashtags for a specific movie
 * Includes popular hashtags that are commonly used for movie promotion
 */
export function generateTrendingMovieHashtags(options: MovieHashtagOptions): string[] {
  const baseHashtags = generateMovieHashtags(options)

  // Add trending/popular hashtags
  const trendingHashtags = [
    "WatchNow",
    "Streaming",
    "MovieReview",
    "FilmBuff",
    "CinemaLovers",
    "MovieNight",
    "Entertainment",
  ]

  return [...baseHashtags, ...trendingHashtags].slice(0, options.maxHashtags || 10)
}

/**
 * Generate hashtags for social media sharing
 * Returns a formatted string ready for use in social media posts
 */
export function formatHashtagsForSharing(hashtags: string[]): string {
  return hashtags.map((tag) => `#${tag}`).join(" ")
}

/**
 * Generate a complete social media share text with hashtags
 */
export function generateShareText(
  title: string,
  description: string,
  options: MovieHashtagOptions,
): string {
  const hashtags = generateMovieHashtags(options)
  const hashtagString = formatHashtagsForSharing(hashtags)

  return `${title}\n${description}\n\n${hashtagString}`
}

