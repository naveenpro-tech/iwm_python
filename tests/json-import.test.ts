import { describe, it, expect } from "@jest/globals"
import { validateMovieJSON, sanitizeMovieData } from "../lib/utils/movie-json-validator"
import { MOVIE_JSON_TEMPLATE, generateMoviePrompt, generateBlankTemplate } from "../lib/utils/movie-json-template"

describe("Movie JSON Import - Validation", () => {
  it("should validate a complete valid movie JSON", () => {
    const result = validateMovieJSON(MOVIE_JSON_TEMPLATE)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it("should reject JSON without required title", () => {
    const invalidData = { ...MOVIE_JSON_TEMPLATE, title: "" }
    const result = validateMovieJSON(invalidData)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.field === "title")).toBe(true)
  })

  it("should reject JSON without required status", () => {
    const invalidData = { ...MOVIE_JSON_TEMPLATE, status: undefined }
    const result = validateMovieJSON(invalidData)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.field === "status")).toBe(true)
  })

  it("should reject invalid status value", () => {
    const invalidData = { ...MOVIE_JSON_TEMPLATE, status: "invalid-status" }
    const result = validateMovieJSON(invalidData)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.field === "status")).toBe(true)
  })

  it("should reject invalid genre values", () => {
    const invalidData = { ...MOVIE_JSON_TEMPLATE, genres: ["Action", "InvalidGenre"] }
    const result = validateMovieJSON(invalidData)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.field === "genres")).toBe(true)
  })

  it("should reject invalid date format", () => {
    const invalidData = { ...MOVIE_JSON_TEMPLATE, releaseDate: "2010/07/16" }
    const result = validateMovieJSON(invalidData)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.field === "releaseDate")).toBe(true)
  })

  it("should reject invalid SidduScore range", () => {
    const invalidData = { ...MOVIE_JSON_TEMPLATE, sidduScore: 15 }
    const result = validateMovieJSON(invalidData)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.field === "sidduScore")).toBe(true)
  })

  it("should validate cast members with required fields", () => {
    const invalidData = {
      ...MOVIE_JSON_TEMPLATE,
      cast: [{ id: "cast-1", name: "Actor Name" }], // Missing character
    }
    const result = validateMovieJSON(invalidData)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.field.includes("cast"))).toBe(true)
  })

  it("should validate crew members with required fields", () => {
    const invalidData = {
      ...MOVIE_JSON_TEMPLATE,
      crew: [{ id: "crew-1", name: "Crew Name" }], // Missing role and department
    }
    const result = validateMovieJSON(invalidData)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.field.includes("crew"))).toBe(true)
  })

  it("should validate streaming links with required fields", () => {
    const invalidData = {
      ...MOVIE_JSON_TEMPLATE,
      streamingLinks: [{ id: "stream-1", provider: "Netflix" }], // Missing url, type, quality
    }
    const result = validateMovieJSON(invalidData)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.field.includes("streamingLinks"))).toBe(true)
  })

  it("should validate awards with required fields", () => {
    const invalidData = {
      ...MOVIE_JSON_TEMPLATE,
      awards: [{ id: "award-1", name: "Academy Awards" }], // Missing category, year, status
    }
    const result = validateMovieJSON(invalidData)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.field.includes("awards"))).toBe(true)
  })

  it("should validate trivia with required fields", () => {
    const invalidData = {
      ...MOVIE_JSON_TEMPLATE,
      trivia: [{ id: "trivia-1", question: "Question?" }], // Missing answer, category
    }
    const result = validateMovieJSON(invalidData)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.field.includes("trivia"))).toBe(true)
  })

  it("should validate timeline events with required fields", () => {
    const invalidData = {
      ...MOVIE_JSON_TEMPLATE,
      timelineEvents: [{ id: "timeline-1", title: "Event" }], // Missing date, category
    }
    const result = validateMovieJSON(invalidData)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.field.includes("timelineEvents"))).toBe(true)
  })

  it("should generate warnings for missing optional but recommended fields", () => {
    const minimalData = {
      title: "Test Movie",
      status: "draft",
      isPublished: false,
      isArchived: false,
      genres: [],
    }
    const result = validateMovieJSON(minimalData)
    expect(result.isValid).toBe(true)
    expect(result.warnings.length).toBeGreaterThan(0)
  })
})

describe("Movie JSON Import - Sanitization", () => {
  it("should add missing IDs to cast members", () => {
    const data = {
      ...MOVIE_JSON_TEMPLATE,
      cast: [{ name: "Actor", character: "Character", order: 1 }],
    }
    const sanitized = sanitizeMovieData(data)
    expect(sanitized.cast![0].id).toBeDefined()
    expect(sanitized.cast![0].id).toMatch(/^cast-/)
  })

  it("should add missing IDs to crew members", () => {
    const data = {
      ...MOVIE_JSON_TEMPLATE,
      crew: [{ name: "Director", role: "Director", department: "Directing" }],
    }
    const sanitized = sanitizeMovieData(data)
    expect(sanitized.crew![0].id).toBeDefined()
    expect(sanitized.crew![0].id).toMatch(/^crew-/)
  })

  it("should add missing IDs to streaming links", () => {
    const data = {
      ...MOVIE_JSON_TEMPLATE,
      streamingLinks: [{ provider: "Netflix", region: "US", url: "https://netflix.com", type: "subscription", quality: "HD" }],
    }
    const sanitized = sanitizeMovieData(data)
    expect(sanitized.streamingLinks![0].id).toBeDefined()
    expect(sanitized.streamingLinks![0].verified).toBe(false)
  })

  it("should add missing IDs to awards", () => {
    const data = {
      ...MOVIE_JSON_TEMPLATE,
      awards: [{ name: "Oscar", year: 2020, category: "Best Picture", status: "Winner" }],
    }
    const sanitized = sanitizeMovieData(data)
    expect(sanitized.awards![0].id).toBeDefined()
  })

  it("should add missing IDs to trivia", () => {
    const data = {
      ...MOVIE_JSON_TEMPLATE,
      trivia: [{ question: "Q?", answer: "A", category: "Behind the Scenes" }],
    }
    const sanitized = sanitizeMovieData(data)
    expect(sanitized.trivia![0].id).toBeDefined()
  })

  it("should add missing IDs to timeline events", () => {
    const data = {
      ...MOVIE_JSON_TEMPLATE,
      timelineEvents: [{ title: "Event", date: "2020-01-01", category: "Production Start", description: "Started" }],
    }
    const sanitized = sanitizeMovieData(data)
    expect(sanitized.timelineEvents![0].id).toBeDefined()
  })

  it("should set default values for required fields", () => {
    const data = { title: "Test", status: "draft" }
    const sanitized = sanitizeMovieData(data)
    expect(sanitized.isPublished).toBe(false)
    expect(sanitized.isArchived).toBe(false)
    expect(sanitized.genres).toEqual([])
    expect(sanitized.importedFrom).toBe("JSON")
  })

  it("should preserve existing order in cast members", () => {
    const data = {
      ...MOVIE_JSON_TEMPLATE,
      cast: [
        { name: "Actor 1", character: "Char 1", order: 5 },
        { name: "Actor 2", character: "Char 2", order: 10 },
      ],
    }
    const sanitized = sanitizeMovieData(data)
    expect(sanitized.cast![0].order).toBe(5)
    expect(sanitized.cast![1].order).toBe(10)
  })

  it("should auto-assign order if missing in cast members", () => {
    const data = {
      ...MOVIE_JSON_TEMPLATE,
      cast: [
        { name: "Actor 1", character: "Char 1" },
        { name: "Actor 2", character: "Char 2" },
      ],
    }
    const sanitized = sanitizeMovieData(data)
    expect(sanitized.cast![0].order).toBe(1)
    expect(sanitized.cast![1].order).toBe(2)
  })
})

describe("Movie JSON Import - Template Generation", () => {
  it("should generate a valid LLM prompt with movie name", () => {
    const prompt = generateMoviePrompt("The Matrix")
    expect(prompt).toContain("The Matrix")
    expect(prompt).toContain("Generate a complete movie JSON object")
    expect(prompt).toContain("JSON TEMPLATE:")
    expect(prompt).toContain('"title"')
  })

  it("should generate a blank template", () => {
    const template = generateBlankTemplate()
    const parsed = JSON.parse(template)
    expect(parsed.title).toBe("Inception")
    expect(parsed.cast).toBeDefined()
    expect(parsed.crew).toBeDefined()
  })

  it("should include all required fields in template", () => {
    const template = generateBlankTemplate()
    const parsed = JSON.parse(template)
    expect(parsed.title).toBeDefined()
    expect(parsed.status).toBeDefined()
    expect(parsed.isPublished).toBeDefined()
    expect(parsed.isArchived).toBeDefined()
  })

  it("should include all 7 tabs worth of data in template", () => {
    const template = generateBlankTemplate()
    const parsed = JSON.parse(template)
    // Tab 1: Basic Info
    expect(parsed.title).toBeDefined()
    expect(parsed.genres).toBeDefined()
    // Tab 2: Media
    expect(parsed.poster).toBeDefined()
    expect(parsed.galleryImages).toBeDefined()
    // Tab 3: Cast & Crew
    expect(parsed.cast).toBeDefined()
    expect(parsed.crew).toBeDefined()
    // Tab 4: Streaming
    expect(parsed.streamingLinks).toBeDefined()
    // Tab 5: Awards
    expect(parsed.awards).toBeDefined()
    // Tab 6: Trivia
    expect(parsed.trivia).toBeDefined()
    // Tab 7: Timeline
    expect(parsed.timelineEvents).toBeDefined()
  })
})

describe("Movie JSON Import - Edge Cases", () => {
  it("should handle null input", () => {
    const result = validateMovieJSON(null)
    expect(result.isValid).toBe(false)
    expect(result.errors[0].field).toBe("root")
  })

  it("should handle undefined input", () => {
    const result = validateMovieJSON(undefined)
    expect(result.isValid).toBe(false)
    expect(result.errors[0].field).toBe("root")
  })

  it("should handle non-object input", () => {
    const result = validateMovieJSON("not an object")
    expect(result.isValid).toBe(false)
    expect(result.errors[0].field).toBe("root")
  })

  it("should handle empty object", () => {
    const result = validateMovieJSON({})
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.field === "title")).toBe(true)
    expect(result.errors.some((e) => e.field === "status")).toBe(true)
  })

  it("should handle arrays instead of objects for nested fields", () => {
    const invalidData = {
      ...MOVIE_JSON_TEMPLATE,
      cast: "not an array",
    }
    const result = validateMovieJSON(invalidData)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.field === "cast")).toBe(true)
  })
})

