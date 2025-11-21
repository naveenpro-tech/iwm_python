import type { CricketMatch, Series } from "./types"

export const mockTeams = {
  india: {
    id: "india",
    name: "India",
    shortName: "IND",
    logo: "/cricket/india-logo.png",
    primaryColor: "#0073CF",
    players: [
      { id: "player1", name: "Rohit Sharma", role: "Batsman", country: "India" },
      { id: "player2", name: "Virat Kohli", role: "Batsman", country: "India" },
      { id: "player3", name: "Jasprit Bumrah", role: "Bowler", country: "India" },
      { id: "player4", name: "Ravindra Jadeja", role: "All-rounder", country: "India" },
      { id: "player5", name: "KL Rahul", role: "Wicket-keeper", country: "India" },
    ],
  },
  australia: {
    id: "australia",
    name: "Australia",
    shortName: "AUS",
    logo: "/cricket/australia-logo.png",
    primaryColor: "#FFCD00",
    players: [
      { id: "player6", name: "Pat Cummins", role: "Bowler", country: "Australia" },
      { id: "player7", name: "Steve Smith", role: "Batsman", country: "Australia" },
      { id: "player8", name: "Mitchell Starc", role: "Bowler", country: "Australia" },
      { id: "player9", name: "Glenn Maxwell", role: "All-rounder", country: "Australia" },
      { id: "player10", name: "Alex Carey", role: "Wicket-keeper", country: "Australia" },
    ],
  },
  england: {
    id: "england",
    name: "England",
    shortName: "ENG",
    logo: "/cricket/england-logo.png",
    primaryColor: "#1A1AB3",
    players: [
      { id: "player11", name: "Joe Root", role: "Batsman", country: "England" },
      { id: "player12", name: "Ben Stokes", role: "All-rounder", country: "England" },
      { id: "player13", name: "Jofra Archer", role: "Bowler", country: "England" },
      { id: "player14", name: "Jos Buttler", role: "Wicket-keeper", country: "England" },
      { id: "player15", name: "Moeen Ali", role: "All-rounder", country: "England" },
    ],
  },
  newZealand: {
    id: "newZealand",
    name: "New Zealand",
    shortName: "NZ",
    logo: "/cricket/new-zealand-logo.png",
    primaryColor: "#000000",
    players: [
      { id: "player16", name: "Kane Williamson", role: "Batsman", country: "New Zealand" },
      { id: "player17", name: "Trent Boult", role: "Bowler", country: "New Zealand" },
      { id: "player18", name: "Tim Southee", role: "Bowler", country: "New Zealand" },
      { id: "player19", name: "Devon Conway", role: "Batsman", country: "New Zealand" },
      { id: "player20", name: "Tom Latham", role: "Wicket-keeper", country: "New Zealand" },
    ],
  },
  southAfrica: {
    id: "southAfrica",
    name: "South Africa",
    shortName: "SA",
    logo: "/cricket/south-africa-logo.png",
    primaryColor: "#007A4D",
    players: [
      { id: "player21", name: "Quinton de Kock", role: "Wicket-keeper", country: "South Africa" },
      { id: "player22", name: "Kagiso Rabada", role: "Bowler", country: "South Africa" },
      { id: "player23", name: "Anrich Nortje", role: "Bowler", country: "South Africa" },
      { id: "player24", name: "Aiden Markram", role: "Batsman", country: "South Africa" },
      { id: "player25", name: "David Miller", role: "Batsman", country: "South Africa" },
    ],
  },
  pakistan: {
    id: "pakistan",
    name: "Pakistan",
    shortName: "PAK",
    logo: "/cricket/pakistan-logo.png",
    primaryColor: "#00A04E",
    players: [
      { id: "player26", name: "Babar Azam", role: "Batsman", country: "Pakistan" },
      { id: "player27", name: "Shaheen Afridi", role: "Bowler", country: "Pakistan" },
      { id: "player28", name: "Mohammad Rizwan", role: "Wicket-keeper", country: "Pakistan" },
      { id: "player29", name: "Shadab Khan", role: "All-rounder", country: "Pakistan" },
      { id: "player30", name: "Fakhar Zaman", role: "Batsman", country: "Pakistan" },
    ],
  },
}

export const mockVenues = {
  wankhede: {
    id: "wankhede",
    name: "Wankhede Stadium",
    city: "Mumbai",
    country: "India",
    capacity: 33000,
    image: "/cricket/wankhede-stadium.png",
  },
  mcg: {
    id: "mcg",
    name: "Melbourne Cricket Ground",
    city: "Melbourne",
    country: "Australia",
    capacity: 100024,
    image: "/cricket/mcg.png",
  },
  lords: {
    id: "lords",
    name: "Lord's Cricket Ground",
    city: "London",
    country: "England",
    capacity: 30000,
    image: "/cricket/lords.png",
  },
  edenGardens: {
    id: "edenGardens",
    name: "Eden Gardens",
    city: "Kolkata",
    country: "India",
    capacity: 68000,
    image: "/cricket/eden-gardens.png",
  },
  chinnaswamy: {
    id: "chinnaswamy",
    name: "M. Chinnaswamy Stadium",
    city: "Bangalore",
    country: "India",
    capacity: 40000,
    image: "/cricket/chinnaswamy.png",
  },
}

export const mockSeries: Series[] = [
  {
    id: "ipl2023",
    name: "Indian Premier League 2023",
    startDate: "2023-03-31T00:00:00Z",
    endDate: "2023-05-28T00:00:00Z",
    matchType: "T20",
    teams: [
      mockTeams.india,
      // Other IPL teams would be here
    ],
    logo: "/cricket/ipl-logo.png",
  },
  {
    id: "wc2023",
    name: "ICC Cricket World Cup 2023",
    startDate: "2023-10-05T00:00:00Z",
    endDate: "2023-11-19T00:00:00Z",
    matchType: "ODI",
    teams: [
      mockTeams.india,
      mockTeams.australia,
      mockTeams.england,
      mockTeams.newZealand,
      mockTeams.southAfrica,
      mockTeams.pakistan,
    ],
    logo: "/cricket/world-cup-logo.png",
  },
  {
    id: "indvaus2023",
    name: "India vs Australia 2023",
    startDate: "2023-09-22T00:00:00Z",
    endDate: "2023-10-01T00:00:00Z",
    matchType: "ODI",
    teams: [mockTeams.india, mockTeams.australia],
    logo: "/cricket/ind-aus-series.png",
  },
]

export const mockMatches: CricketMatch[] = [
  // Live match
  {
    id: "match1",
    matchType: "ODI",
    series: {
      id: "wc2023",
      name: "ICC Cricket World Cup 2023",
      logo: "/cricket/world-cup-logo.png",
    },
    status: "Live",
    teams: {
      home: mockTeams.india,
      away: mockTeams.australia,
    },
    venue: mockVenues.wankhede,
    startTime: "2023-10-15T09:30:00Z",
    toss: {
      winner: "india",
      decision: "bat",
    },
    currentInnings: {
      team: "india",
      runs: 245,
      wickets: 4,
      overs: 42.3,
      runRate: 5.76,
      battingOrder: [],
      bowlingFigures: [],
      extras: {
        wides: 8,
        noBalls: 1,
        byes: 4,
        legByes: 2,
        penalty: 0,
        total: 15,
      },
    },
    innings: [
      // Previous innings would be here
    ],
    recentBalls: ["1", "0", "4", "W", "0", "2"],
    currentBatsmen: {
      striker: {
        player: mockTeams.india.players[1], // Virat Kohli
        runs: 87,
        balls: 92,
      },
      nonStriker: {
        player: mockTeams.india.players[3], // Ravindra Jadeja
        runs: 24,
        balls: 18,
      },
    },
    currentBowler: {
      player: mockTeams.australia.players[0], // Pat Cummins
      overs: 8.3,
      maidens: 1,
      runs: 42,
      wickets: 2,
    },
    partnership: {
      runs: 52,
      balls: 48,
    },
    winProbability: {
      home: 65,
      away: 35,
    },
  },
  // Upcoming match
  {
    id: "match2",
    matchType: "ODI",
    series: {
      id: "wc2023",
      name: "ICC Cricket World Cup 2023",
      logo: "/cricket/world-cup-logo.png",
    },
    status: "Upcoming",
    teams: {
      home: mockTeams.england,
      away: mockTeams.newZealand,
    },
    venue: mockVenues.lords,
    startTime: "2023-10-17T10:30:00Z",
  },
  // Completed match
  {
    id: "match3",
    matchType: "ODI",
    series: {
      id: "wc2023",
      name: "ICC Cricket World Cup 2023",
      logo: "/cricket/world-cup-logo.png",
    },
    status: "Completed",
    teams: {
      home: mockTeams.southAfrica,
      away: mockTeams.pakistan,
    },
    venue: mockVenues.mcg,
    startTime: "2023-10-12T09:00:00Z",
    endTime: "2023-10-12T16:45:00Z",
    toss: {
      winner: "southAfrica",
      decision: "field",
    },
    innings: [
      {
        team: "pakistan",
        runs: 270,
        wickets: 8,
        overs: 50,
        runRate: 5.4,
        battingOrder: [],
        bowlingFigures: [],
        extras: {
          wides: 6,
          noBalls: 0,
          byes: 2,
          legByes: 4,
          penalty: 0,
          total: 12,
        },
      },
      {
        team: "southAfrica",
        runs: 274,
        wickets: 6,
        overs: 48.2,
        runRate: 5.67,
        battingOrder: [],
        bowlingFigures: [],
        extras: {
          wides: 4,
          noBalls: 1,
          byes: 0,
          legByes: 2,
          penalty: 0,
          total: 7,
        },
      },
    ],
    result: {
      winner: "southAfrica",
      margin: "4 wickets",
      description: "South Africa won by 4 wickets with 10 balls remaining",
    },
    manOfTheMatch: mockTeams.southAfrica.players[3], // Aiden Markram
  },
  // Another upcoming match
  {
    id: "match4",
    matchType: "ODI",
    series: {
      id: "wc2023",
      name: "ICC Cricket World Cup 2023",
      logo: "/cricket/world-cup-logo.png",
    },
    status: "Upcoming",
    teams: {
      home: mockTeams.india,
      away: mockTeams.newZealand,
    },
    venue: mockVenues.edenGardens,
    startTime: "2023-10-22T09:30:00Z",
  },
  // Another completed match
  {
    id: "match5",
    matchType: "ODI",
    series: {
      id: "indvaus2023",
      name: "India vs Australia 2023",
      logo: "/cricket/ind-aus-series.png",
    },
    status: "Completed",
    teams: {
      home: mockTeams.india,
      away: mockTeams.australia,
    },
    venue: mockVenues.chinnaswamy,
    startTime: "2023-09-24T09:30:00Z",
    endTime: "2023-09-24T17:15:00Z",
    toss: {
      winner: "australia",
      decision: "bat",
    },
    innings: [
      {
        team: "australia",
        runs: 276,
        wickets: 7,
        overs: 50,
        runRate: 5.52,
        battingOrder: [],
        bowlingFigures: [],
        extras: {
          wides: 5,
          noBalls: 0,
          byes: 1,
          legByes: 3,
          penalty: 0,
          total: 9,
        },
      },
      {
        team: "india",
        runs: 281,
        wickets: 5,
        overs: 48.4,
        runRate: 5.77,
        battingOrder: [],
        bowlingFigures: [],
        extras: {
          wides: 3,
          noBalls: 1,
          byes: 0,
          legByes: 1,
          penalty: 0,
          total: 5,
        },
      },
    ],
    result: {
      winner: "india",
      margin: "5 wickets",
      description: "India won by 5 wickets with 8 balls remaining",
    },
    manOfTheMatch: mockTeams.india.players[1], // Virat Kohli
  },
  // Another live match (innings break)
  {
    id: "match6",
    matchType: "T20",
    series: {
      id: "ipl2023",
      name: "Indian Premier League 2023",
      logo: "/cricket/ipl-logo.png",
    },
    status: "Innings Break",
    teams: {
      home: {
        ...mockTeams.india,
        name: "Mumbai Indians",
        shortName: "MI",
        logo: "/cricket/mumbai-indians-logo.png",
        primaryColor: "#004BA0",
      },
      away: {
        ...mockTeams.india,
        name: "Chennai Super Kings",
        shortName: "CSK",
        logo: "/cricket/chennai-super-kings-logo.png",
        primaryColor: "#FFFF00",
      },
    },
    venue: mockVenues.wankhede,
    startTime: "2023-05-21T14:00:00Z",
    toss: {
      winner: "mumbai",
      decision: "bat",
    },
    innings: [
      {
        team: "mumbai",
        runs: 192,
        wickets: 8,
        overs: 20,
        runRate: 9.6,
        battingOrder: [],
        bowlingFigures: [],
        extras: {
          wides: 7,
          noBalls: 2,
          byes: 1,
          legByes: 2,
          penalty: 0,
          total: 12,
        },
      },
    ],
  },
]

// Generate more upcoming matches
const generateUpcomingMatches = () => {
  const teams = [
    mockTeams.india,
    mockTeams.australia,
    mockTeams.england,
    mockTeams.newZealand,
    mockTeams.southAfrica,
    mockTeams.pakistan,
  ]
  const venues = [mockVenues.wankhede, mockVenues.mcg, mockVenues.lords, mockVenues.edenGardens, mockVenues.chinnaswamy]

  const upcomingMatches: CricketMatch[] = []

  // Generate 10 more upcoming matches
  for (let i = 0; i < 10; i++) {
    const homeTeamIndex = Math.floor(Math.random() * teams.length)
    let awayTeamIndex = Math.floor(Math.random() * teams.length)
    while (awayTeamIndex === homeTeamIndex) {
      awayTeamIndex = Math.floor(Math.random() * teams.length)
    }

    const venueIndex = Math.floor(Math.random() * venues.length)
    const daysFromNow = 3 + i * 2 // Spread matches over coming weeks

    const match: CricketMatch = {
      id: `upcoming-${i + 1}`,
      matchType: i % 3 === 0 ? "Test" : i % 3 === 1 ? "ODI" : "T20",
      series: mockSeries[Math.floor(Math.random() * mockSeries.length)],
      status: "Upcoming",
      teams: {
        home: teams[homeTeamIndex],
        away: teams[awayTeamIndex],
      },
      venue: venues[venueIndex],
      startTime: new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000).toISOString(),
    }

    upcomingMatches.push(match)
  }

  return upcomingMatches
}

// Generate more completed matches
const generateCompletedMatches = () => {
  const teams = [
    mockTeams.india,
    mockTeams.australia,
    mockTeams.england,
    mockTeams.newZealand,
    mockTeams.southAfrica,
    mockTeams.pakistan,
  ]
  const venues = [mockVenues.wankhede, mockVenues.mcg, mockVenues.lords, mockVenues.edenGardens, mockVenues.chinnaswamy]

  const completedMatches: CricketMatch[] = []

  // Generate 10 more completed matches
  for (let i = 0; i < 10; i++) {
    const homeTeamIndex = Math.floor(Math.random() * teams.length)
    let awayTeamIndex = Math.floor(Math.random() * teams.length)
    while (awayTeamIndex === homeTeamIndex) {
      awayTeamIndex = Math.floor(Math.random() * teams.length)
    }

    const venueIndex = Math.floor(Math.random() * venues.length)
    const daysAgo = 3 + i * 2 // Spread matches over past weeks

    const homeTeam = teams[homeTeamIndex]
    const awayTeam = teams[awayTeamIndex]

    const homeScore = 200 + Math.floor(Math.random() * 100)
    const awayScore = 200 + Math.floor(Math.random() * 100)
    const homeWon = homeScore > awayScore

    const match: CricketMatch = {
      id: `completed-${i + 1}`,
      matchType: i % 3 === 0 ? "Test" : i % 3 === 1 ? "ODI" : "T20",
      series: mockSeries[Math.floor(Math.random() * mockSeries.length)],
      status: "Completed",
      teams: {
        home: homeTeam,
        away: awayTeam,
      },
      venue: venues[venueIndex],
      startTime: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
      toss: {
        winner: homeWon ? homeTeam.id : awayTeam.id,
        decision: Math.random() > 0.5 ? "bat" : "field",
      },
      innings: [
        {
          team: homeTeam.id,
          runs: homeScore,
          wickets: Math.floor(Math.random() * 10),
          overs: 50,
          runRate: homeScore / 50,
          battingOrder: [],
          bowlingFigures: [],
          extras: {
            wides: Math.floor(Math.random() * 10),
            noBalls: Math.floor(Math.random() * 3),
            byes: Math.floor(Math.random() * 5),
            legByes: Math.floor(Math.random() * 5),
            penalty: 0,
            total: 0,
          },
        },
        {
          team: awayTeam.id,
          runs: awayScore,
          wickets: Math.floor(Math.random() * 10),
          overs: 50,
          runRate: awayScore / 50,
          battingOrder: [],
          bowlingFigures: [],
          extras: {
            wides: Math.floor(Math.random() * 10),
            noBalls: Math.floor(Math.random() * 3),
            byes: Math.floor(Math.random() * 5),
            legByes: Math.floor(Math.random() * 5),
            penalty: 0,
            total: 0,
          },
        },
      ],
      result: {
        winner: homeWon ? homeTeam.id : awayTeam.id,
        margin: `${Math.abs(homeScore - awayScore)} runs`,
        description: `${homeWon ? homeTeam.name : awayTeam.name} won by ${Math.abs(homeScore - awayScore)} runs`,
      },
      manOfTheMatch: homeWon
        ? homeTeam.players[Math.floor(Math.random() * homeTeam.players.length)]
        : awayTeam.players[Math.floor(Math.random() * awayTeam.players.length)],
    }

    // Fix extras total
    if (match.innings) {
      match.innings[0].extras.total =
        match.innings[0].extras.wides +
        match.innings[0].extras.noBalls +
        match.innings[0].extras.byes +
        match.innings[0].extras.legByes +
        match.innings[0].extras.penalty

      match.innings[1].extras.total =
        match.innings[1].extras.wides +
        match.innings[1].extras.noBalls +
        match.innings[1].extras.byes +
        match.innings[1].extras.legByes +
        match.innings[1].extras.penalty
    }

    completedMatches.push(match)
  }

  return completedMatches
}

// Add generated matches to our mock data
export const allMockMatches = [...mockMatches, ...generateUpcomingMatches(), ...generateCompletedMatches()]

// Helper functions to filter matches
export const getLiveMatches = () =>
  allMockMatches.filter((match) => match.status === "Live" || match.status === "Innings Break")

export const getUpcomingMatches = () =>
  allMockMatches
    .filter((match) => match.status === "Upcoming")
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

export const getCompletedMatches = () =>
  allMockMatches
    .filter((match) => match.status === "Completed")
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())

export const getMatchById = (id: string) => allMockMatches.find((match) => match.id === id)
