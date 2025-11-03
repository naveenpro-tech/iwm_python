/**
 * Mock data for Official Siddu Review
 */

import { OfficialReview } from '@/types/review-page'

export const mockOfficialReview: OfficialReview = {
  id: 1,
  movie_id: 1,
  author: {
    name: 'Siddu Kumar',
    title: 'Chief Film Critic',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=siddu',
  },
  rating: 9.0,
  content: `
## A Timeless Masterpiece of Hope and Redemption

*The Shawshank Redemption* stands as a towering achievement in cinema, a film that transcends its prison setting to deliver a profound meditation on hope, friendship, and the indomitable human spirit. Frank Darabont's adaptation of Stephen King's novella is nothing short of extraordinary, weaving together themes of injustice, perseverance, and ultimate triumph with masterful precision.

### The Power of Hope

At its core, this is a story about hope—not the naive, fleeting kind, but the deep, sustaining hope that keeps us alive even in the darkest circumstances. Andy Dufresne (Tim Robbins) embodies this hope with quiet dignity, never allowing the brutal reality of Shawshank Prison to extinguish his inner light. His friendship with Red (Morgan Freeman) forms the emotional backbone of the film, a relationship that evolves from skepticism to profound mutual respect.

### Technical Excellence

Roger Deakins' cinematography is breathtaking, capturing both the oppressive claustrophobia of prison life and the expansive beauty of freedom. The use of light and shadow throughout the film serves as a visual metaphor for Andy's journey from darkness to light. Thomas Newman's score is equally masterful, underscoring the emotional beats without ever overwhelming them.

### Performances That Define a Generation

Morgan Freeman delivers what may be his finest performance as Red, the prison's "man who can get things." His narration provides the perfect lens through which to view Andy's story, blending world-weary cynicism with growing wonder. Tim Robbins matches him beat for beat, creating a character whose quiet strength and unwavering determination inspire everyone around him.

### Themes That Resonate

The film explores institutionalization with unflinching honesty, showing how prison can become a comfort zone that makes freedom terrifying. Brooks' tragic arc serves as a heartbreaking counterpoint to Andy's triumph, reminding us that not everyone can adapt to change, no matter how desperately they once longed for it.

### A Perfect Ending

The final act is pure cinematic magic. The revelation of Andy's escape plan, executed with meticulous patience over decades, is both shocking and deeply satisfying. The reunion on the beach in Zihuatanejo is earned through every minute of suffering that came before it, making it one of the most emotionally resonant endings in film history.

### Minor Flaws

If there's any criticism to be made, it's that the film occasionally veers into sentimentality. Some moments, particularly in the final act, might feel slightly manipulative to cynical viewers. However, these are minor quibbles in an otherwise flawless execution.

### Final Verdict

*The Shawshank Redemption* is more than just a great film—it's a testament to the power of cinema to inspire, uplift, and remind us of our shared humanity. It's a film that rewards repeated viewings, revealing new layers of meaning with each watch. Whether you're experiencing it for the first time or the hundredth, its message remains as powerful as ever: hope is a good thing, maybe the best of things, and no good thing ever dies.

**Rating: 9.0/10**

*A masterpiece that deserves its place among the greatest films ever made. Essential viewing for anyone who loves cinema.*
  `,
  published_at: '2024-03-15T10:00:00Z',
  read_time_minutes: 8,
  featured_image_url: 'https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
  embedded_media: [
    {
      type: 'image',
      url: 'https://image.tmdb.org/t/p/original/9O7gLzmreU0nGkIB6K3BsJbzvNv.jpg',
      caption: 'Andy and Red share a moment of friendship',
    },
    {
      type: 'image',
      url: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
      caption: 'The iconic rooftop scene',
    },
  ],
}

export const mockOfficialReviewNull: OfficialReview | null = null

