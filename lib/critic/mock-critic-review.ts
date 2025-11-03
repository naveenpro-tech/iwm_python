/**
 * Mock Critic Review Data Generator
 * Provides realistic data for critic review pages during development
 */

export interface CriticReviewData {
  id: string
  externalId: string
  slug: string
  movieId: string
  movieTitle: string
  movieYear: number
  movieBackdrop: string
  moviePoster: string
  movieSidduScore: number
  criticUsername: string
  criticName: string
  criticAvatar: string
  criticVerified: boolean
  criticFollowers: number
  rating: string
  ratingNumeric: number
  ratingBreakdown: { category: string; score: number }[]
  youtubeVideoId: string | null
  writtenContent: string
  images: { url: string; caption: string }[]
  whereToWatch: { platform: string; logo: string; link: string; price?: string }[]
  likes: number
  commentCount: number
  viewCount: number
  publishedAt: string
  updatedAt: string
  userHasLiked: boolean
  userHasBookmarked: boolean
  tags: string[]
  spoilerWarning: boolean
}

export interface CriticReviewComment {
  id: string
  userId: string
  username: string
  avatar: string
  content: string
  likes: number
  createdAt: string
  replies: CriticReviewComment[]
  userHasLiked: boolean
}

export function generateMockCriticReview(slug: string): CriticReviewData {
  const reviews: Record<string, CriticReviewData> = {
    "the-shawshank-redemption-1994": {
      id: "cr-001",
      externalId: "ext-cr-001",
      slug: "the-shawshank-redemption-1994",
      movieId: "tt0111161",
      movieTitle: "The Shawshank Redemption",
      movieYear: 1994,
      movieBackdrop: "https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
      moviePoster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      movieSidduScore: 9.3,
      criticUsername: "siddu",
      criticName: "Siddu Kumar",
      criticAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=siddu",
      criticVerified: true,
      criticFollowers: 125000,
      rating: "A+",
      ratingNumeric: 9.5,
      ratingBreakdown: [
        { category: "Story", score: 10 },
        { category: "Acting", score: 9.5 },
        { category: "Direction", score: 9.5 },
        { category: "Cinematography", score: 9 },
        { category: "Music", score: 9 },
        { category: "Emotional Impact", score: 10 },
      ],
      youtubeVideoId: "6hB3S9bIaco",
      writtenContent: `
        <h2>A Timeless Masterpiece of Hope and Redemption</h2>
        
        <p>Frank Darabont's adaptation of Stephen King's novella is nothing short of a cinematic miracle. <strong>The Shawshank Redemption</strong> transcends the prison drama genre to become a profound meditation on hope, friendship, and the indomitable human spirit.</p>
        
        <h3>The Power of Performance</h3>
        
        <p>Tim Robbins delivers a career-defining performance as Andy Dufresne, a banker wrongly convicted of murder. His portrayal is a masterclass in subtlety—every glance, every measured word carries the weight of a man who refuses to let his circumstances define him. Morgan Freeman's Red is equally magnificent, providing the film's moral compass and emotional anchor.</p>
        
        <blockquote>"Hope is a good thing, maybe the best of things, and no good thing ever dies."</blockquote>
        
        <p>This line, delivered with Freeman's signature gravitas, encapsulates the film's entire philosophy. It's a testament to the screenplay's brilliance that such profound wisdom feels earned rather than preachy.</p>
        
        <h3>Technical Excellence</h3>
        
        <p>Roger Deakins' cinematography is breathtaking. The way he captures the oppressive gray walls of Shawshank prison, contrasted with the vibrant blues of freedom, is visual storytelling at its finest. Thomas Newman's score is equally masterful—understated yet emotionally resonant, it elevates every scene without overwhelming it.</p>
        
        <h3>A Story That Resonates</h3>
        
        <p>What makes this film truly special is its universal appeal. Whether you're watching it for the first time or the tenth, the story of Andy's quiet rebellion against injustice never loses its power. The film's pacing is deliberate, allowing us to truly inhabit this world and understand these characters.</p>
        
        <div class="spoiler-warning">
          <h4>⚠️ SPOILER SECTION</h4>
          <p>The reveal of Andy's escape is one of cinema's greatest moments. The meticulous planning, the years of patience, the sheer audacity of it all—it's a triumph that feels completely earned. When Red finally joins Andy on that beach in Zihuatanejo, it's not just a happy ending; it's a validation of everything the film has been building toward.</p>
        </div>
        
        <h3>Final Verdict</h3>
        
        <p><em>The Shawshank Redemption</em> is more than a great film—it's a cultural touchstone. It reminds us that even in our darkest moments, hope can be our salvation. This is essential viewing for anyone who loves cinema.</p>
        
        <p><strong>Rating: A+ (9.5/10)</strong></p>
        <p><strong>Recommendation:</strong> Absolute must-watch. Clear your schedule and experience this masterpiece.</p>
      `,
      images: [
        {
          url: "https://image.tmdb.org/t/p/original/9O7gLzmreU0nGkIB6K3BsJbzvNv.jpg",
          caption: "Andy and Red's friendship is the heart of the film",
        },
        {
          url: "https://image.tmdb.org/t/p/original/l6hQWH9eDksNJNiXWYRkWqikOdu.jpg",
          caption: "The iconic rooftop scene - a moment of freedom",
        },
      ],
      whereToWatch: [
        {
          platform: "Netflix",
          logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
          link: "https://www.netflix.com",
        },
        {
          platform: "Amazon Prime",
          logo: "https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg",
          link: "https://www.amazon.com/prime-video",
          price: "$3.99",
        },
        {
          platform: "Apple TV",
          logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg",
          link: "https://tv.apple.com",
          price: "$4.99",
        },
      ],
      likes: 8542,
      commentCount: 342,
      viewCount: 125000,
      publishedAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      userHasLiked: false,
      userHasBookmarked: false,
      tags: ["Drama", "Hope", "Friendship", "Masterpiece", "Must-Watch"],
      spoilerWarning: true,
    },
    "inception-2010": {
      id: "cr-002",
      externalId: "ext-cr-002",
      slug: "inception-2010",
      movieId: "tt1375666",
      movieTitle: "Inception",
      movieYear: 2010,
      movieBackdrop: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      moviePoster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      movieSidduScore: 8.8,
      criticUsername: "siddu",
      criticName: "Siddu Kumar",
      criticAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=siddu",
      criticVerified: true,
      criticFollowers: 125000,
      rating: "A",
      ratingNumeric: 9.0,
      ratingBreakdown: [
        { category: "Story", score: 9.5 },
        { category: "Acting", score: 8.5 },
        { category: "Direction", score: 10 },
        { category: "Cinematography", score: 9.5 },
        { category: "Music", score: 10 },
        { category: "Visual Effects", score: 10 },
      ],
      youtubeVideoId: "YoHD9XEInc0",
      writtenContent: `
        <h2>Christopher Nolan's Mind-Bending Masterpiece</h2>
        
        <p>Christopher Nolan has always been fascinated by the architecture of dreams, and with <strong>Inception</strong>, he constructs his most ambitious labyrinth yet. This is a film that demands your full attention and rewards it tenfold.</p>
        
        <h3>A Concept Like No Other</h3>
        
        <p>The premise—corporate espionage through dream invasion—is audacious. But Nolan doesn't just present a cool concept; he builds an entire mythology around it, complete with rules, consequences, and emotional stakes. The layers of dreams within dreams create a narrative complexity that's thrilling to unravel.</p>
        
        <h3>Technical Wizardry</h3>
        
        <p>The practical effects are stunning. That rotating hallway fight scene? Real. The folding city? A combination of practical sets and VFX that feels tangible. Wally Pfister's cinematography captures both the grandeur and intimacy of each dream level.</p>
        
        <p>Hans Zimmer's score is iconic—that BRAAAM sound has become synonymous with epic trailers, but in context, it's a perfect representation of time dilation and urgency.</p>
        
        <h3>The Ensemble</h3>
        
        <p>Leonardo DiCaprio anchors the film with a performance that balances action hero with emotional vulnerability. The supporting cast—Tom Hardy, Joseph Gordon-Levitt, Ellen Page, Marion Cotillard—each brings depth to their roles.</p>
        
        <h3>That Ending</h3>
        
        <p>The spinning top. The cut to black. Nolan leaves us with ambiguity, and it's perfect. The point isn't whether Cobb is dreaming—it's that he's chosen to embrace his reality, whatever it may be.</p>
        
        <p><strong>Rating: A (9.0/10)</strong></p>
        <p><strong>Recommendation:</strong> Essential viewing for fans of intelligent blockbusters.</p>
      `,
      images: [],
      whereToWatch: [
        {
          platform: "HBO Max",
          logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg",
          link: "https://www.hbomax.com",
        },
      ],
      likes: 6234,
      commentCount: 189,
      viewCount: 89000,
      publishedAt: "2024-02-10T14:20:00Z",
      updatedAt: "2024-02-10T14:20:00Z",
      userHasLiked: false,
      userHasBookmarked: false,
      tags: ["Sci-Fi", "Thriller", "Mind-Bending", "Nolan"],
      spoilerWarning: false,
    },
  }

  return reviews[slug] || reviews["the-shawshank-redemption-1994"]
}

export function generateMockComments(): CriticReviewComment[] {
  return [
    {
      id: "comment-1",
      userId: "user-1",
      username: "MovieBuff2024",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
      content: "Absolutely brilliant review! You captured everything that makes this film special. The way you analyzed the cinematography was particularly insightful.",
      likes: 45,
      createdAt: "2024-01-16T08:30:00Z",
      userHasLiked: false,
      replies: [
        {
          id: "comment-1-reply-1",
          userId: "critic-siddu",
          username: "siddu",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=siddu",
          content: "Thank you! Roger Deakins' work on this film is truly masterful. Every frame is a painting.",
          likes: 12,
          createdAt: "2024-01-16T10:15:00Z",
          userHasLiked: false,
          replies: [],
        },
      ],
    },
    {
      id: "comment-2",
      userId: "user-2",
      username: "CinemaLover",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user2",
      content: "I've watched this movie 10+ times and it never gets old. Your review made me want to watch it again tonight!",
      likes: 28,
      createdAt: "2024-01-17T12:45:00Z",
      userHasLiked: false,
      replies: [],
    },
    {
      id: "comment-3",
      userId: "user-3",
      username: "FilmCritic101",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user3",
      content: "Great analysis of the themes. The hope vs. institutionalization dynamic is what elevates this beyond a typical prison drama.",
      likes: 67,
      createdAt: "2024-01-18T16:20:00Z",
      userHasLiked: true,
      replies: [],
    },
  ]
}

