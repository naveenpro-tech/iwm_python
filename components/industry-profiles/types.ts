export interface IndustryProfessionalProfile {
  id: string
  name: string
  role: string
  verificationStatus: "pending" | "verified" | "rejected" | "unverified"
  bio: string
  profilePhoto: string
  coverPhoto?: string
  location?: string
  company?: string
  website?: string
  socialMedia?: {
    twitter?: string
    instagram?: string
    linkedin?: string
    facebook?: string
    youtube?: string
    tiktok?: string
  }
  filmography?: {
    title: string
    year: number
    role: string
    image?: string
  }[]
  awards?: {
    name: string
    year: number
    project?: string
  }[]
  pressKit?: {
    title: string
    type: string
    url: string
    size: string
  }[]
  pulses?: {
    id: string
    content: string
    timestamp: string
    likes: number
    comments: number
    views: number
    image?: string
  }[]
  stats?: {
    followers: number
    projects: number
    awards: number
  }
  joinDate: string
  privacySettings?: {
    contactVisibility: "public" | "industry_only" | "private"
    profileVisibility?: "public" | "industry_only" | "private"
    filmographyVisibility?: "public" | "industry_only" | "private"
    awardsVisibility?: "public" | "industry_only" | "private"
    pressKitVisibility?: "public" | "industry_only" | "private"
    pulsesVisibility?: "public" | "industry_only" | "private"
  }
  verificationDocuments?: {
    id: string
    type: string
    name: string
    url: string
    uploadDate: string
    status: "pending" | "verified" | "rejected"
  }[]
}

export interface VerificationRequest {
  id: string
  profileId: string
  profileName: string
  profileRole: string
  profilePhoto: string
  submissionDate: string
  status: "pending" | "in_review" | "approved" | "rejected"
  documents: {
    id: string
    type: string
    name: string
    url: string
    uploadDate: string
  }[]
  reviewerId?: string
  reviewDate?: string
  reviewNotes?: string
  rejectionReason?: string
}

export interface PressKitItem {
  id: string
  title: string
  type: string
  url: string
  size: string
  uploadDate: string
  profileId: string
}

export interface FilmographyItem {
  id: string
  title: string
  year: number
  role: string
  description?: string
  image?: string
  profileId: string
}

export interface AwardItem {
  id: string
  name: string
  year: number
  project?: string
  description?: string
  profileId: string
}
