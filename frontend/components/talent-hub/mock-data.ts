import type { CastingCall } from "./types"

export const mockCastingCalls: CastingCall[] = [
  {
    id: "cc-001",
    projectTitle: "The Last Horizon",
    projectType: "feature",
    productionCompany: "Stellar Productions",
    description:
      "A sci-fi epic set in the year 2150, following a group of explorers who discover a habitable planet at the edge of our galaxy. As they establish the first human colony, they uncover ancient alien artifacts that suggest they are not the first intelligent life to inhabit the planet.\n\nThis is a high-concept science fiction film with practical effects and on-location shooting in Iceland and New Zealand.",
    productionTimeline: {
      start: new Date("2023-12-15"),
      end: new Date("2024-03-30"),
    },
    location: {
      city: "Auckland",
      state: "Auckland Region",
      country: "New Zealand",
    },
    budgetRange: "high",
    visibility: "public",
    roles: [
      {
        id: "role-001",
        type: "acting",
        title: "Captain Elara Chen",
        description:
          "Lead role. Mission commander with a military background and scientific expertise. Strong-willed, pragmatic, and haunted by a previous failed mission. Age 35-45.",
        category: "lead",
        compensation: "paid",
        paymentDetails: "SAG-AFTRA Scale + 20%",
        requirements: {
          ageRange: { min: 35, max: 45 },
          gender: ["Female"],
          ethnicity: ["Asian", "Open to All"],
          languages: [
            { language: "English", proficiency: "fluent" },
            { language: "Mandarin", proficiency: "conversational" },
          ],
          skills: ["Combat Training", "Horseback Riding", "Swimming"],
          experienceLevel: "professional",
          unionStatus: "sag-aftra",
        },
        auditionType: "in-person",
      },
      {
        id: "role-002",
        type: "acting",
        title: "Dr. Marcus Wells",
        description:
          "Supporting role. Brilliant xenobiologist with social awkwardness. Passionate about his work to a fault. Comic relief with dramatic moments. Age 30-40.",
        category: "supporting",
        compensation: "paid",
        paymentDetails: "SAG-AFTRA Scale",
        requirements: {
          ageRange: { min: 30, max: 40 },
          gender: ["Male"],
          ethnicity: ["Open to All"],
          languages: [{ language: "English", proficiency: "fluent" }],
          skills: ["Improvisation"],
          experienceLevel: "professional",
          unionStatus: "both",
        },
        auditionType: "self-tape",
      },
      {
        id: "role-003",
        type: "crew",
        title: "Director of Photography",
        description:
          "Seeking an experienced DP with a strong background in sci-fi and practical effects. Must be comfortable with challenging outdoor shoots in extreme environments.",
        category: "head",
        department: "camera",
        compensation: "paid",
        paymentDetails: "Competitive rate based on experience",
        requirements: {
          experienceLevel: "professional",
        },
        auditionType: "in-person",
      },
    ],
    submissionDeadline: new Date("2023-11-30"),
    postedDate: new Date("2023-10-15"),
    posterImage: "/sci-fi-film-set-spaceship.png",
    isVerified: true,
    status: "active",
    submissionGuidelines: {
      requiredMaterials: ["Headshot", "Resume/CV", "Demo Reel", "Cover Letter"],
      submissionMethod: "siddu",
      specialInstructions:
        "For acting roles, please prepare a 2-minute contemporary dramatic monologue. For Captain Elara Chen, please also include a 30-second clip demonstrating your ability to portray authority.",
    },
  },
  {
    id: "cc-002",
    projectTitle: "Whispers in the Alley",
    projectType: "short",
    productionCompany: "Midnight Hour Films",
    description:
      "A psychological horror short film about a street artist who begins to see disturbing visions after painting a mural in an abandoned alleyway. As the line between reality and hallucination blurs, they must confront a decades-old tragedy that haunts the neighborhood.\n\nThis atmospheric short will be shot entirely at night in the historic district of New Orleans.",
    productionTimeline: {
      start: new Date("2023-11-10"),
      end: new Date("2023-11-20"),
    },
    location: {
      city: "New Orleans",
      state: "Louisiana",
      country: "USA",
    },
    budgetRange: "medium",
    visibility: "public",
    roles: [
      {
        id: "role-004",
        type: "acting",
        title: "Jamie",
        description:
          "Lead role. A talented but struggling street artist with a troubled past. Increasingly paranoid and sleep-deprived as the story progresses. Age 25-35.",
        category: "lead",
        compensation: "paid",
        paymentDetails: "$200/day + meals and credit",
        requirements: {
          ageRange: { min: 25, max: 35 },
          gender: ["Open to All"],
          ethnicity: ["Open to All"],
          experienceLevel: "intermediate",
          unionStatus: "both",
        },
        auditionType: "self-tape",
      },
      {
        id: "role-005",
        type: "crew",
        title: "Sound Designer",
        description:
          "Looking for a creative sound designer with experience in horror/suspense. Must be able to create immersive, unsettling soundscapes that enhance the psychological horror elements.",
        category: "head",
        department: "sound",
        compensation: "paid",
        paymentDetails: "$1,500 flat fee",
        requirements: {
          skills: ["Atmospheric Sound Design", "Foley", "Sound Mixing"],
          experienceLevel: "intermediate",
        },
        auditionType: "video-call",
      },
    ],
    submissionDeadline: new Date("2023-10-25"),
    postedDate: new Date("2023-10-10"),
    posterImage: "/dark-alley-street-art.png",
    isVerified: true,
    status: "active",
    submissionGuidelines: {
      requiredMaterials: ["Resume/CV", "Portfolio", "References"],
      submissionMethod: "email",
      contactInfo: {
        email: "casting@midnighthourfilms.com",
      },
      specialInstructions:
        "For the role of Jamie, please include a self-tape of a 1-minute monologue that demonstrates your ability to portray escalating fear or paranoia.",
    },
  },
  {
    id: "cc-003",
    projectTitle: "Rhythms of Rajasthan",
    projectType: "documentary",
    productionCompany: "Global Lens Documentaries",
    description:
      "A feature-length documentary exploring the rich musical traditions of Rajasthan, India. Following several families of traditional musicians as they navigate preserving their cultural heritage while adapting to modern influences and economic pressures.\n\nThis documentary will involve extensive travel throughout rural Rajasthan with a small crew, capturing authentic performances and intimate family moments.",
    productionTimeline: {
      start: new Date("2024-01-15"),
      end: new Date("2024-03-15"),
    },
    location: {
      city: "Jodhpur",
      state: "Rajasthan",
      country: "India",
    },
    budgetRange: "medium",
    visibility: "public",
    roles: [
      {
        id: "role-006",
        type: "crew",
        title: "Documentary Cinematographer",
        description:
          "Seeking an experienced documentary cinematographer with a keen eye for capturing cultural moments and musical performances. Must be comfortable with run-and-gun shooting in various lighting conditions.",
        category: "head",
        department: "camera",
        compensation: "paid",
        paymentDetails: "$4,000/month + accommodations and travel",
        requirements: {
          languages: [
            { language: "English", proficiency: "fluent" },
            { language: "Hindi", proficiency: "basic" },
          ],
          skills: ["Handheld Camera Operation", "Natural Light Shooting", "Documentary Style"],
          experienceLevel: "professional",
        },
        auditionType: "video-call",
      },
      {
        id: "role-007",
        type: "crew",
        title: "Sound Recordist",
        description:
          "Looking for a sound recordist with experience recording live music performances in challenging environments. Knowledge of traditional Indian instruments is a plus.",
        category: "senior",
        department: "sound",
        compensation: "paid",
        paymentDetails: "$3,500/month + accommodations and travel",
        requirements: {
          skills: ["Location Sound Recording", "Music Recording", "Sound Mixing"],
          experienceLevel: "professional",
        },
        auditionType: "video-call",
      },
      {
        id: "role-008",
        type: "crew",
        title: "Production Assistant/Translator",
        description:
          "Seeking a local production assistant who can also serve as a translator. Must be familiar with Rajasthani culture and fluent in both Hindi and English.",
        category: "assistant",
        department: "production",
        compensation: "paid",
        paymentDetails: "$1,500/month + meals",
        requirements: {
          languages: [
            { language: "English", proficiency: "fluent" },
            { language: "Hindi", proficiency: "native" },
            { language: "Rajasthani", proficiency: "conversational" },
          ],
          experienceLevel: "beginner",
        },
        auditionType: "in-person",
      },
    ],
    submissionDeadline: new Date("2023-12-15"),
    postedDate: new Date("2023-10-20"),
    posterImage: "/rajasthani-musicians.png",
    isVerified: true,
    status: "active",
    submissionGuidelines: {
      requiredMaterials: ["Resume/CV", "Portfolio", "References"],
      submissionMethod: "siddu",
      specialInstructions:
        "Please include links to previous documentary work, particularly anything involving music recording or cultural documentation. For the cinematographer and sound recordist positions, experience working in developing countries is highly desirable.",
    },
  },
  {
    id: "cc-004",
    projectTitle: "Crossroads",
    projectType: "tv-series",
    productionCompany: "Pinnacle Network",
    description:
      "A 10-episode drama series set in a small Midwestern town where the lives of residents intersect after a controversial development project threatens to divide the community. Exploring themes of economic anxiety, environmental concerns, and small-town politics.\n\nThis character-driven series will be shot on location in rural Illinois with both studio and location work.",
    productionTimeline: {
      start: new Date("2024-02-01"),
      end: new Date("2024-06-30"),
    },
    location: {
      city: "Chicago",
      state: "Illinois",
      country: "USA",
    },
    budgetRange: "high",
    visibility: "public",
    roles: [
      {
        id: "role-009",
        type: "acting",
        title: "Mayor Sarah Lawson",
        description:
          "Series regular. A pragmatic third-term mayor caught between economic development and environmental protection. Politically savvy but genuinely cares about her town. Age 45-60.",
        category: "lead",
        compensation: "paid",
        paymentDetails: "SAG-AFTRA Television Agreement rates",
        requirements: {
          ageRange: { min: 45, max: 60 },
          gender: ["Female"],
          ethnicity: ["Open to All"],
          experienceLevel: "professional",
          unionStatus: "sag-aftra",
        },
        auditionType: "in-person",
      },
      {
        id: "role-010",
        type: "acting",
        title: "Daniel Chen",
        description:
          "Series regular. Environmental scientist who returns to his hometown to fight against the development. Idealistic but haunted by past failures. Age 35-45.",
        category: "lead",
        compensation: "paid",
        paymentDetails: "SAG-AFTRA Television Agreement rates",
        requirements: {
          ageRange: { min: 35, max: 45 },
          gender: ["Male"],
          ethnicity: ["Asian", "Open to All"],
          experienceLevel: "professional",
          unionStatus: "sag-aftra",
        },
        auditionType: "in-person",
      },
      {
        id: "role-011",
        type: "acting",
        title: "Various Townspeople",
        description:
          "Multiple supporting and background roles for diverse residents of the town. All ages, backgrounds, and experience levels welcome.",
        category: "supporting",
        compensation: "paid",
        paymentDetails: "SAG-AFTRA Background rates",
        requirements: {
          experienceLevel: "beginner",
          unionStatus: "both",
        },
        auditionType: "self-tape",
      },
    ],
    submissionDeadline: new Date("2023-12-30"),
    postedDate: new Date("2023-10-25"),
    posterImage: "/placeholder.svg?height=400&width=600&query=small town main street with people",
    isVerified: true,
    status: "active",
    submissionGuidelines: {
      requiredMaterials: ["Headshot", "Resume/CV", "Demo Reel"],
      submissionMethod: "siddu",
      specialInstructions:
        "For lead roles, please prepare two contrasting scenes that demonstrate your range. Local actors from the Illinois/Wisconsin/Indiana area are encouraged to apply.",
    },
  },
  {
    id: "cc-005",
    projectTitle: "Neon Dreams",
    projectType: "music-video",
    productionCompany: "Pulse Visuals",
    description:
      "A stylized music video for up-and-coming electronic artist LUMA's new single 'Neon Dreams.' Set in a futuristic nightclub with cyberpunk aesthetics, the video will blend choreographed dance sequences with narrative elements.\n\nThis one-day shoot will take place on a custom-built set in Los Angeles with extensive lighting effects and practical props.",
    productionTimeline: {
      start: new Date("2023-11-05"),
      end: new Date("2023-11-05"),
    },
    location: {
      city: "Los Angeles",
      state: "California",
      country: "USA",
    },
    budgetRange: "medium",
    visibility: "public",
    roles: [
      {
        id: "role-012",
        type: "acting",
        title: "Lead Dancer",
        description:
          "Featured dancer who will interact with the artist throughout the video. Strong contemporary and hip-hop skills required. Age 21-30.",
        category: "lead",
        compensation: "paid",
        paymentDetails: "$500 for the day + credit",
        requirements: {
          ageRange: { min: 21, max: 30 },
          gender: ["Open to All"],
          ethnicity: ["Open to All"],
          skills: ["Contemporary Dance", "Hip-Hop", "Improvisation"],
          experienceLevel: "professional",
        },
        auditionType: "in-person",
      },
      {
        id: "role-013",
        type: "acting",
        title: "Club Patrons",
        description:
          "10-15 extras to fill the nightclub scene. Should have basic movement abilities and a unique, edgy style. Ages 21-35.",
        category: "extra",
        compensation: "paid",
        paymentDetails: "$150 for the day + meals",
        requirements: {
          ageRange: { min: 21, max: 35 },
          gender: ["Open to All"],
          ethnicity: ["Open to All"],
          experienceLevel: "beginner",
        },
        auditionType: "self-tape",
      },
      {
        id: "role-014",
        type: "crew",
        title: "Makeup Artist (SFX)",
        description:
          "Seeking a makeup artist with experience in creative, avant-garde looks and minor special effects for a futuristic/cyberpunk aesthetic.",
        category: "head",
        department: "makeup",
        compensation: "paid",
        paymentDetails: "$400 for the day",
        requirements: {
          skills: ["SFX Makeup", "Avant-Garde", "Airbrush"],
          experienceLevel: "intermediate",
        },
        auditionType: "video-call",
      },
    ],
    submissionDeadline: new Date("2023-10-28"),
    postedDate: new Date("2023-10-18"),
    posterImage: "/placeholder.svg?height=400&width=600&query=futuristic cyberpunk nightclub with neon lights",
    isVerified: false,
    status: "active",
    submissionGuidelines: {
      requiredMaterials: ["Headshot", "Resume/CV", "Demo Reel", "Portfolio"],
      submissionMethod: "email",
      contactInfo: {
        email: "casting@pulsevisuals.com",
      },
      specialInstructions:
        "For dancers, please include a 1-minute video demonstrating your style and range. For club patrons, please include photos that showcase your personal style and look.",
    },
  },
]
