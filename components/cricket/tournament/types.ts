export interface Team {
  id: string
  name: string
  shortName: string
  logoUrl: string
}

export interface Match {
  id: string
  matchNumber: number
  stage: string
  date: string
  teams: {
    team1: Team
    team2: Team
  }
  venue: string
  result?: string
  scorecard?: {
    team1: string
    team2: string
  }
  status: "Upcoming" | "Live" | "Completed"
}

export interface Venue {
  name: string
  location: string
  capacity: string
  imageUrl: string
}

export interface Sponsor {
  name: string
  logoUrl: string
}

export interface StandingsEntry {
  team: Team
  played: number
  won: number
  lost: number
  tied: number
  noResult: number
  points: number
  netRunRate: number
}

export interface Group {
  name: string
  standings: StandingsEntry[]
}

export interface BattingLeader {
  player: {
    id: string
    name: string
    team: Team
  }
  matches: number
  innings: number
  runs: number
  average: number
  strikeRate: number
  fifties: number
  hundreds: number
  highestScore: string
}

export interface BowlingLeader {
  player: {
    id: string
    name: string
    team: Team
  }
  matches: number
  innings: number
  wickets: number
  economy: number
  average: number
  bestBowling: string
}

export interface PastWinner {
  year: string
  winner: string
  runnerUp: string
  hostCountry: string
  finalResult: string
}

export interface TournamentProfile {
  id: string
  name: string
  edition: string
  format: string
  formatDescription: string
  startDate: string
  endDate: string
  host: string
  status: "Upcoming" | "Live" | "Completed"
  logoUrl: string
  coverImageUrl: string
  currentChampion?: string
  teams: Team[]
  matches: Match[]
  venues: Venue[]
  sponsors?: Sponsor[]
  groups: Group[]
  battingLeaders: BattingLeader[]
  bowlingLeaders: BowlingLeader[]
  pastWinners: PastWinner[]
  prizeMoney: {
    winner: string
    runnerUp: string
    semifinalists: string
    total: string
  }
}
