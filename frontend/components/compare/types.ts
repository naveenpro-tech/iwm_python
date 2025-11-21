{
  ;`export interface MovieComparisonData {
  id: string;
  title: string;
  year: number;
  director: string;
  runtime: number; // in minutes
  genres: string[];
  sidduScore: number; // 0-100
  criticScore: number; // 0-100 (e.g., Metacritic)
  audienceScore: number; // 0-100 (e.g., Rotten Tomatoes Audience)
  synopsis: string;
  cast: string[]; // Top 3-4 actors
  poster: string; // URL to poster image
  productionDetails?: {
    budget?: string;
    studio?: string;
    country?: string;
    language?: string;
  };
  boxOffice?: {
    worldwide?: string;
    domestic?: string;
    openingWeekendUSA?: string;
  };
  awardsSummary?: string; // e.g., "Winner of 4 Oscars"
  trailerUrl?: string;
  // Additional fields for richer comparison
  cinematographer?: string;
  composer?: string;
  keyThemes?: string[];
  visualStyle?: string;
  emotionalImpact?: string; // e.g., "Thought-provoking", "Heartwarming"
  targetAudience?: string; // e.g., "Mature Audiences", "Family"
}

export interface MovieSearchSelectItem {
  id: string;
  title: string;
  year: number;
  poster?: string;
}`
}
