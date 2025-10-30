"use client"

import React, { useState, useEffect } from "react"
import { Copy, Download, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import Link from "next/link"

interface SchemaField {
  name: string
  type: string
  required: boolean
  description: string
}

interface ImportSchema {
  version: string
  description: string
  fields: SchemaField[]
  example: Record<string, any>
}

interface ImportTemplate {
  description: string
  template: Record<string, any>[]
}

export default function AdminMoviesSchemaPage() {
  const [schema, setSchema] = useState<ImportSchema | null>(null)
  const [template, setTemplate] = useState<ImportTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set())
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
        
        const [schemaRes, templateRes] = await Promise.all([
          fetch(`${apiBase}/api/admin/import/schema`),
          fetch(`${apiBase}/api/admin/import/template`),
        ])

        if (!schemaRes.ok) throw new Error("Failed to fetch schema")
        if (!templateRes.ok) throw new Error("Failed to fetch template")

        const schemaData = await schemaRes.json()
        const templateData = await templateRes.json()

        setSchema(schemaData)
        setTemplate(templateData)
      } catch (e: any) {
        setError(e?.message || "Failed to load schema")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleField = (fieldName: string) => {
    const newExpanded = new Set(expandedFields)
    if (newExpanded.has(fieldName)) {
      newExpanded.delete(fieldName)
    } else {
      newExpanded.add(fieldName)
    }
    setExpandedFields(newExpanded)
  }

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const downloadTemplate = () => {
    if (!template) return
    const json = JSON.stringify(template.template, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "movie-import-template.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadSchema = () => {
    if (!schema) return
    const json = JSON.stringify(schema, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "movie-import-schema.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center text-gray-400">Loading schema...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="p-4 border border-red-700 bg-red-950/40 text-red-200 rounded">
          {error}
        </div>
      </div>
    )
  }

  if (!schema || !template) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center text-gray-400">No schema data available</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Movie Import Schema</h1>
        <p className="text-gray-400 mb-4">{schema.description}</p>
        <div className="flex gap-3">
          <button
            onClick={downloadSchema}
            className="flex items-center gap-2 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            <Download size={16} />
            Download Schema
          </button>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white transition"
          >
            <Download size={16} />
            Download Template
          </button>
          <Link
            href="/admin/movies/import"
            className="flex items-center gap-2 px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white transition"
          >
            <ExternalLink size={16} />
            Go to Import Page
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Fields Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Fields ({schema.fields.length})</h2>
          <div className="space-y-2">
            {schema.fields.map((field) => (
              <div
                key={field.name}
                className="border border-gray-700 rounded bg-gray-900/50 hover:bg-gray-900 transition"
              >
                <button
                  onClick={() => toggleField(field.name)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                  <div className="flex-1">
                    <div className="font-mono text-sm font-semibold">{field.name}</div>
                    <div className="text-xs text-gray-400">
                      {field.type} {field.required && <span className="text-red-400">*required</span>}
                    </div>
                  </div>
                  {expandedFields.has(field.name) ? (
                    <ChevronUp size={16} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400" />
                  )}
                </button>
                {expandedFields.has(field.name) && (
                  <div className="px-4 pb-3 border-t border-gray-700 pt-3 text-sm text-gray-300">
                    <p className="mb-2">{field.description}</p>
                    <button
                      onClick={() => copyToClipboard(field.name, field.name)}
                      className="flex items-center gap-2 text-xs px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 transition"
                    >
                      <Copy size={12} />
                      {copiedField === field.name ? "Copied!" : "Copy field name"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Example Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Example Movie</h2>
          <div className="bg-gray-900/50 border border-gray-700 rounded p-4">
            <pre className="text-xs text-gray-300 overflow-auto max-h-96 font-mono">
              {JSON.stringify(schema.example, null, 2)}
            </pre>
            <button
              onClick={() => copyToClipboard(JSON.stringify(schema.example, null, 2), "example")}
              className="mt-3 flex items-center gap-2 text-xs px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 w-full justify-center transition"
            >
              <Copy size={14} />
              {copiedField === "example" ? "Copied!" : "Copy example"}
            </button>
          </div>
        </div>
      </div>

      {/* Template Preview */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Template Preview</h2>
        <div className="bg-gray-900/50 border border-gray-700 rounded p-4">
          <pre className="text-xs text-gray-300 overflow-auto max-h-96 font-mono">
            {JSON.stringify(template.template, null, 2)}
          </pre>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 border border-blue-700 bg-blue-950/40 rounded">
        <h3 className="font-semibold text-blue-200 mb-2">How to use:</h3>
        <ol className="text-sm text-blue-100 space-y-1 list-decimal list-inside">
          <li>Download the template or copy the example above</li>
          <li>Fill in your movie data following the schema</li>
          <li>Go to <Link href="/admin/movies/import" className="underline hover:text-blue-300">Import Movies</Link> page</li>
          <li>Paste or upload your JSON file</li>
          <li>Click Import to add movies to the database</li>
        </ol>
      </div>
    </div>
  )
}

