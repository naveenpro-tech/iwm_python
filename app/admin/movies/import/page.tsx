"use client"

import React, { useState } from "react"
import { getAuthHeaders } from "@/lib/auth"

export default function AdminMoviesImportPage() {
  const [jsonText, setJsonText] = useState(`[
  {
    "external_id": "tmdb-123456",
    "title": "Example Movie",
    "year": "2025",
    "genres": ["action", "sci-fi"],
    "directors": [{ "name": "Jane Doe" }],
    "cast": [{ "name": "John Actor", "character": "Hero" }],
    "streaming": [
      { "platform": "netflix", "region": "US", "type": "subscription" }
    ]
  }
]`)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<null | { imported: number; updated: number; failed: number; errors: string[] }>(null)
  const [error, setError] = useState<string | null>(null)

  const insertFullTemplate = () => {
    const tmpl = `[
  {
    "external_id": "manual-gem-sample",
    "title": "Sample Movie Title",
    "tagline": "Optional tagline",
    "year": "2025",
    "release_date": "2025-06-01",
    "runtime": 123,
    "rating": "PG-13",
    "siddu_score": 8.2,
    "critics_score": 82.5,
    "imdb_rating": 7.8,
    "rotten_tomatoes_score": 90.0,
    "language": "EN",
    "country": "United States",
    "overview": "One paragraph plot overview.",
    "poster_url": "https://example.com/poster.jpg",
    "backdrop_url": "https://example.com/backdrop.jpg",
    "budget": 100000000,
    "revenue": 350000000,
    "status": "Released",
    "genres": ["Action", "Sci-Fi"],
    "directors": [{ "name": "Jane Director", "image": null }],
    "writers": [{ "name": "Writ Erson", "image": null }],
    "producers": [{ "name": "Pro Ducer", "image": null }],
    "cast": [
      { "name": "John Star", "character": "Hero", "image": null },
      { "name": "Mary CoStar", "character": "Partner", "image": null }
    ],
    "streaming": [
      { "platform": "Netflix", "region": "US", "type": "subscription", "price": null, "quality": "HD", "url": "https://netflix.com/title/xyz" },
      { "platform": "Apple TV", "region": "US", "type": "buy", "price": 14.99, "quality": "UHD", "url": "https://tv.apple.com/item/xyz" }
    ],
    "awards": [
      { "name": "Academy Awards", "year": 2025, "category": "Best Picture", "status": "Winner" }
    ],
    "trivia": [
      { "question": "Was this movie based on a true story?", "category": "Production", "answer": "Yes, inspired by real events", "explanation": "The filmmakers drew inspiration from historical records." }
    ],
    "timeline": [
      { "date": "2024-01-15", "title": "Production Begins", "description": "Principal photography starts", "type": "Production Start" },
      { "date": "2025-06-01", "title": "Theatrical Release", "description": "Movie released in theaters worldwide", "type": "Theatrical" }
    ]
  }
]`;
    setJsonText(tmpl);
  }

  const handleFile = async (file: File) => {
    const text = await file.text()
    setJsonText(text)
  }

  const submit = async () => {
    setIsSubmitting(true)
    setResult(null)
    setError(null)
    try {
      const payload = JSON.parse(jsonText)
      if (!Array.isArray(payload)) throw new Error("JSON must be an array of movies")
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
      const authHeaders = getAuthHeaders()
      const res = await fetch(`${apiBase}/api/v1/admin/movies/import`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        // Handle authentication errors specifically
        if (res.status === 401) {
          throw new Error("Authentication required. Please login as admin.")
        }
        if (res.status === 403) {
          throw new Error("Access denied. Admin privileges required.")
        }
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || `Import failed: ${res.status} ${res.statusText}`)
      }
      const data = await res.json()
      setResult(data)
    } catch (e: any) {
      setError(e?.message || "Import failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Admin: Import Movies (JSON)</h1>
      <p className="text-sm text-gray-400 mb-4">Paste JSON array or upload a .json file matching the example template.</p>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="file"
          accept="application/json,.json"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />
        <button
          onClick={insertFullTemplate}
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
          type="button"
        >
          Insert Full Template
        </button>
        <button
          onClick={submit}
          disabled={isSubmitting}
          className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
        >
          {isSubmitting ? "Importing..." : "Import"}
        </button>
      </div>
      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        rows={16}
        className="w-full bg-[#111] text-gray-200 border border-gray-700 rounded p-3 font-mono text-sm"
      />
      {error && (
        <div className="mt-4 p-3 border border-red-700 bg-red-950/40 text-red-200 rounded">{error}</div>
      )}
      {result && (
        <div className="mt-4 p-3 border border-green-700 bg-green-950/40 text-green-200 rounded">
          <div>Imported: {result.imported}</div>
          <div>Updated: {result.updated}</div>
          <div>Failed: {result.failed}</div>
          {result.errors?.length ? (
            <details className="mt-2">
              <summary>Errors</summary>
              <ul className="list-disc ml-6">
                {result.errors.map((e, i) => (
                  <li key={i} className="text-sm">{e}</li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      )}
    </div>
  )
}

