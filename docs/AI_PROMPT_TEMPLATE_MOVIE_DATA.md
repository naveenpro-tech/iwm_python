# AI Prompt Template for Comprehensive Movie Data Collection

This document provides a reusable AI prompt template for gathering complete movie information using advanced AI models (GPT-4, Claude, Gemini).

## Overview

Use this prompt template with your preferred AI model to collect comprehensive movie data that can be directly imported into the movie management system via the `/admin/movies/import` endpoint.

## Prompt Template

```
You are a movie data collection assistant. Your task is to gather comprehensive information about a movie and return it in a specific JSON format.

MOVIE TITLE: [INSERT MOVIE TITLE HERE]

Please research and provide complete information about this movie. For each field, provide accurate, verified information. If information is not available, use null.

Return ONLY valid JSON in the following format (no markdown, no explanations):

{
  "external_id": "tmdb_[ID]",
  "title": "Movie Title",
  "year": 2024,
  "synopsis": "Full plot summary...",
  "genres": ["Genre1", "Genre2"],
  "rating": "PG-13",
  "runtime": 120,
  "language": "English",
  "country": "USA",
  "posterUrl": "https://...",
  "backdropUrl": "https://...",
  "directors": [
    {
      "name": "Director Name",
      "role": "director",
      "image": "https://..."
    }
  ],
  "writers": [
    {
      "name": "Writer Name",
      "role": "writer",
      "image": "https://..."
    }
  ],
  "producers": [
    {
      "name": "Producer Name",
      "role": "producer",
      "image": "https://..."
    }
  ],
  "cast": [
    {
      "name": "Actor Name",
      "character": "Character Name",
      "role": "actor",
      "image": "https://..."
    }
  ],
  "awards": [
    {
      "name": "Award Name",
      "year": 2024,
      "category": "Best Picture",
      "status": "Winner"
    }
  ],
  "trivia": [
    {
      "question": "Interesting fact question?",
      "category": "production",
      "answer": "The answer to the trivia question",
      "explanation": "Additional context"
    }
  ],
  "timeline": [
    {
      "date": "2023-01-15",
      "title": "Event Title",
      "description": "Event description",
      "type": "production"
    }
  ],
  "streaming": [
    {
      "platform": "Netflix",
      "region": "US",
      "type": "subscription",
      "price": null,
      "quality": "4K",
      "url": "https://..."
    }
  ]
}

IMPORTANT REQUIREMENTS:
1. All dates must be in YYYY-MM-DD format
2. All URLs must be valid and accessible
3. Cast list should include main actors (top 10)
4. Genres should be from: Action, Adventure, Animation, Comedy, Crime, Documentary, Drama, Family, Fantasy, History, Horror, Music, Mystery, Romance, Science Fiction, Thriller, War, Western
5. Ratings should be: G, PG, PG-13, R, NC-17, or null
6. Award status should be: Winner, Nominee, or null
7. Trivia categories: production, cast-crew, plot-details, soundtrack-music, behind-the-scenes
8. Timeline types: development, production, post-production, marketing, release, reception, award
9. Streaming types: subscription, rent, buy, free
10. Ensure all data is accurate and from reliable sources
```

## Usage Instructions

### For GPT-4 (OpenAI)

1. Go to [ChatGPT](https://chat.openai.com)
2. Copy the prompt template above
3. Replace `[INSERT MOVIE TITLE HERE]` with your movie title
4. Paste into the chat
5. Copy the JSON response
6. Validate the JSON at [JSONLint](https://jsonlint.com)
7. Import via the admin panel

### For Claude (Anthropic)

1. Go to [Claude](https://claude.ai)
2. Copy the prompt template above
3. Replace `[INSERT MOVIE TITLE HERE]` with your movie title
4. Paste into the conversation
5. Copy the JSON response
6. Validate the JSON
7. Import via the admin panel

### For Gemini (Google)

1. Go to [Google Gemini](https://gemini.google.com)
2. Copy the prompt template above
3. Replace `[INSERT MOVIE TITLE HERE]` with your movie title
4. Paste into the chat
5. Copy the JSON response
6. Validate the JSON
7. Import via the admin panel

## Example Output: Inception (2010)

```json
{
  "external_id": "tmdb_27205",
  "title": "Inception",
  "year": 2010,
  "synopsis": "Dom Cobb is a skilled thief who specializes in extraction, stealing valuable secrets from deep within the subconscious during the dream state. Cobb is offered a chance to have his criminal history erased, but only if he can accomplish an impossible task: instead of stealing an idea, he must plant one.",
  "genres": ["Science Fiction", "Thriller", "Adventure"],
  "rating": "PG-13",
  "runtime": 148,
  "language": "English",
  "country": "USA",
  "posterUrl": "https://image.tmdb.org/t/p/w500/9gk7adHYeDMNNGceKc06f6I9xvx.jpg",
  "backdropUrl": "https://image.tmdb.org/t/p/w1280/s3TBrFFG4iq8IEiOWUDc6ZsWE8F.jpg",
  "directors": [
    {
      "name": "Christopher Nolan",
      "role": "director",
      "image": "https://image.tmdb.org/t/p/w500/YvLyLso.jpg"
    }
  ],
  "writers": [
    {
      "name": "Christopher Nolan",
      "role": "writer",
      "image": "https://image.tmdb.org/t/p/w500/YvLyLso.jpg"
    }
  ],
  "producers": [
    {
      "name": "Emma Thomas",
      "role": "producer",
      "image": null
    }
  ],
  "cast": [
    {
      "name": "Leonardo DiCaprio",
      "character": "Dom Cobb",
      "role": "actor",
      "image": "https://image.tmdb.org/t/p/w500/wo2hJpn04vbtchYlQQncinx33zG.jpg"
    },
    {
      "name": "Marion Cotillard",
      "character": "Mal",
      "role": "actor",
      "image": "https://image.tmdb.org/t/p/w500/ggXnlMSGjkfvnKvFXgxN0Uw0Ygf.jpg"
    }
  ],
  "awards": [
    {
      "name": "Academy Awards",
      "year": 2011,
      "category": "Best Cinematography",
      "status": "Winner"
    },
    {
      "name": "Academy Awards",
      "year": 2011,
      "category": "Best Picture",
      "status": "Nominee"
    }
  ],
  "trivia": [
    {
      "question": "Was the spinning top at the end real or CGI?",
      "category": "production",
      "answer": "The spinning top was achieved practically without CGI",
      "explanation": "Christopher Nolan used a practical spinning top prop for the iconic ending"
    }
  ],
  "timeline": [
    {
      "date": "2008-01-15",
      "title": "Script Development Begins",
      "description": "Christopher Nolan begins developing the screenplay",
      "type": "development"
    },
    {
      "date": "2010-07-16",
      "title": "Theatrical Release",
      "description": "Inception released in theaters",
      "type": "release"
    }
  ],
  "streaming": [
    {
      "platform": "Netflix",
      "region": "US",
      "type": "subscription",
      "price": null,
      "quality": "4K",
      "url": "https://www.netflix.com/title/70131314"
    }
  ]
}
```

## Validation Checklist

Before importing, verify:

- [ ] All required fields are present
- [ ] JSON is valid (no syntax errors)
- [ ] All dates are in YYYY-MM-DD format
- [ ] All URLs are valid and accessible
- [ ] Genres are from the approved list
- [ ] Rating is from the approved list
- [ ] No duplicate cast/crew members
- [ ] Character names are provided for cast
- [ ] At least one director is listed
- [ ] Synopsis is at least 50 characters

## Import Steps

1. Go to Admin Panel → Movies → Import
2. Click "Import Movies (JSON)"
3. Paste the JSON data
4. Click "Import"
5. Verify the movie appears in the movies list

## Troubleshooting

**JSON Validation Error**: Use [JSONLint](https://jsonlint.com) to identify syntax errors

**Missing Fields**: Ensure all required fields are present in the JSON

**Invalid URLs**: Verify all image URLs are accessible and return valid images

**Duplicate Entries**: Check if the movie already exists before importing

## Tips for Best Results

1. Use specific movie titles (include year if ambiguous)
2. Request data from reliable sources (IMDb, TMDB, Wikipedia)
3. Verify cast and crew information
4. Include multiple trivia items for richer content
5. Add streaming availability for your region
6. Include awards and nominations for notable films

