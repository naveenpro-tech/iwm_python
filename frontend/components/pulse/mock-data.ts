import type { PulseType } from "./types"
import { v4 as uuidv4 } from "uuid"

// Helper function to generate random number within range
const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

// Helper function to generate random date within last 7 days
const randomRecentDate = () => {
  const now = new Date()
  const daysAgo = randomNumber(0, 7)
  const hoursAgo = randomNumber(0, 23)
  const minutesAgo = randomNumber(0, 59)

  now.setDate(now.getDate() - daysAgo)
  now.setHours(now.getHours() - hoursAgo)
  now.setMinutes(now.getMinutes() - minutesAgo)

  return now.toISOString()
}

// Generate mock pulses
export const mockPulses: PulseType[] = [
  {
    id: uuidv4(),
    userId: "user1",
    userInfo: {
      username: "christophernolan",
      displayName: "Christopher Nolan",
      avatarUrl: "/christopher-nolan.png",
      isVerified: true,
      verificationLevel: "celebrity",
      isFollowing: true,
    },
    content: {
      text: "Excited to announce that Oppenheimer will be available for streaming next month. It's been an incredible journey bringing this story to life. Thank you to everyone who supported the film in theaters!",
      linkedContent: {
        type: "movie",
        id: "movie1",
        title: "Oppenheimer",
        posterUrl: "/oppenheimer-inspired-poster.png",
      },
      hashtags: ["#Oppenheimer", "#FilmAnnouncement"],
    },
    engagement: {
      reactions: {
        love: 8542,
        fire: 3201,
        mindblown: 4562,
        laugh: 1203,
        sad: 89,
        angry: 12,
        total: 17609,
      },
      comments: 2453,
      shares: 1876,
      userReaction: "mindblown",
      hasCommented: false,
      hasShared: true,
      hasBookmarked: true,
    },
    timestamp: randomRecentDate(),
  },
  {
    id: uuidv4(),
    userId: "user2",
    userInfo: {
      username: "filmcritic",
      displayName: "Cinema Insights",
      avatarUrl: "/user-avatar-2.png",
      isVerified: true,
      verificationLevel: "industry",
      isFollowing: false,
    },
    content: {
      text: "Just finished watching 'Poor Things' and I'm absolutely blown away by Emma Stone's performance. Yorgos Lanthimos has created another masterpiece that challenges conventional storytelling. The visual design and cinematography are unlike anything I've seen this year. Highly recommended! #PoorThings #EmmaStone #FilmReview",
      media: [
        {
          type: "image",
          url: "/poor-things-poster.png",
        },
      ],
      hashtags: ["#PoorThings", "#EmmaStone", "#FilmReview"],
    },
    engagement: {
      reactions: {
        love: 1245,
        fire: 876,
        mindblown: 1532,
        laugh: 432,
        sad: 21,
        angry: 5,
        total: 4111,
      },
      comments: 342,
      shares: 187,
      hasCommented: true,
      hasShared: false,
      hasBookmarked: false,
    },
    timestamp: randomRecentDate(),
  },
  {
    id: uuidv4(),
    userId: "user3",
    userInfo: {
      username: "cricketfan",
      displayName: "Cricket Enthusiast",
      avatarUrl: "/user-avatar-3.png",
      isVerified: false,
      isFollowing: true,
    },
    content: {
      text: "What an incredible match between India and Australia! The last over was absolutely nail-biting. Virat Kohli's century was the difference maker. Looking forward to the next match in the series!",
      linkedContent: {
        type: "cricket",
        id: "match1",
        title: "India vs Australia - 2nd ODI",
        posterUrl: "/cricket/ind-aus-series.png",
      },
      hashtags: ["#INDvAUS", "#CricketFever", "#ViratKohli"],
    },
    engagement: {
      reactions: {
        love: 3421,
        fire: 2876,
        mindblown: 1987,
        laugh: 543,
        sad: 321,
        angry: 98,
        total: 9246,
      },
      comments: 876,
      shares: 432,
      userReaction: "fire",
      hasCommented: false,
      hasShared: true,
      hasBookmarked: false,
    },
    timestamp: randomRecentDate(),
  },
  {
    id: uuidv4(),
    userId: "user4",
    userInfo: {
      username: "filmstudent",
      displayName: "Aspiring Filmmaker",
      avatarUrl: "/user-avatar-4.png",
      isVerified: false,
      isFollowing: false,
    },
    content: {
      text: "Studying the cinematography techniques in 'Dune: Part Two'. Denis Villeneuve and Greig Fraser have created such a distinctive visual language for this universe. The use of scale and perspective is particularly impressive. Any other film students analyzing this masterpiece?",
      media: [
        {
          type: "image",
          url: "/dune-part-two-poster.png",
        },
        {
          type: "image",
          url: "/cinematic-scene.png",
        },
      ],
      hashtags: ["#Dune2", "#Cinematography", "#FilmStudy"],
    },
    engagement: {
      reactions: {
        love: 543,
        fire: 321,
        mindblown: 432,
        laugh: 87,
        sad: 12,
        angry: 3,
        total: 1398,
      },
      comments: 98,
      shares: 54,
      hasCommented: false,
      hasShared: false,
      hasBookmarked: false,
    },
    timestamp: randomRecentDate(),
  },
  {
    id: uuidv4(),
    userId: "user5",
    userInfo: {
      username: "moviebuff",
      displayName: "Cinema Aficionado",
      avatarUrl: "/user-avatar-5.png",
      isVerified: true,
      verificationLevel: "basic",
      isFollowing: true,
    },
    content: {
      text: "My top 5 films of the year so far:\n1. Oppenheimer\n2. Poor Things\n3. Dune: Part Two\n4. Civil War\n5. Challengers\n\nWhat's on your list? Any overlooked gems I should check out?",
      hashtags: ["#TopFilms", "#MovieRankings", "#FilmDiscussion"],
    },
    engagement: {
      reactions: {
        love: 876,
        fire: 432,
        mindblown: 321,
        laugh: 98,
        sad: 43,
        angry: 21,
        total: 1791,
      },
      comments: 432,
      shares: 87,
      hasCommented: true,
      hasShared: false,
      hasBookmarked: true,
    },
    timestamp: randomRecentDate(),
  },
  {
    id: uuidv4(),
    userId: "user6",
    userInfo: {
      username: "zendaya",
      displayName: "Zendaya",
      avatarUrl: "/actress-portrait.png",
      isVerified: true,
      verificationLevel: "celebrity",
      isFollowing: false,
    },
    content: {
      text: "So grateful for the incredible response to Challengers! Working with Luca Guadagnino and my amazing co-stars was such a rewarding experience. Thank you to everyone who has supported the film!",
      media: [
        {
          type: "image",
          url: "/challengers-poster.png",
        },
        {
          type: "image",
          url: "/challengers-tennis-match.png",
        },
      ],
      hashtags: ["#Challengers", "#NewFilm", "#ThankYou"],
    },
    engagement: {
      reactions: {
        love: 12543,
        fire: 8765,
        mindblown: 6543,
        laugh: 3210,
        sad: 432,
        angry: 98,
        total: 31591,
      },
      comments: 4321,
      shares: 2109,
      hasCommented: false,
      hasShared: false,
      hasBookmarked: true,
    },
    timestamp: randomRecentDate(),
  },
  {
    id: uuidv4(),
    userId: "user7",
    userInfo: {
      username: "sportscaster",
      displayName: "Cricket Commentator",
      avatarUrl: "/user-avatar-6.png",
      isVerified: true,
      verificationLevel: "industry",
      isFollowing: true,
    },
    content: {
      text: "The IPL 2024 is shaping up to be one of the most competitive seasons yet! Mumbai Indians and Chennai Super Kings are looking strong, but don't count out the Royal Challengers Bangalore. Who's your pick to win this year?",
      media: [
        {
          type: "image",
          url: "/cricket/ipl-logo.png",
        },
      ],
      hashtags: ["#IPL2024", "#CricketFever", "#T20Cricket"],
    },
    engagement: {
      reactions: {
        love: 2109,
        fire: 1876,
        mindblown: 987,
        laugh: 654,
        sad: 321,
        angry: 98,
        total: 6045,
      },
      comments: 1543,
      shares: 876,
      userReaction: "love",
      hasCommented: true,
      hasShared: true,
      hasBookmarked: false,
    },
    timestamp: randomRecentDate(),
  },
  {
    id: uuidv4(),
    userId: "user8",
    userInfo: {
      username: "filmdirector",
      displayName: "Indie Filmmaker",
      avatarUrl: "/user-avatar-7.png",
      isVerified: true,
      verificationLevel: "industry",
      isFollowing: false,
    },
    content: {
      text: "Just wrapped principal photography on my new short film! Six intense days of shooting, an incredible cast and crew, and some of the most beautiful locations. Can't wait to share more details soon. The post-production journey begins now!",
      media: [
        {
          type: "image",
          url: "/film-set.png",
        },
      ],
      hashtags: ["#FilmProduction", "#ShortFilm", "#IndieFilmmaking"],
    },
    engagement: {
      reactions: {
        love: 876,
        fire: 543,
        mindblown: 321,
        laugh: 98,
        sad: 43,
        angry: 12,
        total: 1893,
      },
      comments: 154,
      shares: 87,
      hasCommented: false,
      hasShared: false,
      hasBookmarked: false,
    },
    timestamp: randomRecentDate(),
  },
  {
    id: uuidv4(),
    userId: "user9",
    userInfo: {
      username: "cinemaphile",
      displayName: "Film Historian",
      avatarUrl: "/user-avatar-8.png",
      isVerified: true,
      verificationLevel: "industry",
      isFollowing: true,
    },
    content: {
      text: "Today marks the 50th anniversary of Francis Ford Coppola's 'The Godfather Part II' (1974). A rare sequel that many consider superior to the original, it expanded the Corleone saga both forward and backward in time. What's your favorite scene from this masterpiece?",
      media: [
        {
          type: "image",
          url: "/classic-mob-poster.png",
        },
      ],
      hashtags: ["#TheGodfatherPartII", "#FilmAnniversary", "#FrancisFordCoppola"],
    },
    engagement: {
      reactions: {
        love: 3254,
        fire: 1876,
        mindblown: 2109,
        laugh: 432,
        sad: 321,
        angry: 54,
        total: 8046,
      },
      comments: 987,
      shares: 654,
      userReaction: "love",
      hasCommented: true,
      hasShared: true,
      hasBookmarked: true,
    },
    timestamp: randomRecentDate(),
  },
  {
    id: uuidv4(),
    userId: "user10",
    userInfo: {
      username: "filmfestival",
      displayName: "Global Film Festivals",
      avatarUrl: "/user-avatar-9.png",
      isVerified: true,
      verificationLevel: "industry",
      isFollowing: false,
    },
    content: {
      text: "Announcing our official selection for this year's festival! We received over 5,000 submissions from 120 countries and have selected 200 films across all categories. The full program will be available next week. Early bird tickets go on sale this Friday!",
      hashtags: ["#FilmFestival", "#OfficialSelection", "#IndieFilm"],
    },
    engagement: {
      reactions: {
        love: 1543,
        fire: 876,
        mindblown: 654,
        laugh: 321,
        sad: 98,
        angry: 43,
        total: 3535,
      },
      comments: 432,
      shares: 321,
      hasCommented: false,
      hasShared: false,
      hasBookmarked: false,
    },
    timestamp: randomRecentDate(),
  },
  {
    id: uuidv4(),
    userId: "user11",
    userInfo: {
      username: "cillianmurphy",
      displayName: "Cillian Murphy",
      avatarUrl: "/cillian-murphy-portrait.png",
      isVerified: true,
      verificationLevel: "celebrity",
      isFollowing: true,
    },
    content: {
      text: "Reflecting on the journey of bringing J. Robert Oppenheimer to life. This role challenged me in ways I never expected. Eternally grateful to Christopher Nolan for his trust and vision. The response from audiences worldwide has been overwhelming.",
      linkedContent: {
        type: "movie",
        id: "movie1",
        title: "Oppenheimer",
        posterUrl: "/oppenheimer-inspired-poster.png",
      },
      hashtags: ["#Oppenheimer", "#ChristopherNolan"],
    },
    engagement: {
      reactions: {
        love: 15432,
        fire: 9876,
        mindblown: 7654,
        laugh: 2109,
        sad: 876,
        angry: 321,
        total: 36268,
      },
      comments: 5432,
      shares: 3210,
      hasCommented: false,
      hasShared: true,
      hasBookmarked: true,
    },
    timestamp: randomRecentDate(),
  },
  {
    id: uuidv4(),
    userId: "user12",
    userInfo: {
      username: "viratkohli",
      displayName: "Virat Kohli",
      avatarUrl: "/cricket/virat-kohli.png",
      isVerified: true,
      verificationLevel: "celebrity",
      isFollowing: false,
    },
    content: {
      text: "What a match! Proud of the team's performance today. Special thanks to all the fans who came out to support us. Your energy keeps us going! 🇮🇳 #TeamIndia",
      media: [
        {
          type: "image",
          url: "/cricket/ind-aus-series.png",
        },
      ],
      hashtags: ["#TeamIndia", "#BleedBlue", "#INDvAUS"],
    },
    engagement: {
      reactions: {
        love: 25432,
        fire: 18765,
        mindblown: 12543,
        laugh: 8765,
        sad: 1543,
        angry: 876,
        total: 67924,
      },
      comments: 9876,
      shares: 7654,
      hasCommented: true,
      hasShared: true,
      hasBookmarked: false,
    },
    timestamp: randomRecentDate(),
  },
  {
    id: uuidv4(),
    userId: "user13",
    userInfo: {
      username: "filmreview",
      displayName: "The Film Critic",
      avatarUrl: "/user-avatar-1.png",
      isVerified: true,
      verificationLevel: "industry",
      isFollowing: true,
    },
    content: {
      text: "REVIEW: 'Civil War' (2024) - Alex Garland delivers a haunting, visceral look at a fractured America. The cinematography is stunning, with unforgettable imagery that will stay with you long after the credits roll. Kirsten Dunst gives one of her best performances. ★★★★½",
      media: [
        {
          type: "image",
          url: "/civil-war-movie-poster.png",
        },
      ],
      hashtags: ["#CivilWar", "#MovieReview", "#AlexGarland"],
    },
    engagement: {
      reactions: {
        love: 2109,
        fire: 1543,
        mindblown: 987,
        laugh: 432,
        sad: 321,
        angry: 154,
        total: 5546,
      },
      comments: 876,
      shares: 543,
      userReaction: "mindblown",
      hasCommented: true,
      hasShared: false,
      hasBookmarked: true,
    },
    timestamp: randomRecentDate(),
  },
  {
    id: uuidv4(),
    userId: "user14",
    userInfo: {
      username: "filmstudio",
      displayName: "Universal Pictures",
      avatarUrl: "/user-avatar-4.png",
      isVerified: true,
      verificationLevel: "industry",
      isFollowing: false,
    },
    content: {
      text: "Announcing our upcoming slate for 2025! We're thrilled to bring you new films from some of the most exciting directors working today. Stay tuned for trailers and more information in the coming months.",
      hashtags: ["#ComingSoon", "#MovieAnnouncement", "#2025Films"],
    },
    engagement: {
      reactions: {
        love: 4321,
        fire: 2109,
        mindblown: 1543,
        laugh: 876,
        sad: 432,
        angry: 321,
        total: 9602,
      },
      comments: 1876,
      shares: 987,
      hasCommented: false,
      hasShared: false,
      hasBookmarked: false,
    },
    timestamp: randomRecentDate(),
  },
  {
    id: uuidv4(),
    userId: "user15",
    userInfo: {
      username: "cinematographer",
      displayName: "Roger Deakins",
      avatarUrl: "/older-cinematographer.png",
      isVerified: true,
      verificationLevel: "celebrity",
      isFollowing: true,
    },
    content: {
      text: "Light is everything in cinematography. It's not just about making things visible, but about creating mood, depth, and emotion. Always ask yourself what story the light is telling.",
      media: [
        {
          type: "image",
          url: "/cinematic-lighting.png",
        },
      ],
      hashtags: ["#Cinematography", "#FilmLighting", "#VisualStorytelling"],
    },
    engagement: {
      reactions: {
        love: 5432,
        fire: 3210,
        mindblown: 2109,
        laugh: 876,
        sad: 432,
        angry: 321,
        total: 12380,
      },
      comments: 1543,
      shares: 987,
      userReaction: "mindblown",
      hasCommented: true,
      hasShared: true,
      hasBookmarked: true,
    },
    timestamp: randomRecentDate(),
  },
]
