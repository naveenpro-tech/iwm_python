{
  ;`'use client'

import Image from "next/image"
import { X, Star, Users, Film, DollarSign, Calendar, Clock, Globe, Languages, Award, Video } from 'lucide-react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { MovieComparisonData } from "./types"
import { Separator } from "@/components/ui/separator"

interface ComparisonColumnProps {
  movie: MovieComparisonData
  onRemoveMovie: (movieId: string) => void
  isHighlighted?: (field: keyof MovieComparisonData, value: any) => boolean
}

const StatItem: React.FC<{ icon: React.ElementType; label: string; value?: string | number | string[]; className?: string; highlight?: boolean }> = ({
  icon: Icon,
  label,
  value,
  className,
  highlight,
}) => {
  if (!value && typeof value !== 'number') return null
  return (
    <div className={cn("flex items-start space-x-2 py-2", className, highlight && "bg-siddu-electric-blue/10 rounded p-1 -m-1")}>
      <Icon className="h-4 w-4 mt-0.5 text-siddu-electric-blue flex-shrink-0" />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        {Array.isArray(value) ? (
          <div className="flex flex-wrap gap-1 mt-1">
            {value.map((item, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                {item}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm font-medium text-gray-100">{value}</p>
        )}
      </div>
    </div>
  )
}

export function ComparisonColumn({ movie, onRemoveMovie, isHighlighted }: ComparisonColumnProps) {
  const highlight = (field: keyof MovieComparisonData, value: any) => isHighlighted?.(field, value) ?? false;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-siddu-bg-card-dark border border-siddu-border-subtle rounded-lg p-4 md:p-6 flex flex-col h-full shadow-xl"
    >
      <div className="relative">
        <Image
          src={movie.poster || "/placeholder.svg?width=300&height=450&text=No+Poster"}
          alt={\`Poster for \${movie.title}\`}
          width={300}
          height={450}
          className="w-full h-auto rounded-md object-cover aspect-[2/3] mb-4 shadow-lg"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemoveMovie(movie.id)}
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8"
          aria-label="Remove movie from comparison"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <h2 className="text-xl lg:text-2xl font-bold text-white mb-1 truncate">{movie.title}</h2>
      <p className="text-sm text-gray-400 mb-4">{movie.year}</p>

      <div className="space-y-3 mb-4 flex-grow overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <StatItem icon={Star} label="SidduScore" value={movie.sidduScore} highlight={highlight('sidduScore', movie.sidduScore)} />
        <StatItem icon={Users} label="Audience Score" value={movie.audienceScore ? \`\${movie.audienceScore}%\` : 'N/A'} highlight={highlight('audienceScore', movie.audienceScore)} />
        <StatItem icon={Film} label="Critic Score" value={movie.criticScore ? \`\${movie.criticScore}%\` : 'N/A'} highlight={highlight('criticScore', movie.criticScore)} />
        
        <Separator className="my-3 bg-gray-700" />
        
        <StatItem icon={Calendar} label="Genres" value={movie.genres} />
        <StatItem icon={Clock} label="Runtime" value={movie.runtime ? \`\${movie.runtime} min\` : 'N/A'} highlight={highlight('runtime', movie.runtime)} />
        <StatItem icon={Users} label="Director" value={movie.director} />
        <StatItem icon={Users} label="Top Cast" value={movie.cast.slice(0,3)} />
        
        {movie.productionDetails && (
          <>
            <Separator className="my-3 bg-gray-700" />
            <h3 className="text-sm font-semibold text-siddu-electric-blue pt-2">Production</h3>
            <StatItem icon={DollarSign} label="Budget" value={movie.productionDetails.budget} />
            <StatItem icon={Film} label="Studio(s)" value={movie.productionDetails.studio} />
            <StatItem icon={Globe} label="Country" value={movie.productionDetails.country} />
            <StatItem icon={Languages} label="Language" value={movie.productionDetails.language} />
          </>
        )}

        {movie.boxOffice && (
           <>
            <Separator className="my-3 bg-gray-700" />
            <h3 className="text-sm font-semibold text-siddu-electric-blue pt-2">Box Office</h3>
            <StatItem icon={DollarSign} label="Worldwide Gross" value={movie.boxOffice.worldwide} highlight={highlight('boxOffice', movie.boxOffice.worldwide)} />
            <StatItem icon={DollarSign} label="Domestic Gross (USA)" value={movie.boxOffice.domestic} />
            <StatItem icon={DollarSign} label="Opening Weekend (USA)" value={movie.boxOffice.openingWeekendUSA} />
          </>
        )}
        
        <Separator className="my-3 bg-gray-700" />
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all duration-300 cursor-help" title={movie.synopsis}>
          {movie.synopsis}
        </p>

        {movie.awardsSummary && <StatItem icon={Award} label="Awards" value={movie.awardsSummary} />}
      </div>

      {movie.trailerUrl && (
        <Button 
          variant="outline" 
          className="mt-auto w-full border-siddu-electric-blue text-siddu-electric-blue hover:bg-siddu-electric-blue/10 hover:text-siddu-electric-blue"
          onClick={() => window.open(movie.trailerUrl, '_blank')}
        >
          <Video className="h-4 w-4 mr-2" /> Watch Trailer
        </Button>
      )}
    </motion.div>
  )
}`
}
