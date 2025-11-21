"use client"

import { useState, useRef, useEffect } from "react"
import { Bold, Italic, Underline, List, ListOrdered, Quote, Link, Type } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReviewEditorProps {
  value: string
  onChange: (value: string) => void
  movieTitle: string
}

export function ReviewEditor({ value, onChange, movieTitle }: ReviewEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    setCharCount(value.length)
  }, [value])

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerText)
    }
  }

  const handleInput = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText
      onChange(text)
      setCharCount(text.length)
    }
  }

  const getCharCountColor = () => {
    if (charCount < 50) return "text-red-500"
    if (charCount < 200) return "text-siddu-accent-yellow"
    return "text-green-500"
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-siddu-text-light">Your Review</label>

      <div className="border border-siddu-border-subtle rounded-lg overflow-hidden focus-within:border-siddu-electric-blue transition-colors">
        <div className="bg-siddu-bg-card-dark border-b border-siddu-border-subtle p-2 flex items-center gap-1 flex-wrap">
          <Button type="button" variant="ghost" size="sm" onClick={() => handleFormat("bold")} className="p-2 h-8">
            <Bold className="w-4 h-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => handleFormat("italic")} className="p-2 h-8">
            <Italic className="w-4 h-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => handleFormat("underline")} className="p-2 h-8">
            <Underline className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-siddu-border-subtle mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleFormat("insertUnorderedList")}
            className="p-2 h-8"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleFormat("insertOrderedList")}
            className="p-2 h-8"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-siddu-border-subtle mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleFormat("formatBlock", "<blockquote>")}
            className="p-2 h-8"
          >
            <Quote className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = prompt("Enter URL:")
              if (url) handleFormat("createLink", url)
            }}
            className="p-2 h-8"
          >
            <Link className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleFormat("removeFormat")}
            className="p-2 h-8"
          >
            <Type className="w-4 h-4" />
          </Button>
        </div>

        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="min-h-[200px] p-4 bg-siddu-bg-card text-siddu-text-light focus:outline-none"
          style={{
            lineHeight: "1.6",
            wordBreak: "break-word",
          }}
          placeholder={`Share your thoughts on ${movieTitle}... What worked? What didn't? No spoilers unless marked.`}
          suppressContentEditableWarning
        />

        <div className="bg-siddu-bg-card-dark border-t border-siddu-border-subtle px-4 py-2 flex justify-between items-center">
          <div className="text-sm text-siddu-text-subtle">
            {charCount < 50 && <span>Minimum 50 characters required</span>}
            {charCount >= 50 && charCount < 200 && <span>Good start! Consider adding more detail</span>}
            {charCount >= 200 && <span>Great review length!</span>}
          </div>
          <div className={`text-sm font-medium ${getCharCountColor()}`}>{charCount} / 5000</div>
        </div>
      </div>
    </div>
  )
}
