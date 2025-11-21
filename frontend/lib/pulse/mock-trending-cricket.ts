/**
 * Mock Trending Cricket Matches Data
 * 5 cricket matches (live, upcoming, completed)
 */

import { TrendingCricketMatch } from '@/types/pulse'

// Helper function to generate timestamps
const getTimestamp = (hoursAgo: number): string => {
  const date = new Date()
  date.setHours(date.getHours() - hoursAgo)
  return date.toISOString()
}

export const mockTrendingCricket: TrendingCricketMatch[] = [
  {
    id: 'cricket-1',
    team1: 'India',
    team2: 'Australia',
    team1_flag: '🇮🇳',
    team2_flag: '🇦🇺',
    status: 'live',
    score: 'IND: 245/4 (45.2 overs) | AUS: Yet to bat',
    venue: 'Wankhede Stadium, Mumbai',
    start_time: getTimestamp(3),
    is_live: true,
  },
  {
    id: 'cricket-2',
    team1: 'England',
    team2: 'South Africa',
    team1_flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    team2_flag: '🇿🇦',
    status: 'live',
    score: 'ENG: 178/7 (38.4 overs) | SA: 182/5 (40 overs)',
    venue: 'Lord\'s Cricket Ground, London',
    start_time: getTimestamp(5),
    is_live: true,
  },
  {
    id: 'cricket-3',
    team1: 'Pakistan',
    team2: 'New Zealand',
    team1_flag: '🇵🇰',
    team2_flag: '🇳🇿',
    status: 'upcoming',
    venue: 'National Stadium, Karachi',
    start_time: getTimestamp(-24), // Tomorrow
    is_live: false,
  },
  {
    id: 'cricket-4',
    team1: 'Sri Lanka',
    team2: 'Bangladesh',
    team1_flag: '🇱🇰',
    team2_flag: '🇧🇩',
    status: 'upcoming',
    venue: 'R. Premadasa Stadium, Colombo',
    start_time: getTimestamp(-48), // Day after tomorrow
    is_live: false,
  },
  {
    id: 'cricket-5',
    team1: 'West Indies',
    team2: 'Afghanistan',
    team1_flag: '🏴',
    team2_flag: '🇦🇫',
    status: 'completed',
    score: 'WI: 234/8 (50 overs) | AFG: 238/6 (48.3 overs) - AFG won by 4 wickets',
    venue: 'Kensington Oval, Barbados',
    start_time: getTimestamp(12),
    is_live: false,
  },
]

