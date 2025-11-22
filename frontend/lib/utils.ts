import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string or Date object into a readable format
 * @param date - Date string or Date object
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-US", options).format(dateObj)
}

/**
 * Resolves the full URL for an image, handling relative API paths
 * @param url - The image URL (absolute or relative)
 * @param type - The type of image ("avatar" | "banner")
 * @returns The resolved full URL
 */
export function resolveImageUrl(url: string | null | undefined, type: "avatar" | "banner" = "avatar"): string {
  if (!url) {
    return type === "avatar"
      ? "/placeholder.svg?height=160&width=160&query=person+silhouette"
      : "/movie-backdrop.png"
  }

  if (url.startsWith("/api")) {
    // In development, we need to prepend the API base URL
    // In production, if served from same domain, it might work, but safer to prepend if we know the base
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
    return `${apiBase}${url}`
  }

  return url
}
