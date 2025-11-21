"use client"

import Image from "next/image"

interface StreamingServiceLogoProps {
  providerName: string
  logoUrl: string
  size?: number // Approx size in pixels
  className?: string
}

// A simple map for known provider names to a more consistent display name or specific styling if needed
const providerDisplayName: Record<string, string> = {
  Netflix: "Netflix",
  "Amazon Prime Video": "Prime Video",
  "Disney+": "Disney+",
  "HBO Max": "Max", // Or HBO Max depending on branding
  Hulu: "Hulu",
  "Apple TV+": "Apple TV+",
  ParamountPlus: "Paramount+", // Assuming this is how it might come from an API
  Peacock: "Peacock",
  YouTube: "YouTube",
  "Google Play Movies & TV": "Google Play",
  Vudu: "Vudu",
  "Microsoft Store": "Microsoft",
  JioCinema: "JioCinema",
  // Add more as needed
}

export function StreamingServiceLogo({ providerName, logoUrl, size = 24, className = "" }: StreamingServiceLogoProps) {
  const displayName = providerDisplayName[providerName] || providerName

  return (
    <div className={`flex items-center ${className}`} title={displayName}>
      <Image
        src={logoUrl || `/placeholder.svg?width=${size}&height=${size}&query=${encodeURIComponent(displayName)} logo`}
        alt={`${displayName} logo`}
        width={size}
        height={size}
        className="rounded-sm object-contain" // object-contain is usually good for logos
      />
    </div>
  )
}
