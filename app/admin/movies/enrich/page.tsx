"use client"

import React, { useState } from "react"

export default function AdminMoviesEnrichPage() {
  const [query, setQuery] = useState("")
  const [bulk, setBulk] = useState("Dune: Part Two\nOppenheimer\nInside Out 2")
  const [existingId, setExistingId] = useState("")
  const [loading, setLoading] = useState<null | string>(null)
  const [result, setResult] = useState<any>(null)
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  const call = async (path: string, body: any) => {
    setLoading(path)
    setResult(null)
    try {
      const res = await fetch(`${apiBase}/api/v1${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      setResult({ ok: res.ok, data })
    } catch (e: any) {
      setResult({ ok: false, error: e?.message || "request failed" })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Admin: Enrich Movies (Gemini/TMDB)</h1>
      <p className="text-sm text-gray-400 mb-6">If Gemini API key is missing, the system will fallback to TMDB using your configured TMDB_API_KEY.</p>

      <div className="space-y-6">
        <section className="border border-gray-700 rounded p-4">
          <h2 className="text-lg font-medium mb-2">Single Query</h2>
          <div className="flex gap-2">
            <input className="flex-1 bg-[#111] border border-gray-700 rounded px-3 py-2" placeholder="e.g., Dune: Part Two" value={query} onChange={(e) => setQuery(e.target.value)} />
            <button
              onClick={() => call("/admin/movies/enrich", { query })}
              disabled={!query || !!loading}
              className="px-3 py-2 bg-blue-600 rounded text-white disabled:opacity-50"
            >
              {loading === "/admin/movies/enrich" ? "Enriching..." : "Enrich"}
            </button>
          </div>
        </section>

        <section className="border border-gray-700 rounded p-4">
          <h2 className="text-lg font-medium mb-2">Enrich Existing (by external_id)</h2>
          <div className="flex gap-2">
            <input className="flex-1 bg-[#111] border border-gray-700 rounded px-3 py-2" placeholder="external_id (e.g., tmdb-123)" value={existingId} onChange={(e) => setExistingId(e.target.value)} />
            <button
              onClick={() => call("/admin/movies/enrich-existing", { external_id: existingId })}
              disabled={!existingId || !!loading}
              className="px-3 py-2 bg-emerald-600 rounded text-white disabled:opacity-50"
            >
              {loading === "/admin/movies/enrich-existing" ? "Updating..." : "Fill Missing"}
            </button>
          </div>
        </section>

        <section className="border border-gray-700 rounded p-4">
          <h2 className="text-lg font-medium mb-2">Bulk Queries (one per line)</h2>
          <textarea className="w-full bg-[#111] border border-gray-700 rounded px-3 py-2 font-mono text-sm" rows={8} value={bulk} onChange={(e) => setBulk(e.target.value)} />
          <div className="mt-2">
            <button
              onClick={() => call("/admin/movies/enrich/bulk", { queries: bulk.split("\n").map((s) => s.trim()).filter(Boolean) })}
              disabled={!!loading}
              className="px-3 py-2 bg-purple-600 rounded text-white disabled:opacity-50"
            >
              {loading === "/admin/movies/enrich/bulk" ? "Enriching..." : "Enrich Bulk"}
            </button>
          </div>
        </section>

        {result && (
          <section className={`border rounded p-4 ${result.ok ? "border-green-700 bg-green-950/30" : "border-red-700 bg-red-950/30"}`}>
            <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(result, null, 2)}</pre>
          </section>
        )}
      </div>
    </div>
  )
}

