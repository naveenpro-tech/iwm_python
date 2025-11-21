export interface AdvancedSearchState {
  query: string
  filters: FilterSet
  savedSearches: SavedSearch[]
  searchHistory: SearchHistoryItem[]
  results: SearchResult[]
  isLoading: boolean
}

export interface FilterSet {
  textFilters: TextFilters
  peopleFilters: PeopleFilters
  dateFilters: DateFilters
  ratingFilters: RatingFilters
  awardFilters: AwardFilters
  technicalFilters: TechnicalFilters
}

export interface TextFilters {
  exactPhrase?: string
  titleContains?: string
  excludeWords?: string[]
}

export interface PeopleFilters {
  actors?: string[]
  directors?: string[]
  writers?: string[]
  producers?: string[]
}

export interface DateFilters {
  yearFrom?: number
  yearTo?: number
  decade?: string
  specificYear?: number
}

export interface RatingFilters {
  sidduScoreMin?: number
  sidduScoreMax?: number
  userRatingMin?: number
  userRatingMax?: number
}

export interface AwardFilters {
  hasOscar?: boolean
  hasCannes?: boolean
  hasGoldenGlobe?: boolean
  specificAwards?: string[]
}

export interface TechnicalFilters {
  cinematographer?: string
  vfxSupervisor?: string
  composer?: string
  editor?: string
}

export interface SavedSearch {
  id: string
  name: string
  query: string
  filters: FilterSet
  createdAt: Date
}

export interface SearchHistoryItem {
  id: string
  query: string
  filters: FilterSet
  timestamp: Date
  resultCount: number
}

export interface SearchResult {
  id: string
  type: "movie" | "person" | "scene"
  title: string
  year?: number
  poster?: string
  rating?: number
  matchScore: number
  hasOscar?: boolean
  hasCannes?: boolean
  hasGoldenGlobe?: boolean
}
