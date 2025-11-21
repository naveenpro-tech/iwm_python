export function getMockTournamentData() {
  return {
    id: "ipl-2023",
    name: "Indian Premier League 2023",
    shortName: "IPL 2023",
    logoUrl: "/cricket/ipl-logo.png",
    startDate: "2023-03-31",
    endDate: "2023-05-28",
    host: "India",
    teams: [
      {
        id: "csk",
        name: "Chennai Super Kings",
        shortName: "CSK",
        logoUrl: "/cricket/chennai-super-kings-logo.png",
      },
      {
        id: "mi",
        name: "Mumbai Indians",
        shortName: "MI",
        logoUrl: "/cricket/mumbai-indians-logo.png",
      },
      {
        id: "rcb",
        name: "Royal Challengers Bangalore",
        shortName: "RCB",
        logoUrl: "/cricket/generic-cricket-team-logo.png",
      },
      {
        id: "kkr",
        name: "Kolkata Knight Riders",
        shortName: "KKR",
        logoUrl: "/cricket/generic-cricket-team-logo.png",
      },
      {
        id: "dc",
        name: "Delhi Capitals",
        shortName: "DC",
        logoUrl: "/cricket/generic-cricket-team-logo.png",
      },
      {
        id: "srh",
        name: "Sunrisers Hyderabad",
        shortName: "SRH",
        logoUrl: "/cricket/generic-cricket-team-logo.png",
      },
    ],
    venues: [
      {
        id: "wankhede",
        name: "Wankhede Stadium",
        city: "Mumbai",
        country: "India",
        capacity: 33000,
        imageUrl: "/cricket/wankhede-stadium.png",
      },
      {
        id: "chinnaswamy",
        name: "M. Chinnaswamy Stadium",
        city: "Bengaluru",
        country: "India",
        capacity: 40000,
        imageUrl: "/cricket/chinnaswamy.png",
      },
      {
        id: "eden-gardens",
        name: "Eden Gardens",
        city: "Kolkata",
        country: "India",
        capacity: 68000,
        imageUrl: "/cricket/eden-gardens.png",
      },
      {
        id: "chepauk",
        name: "MA Chidambaram Stadium",
        city: "Chennai",
        country: "India",
        capacity: 50000,
        imageUrl: "/cricket/generic-cricket-team-logo.png",
      },
    ],
    format: {
      type: "League + Playoffs",
      description: "Round-robin league followed by playoffs with top 4 teams",
    },
    standings: [
      {
        position: 1,
        team: {
          name: "Chennai Super Kings",
          logoUrl: "/cricket/chennai-super-kings-logo.png",
        },
        played: 14,
        won: 10,
        lost: 4,
        drawn: 0,
        points: 20,
        netRunRate: 0.652,
        form: ["W", "W", "L", "W", "W"],
        positionChange: "up",
      },
      {
        position: 2,
        team: {
          name: "Mumbai Indians",
          logoUrl: "/cricket/mumbai-indians-logo.png",
        },
        played: 14,
        won: 9,
        lost: 5,
        drawn: 0,
        points: 18,
        netRunRate: 0.421,
        form: ["W", "W", "W", "L", "W"],
        positionChange: "same",
      },
      {
        position: 3,
        team: {
          name: "Royal Challengers Bangalore",
          logoUrl: "/cricket/generic-cricket-team-logo.png",
        },
        played: 14,
        won: 8,
        lost: 6,
        drawn: 0,
        points: 16,
        netRunRate: 0.235,
        form: ["W", "L", "W", "W", "L"],
        positionChange: "up",
      },
      {
        position: 4,
        team: {
          name: "Kolkata Knight Riders",
          logoUrl: "/cricket/generic-cricket-team-logo.png",
        },
        played: 14,
        won: 7,
        lost: 7,
        drawn: 0,
        points: 14,
        netRunRate: 0.147,
        form: ["L", "W", "L", "W", "W"],
        positionChange: "down",
      },
    ],
    matches: [
      {
        id: "match-1",
        date: "2023-03-31",
        time: "19:30 IST",
        teams: {
          team1: {
            name: "Chennai Super Kings",
            logoUrl: "/cricket/chennai-super-kings-logo.png",
          },
          team2: {
            name: "Mumbai Indians",
            logoUrl: "/cricket/mumbai-indians-logo.png",
          },
        },
        venue: "Wankhede Stadium, Mumbai",
        isCompleted: true,
        result: "Chennai Super Kings won by 5 wickets",
      },
      {
        id: "match-2",
        date: "2023-04-02",
        time: "15:30 IST",
        teams: {
          team1: {
            name: "Royal Challengers Bangalore",
            logoUrl: "/cricket/generic-cricket-team-logo.png",
          },
          team2: {
            name: "Kolkata Knight Riders",
            logoUrl: "/cricket/generic-cricket-team-logo.png",
          },
        },
        venue: "M. Chinnaswamy Stadium, Bengaluru",
        isCompleted: true,
        result: "Royal Challengers Bangalore won by 8 wickets",
      },
      {
        id: "match-3",
        date: "2023-04-03",
        time: "19:30 IST",
        teams: {
          team1: {
            name: "Delhi Capitals",
            logoUrl: "/cricket/generic-cricket-team-logo.png",
          },
          team2: {
            name: "Sunrisers Hyderabad",
            logoUrl: "/cricket/generic-cricket-team-logo.png",
          },
        },
        venue: "Arun Jaitley Stadium, Delhi",
        isCompleted: true,
        result: "Sunrisers Hyderabad won by 4 wickets",
      },
      {
        id: "match-4",
        date: "2023-05-28",
        time: "19:30 IST",
        teams: {
          team1: {
            name: "Chennai Super Kings",
            logoUrl: "/cricket/chennai-super-kings-logo.png",
          },
          team2: {
            name: "Mumbai Indians",
            logoUrl: "/cricket/mumbai-indians-logo.png",
          },
        },
        venue: "Narendra Modi Stadium, Ahmedabad",
        isCompleted: true,
        result: "Chennai Super Kings won by 5 wickets",
        isFinal: true,
      },
    ],
    statistics: {
      categories: [
        {
          id: "most-runs",
          name: "Most Runs",
          unit: "",
          players: [
            {
              id: "player-1",
              name: "Virat Kohli",
              team: {
                name: "Royal Challengers Bangalore",
                logoUrl: "/cricket/generic-cricket-team-logo.png",
              },
              avatarUrl: "/cricket/virat-kohli.png",
              value: 639,
              matches: 14,
            },
            {
              id: "player-2",
              name: "Rohit Sharma",
              team: {
                name: "Mumbai Indians",
                logoUrl: "/cricket/mumbai-indians-logo.png",
              },
              avatarUrl: "/rohit-sharma-cricketer.png",
              value: 578,
              matches: 14,
            },
            {
              id: "player-3",
              name: "MS Dhoni",
              team: {
                name: "Chennai Super Kings",
                logoUrl: "/cricket/chennai-super-kings-logo.png",
              },
              avatarUrl: "/placeholder-9vi85.png",
              value: 455,
              matches: 14,
            },
          ],
        },
        {
          id: "most-wickets",
          name: "Most Wickets",
          unit: "",
          players: [
            {
              id: "player-4",
              name: "Jasprit Bumrah",
              team: {
                name: "Mumbai Indians",
                logoUrl: "/cricket/mumbai-indians-logo.png",
              },
              avatarUrl: "/jasprit-bumrah-cricketer.png",
              value: 27,
              matches: 14,
            },
            {
              id: "player-5",
              name: "Ravindra Jadeja",
              team: {
                name: "Chennai Super Kings",
                logoUrl: "/cricket/chennai-super-kings-logo.png",
              },
              avatarUrl: "/ravindra-jadeja-cricketer.png",
              value: 22,
              matches: 14,
            },
            {
              id: "player-6",
              name: "Mohammed Siraj",
              team: {
                name: "Royal Challengers Bangalore",
                logoUrl: "/cricket/generic-cricket-team-logo.png",
              },
              avatarUrl: "/placeholder-22pke.png",
              value: 19,
              matches: 14,
            },
          ],
        },
        {
          id: "highest-strike-rate",
          name: "Highest Strike Rate",
          unit: "",
          players: [
            {
              id: "player-7",
              name: "Hardik Pandya",
              team: {
                name: "Mumbai Indians",
                logoUrl: "/cricket/mumbai-indians-logo.png",
              },
              avatarUrl: "/placeholder-9vi85.png",
              value: 191.5,
              matches: 14,
            },
            {
              id: "player-8",
              name: "Andre Russell",
              team: {
                name: "Kolkata Knight Riders",
                logoUrl: "/cricket/generic-cricket-team-logo.png",
              },
              avatarUrl: "/placeholder-22pke.png",
              value: 186.7,
              matches: 12,
            },
            {
              id: "player-9",
              name: "Rishabh Pant",
              team: {
                name: "Delhi Capitals",
                logoUrl: "/cricket/generic-cricket-team-logo.png",
              },
              avatarUrl: "/placeholder-9vi85.png",
              value: 173.2,
              matches: 14,
            },
          ],
        },
      ],
    },
    history: {
      winners: [
        {
          year: 2022,
          team: {
            name: "Gujarat Titans",
            logoUrl: "/cricket/generic-cricket-team-logo.png",
          },
          captain: "Hardik Pandya",
          venue: "Narendra Modi Stadium, Ahmedabad",
          result: "Defeated Rajasthan Royals by 7 wickets",
        },
        {
          year: 2021,
          team: {
            name: "Chennai Super Kings",
            logoUrl: "/cricket/chennai-super-kings-logo.png",
          },
          captain: "MS Dhoni",
          venue: "Dubai International Cricket Stadium",
          result: "Defeated Kolkata Knight Riders by 27 runs",
        },
        {
          year: 2020,
          team: {
            name: "Mumbai Indians",
            logoUrl: "/cricket/mumbai-indians-logo.png",
          },
          captain: "Rohit Sharma",
          venue: "Dubai International Cricket Stadium",
          result: "Defeated Delhi Capitals by 5 wickets",
        },
      ],
      records: [
        {
          type: "Highest Individual Score",
          player: {
            name: "Chris Gayle",
            team: "Royal Challengers Bangalore",
          },
          value: "175* runs",
          year: 2013,
        },
        {
          type: "Best Bowling Figures",
          player: {
            name: "Alzarri Joseph",
            team: "Mumbai Indians",
          },
          value: "6/12",
          year: 2019,
        },
        {
          type: "Highest Team Total",
          player: {
            name: "Royal Challengers Bangalore",
            team: "Royal Challengers Bangalore",
          },
          value: "263/5",
          year: 2013,
        },
        {
          type: "Most Sixes in an Innings",
          player: {
            name: "Chris Gayle",
            team: "Royal Challengers Bangalore",
          },
          value: "17 sixes",
          year: 2013,
        },
      ],
    },
    pulsePosts: [
      {
        id: "post-1",
        author: {
          name: "IPL Official",
          avatarUrl: "/user-avatar-1.png",
          verified: true,
        },
        content:
          "Congratulations to Chennai Super Kings on winning their 5th IPL title! What an incredible final against Mumbai Indians!",
        timestamp: "2023-05-28T22:45:00Z",
        likes: 12453,
        comments: 1876,
        shares: 3421,
        media: {
          type: "image",
          url: "/cricket/generic-cricket-team-logo.png",
        },
      },
      {
        id: "post-2",
        author: {
          name: "Cricket Analyst",
          avatarUrl: "/user-avatar-2.png",
          verified: true,
        },
        content:
          "Virat Kohli finishes as the top run-scorer of IPL 2023 with 639 runs. His consistency throughout the tournament has been remarkable!",
        timestamp: "2023-05-27T18:30:00Z",
        likes: 8765,
        comments: 1243,
        shares: 2198,
        media: {
          type: "image",
          url: "/cricket/virat-kohli.png",
        },
      },
      {
        id: "post-3",
        author: {
          name: "Cricket Fan",
          avatarUrl: "/user-avatar-3.png",
          verified: false,
        },
        content:
          "What a tournament! Can't wait for IPL 2024 already. Who do you think will be the top contenders next year?",
        timestamp: "2023-05-29T10:15:00Z",
        likes: 3421,
        comments: 876,
        shares: 543,
        media: null,
      },
    ],
  }
}

export function getMockTournamentsList() {
  return [
    {
      id: "ipl-2023",
      name: "Indian Premier League 2023",
      shortName: "IPL 2023",
      logoUrl: "/cricket/ipl-logo.png",
      startDate: "2023-03-31",
      endDate: "2023-05-28",
      status: "completed",
      winner: "Chennai Super Kings",
    },
    {
      id: "wc-2023",
      name: "ICC Cricket World Cup 2023",
      shortName: "WC 2023",
      logoUrl: "/cricket/world-cup-logo.png",
      startDate: "2023-10-05",
      endDate: "2023-11-19",
      status: "upcoming",
      winner: null,
    },
    {
      id: "ind-aus-2023",
      name: "India vs Australia Series 2023",
      shortName: "IND v AUS 2023",
      logoUrl: "/cricket/ind-aus-series.png",
      startDate: "2023-09-22",
      endDate: "2023-10-03",
      status: "upcoming",
      winner: null,
    },
    {
      id: "t20-wc-2022",
      name: "ICC T20 World Cup 2022",
      shortName: "T20 WC 2022",
      logoUrl: "/cricket/world-cup-logo.png",
      startDate: "2022-10-16",
      endDate: "2022-11-13",
      status: "completed",
      winner: "England",
    },
  ]
}

export function getMockUpcomingMatches() {
  return [
    {
      id: "match-101",
      tournament: {
        id: "wc-2023",
        name: "ICC Cricket World Cup 2023",
        logoUrl: "/cricket/world-cup-logo.png",
      },
      date: "2023-10-05",
      time: "14:30 IST",
      teams: {
        team1: {
          id: "ind",
          name: "India",
          logoUrl: "/cricket/india-logo.png",
        },
        team2: {
          id: "aus",
          name: "Australia",
          logoUrl: "/cricket/australia-logo.png",
        },
      },
      venue: "Narendra Modi Stadium, Ahmedabad",
      isHighlighted: true,
    },
    {
      id: "match-102",
      tournament: {
        id: "wc-2023",
        name: "ICC Cricket World Cup 2023",
        logoUrl: "/cricket/world-cup-logo.png",
      },
      date: "2023-10-06",
      time: "14:30 IST",
      teams: {
        team1: {
          id: "eng",
          name: "England",
          logoUrl: "/cricket/england-logo.png",
        },
        team2: {
          id: "nz",
          name: "New Zealand",
          logoUrl: "/cricket/new-zealand-logo.png",
        },
      },
      venue: "Eden Gardens, Kolkata",
      isHighlighted: false,
    },
    {
      id: "match-103",
      tournament: {
        id: "wc-2023",
        name: "ICC Cricket World Cup 2023",
        logoUrl: "/cricket/world-cup-logo.png",
      },
      date: "2023-10-07",
      time: "14:30 IST",
      teams: {
        team1: {
          id: "sa",
          name: "South Africa",
          logoUrl: "/cricket/south-africa-logo.png",
        },
        team2: {
          id: "pak",
          name: "Pakistan",
          logoUrl: "/cricket/pakistan-logo.png",
        },
      },
      venue: "M. A. Chidambaram Stadium, Chennai",
      isHighlighted: false,
    },
  ]
}
