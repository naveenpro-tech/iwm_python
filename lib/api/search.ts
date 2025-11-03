/**
 * Search API Client
 * Searches movies from the FastAPI backend
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export interface SearchResult {
  id: string;
  title: string;
  year: string;
  posterUrl: string;
  genres: string[];
  sidduScore: number;
  runtime: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
}

/**
 * Search movies by title, description, or genre name
 * @param query - Search query string
 * @param limit - Maximum number of results (default: 10, max: 50)
 * @returns Search results ordered by relevance
 */
export async function searchMovies(
  query: string,
  limit: number = 10
): Promise<SearchResponse> {
  if (!query || query.trim().length === 0) {
    return { results: [], total: 0 };
  }

  const params = new URLSearchParams({
    q: query.trim(),
    limit: Math.min(limit, 50).toString(),
  });

  const response = await fetch(`${API_BASE}/api/v1/movies/search?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  return response.json();
}

