export interface CastingCall {
  id: string
  projectTitle: string
  projectType: "feature" | "short" | "tv-series" | "web-series" | "commercial" | "documentary"
  productionCompany: string
  description: string
  productionTimeline: {
    start: Date
    end: Date
  }
  location: {
    city: string
    state: string
    country: string
  }
  budgetRange?: "low" | "medium" | "high" | "undisclosed"
  visibility: "public" | "private"
  roles: Role[]
  submissionDeadline: Date
  postedDate: Date
  posterImage?: string
  isVerified: boolean
  status: "active" | "closed" | "draft"
}

export interface Role {
  id: string
  type: "acting" | "crew"
  title: string
  description: string
  category: string // Lead, Supporting, Extra for acting; Department Head, Assistant for crew
  department?: string // For crew positions
  compensation: "paid" | "unpaid" | "deferred" | "credit-only"
  paymentDetails?: string
  requirements: {
    ageRange?: { min: number; max: number }
    gender?: string[]
    ethnicity?: string[]
    languages?: { language: string; proficiency: string }[]
    physicalAttributes?: string
    skills?: string[]
    experienceLevel: "beginner" | "intermediate" | "professional"
    unionStatus?: "sag-aftra" | "non-union" | "both"
  }
  auditionType: "in-person" | "self-tape" | "video-call"
}

export interface SubmissionGuidelines {
  requiredMaterials: string[]
  submissionMethod: "siddu" | "email" | "website"
  contactInfo?: {
    email?: string
    website?: string
  }
  specialInstructions?: string
}

export interface FormData extends Omit<CastingCall, "id" | "postedDate" | "status"> {
  submissionGuidelines: SubmissionGuidelines
}
