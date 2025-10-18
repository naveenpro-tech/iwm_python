export interface Player {
  id: string
  name: string
  role: string
  battingStyle: string
  bowlingStyle?: string
  age: number
  imageUrl: string
}

export interface Match {
  id: string
  date: string
  format: "Test" | "ODI" | "T20"
  opponent: {
    id: string
    name: string
    logoUrl: string
  }
  venue: string
  result: string
  scorecard: {
    team: string
    opponent: string
  }
}

export interface Trophy {
  id: string
  name: string
  year: string
  imageUrl: string
  description: string
}

export interface TeamStatistics {
  matches: number
  wins: number
  losses: number
  draws: number
  winPercentage: number
  highestScore: string
  lowestScore: string
  venuePerformance: {
    [venue: string]: number // win percentage at venue
  }
  rivalRecords: {
    [team: string]: {
      wins: number
      losses: number
      draws: number
    }
  }
}

export interface TeamProfile {
  id: string
  name: string
  shortName: string
  established: string
  logoUrl: string
  homeGround: string
  captain: string
  coach: string
  formats: string[]
  teamColors: {
    primary: string
    secondary: string
  }
  iccRanking: {
    test: number
    odi: number
    t20: number
  }
  players: Player[]
  recentMatches: Match[]
  upcomingMatches: Match[]
  trophies: Trophy[]
  statistics: {
    overall: TeamStatistics
    formats: {
      test: TeamStatistics
      odi: TeamStatistics
      t20: TeamStatistics
    }
  }
}
