"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PlayerProfileHero } from "@/components/cricket/player-profile/player-profile-hero"
import { CareerStatisticsSection } from "@/components/cricket/player-profile/career-statistics-section"
import { BiographySection } from "@/components/cricket/player-profile/biography-section"
import { CareerHighlightsCard } from "@/components/cricket/player-profile/career-highlights-card"
import { MatchHistorySection } from "@/components/cricket/player-profile/match-history-section"
import { AwardsSection } from "@/components/cricket/player-profile/awards-section"
import { FanCommentsSection } from "@/components/cricket/player-profile/fan-comments-section"

// Mock data for Virat Kohli
const MOCK_PLAYER_DATA = {
  id: "virat-kohli",
  name: "Virat Kohli",
  fullName: "Virat Kohli",
  role: "Batsman",
  battingStyle: "Right-handed",
  bowlingStyle: "Right-arm medium",
  country: "India",
  countryCode: "india",
  dateOfBirth: "November 5, 1988",
  age: 34,
  teams: ["India", "Royal Challengers Bangalore", "Delhi"],
  imageUrl: "/cricket/virat-kohli.png",
  coverImageUrl: "/cricket/ind-aus-series.png",
  isFollowing: true,
  isFavorite: true,
  rating: {
    batting: 95,
    bowling: 30,
    fielding: 85,
  },
}

const MOCK_PLAYER_STATS = {
  batting: {
    test: {
      matches: 108,
      innings: 183,
      runs: 8416,
      average: 49.95,
      strikeRate: 55.64,
      hundreds: 27,
      fifties: 28,
      highestScore: "254*",
      notOuts: 11,
      fours: 894,
      sixes: 24,
    },
    odi: {
      matches: 275,
      innings: 265,
      runs: 12898,
      average: 57.32,
      strikeRate: 93.62,
      hundreds: 46,
      fifties: 65,
      highestScore: "183",
      notOuts: 40,
      fours: 1211,
      sixes: 139,
    },
    t20i: {
      matches: 115,
      innings: 107,
      runs: 4008,
      average: 52.73,
      strikeRate: 137.96,
      hundreds: 1,
      fifties: 37,
      highestScore: "122*",
      notOuts: 31,
      fours: 356,
      sixes: 118,
    },
  },
  bowling: {
    test: {
      matches: 108,
      innings: 38,
      wickets: 0,
      average: 0,
      economy: 3.86,
      bestFigures: "0/16",
      fiveWickets: 0,
    },
    odi: {
      matches: 275,
      innings: 50,
      wickets: 4,
      average: 166.25,
      economy: 6.22,
      bestFigures: "1/15",
      fiveWickets: 0,
    },
    t20i: {
      matches: 115,
      innings: 13,
      wickets: 4,
      average: 77.0,
      economy: 8.14,
      bestFigures: "1/13",
      fiveWickets: 0,
    },
  },
  performanceByYear: [
    { year: 2010, testRuns: 202, odiRuns: 995, t20iRuns: 118 },
    { year: 2011, testRuns: 358, odiRuns: 1381, t20iRuns: 97 },
    { year: 2012, testRuns: 689, odiRuns: 1026, t20iRuns: 289 },
    { year: 2013, testRuns: 616, odiRuns: 1268, t20iRuns: 115 },
    { year: 2014, testRuns: 739, odiRuns: 1054, t20iRuns: 77 },
    { year: 2015, testRuns: 640, odiRuns: 623, t20iRuns: 43 },
    { year: 2016, testRuns: 1215, odiRuns: 739, t20iRuns: 641 },
    { year: 2017, testRuns: 1059, odiRuns: 1460, t20iRuns: 299 },
    { year: 2018, testRuns: 1322, odiRuns: 1202, t20iRuns: 211 },
    { year: 2019, testRuns: 612, odiRuns: 1377, t20iRuns: 254 },
    { year: 2020, testRuns: 116, odiRuns: 431, t20iRuns: 0 },
    { year: 2021, testRuns: 536, odiRuns: 129, t20iRuns: 299 },
    { year: 2022, testRuns: 265, odiRuns: 302, t20iRuns: 781 },
    { year: 2023, testRuns: 557, odiRuns: 911, t20iRuns: 784 },
  ],
  performanceByOpposition: [
    { opposition: "Australia", testRuns: 1352, odiRuns: 2083, t20iRuns: 718 },
    { opposition: "England", testRuns: 1991, odiRuns: 1349, t20iRuns: 589 },
    { opposition: "South Africa", testRuns: 1236, odiRuns: 1287, t20iRuns: 467 },
    { opposition: "West Indies", testRuns: 898, odiRuns: 1142, t20iRuns: 491 },
    { opposition: "New Zealand", testRuns: 866, odiRuns: 1378, t20iRuns: 378 },
    { opposition: "Sri Lanka", testRuns: 1055, odiRuns: 2220, t20iRuns: 339 },
    { opposition: "Pakistan", testRuns: 0, odiRuns: 536, t20iRuns: 461 },
    { opposition: "Bangladesh", testRuns: 683, odiRuns: 808, t20iRuns: 169 },
  ],
}

const MOCK_PLAYER_BIO = {
  fullName: "Virat Kohli",
  nickname: "King Kohli",
  bio: "Virat Kohli is widely regarded as one of the greatest batsmen in the history of cricket. Born in Delhi, India, he has established himself as a prolific run-scorer across all formats of the game. Known for his aggressive batting style and exceptional fitness, Kohli has broken numerous records and set new standards in modern cricket. He captained the Indian national team from 2013 to 2022, leading India to numerous victories and establishing the team as a dominant force in world cricket.",
  careerHighlights: [
    "Fastest batsman to reach 10,000 runs in ODI cricket",
    "Second highest century-maker in ODI cricket history",
    "Led India to their first-ever Test series win in Australia in 2018-19",
    "ICC Cricketer of the Year in 2017 and 2018",
    "Received the Rajiv Gandhi Khel Ratna Award, India's highest sporting honor, in 2018",
  ],
  personalLife:
    "Off the field, Kohli is known for his disciplined lifestyle, fitness regimen, and philanthropic work through the Virat Kohli Foundation. He is married to Bollywood actress Anushka Sharma, and they have a daughter named Vamika. Kohli is also a successful entrepreneur with his own fashion line, restaurant chain, and investments in various startups.",
  imageUrl: "/cricket/virat-kohli.png",
}

const MOCK_CAREER_HIGHLIGHTS = [
  {
    id: "1",
    title: "Double Century Against South Africa",
    date: "October 11, 2019",
    description:
      "Scored a magnificent 254* against South Africa in Pune, his highest Test score and seventh double century.",
    imageUrl: "/cricket/ind-aus-series.png",
    achievement: "254* runs (336 balls, 33 fours, 2 sixes)",
    venue: "Pune",
    opposition: "South Africa",
  },
  {
    id: "2",
    title: "ODI Career-Best Against Pakistan",
    date: "March 18, 2012",
    description:
      "Smashed a career-best 183 against Pakistan in the Asia Cup, the highest individual score in the tournament's history.",
    imageUrl: "/cricket/ind-aus-series.png",
    achievement: "183 runs (148 balls, 22 fours, 1 six)",
    venue: "Dhaka",
    opposition: "Pakistan",
  },
  {
    id: "3",
    title: "T20 World Cup Heroics",
    date: "March 27, 2016",
    description:
      "Led India to victory with an unbeaten 82 off 51 balls against Australia in the T20 World Cup, showcasing his ability to perform under pressure.",
    imageUrl: "/cricket/ind-aus-series.png",
    achievement: "82* runs (51 balls, 9 fours, 2 sixes)",
    venue: "Mohali",
    opposition: "Australia",
  },
]

const MOCK_MATCH_HISTORY = {
  test: [
    {
      id: "t1",
      date: "January 3-7, 2023",
      venue: "Sydney Cricket Ground",
      opposition: "Australia",
      oppositionFlag: "australia",
      result: "India won by 6 wickets",
      playerPerformance: {
        batting: {
          runs: 79,
          balls: 142,
          fours: 8,
          sixes: 1,
          notOut: false,
        },
      },
    },
    {
      id: "t2",
      date: "December 26-30, 2022",
      venue: "Melbourne Cricket Ground",
      opposition: "Australia",
      oppositionFlag: "australia",
      result: "Match Drawn",
      playerPerformance: {
        batting: {
          runs: 116,
          balls: 225,
          fours: 12,
          sixes: 0,
          notOut: false,
        },
      },
    },
    {
      id: "t3",
      date: "November 25-29, 2022",
      venue: "Eden Gardens",
      opposition: "England",
      oppositionFlag: "england",
      result: "India won by an innings and 25 runs",
      playerPerformance: {
        batting: {
          runs: 136,
          balls: 198,
          fours: 18,
          sixes: 0,
          notOut: true,
        },
      },
    },
    {
      id: "t4",
      date: "October 14-18, 2022",
      venue: "Wankhede Stadium",
      opposition: "New Zealand",
      oppositionFlag: "new-zealand",
      result: "India lost by 8 wickets",
      playerPerformance: {
        batting: {
          runs: 45,
          balls: 78,
          fours: 5,
          sixes: 0,
          notOut: false,
        },
        bowling: {
          overs: 3,
          maidens: 0,
          runs: 12,
          wickets: 0,
          economy: 4.0,
        },
      },
    },
    {
      id: "t5",
      date: "September 1-5, 2022",
      venue: "M. Chinnaswamy Stadium",
      opposition: "South Africa",
      oppositionFlag: "south-africa",
      result: "India won by 113 runs",
      playerPerformance: {
        batting: {
          runs: 153,
          balls: 217,
          fours: 15,
          sixes: 2,
          notOut: false,
        },
      },
    },
    {
      id: "t6",
      date: "August 12-16, 2022",
      venue: "Lord's Cricket Ground",
      opposition: "England",
      oppositionFlag: "england",
      result: "Match Drawn",
      playerPerformance: {
        batting: {
          runs: 42,
          balls: 103,
          fours: 3,
          sixes: 0,
          notOut: false,
        },
      },
    },
  ],
  odi: [
    {
      id: "o1",
      date: "March 22, 2023",
      venue: "Wankhede Stadium",
      opposition: "Australia",
      oppositionFlag: "australia",
      result: "India won by 5 wickets",
      playerPerformance: {
        batting: {
          runs: 85,
          balls: 81,
          fours: 9,
          sixes: 2,
          notOut: false,
        },
      },
    },
    {
      id: "o2",
      date: "March 19, 2023",
      venue: "Eden Gardens",
      opposition: "Australia",
      oppositionFlag: "australia",
      result: "Australia won by 21 runs",
      playerPerformance: {
        batting: {
          runs: 31,
          balls: 35,
          fours: 3,
          sixes: 0,
          notOut: false,
        },
      },
    },
    {
      id: "o3",
      date: "March 17, 2023",
      venue: "M. Chinnaswamy Stadium",
      opposition: "Australia",
      oppositionFlag: "australia",
      result: "India won by 6 wickets",
      playerPerformance: {
        batting: {
          runs: 123,
          balls: 95,
          fours: 11,
          sixes: 4,
          notOut: true,
        },
      },
    },
    {
      id: "o4",
      date: "February 14, 2023",
      venue: "Narendra Modi Stadium",
      opposition: "New Zealand",
      oppositionFlag: "new-zealand",
      result: "India won by 90 runs",
      playerPerformance: {
        batting: {
          runs: 62,
          balls: 48,
          fours: 6,
          sixes: 2,
          notOut: false,
        },
        bowling: {
          overs: 2,
          maidens: 0,
          runs: 12,
          wickets: 0,
          economy: 6.0,
        },
      },
    },
    {
      id: "o5",
      date: "February 11, 2023",
      venue: "Holkar Cricket Stadium",
      opposition: "New Zealand",
      oppositionFlag: "new-zealand",
      result: "New Zealand won by 18 runs",
      playerPerformance: {
        batting: {
          runs: 45,
          balls: 51,
          fours: 5,
          sixes: 0,
          notOut: false,
        },
      },
    },
  ],
  t20i: [
    {
      id: "t20-1",
      date: "January 29, 2023",
      venue: "Narendra Modi Stadium",
      opposition: "New Zealand",
      oppositionFlag: "new-zealand",
      result: "India won by 6 wickets",
      playerPerformance: {
        batting: {
          runs: 65,
          balls: 42,
          fours: 6,
          sixes: 3,
          notOut: true,
        },
      },
    },
    {
      id: "t20-2",
      date: "January 27, 2023",
      venue: "JSCA International Stadium",
      opposition: "New Zealand",
      oppositionFlag: "new-zealand",
      result: "New Zealand won by 21 runs",
      playerPerformance: {
        batting: {
          runs: 11,
          balls: 9,
          fours: 1,
          sixes: 0,
          notOut: false,
        },
      },
    },
    {
      id: "t20-3",
      date: "January 24, 2023",
      venue: "Ekana Cricket Stadium",
      opposition: "New Zealand",
      oppositionFlag: "new-zealand",
      result: "India won by 8 wickets",
      playerPerformance: {
        batting: {
          runs: 36,
          balls: 27,
          fours: 3,
          sixes: 1,
          notOut: true,
        },
      },
    },
    {
      id: "t20-4",
      date: "November 10, 2022",
      venue: "Adelaide Oval",
      opposition: "England",
      oppositionFlag: "england",
      result: "England won by 10 wickets",
      playerPerformance: {
        batting: {
          runs: 50,
          balls: 40,
          fours: 4,
          sixes: 1,
          notOut: false,
        },
      },
    },
    {
      id: "t20-5",
      date: "November 6, 2022",
      venue: "Melbourne Cricket Ground",
      opposition: "Zimbabwe",
      oppositionFlag: "south-africa",
      result: "India won by 71 runs",
      playerPerformance: {
        batting: {
          runs: 26,
          balls: 25,
          fours: 1,
          sixes: 1,
          notOut: false,
        },
      },
    },
  ],
}

const MOCK_AWARDS = [
  {
    id: "a1",
    title: "Rajiv Gandhi Khel Ratna Award",
    year: "2018",
    description: "India's highest sporting honor awarded for exceptional performance in cricket over multiple years.",
    imageUrl: "/khel-ratna-award.png",
    category: "National Honor",
  },
  {
    id: "a2",
    title: "ICC Cricketer of the Year",
    year: "2017, 2018",
    description:
      "Awarded the Sir Garfield Sobers Trophy for being the best overall international cricketer of the year.",
    imageUrl: "/cricket/ipl-logo.png",
    category: "International Award",
  },
  {
    id: "a3",
    title: "Padma Shri",
    year: "2017",
    description: "India's fourth-highest civilian award for distinguished contribution to sports.",
    imageUrl: "/khel-ratna-award.png",
    category: "National Honor",
  },
  {
    id: "a4",
    title: "ICC ODI Player of the Year",
    year: "2012, 2017, 2018",
    description: "Recognized as the best One Day International cricket player for outstanding performance.",
    imageUrl: "/cricket/world-cup-logo.png",
    category: "International Award",
  },
]

const MOCK_COMMENTS = [
  {
    id: "c1",
    user: {
      name: "CricketFan123",
      avatar: "/user-avatar-1.png",
    },
    date: "2 days ago",
    content:
      "Virat Kohli is undoubtedly the greatest batsman of this generation. His consistency across all formats is unmatched. I've been following his career since his U-19 days, and his transformation has been incredible!",
    likes: 156,
    userLiked: false,
  },
  {
    id: "c2",
    user: {
      name: "SportsTalk",
      avatar: "/user-avatar-2.png",
    },
    date: "1 week ago",
    content:
      "His technique against fast bowling is a masterclass for young cricketers. The way he handles pressure situations makes him special. Remember that innings against Australia in the 2016 T20 World Cup? Pure class!",
    likes: 98,
    userLiked: true,
  },
  {
    id: "c3",
    user: {
      name: "CricketAnalyst",
      avatar: "/user-avatar-3.png",
    },
    date: "2 weeks ago",
    content:
      "While his batting is exceptional, I think his contribution as a captain in transforming Indian cricket's fitness culture is equally significant. He raised the bar for everyone in the team.",
    likes: 72,
    userLiked: false,
  },
]

export default function PlayerProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("stats")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#282828] border-t-[#00BFFF] rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <PlayerProfileHero player={MOCK_PLAYER_DATA} />

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="stats" onValueChange={setActiveTab} className="w-full">
          <div className="bg-[#282828] rounded-lg p-2 mb-8">
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-6 bg-[#1A1A1A]">
              <TabsTrigger value="stats" className="data-[state=active]:bg-[#3A3A3A]">
                Statistics
              </TabsTrigger>
              <TabsTrigger value="bio" className="data-[state=active]:bg-[#3A3A3A]">
                Biography
              </TabsTrigger>
              <TabsTrigger value="highlights" className="data-[state=active]:bg-[#3A3A3A]">
                Highlights
              </TabsTrigger>
              <TabsTrigger value="matches" className="data-[state=active]:bg-[#3A3A3A]">
                Matches
              </TabsTrigger>
              <TabsTrigger value="awards" className="data-[state=active]:bg-[#3A3A3A]">
                Awards
              </TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-[#3A3A3A]">
                Fan Zone
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="stats">
            <CareerStatisticsSection playerStats={MOCK_PLAYER_STATS} />
          </TabsContent>

          <TabsContent value="bio">
            <BiographySection playerBio={MOCK_PLAYER_BIO} />
          </TabsContent>

          <TabsContent value="highlights">
            <CareerHighlightsCard highlights={MOCK_CAREER_HIGHLIGHTS} />
          </TabsContent>

          <TabsContent value="matches">
            <MatchHistorySection matchHistory={MOCK_MATCH_HISTORY} />
          </TabsContent>

          <TabsContent value="awards">
            <AwardsSection awards={MOCK_AWARDS} />
          </TabsContent>

          <TabsContent value="comments">
            <FanCommentsSection comments={MOCK_COMMENTS} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
