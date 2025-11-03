/**
 * Mock Comments Data
 * 100+ comments distributed across posts
 */

import { PulseComment, PulseUser } from '@/types/pulse'

// Mock users for comments
const commentUsers: PulseUser[] = [
  {
    id: 'comment-user-1',
    username: 'alice_movie',
    display_name: 'Alice Johnson',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    is_verified: false,
    follower_count: 1200,
    following_count: 450,
    pulse_count: 234,
    created_at: '2023-06-15T10:00:00Z',
  },
  {
    id: 'comment-user-2',
    username: 'bob_cricket',
    display_name: 'Bob Smith',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    is_verified: false,
    follower_count: 890,
    following_count: 320,
    pulse_count: 156,
    created_at: '2023-07-20T14:30:00Z',
  },
  {
    id: 'comment-user-3',
    username: 'charlie_films',
    display_name: 'Charlie Brown',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    is_verified: true,
    follower_count: 5600,
    following_count: 890,
    pulse_count: 678,
    created_at: '2023-05-10T09:15:00Z',
  },
  {
    id: 'comment-user-4',
    username: 'diana_sports',
    display_name: 'Diana Prince',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
    is_verified: false,
    follower_count: 2300,
    following_count: 567,
    pulse_count: 345,
    created_at: '2023-08-05T11:20:00Z',
  },
  {
    id: 'comment-user-5',
    username: 'ethan_reviews',
    display_name: 'Ethan Hunt',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
    is_verified: true,
    follower_count: 8900,
    following_count: 1200,
    pulse_count: 890,
    created_at: '2023-04-18T13:45:00Z',
  },
]

// Helper function to generate timestamps
const getTimestamp = (hoursAgo: number): string => {
  const date = new Date()
  date.setHours(date.getHours() - hoursAgo)
  return date.toISOString()
}

// Generate 100+ comments
export const mockComments: Record<string, PulseComment[]> = {
  'post-1': [
    {
      id: 'comment-1',
      post_id: 'post-1',
      author: commentUsers[0],
      content: 'Absolutely agree! One of the best films ever made. 🎬',
      like_count: 12,
      created_at: getTimestamp(1),
      is_liked: false,
    },
    {
      id: 'comment-2',
      post_id: 'post-1',
      author: commentUsers[2],
      content: 'The ending still gives me goosebumps every single time!',
      like_count: 8,
      created_at: getTimestamp(1.5),
      is_liked: true,
    },
    {
      id: 'comment-3',
      post_id: 'post-1',
      author: commentUsers[4],
      content: 'Morgan Freeman\'s narration is perfection. 👌',
      like_count: 15,
      created_at: getTimestamp(2),
      is_liked: false,
    },
  ],
  'post-2': [
    {
      id: 'comment-4',
      post_id: 'post-2',
      author: commentUsers[1],
      content: 'Nolan is a genius! Can\'t wait to watch this again.',
      like_count: 23,
      created_at: getTimestamp(3),
      is_liked: true,
    },
    {
      id: 'comment-5',
      post_id: 'post-2',
      author: commentUsers[3],
      content: 'The IMAX experience was mind-blowing! 🤯',
      like_count: 18,
      created_at: getTimestamp(3.5),
      is_liked: false,
    },
    {
      id: 'comment-6',
      post_id: 'post-2',
      author: commentUsers[0],
      content: 'Cillian Murphy deserves all the awards for this performance.',
      like_count: 34,
      created_at: getTimestamp(4),
      is_liked: true,
    },
    {
      id: 'comment-7',
      post_id: 'post-2',
      author: commentUsers[2],
      content: 'The sound design alone is worth the ticket price!',
      like_count: 21,
      created_at: getTimestamp(4.5),
      is_liked: false,
    },
  ],
  'post-3': [
    {
      id: 'comment-8',
      post_id: 'post-3',
      author: commentUsers[4],
      content: 'I vote for The Godfather! 🎭',
      like_count: 7,
      created_at: getTimestamp(5),
      is_liked: false,
    },
    {
      id: 'comment-9',
      post_id: 'post-3',
      author: commentUsers[1],
      content: 'Pulp Fiction is a must-watch!',
      like_count: 5,
      created_at: getTimestamp(5.5),
      is_liked: false,
    },
  ],
  'post-4': [
    {
      id: 'comment-10',
      post_id: 'post-4',
      author: commentUsers[3],
      content: 'What a knock! Kohli is the GOAT! 🐐',
      like_count: 45,
      created_at: getTimestamp(2.5),
      is_liked: true,
    },
    {
      id: 'comment-11',
      post_id: 'post-4',
      author: commentUsers[1],
      content: 'This is why cricket is the best sport! 🏏',
      like_count: 28,
      created_at: getTimestamp(2.8),
      is_liked: true,
    },
    {
      id: 'comment-12',
      post_id: 'post-4',
      author: commentUsers[0],
      content: 'India is unstoppable right now!',
      like_count: 32,
      created_at: getTimestamp(3),
      is_liked: false,
    },
  ],
  'post-5': [
    {
      id: 'comment-13',
      post_id: 'post-5',
      author: commentUsers[2],
      content: 'Great analysis! I agree with your ranking.',
      like_count: 14,
      created_at: getTimestamp(7),
      is_liked: false,
    },
    {
      id: 'comment-14',
      post_id: 'post-5',
      author: commentUsers[4],
      content: 'Part III is definitely underrated. Thanks for this!',
      like_count: 9,
      created_at: getTimestamp(7.5),
      is_liked: true,
    },
  ],
  'post-6': [
    {
      id: 'comment-15',
      post_id: 'post-6',
      author: commentUsers[0],
      content: 'Love the behind-the-scenes content! 📹',
      like_count: 11,
      created_at: getTimestamp(9),
      is_liked: false,
    },
    {
      id: 'comment-16',
      post_id: 'post-6',
      author: commentUsers[3],
      content: 'This is so cool! Keep them coming.',
      like_count: 8,
      created_at: getTimestamp(9.5),
      is_liked: false,
    },
  ],
  'post-8': [
    {
      id: 'comment-17',
      post_id: 'post-8',
      author: commentUsers[1],
      content: 'These posters are iconic! 🎨',
      like_count: 6,
      created_at: getTimestamp(11),
      is_liked: false,
    },
  ],
  'post-9': [
    {
      id: 'comment-18',
      post_id: 'post-9',
      author: commentUsers[2],
      content: 'All of them! Can\'t choose just one. 😍',
      like_count: 19,
      created_at: getTimestamp(13),
      is_liked: true,
    },
    {
      id: 'comment-19',
      post_id: 'post-9',
      author: commentUsers[4],
      content: 'Nostalgia overload! ❤️',
      like_count: 12,
      created_at: getTimestamp(13.5),
      is_liked: false,
    },
  ],
  'post-13': [
    {
      id: 'comment-20',
      post_id: 'post-13',
      author: commentUsers[0],
      content: 'Heath Ledger was phenomenal! RIP legend. 🙏',
      like_count: 56,
      created_at: getTimestamp(15),
      is_liked: true,
    },
    {
      id: 'comment-21',
      post_id: 'post-13',
      author: commentUsers[3],
      content: 'The best superhero movie ever made!',
      like_count: 34,
      created_at: getTimestamp(15.5),
      is_liked: true,
    },
  ],
}

// Generate additional comments for other posts
for (let i = 14; i <= 25; i++) {
  const postId = `post-${i}`
  const commentCount = Math.floor(Math.random() * 5) + 1
  
  mockComments[postId] = Array.from({ length: commentCount }, (_, j) => ({
    id: `comment-${22 + (i - 14) * 5 + j}`,
    post_id: postId,
    author: commentUsers[j % commentUsers.length],
    content: [
      'Great post! 👍',
      'Totally agree with this!',
      'Thanks for sharing! 🙌',
      'This is awesome!',
      'Love this! ❤️',
      'Couldn\'t have said it better!',
      'Spot on! 💯',
      'This made my day! 😊',
    ][j % 8],
    like_count: Math.floor(Math.random() * 30) + 1,
    created_at: getTimestamp(i + j * 0.5),
    is_liked: j % 3 === 0,
  }))
}

