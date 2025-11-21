"use client"

import { RelatedGenres } from "./related-genres"
import { GenreCuratedCollections } from "./genre-curated-collections"
import { GenreNotableFigures } from "./genre-notable-figures"
import { GenreEvolutionTimeline } from "./genre-evolution-timeline"
import type { GenreDetails } from "@/lib/api"

interface GenreAdditionalContentProps {
  relatedGenres: GenreDetails["relatedGenres"]
  curatedCollections: GenreDetails["curatedCollections"]
  notableFigures: GenreDetails["notableFigures"]
  evolutionTimeline: GenreDetails["evolutionTimeline"]
  genreName: string
}

export function GenreAdditionalContent({
  relatedGenres,
  curatedCollections,
  notableFigures,
  evolutionTimeline,
  genreName,
}: GenreAdditionalContentProps) {
  return (
    <div className="space-y-6 md:space-y-8 bg-gray-800/30 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-gray-700/50">
      <RelatedGenres relatedGenres={relatedGenres} />
      <GenreCuratedCollections collections={curatedCollections} genreName={genreName} />
      <GenreNotableFigures figures={notableFigures} genreName={genreName} />
      <GenreEvolutionTimeline timelineEvents={evolutionTimeline} genreName={genreName} />
    </div>
  )
}
