export interface TalentProfile {
  id: string
  userId: string
  // Personal Information
  fullName: string
  professionalName?: string
  email: string
  phone?: string
  location: {
    city: string
    state?: string
    country: string
  }
  dateOfBirth?: Date
  genderIdentity?: string
  pronouns?: string

  // Professional Identity
  primaryRole: "actor" | "crew"
  secondaryRoles?: string[]
  unionStatus?: "sag-aftra" | "non-union" | "other"
  yearsOfExperience: number
  languages?: { language: string; proficiency: string }[]
  professionalWebsite?: string

  // Actor-specific
  actorDetails?: {
    ageRange?: { min: number; max: number }
    height?: string
    weight?: string
    hairColor?: string
    eyeColor?: string
    ethnicity?: string
    bodyType?: string
  }

  // Crew-specific
  crewDetails?: {
    department: string
    specialization: string[]
    equipment: string[]
    software: string[]
    certifications?: string[]
  }

  // Media
  profilePhoto?: string
  coverPhoto?: string
  additionalPhotos?: {
    id: string
    url: string
    caption?: string
    type: "headshot" | "production" | "behind-scenes"
  }[]
  showreel?: {
    url: string
    platform: "youtube" | "vimeo" | "upload"
    thumbnail?: string
    duration?: number
  }
  portfolioLinks?: {
    platform: string
    url: string
  }[]

  // Experience & Skills
  experience: ProjectExperience[]
  skills: {
    category: string
    items: {
      name: string
      proficiency?: "beginner" | "intermediate" | "expert"
      endorsements?: number
      endorsers?: string[]
    }[]
  }[]

  // Biography & Documents
  biography?: string
  resume?: {
    url: string
    uploadedAt: Date
  }
  additionalDocuments?: {
    type: "certificate" | "reference" | "award"
    name: string
    url: string
  }[]

  // Privacy Settings
  privacySettings: {
    profileVisibility: "public" | "industry-only" | "private"
    contactVisibility: "public" | "verified-only" | "private"
    searchEngineIndexing: boolean
    sectionPrivacy: {
      [key: string]: "public" | "industry-only" | "private"
    }
  }

  // Metadata
  isVerified: boolean
  verificationLevel?: "basic" | "professional" | "premium"
  profileCompleteness: number
  createdAt: Date
  updatedAt: Date
  lastViewedBy?: {
    name: string
    role: string
    date: Date
  }[]
  viewCount: number
  monthlyViews: number
  followerCount: number
  following: string[]

  // Applications
  applications?: Application[]
}

export interface ProjectExperience {
  id: string
  title: string
  productionType: "film" | "tv" | "theater" | "commercial" | "other"
  role: string
  company?: string
  director?: string
  year: number
  description?: string
  media?: {
    type: "image" | "video"
    url: string
    thumbnail?: string
  }[]
}

export interface Application {
  id: string
  castingCallId: string
  castingCallTitle: string
  roleAppliedFor: string
  appliedDate: Date
  status: "applied" | "under-review" | "shortlisted" | "rejected" | "archived"
  lastUpdate: Date
  messages?: {
    from: string
    content: string
    date: Date
  }[]
}

export interface ProfileFormData extends Partial<TalentProfile> {
  currentStep: number
}

export interface SkillEndorsement {
  skillId: string
  endorserId: string
  endorserName: string
  endorserRole: string
  endorsedAt: Date
}
