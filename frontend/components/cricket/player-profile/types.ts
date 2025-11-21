export interface Team {
  id: string
  name: string
  shortName: string
  logoUrl: string
}

export interface BattingStats {
  matches: number
  innings: number
  runs: number
  average: number
  strikeRate: number
  highestScore: number
  notOuts: number
  centuries: number
  halfCenturies: number
  fours: number
  sixes: number
  formats: {
    test: any
    odi: any
    t20: any
  }
  yearlyStats: {
    year: number
    runs: number
    average: number
    centuries: number
    halfCenturies: number
  }[]
}

export interface BowlingStats {
  matches: number
  innings: number
  wickets: number
  average: number
  economy: number
  bestBowling: string
  fiveWicketHauls: number
  formats: {
    test: any
    odi: any
    t20: any
  }
  yearlyStats: {
    year: number
    wickets: number
    average: number
    economy: number
  }[]
}

export interface FieldingStats {
  catches: number
  stumpings: number
  runOuts: number
}

export interface CareerHighlight {
  title: string
  description: string
  date: string
  opponent: string
  venue: string
  imageUrl: string
}

export interface Award {
  title: string
  year: string
  description: string
  imageUrl: string
}

export interface Match {
  id: string
  date: string
  format: "Test" | "ODI" | "T20"
  teams: {
    home: Team
    away: Team
  }
  venue: string
  result: string
  playerPerformance: {
    batting?: {
      runs: number
      balls: number
      fours: number
      sixes: number
      strikeRate: number
    }
    bowling?: {
      overs: number
      maidens: number
      runs: number
      wickets: number
      economy: number
    }
  }
}

export interface PlayerProfile {
  id: string
  name: string
  fullName: string
  dateOfBirth: string
  placeOfBirth: string
  nationality: string
  role: string
  battingStyle: string
  bowlingStyle: string
  teams: Team[]
  teamColors: {
    primary: string
    secondary: string
  }
  biography: string
  careerSpan: string
  imageUrl: string
  socialMedia: {
    twitter?: string
    instagram?: string
    facebook?: string
  }
  statistics: {
    batting: BattingStats
    bowling?: BowlingStats
    fielding: FieldingStats
  }
  careerHighlights: {
    batting: CareerHighlight[]
    bowling?: CareerHighlight[]
  }
  matchHistory: Match[]
  awards: Award[]
}
