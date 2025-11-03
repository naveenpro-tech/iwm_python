import type { CriticBlogPost } from "@/types/critic"

export function generateMockBlogPosts(criticUsername: string): CriticBlogPost[] {
  const basePosts: CriticBlogPost[] = [
    {
      id: 1,
      critic_id: 1,
      title: "Why Dune Part 2 is the Sci-Fi Epic We've Been Waiting For",
      slug: "dune-part-2-sci-fi-epic",
      content: `Denis Villeneuve has done it again. Dune Part 2 is not just a sequel; it's a cinematic achievement that elevates the entire franchise to new heights.

## Visual Mastery

The cinematography by Greig Fraser is nothing short of breathtaking. Every frame feels meticulously crafted, from the vast desert landscapes of Arrakis to the intimate character moments. The use of natural light and practical effects creates a sense of realism that CGI-heavy blockbusters often lack.

## Character Development

Where Part 1 laid the groundwork, Part 2 allows the characters to truly shine. Timothée Chalamet's Paul Atreides undergoes a transformation that is both compelling and tragic. Zendaya's Chani is no longer just a vision in the desert; she's a fully realized character with agency and depth.

## Thematic Depth

Villeneuve doesn't shy away from the complex themes of Frank Herbert's novel. The film explores power, religion, colonialism, and destiny with a nuance rarely seen in mainstream cinema. It asks difficult questions and doesn't provide easy answers.

## The Verdict

Dune Part 2 is a masterclass in epic filmmaking. It's a film that demands to be seen on the biggest screen possible, with the best sound system available. This is cinema at its finest.

**Rating: 9.5/10**`,
      excerpt: "Denis Villeneuve has done it again. Dune Part 2 is not just a sequel; it's a cinematic achievement that elevates the entire franchise to new heights.",
      featured_image_url: "/blog/dune-part-2-banner.jpg",
      tags: ["Sci-Fi", "Denis Villeneuve", "Dune", "Epic Cinema"],
      published_at: "2025-10-20T10:00:00Z",
      views_count: 12500,
      is_published: true,
      read_time_minutes: 5,
    },
    {
      id: 2,
      critic_id: 1,
      title: "My Top 10 Horror Films of the 1970s",
      slug: "top-10-horror-films-1970s",
      content: `The 1970s was a golden age for horror cinema. Here are my top 10 picks from this incredible decade.

## 10. Carrie (1976)
Brian De Palma's adaptation of Stephen King's novel is a masterclass in building tension. Sissy Spacek's performance is unforgettable.

## 9. Dawn of the Dead (1978)
George A. Romero's zombie satire is both terrifying and thought-provoking. The mall setting is iconic.

## 8. Suspiria (1977)
Dario Argento's giallo masterpiece is a visual feast. The use of color and sound is revolutionary.

## 7. Don't Look Now (1973)
Nicolas Roeg's psychological thriller is haunting and beautiful. The Venice setting adds to the eerie atmosphere.

## 6. The Wicker Man (1973)
This British folk horror film is deeply unsettling. The ending is one of the most shocking in cinema history.

## 5. Halloween (1978)
John Carpenter's slasher classic defined a genre. Michael Myers is one of the most iconic villains ever created.

## 4. The Texas Chain Saw Massacre (1974)
Tobe Hooper's brutal masterpiece is still shocking today. The raw, documentary-style filmmaking is incredibly effective.

## 3. Alien (1979)
Ridley Scott's sci-fi horror hybrid is perfect. The design, the atmosphere, the tension—everything works.

## 2. The Exorcist (1973)
William Friedkin's demonic possession film is terrifying on every level. Linda Blair's performance is legendary.

## 1. Rosemary's Baby (1968)
Technically from 1968, but it set the tone for 70s horror. Roman Polanski's paranoia thriller is a masterpiece of psychological horror.

The 1970s gave us some of the most influential horror films ever made. These films continue to inspire filmmakers today.`,
      excerpt: "The 1970s was a golden age for horror cinema. Here are my top 10 picks from this incredible decade, from Carrie to The Exorcist.",
      featured_image_url: "/blog/70s-horror-banner.jpg",
      tags: ["Horror", "1970s", "Top 10", "Classic Cinema"],
      published_at: "2025-10-15T14:00:00Z",
      views_count: 8900,
      is_published: true,
      read_time_minutes: 7,
    },
    {
      id: 3,
      critic_id: 1,
      title: "Sundance 2025: My Most Anticipated Films",
      slug: "sundance-2025-anticipated-films",
      content: `The Sundance Film Festival is just around the corner, and I'm incredibly excited about this year's lineup. Here are the films I'm most looking forward to.

## "The Last Light" (Dir. Sarah Chen)
This post-apocalyptic drama has been generating buzz since its announcement. Chen's previous work showed incredible promise, and this looks like her breakthrough.

## "Echoes of Tomorrow" (Dir. Marcus Williams)
A sci-fi thriller that explores AI consciousness. The premise alone has me hooked.

## "Beneath the Surface" (Dir. Elena Rodriguez)
A psychological horror film set in a remote research station. Early reports suggest it's genuinely terrifying.

## "The Painter's Dream" (Dir. Jean-Luc Moreau)
A French drama about an artist losing his sight. Moreau is one of the most underrated directors working today.

## "Neon Nights" (Dir. Kim Ji-woo)
A Korean neo-noir that promises to be visually stunning. The trailer alone is a work of art.

I'll be covering the festival extensively, so stay tuned for my reviews and insights!`,
      excerpt: "The Sundance Film Festival is just around the corner, and I'm incredibly excited about this year's lineup. Here are the films I'm most looking forward to.",
      featured_image_url: "/blog/sundance-2025-banner.jpg",
      tags: ["Sundance", "Film Festival", "2025", "Indie Cinema"],
      published_at: "2025-10-10T09:00:00Z",
      views_count: 6700,
      is_published: true,
      read_time_minutes: 4,
    },
    {
      id: 4,
      critic_id: 1,
      title: "The Art of the Long Take: From Hitchcock to Iñárritu",
      slug: "art-of-long-take-cinema",
      content: `The long take is one of cinema's most powerful tools. When used effectively, it can create immersion, build tension, and showcase technical mastery.

## Rope (1948) - Alfred Hitchcock
Hitchcock's experiment with continuous takes was revolutionary for its time. While technically composed of multiple shots, the illusion of a single take was groundbreaking.

## Touch of Evil (1958) - Orson Welles
The opening shot is one of the most famous in cinema history. Three minutes of pure cinematic brilliance.

## Goodfellas (1990) - Martin Scorsese
The Copacabana tracking shot is iconic. It's not just technically impressive; it serves the story perfectly.

## Children of Men (2006) - Alfonso Cuarón
Multiple long takes that are both technically stunning and emotionally powerful. The car ambush scene is unforgettable.

## Birdman (2014) - Alejandro González Iñárritu
The entire film appears to be one continuous shot. It's a technical marvel that serves the story's themes perfectly.

The long take requires meticulous planning, perfect execution, and serves a purpose beyond showing off. When done right, it's cinema at its finest.`,
      excerpt: "The long take is one of cinema's most powerful tools. Exploring the masters from Hitchcock to Iñárritu and how they use this technique.",
      featured_image_url: "/blog/long-take-banner.jpg",
      tags: ["Cinematography", "Film Technique", "Analysis", "Masterclass"],
      published_at: "2025-10-05T16:00:00Z",
      views_count: 11200,
      is_published: true,
      read_time_minutes: 6,
    },
    {
      id: 5,
      critic_id: 1,
      title: "Why We Need More Original Sci-Fi Films",
      slug: "need-more-original-sci-fi",
      content: `In an era dominated by sequels, prequels, and reboots, original sci-fi films are becoming increasingly rare. Here's why that's a problem and what we can do about it.

## The State of Sci-Fi
Look at the top-grossing films of the past decade. Most are part of established franchises. While there's nothing wrong with sequels, the lack of original voices is concerning.

## Why Original Sci-Fi Matters
Science fiction has always been about exploring new ideas, challenging assumptions, and imagining different futures. When we only revisit familiar worlds, we lose that sense of discovery.

## Recent Successes
Films like "Everything Everywhere All at Once," "Arrival," and "Ex Machina" prove that original sci-fi can be both critically acclaimed and commercially successful.

## Supporting Original Voices
As audiences, we have power. By supporting original films in theaters, we send a message to studios that there's an appetite for new stories.

The future of sci-fi depends on our willingness to embrace the unknown. Let's make sure that future is bright.`,
      excerpt: "In an era dominated by sequels and reboots, original sci-fi films are becoming rare. Here's why that's a problem and what we can do about it.",
      featured_image_url: "/blog/original-scifi-banner.jpg",
      tags: ["Sci-Fi", "Industry Analysis", "Original Films", "Opinion"],
      published_at: "2025-09-28T12:00:00Z",
      views_count: 9400,
      is_published: true,
      read_time_minutes: 5,
    },
  ]

  return basePosts
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function generateExcerpt(content: string, maxLength: number = 200): string {
  const plainText = content.replace(/[#*`]/g, "").trim()
  if (plainText.length <= maxLength) return plainText
  return plainText.substring(0, maxLength).trim() + "..."
}

