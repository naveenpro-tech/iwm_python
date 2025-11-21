import type { RecentItem } from "./types"

export const mockRecentItems: RecentItem[] = [
  {
    id: "1",
    type: "movie",
    title: "Oppenheimer",
    subtitle: "2023 • Christopher Nolan",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    image: "/oppenheimer-inspired-poster.png",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    duration: "3h 0m",
    link: "/movies/oppenheimer",
    metadata: {
      rating: 8.5,
      genre: ["Biography", "Drama", "History"],
    },
  },
  {
    id: "2",
    type: "profile",
    title: "Emma Thompson",
    subtitle: "Actress • London, UK",
    description: "Award-winning actress with 20+ years of experience in film and theater",
    image: "/user-avatar-2.png",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    role: "Lead Actress",
    link: "/talent-hub/profile/emma-thompson",
    metadata: {
      location: "London, UK",
    },
  },
  {
    id: "3",
    type: "casting",
    title: "Lead Role in Sci-Fi Thriller",
    subtitle: "Nexus Productions",
    description: "Seeking experienced actor for lead role in upcoming sci-fi thriller",
    image: "/sci-fi-film-set-spaceship.png",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    status: "Open",
    link: "/talent-hub/calls/lead-sci-fi",
    metadata: {
      location: "Los Angeles, CA",
      deadline: "2024-02-15",
    },
  },
  {
    id: "4",
    type: "industry",
    title: "Christopher Nolan",
    subtitle: "Director • Verified",
    description: "Acclaimed filmmaker known for complex narratives and practical effects",
    image: "/christopher-nolan.png",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    link: "/industry/profile/christopher-nolan",
    metadata: {
      location: "Los Angeles, CA",
    },
  },
  {
    id: "5",
    type: "cricket",
    title: "India vs Australia - 3rd Test",
    subtitle: "Day 2 • Melbourne Cricket Ground",
    description: "India leads by 150 runs in the first innings",
    image: "/cricket/mcg.png",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    score: "IND 350/7",
    link: "/cricket/matches/ind-vs-aus-3rd-test",
    metadata: {
      matchType: "Test Match",
    },
  },
  {
    id: "6",
    type: "pulse",
    title: "Breaking: New Marvel Movie Announced",
    subtitle: "By MovieBuff42",
    description: "Marvel Studios announces new Avengers movie for 2025",
    image: "/generic-sci-fi-poster.png",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    author: "MovieBuff42",
    link: "/pulse/marvel-announcement",
    metadata: {
      likes: 1250,
      comments: 89,
    },
  },
  {
    id: "7",
    type: "movie",
    title: "Dune: Part Two",
    subtitle: "2024 • Denis Villeneuve",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge",
    image: "/dune-part-two-poster.png",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    duration: "2h 46m",
    link: "/movies/dune-part-two",
    metadata: {
      rating: 8.8,
      genre: ["Sci-Fi", "Adventure", "Drama"],
    },
  },
  {
    id: "8",
    type: "profile",
    title: "Michael Chen",
    subtitle: "Cinematographer • New York, NY",
    description: "Specializing in atmospheric cinematography for indie films",
    image: "/user-avatar-5.png",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    role: "Director of Photography",
    link: "/talent-hub/profile/michael-chen",
    metadata: {
      location: "New York, NY",
    },
  },
  {
    id: "9",
    type: "casting",
    title: "Supporting Roles for Period Drama",
    subtitle: "Heritage Films",
    description: "Multiple supporting roles available for 1920s period drama",
    image: "/period-drama-poster.png",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    status: "Closing Soon",
    link: "/talent-hub/calls/period-drama-roles",
    metadata: {
      location: "London, UK",
      deadline: "2024-01-30",
    },
  },
  {
    id: "10",
    type: "cricket",
    title: "IPL 2024 Auction Highlights",
    subtitle: "Mumbai Indians secure top picks",
    description: "Mumbai Indians spend big on international stars",
    image: "/cricket/mumbai-indians-logo.png",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
    link: "/cricket/ipl-auction-2024",
    metadata: {
      matchType: "IPL News",
    },
  },
]
