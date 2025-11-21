export interface Player {
  id: string
  name: string
  role: "Batsman" | "Bowler" | "All-rounder" | "Wicket-keeper"
  image?: string
  country: string
}

export interface Team {
  id: string
  name: string
  shortName: string // 3-letter code
  logo: string
  primaryColor: string
  players: Player[]
}

export interface BattingPerformance {
  player: Player
  runs: number
  balls: number
  fours: number
  sixes: number
  strikeRate: number
  dismissal?: string
  bowler?: Player
  fielder?: Player
}

export interface BowlingPerformance {
  player: Player
  overs: number
  maidens: number
  runs: number
  wickets: number
  economy: number
  dots: number
  fours: number
  sixes: number
}

export interface Innings {
  team: string
  runs: number
  wickets: number
  overs: number
  runRate: number
  battingOrder: BattingPerformance[]
  bowlingFigures: BowlingPerformance[]
  extras: {
    wides: number
    noBalls: number
    byes: number
    legByes: number
    penalty: number
    total: number
  }
}

export interface MatchResult {
  winner: string
  margin: string
  description: string
}

export interface Venue {
  id: string
  name: string
  city: string
  country: string
  capacity?: number
  image?: string
}

export interface Commentary {
  id: string
  matchId: string
  timestamp: string
  over: number
  ball: number
  text: string
  isKeyMoment: boolean
  type: "regular" | "boundary" | "six" | "wicket" | "milestone" | "other"
}

export interface CricketMatch {
  id: string
  matchType: "T20" | "ODI" | "Test" | "T10" | "Other"
  series: {
    id: string
    name: string
    logo?: string
  }
  status: "Upcoming" | "Live" | "Innings Break" | "Lunch" | "Tea" | "Stumps" | "Completed" | "Abandoned" | "Delayed"
  teams: {
    home: Team
    away: Team
  }
  venue: Venue
  startTime: string // ISO date string
  endTime?: string // ISO date string
  toss?: {
    winner: string
    decision: "bat" | "field"
  }
  currentInnings?: Innings
  innings?: Innings[]
  result?: MatchResult
  manOfTheMatch?: Player
  recentBalls?: string[]
  currentBatsmen?: {
    striker: {
      player: Player
      runs: number
      balls: number
    }
    nonStriker: {
      player: Player
      runs: number
      balls: number
    }
  }
  currentBowler?: {
    player: Player
    overs: number
    maidens: number
    runs: number
    wickets: number
  }
  requiredRunRate?: number
  partnership?: {
    runs: number
    balls: number
  }
  winProbability?: {
    home: number
    away: number
  }
}

export interface Series {
  id: string
  name: string
  startDate: string
  endDate: string
  matchType: "T20" | "ODI" | "Test" | "T10" | "Other"
  teams: Team[]
  logo?: string
}

export type MatchFilter = {
  series?: string
  matchType?: ("T20" | "ODI" | "Test" | "T10" | "Other")[]
  team?: string
  dateRange?: {
    start: string
    end: string
  }
}
