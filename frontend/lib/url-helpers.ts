{
  ;`// Helper to parse movie IDs from URL query string
export function parseMovieIds(query: string | null): string[] {
  if (!query) return [];
  return query.split(",").filter(Boolean); // Filter out any empty strings if query ends with a comma
}

// Helper to stringify movie IDs for URL query string
export function stringifyMovieIds(ids: string[]): string {
  return ids.join(",");
}

// Helper to generate a slug from a title
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
}`
}
