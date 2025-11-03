export interface CriticApplication {
  id: string
  fullName: string
  username: string
  bio: string
  profilePicture: string
  youtubeUrl: string
  twitterUrl: string
  instagramUrl: string
  portfolioLinks: string[]
  whyApply: string
  appliedDate: string
  status: "pending" | "approved" | "rejected"
  reviewedBy?: string
  reviewedDate?: string
  rejectionReason?: string
}

export function generateMockApplications(): CriticApplication[] {
  return [
    {
      id: "app-1",
      fullName: "Arjun Mehta",
      username: "arjun_cinema",
      bio: "Film critic with 8 years of experience. Passionate about international cinema and indie films. Published in major film magazines.",
      profilePicture: "/applicant-1.png",
      youtubeUrl: "https://youtube.com/@arjuncinema",
      twitterUrl: "https://twitter.com/arjuncinema",
      instagramUrl: "https://instagram.com/arjuncinema",
      portfolioLinks: [
        "https://filmmagazine.com/reviews/arjun-mehta",
        "https://youtube.com/watch?v=example1",
        "https://medium.com/@arjuncinema",
      ],
      whyApply: "I've been reviewing films for over 8 years and have built a dedicated following. I believe in honest, thoughtful criticism that helps audiences discover great cinema. I want to contribute to this platform's mission of connecting film lovers with quality content.",
      appliedDate: "2025-10-20T10:30:00Z",
      status: "pending",
    },
    {
      id: "app-2",
      fullName: "Kavya Reddy",
      username: "kavya_reviews",
      bio: "Bollywood and Hollywood critic. Former film school professor. Specializing in narrative analysis and cinematography.",
      profilePicture: "/applicant-2.png",
      youtubeUrl: "https://youtube.com/@kavyareviews",
      twitterUrl: "https://twitter.com/kavyareviews",
      instagramUrl: "",
      portfolioLinks: [
        "https://filmschool.edu/faculty/kavya-reddy",
        "https://criticsassociation.org/members/kavya",
      ],
      whyApply: "As a former film professor, I've spent decades analyzing cinema. I want to share my academic insights with a broader audience and help elevate film discourse on this platform.",
      appliedDate: "2025-10-19T14:15:00Z",
      status: "pending",
    },
    {
      id: "app-3",
      fullName: "Rohan Sharma",
      username: "rohan_film",
      bio: "Action and thriller specialist. 5 years of professional film criticism. Regular contributor to major entertainment websites.",
      profilePicture: "/applicant-3.png",
      youtubeUrl: "",
      twitterUrl: "https://twitter.com/rohanfilm",
      instagramUrl: "https://instagram.com/rohanfilm",
      portfolioLinks: [
        "https://entertainment.com/author/rohan-sharma",
        "https://filmcritic.net/rohan",
      ],
      whyApply: "I specialize in action and thriller genres and have developed a unique analytical framework for evaluating these films. I'd love to bring this expertise to your platform.",
      appliedDate: "2025-10-18T09:00:00Z",
      status: "pending",
    },
    {
      id: "app-4",
      fullName: "Meera Patel",
      username: "meera_movies",
      bio: "Independent film critic focusing on world cinema. Published author and podcast host.",
      profilePicture: "/applicant-4.png",
      youtubeUrl: "https://youtube.com/@meeramovies",
      twitterUrl: "https://twitter.com/meeramovies",
      instagramUrl: "https://instagram.com/meeramovies",
      portfolioLinks: [
        "https://worldcinema.com/critics/meera-patel",
        "https://podcasts.com/cinema-conversations",
        "https://amazon.com/books/meera-patel",
      ],
      whyApply: "I've dedicated my career to promoting world cinema and helping audiences discover films beyond Hollywood. I believe this platform can be a powerful tool for cultural exchange through film.",
      appliedDate: "2025-10-17T16:45:00Z",
      status: "approved",
      reviewedBy: "admin",
      reviewedDate: "2025-10-21T11:00:00Z",
    },
    {
      id: "app-5",
      fullName: "Vikram Singh",
      username: "vikram_critic",
      bio: "Film enthusiast with a blog. Love watching movies and sharing my thoughts.",
      profilePicture: "/applicant-5.png",
      youtubeUrl: "",
      twitterUrl: "",
      instagramUrl: "",
      portfolioLinks: [
        "https://vikramblog.wordpress.com",
      ],
      whyApply: "I really like movies and want to be a critic. I watch a lot of films and think I have good opinions.",
      appliedDate: "2025-10-16T12:00:00Z",
      status: "rejected",
      reviewedBy: "admin",
      reviewedDate: "2025-10-20T09:30:00Z",
      rejectionReason: "Insufficient professional experience and portfolio. We recommend building a stronger body of work before reapplying.",
    },
    {
      id: "app-6",
      fullName: "Ananya Gupta",
      username: "ananya_cinema",
      bio: "Drama and romance expert. 10 years of experience in film journalism. Award-winning critic.",
      profilePicture: "/applicant-6.png",
      youtubeUrl: "https://youtube.com/@ananyacinema",
      twitterUrl: "https://twitter.com/ananyacinema",
      instagramUrl: "https://instagram.com/ananyacinema",
      portfolioLinks: [
        "https://filmjournal.com/ananya-gupta",
        "https://criticschoice.org/members/ananya",
        "https://awards.com/best-critic-2024",
      ],
      whyApply: "With a decade of experience and recognition from the Critics Choice Association, I'm excited to bring my expertise to this innovative platform and connect with a new generation of film lovers.",
      appliedDate: "2025-10-15T08:20:00Z",
      status: "approved",
      reviewedBy: "admin",
      reviewedDate: "2025-10-19T15:00:00Z",
    },
    {
      id: "app-7",
      fullName: "Karthik Iyer",
      username: "karthik_reviews",
      bio: "Horror and sci-fi specialist. YouTube creator with 500K subscribers. Regular festival attendee.",
      profilePicture: "/applicant-7.png",
      youtubeUrl: "https://youtube.com/@karthikreviews",
      twitterUrl: "https://twitter.com/karthikreviews",
      instagramUrl: "https://instagram.com/karthikreviews",
      portfolioLinks: [
        "https://youtube.com/@karthikreviews",
        "https://patreon.com/karthikreviews",
      ],
      whyApply: "I've built a community of 500K horror and sci-fi fans on YouTube. I want to expand my reach and contribute to a platform that values quality film criticism.",
      appliedDate: "2025-10-14T11:30:00Z",
      status: "pending",
    },
    {
      id: "app-8",
      fullName: "Divya Nair",
      username: "divya_film",
      bio: "Documentary and non-fiction film specialist. Film festival programmer and curator.",
      profilePicture: "/applicant-8.png",
      youtubeUrl: "",
      twitterUrl: "https://twitter.com/divyafilm",
      instagramUrl: "https://instagram.com/divyafilm",
      portfolioLinks: [
        "https://filmfestival.org/programmers/divya-nair",
        "https://documentary.com/critics/divya",
      ],
      whyApply: "As a festival programmer, I've watched thousands of documentaries and non-fiction films. I want to share my insights and help audiences discover this often-overlooked genre.",
      appliedDate: "2025-10-13T13:00:00Z",
      status: "pending",
    },
    {
      id: "app-9",
      fullName: "Rahul Kapoor",
      username: "rahul_cinema",
      bio: "Classic cinema enthusiast. Film historian and restoration advocate.",
      profilePicture: "/applicant-9.png",
      youtubeUrl: "https://youtube.com/@rahulcinema",
      twitterUrl: "https://twitter.com/rahulcinema",
      instagramUrl: "",
      portfolioLinks: [
        "https://filmhistory.org/rahul-kapoor",
        "https://restoration.org/advocates/rahul",
      ],
      whyApply: "I'm passionate about preserving and promoting classic cinema. I believe modern audiences need to understand film history to appreciate contemporary cinema.",
      appliedDate: "2025-10-12T10:00:00Z",
      status: "rejected",
      reviewedBy: "admin",
      reviewedDate: "2025-10-18T14:00:00Z",
      rejectionReason: "Focus too narrow. We're looking for critics who can cover a broader range of contemporary films.",
    },
    {
      id: "app-10",
      fullName: "Sneha Desai",
      username: "sneha_reviews",
      bio: "Animation and family film specialist. Former Disney animator turned critic.",
      profilePicture: "/applicant-10.png",
      youtubeUrl: "https://youtube.com/@snehareviews",
      twitterUrl: "https://twitter.com/snehareviews",
      instagramUrl: "https://instagram.com/snehareviews",
      portfolioLinks: [
        "https://animation.com/critics/sneha-desai",
        "https://disney.com/alumni/sneha",
      ],
      whyApply: "With my background as a Disney animator, I bring unique technical insights to animation criticism. I want to help families discover quality animated content.",
      appliedDate: "2025-10-11T15:30:00Z",
      status: "pending",
    },
  ]
}

