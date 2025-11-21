import type { HelpCategory, HelpTopic, SupportChannel } from "./types"

export const popularTopics: HelpTopic[] = [
  { id: "account", title: "Account Settings", url: "/help/account" },
  { id: "payment", title: "Payment Issues", url: "/help/payment" },
  { id: "reviews", title: "Writing Reviews", url: "/help/reviews" },
  { id: "watchlist", title: "Managing Watchlist", url: "/help/watchlist" },
  { id: "streaming", title: "Streaming Problems", url: "/help/streaming" },
  { id: "cricket", title: "Cricket Updates", url: "/help/cricket" },
]

export const helpCategories: HelpCategory[] = [
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Learn the basics of using Siddu",
    icon: "rocket",
    faqs: [
      {
        id: "gs-1",
        question: "How do I create an account on Siddu?",
        answer:
          'Creating an account on Siddu is easy! Click on the "Sign Up" button in the top right corner of the homepage. You can sign up using your email address, or through your Google, Facebook, or Apple account. Follow the prompts to complete your profile setup, and you\'ll be ready to explore all that Siddu has to offer.',
        category: "getting-started",
        tags: ["account", "signup", "registration"],
        helpfulCount: 124,
        notHelpfulCount: 3,
      },
      {
        id: "gs-2",
        question: "What features are available without an account?",
        answer:
          "Without an account, you can browse movies, read reviews, check cricket scores, and view basic information about films and cricket matches. However, to access personalized features like creating watchlists, writing reviews, following your favorite actors or cricketers, and receiving recommendations, you'll need to create a free account.",
        category: "getting-started",
        tags: ["account", "features", "free"],
        helpfulCount: 87,
        notHelpfulCount: 5,
      },
      {
        id: "gs-3",
        question: "How do I navigate between movies and cricket sections?",
        answer:
          'You can easily switch between the movies and cricket sections using the main navigation menu at the top of the page. Click on "Movies" to explore films, reviews, and cinema content, or click on "Cricket" to access match information, player profiles, and cricket news. You can also use the search function to find specific content across both sections.',
        category: "getting-started",
        tags: ["navigation", "movies", "cricket"],
        helpfulCount: 56,
        notHelpfulCount: 2,
      },
    ],
    articles: [
      {
        id: "article-gs-1",
        title: "Getting Started with Siddu: A Complete Guide",
        summary: "Learn everything you need to know about using Siddu effectively.",
        content: "This is a placeholder for the full article content.",
        category: "getting-started",
        tags: ["guide", "tutorial", "basics"],
        lastUpdated: "2023-11-15",
        imageUrl: "/placeholder.svg?height=200&width=400&query=Siddu platform guide",
      },
      {
        id: "article-gs-2",
        title: "Personalizing Your Siddu Experience",
        summary: "Customize your profile, preferences, and notifications for a tailored experience.",
        content: "This is a placeholder for the full article content.",
        category: "getting-started",
        tags: ["personalization", "preferences", "profile"],
        lastUpdated: "2023-11-10",
      },
    ],
  },
  {
    id: "account",
    name: "Account & Profile",
    description: "Manage your account settings and profile information",
    icon: "user",
    faqs: [
      {
        id: "acc-1",
        question: "How do I change my password?",
        answer:
          'To change your password, go to your Profile Settings by clicking on your profile picture in the top right corner and selecting "Settings". Navigate to the "Security" tab, where you\'ll find the option to change your password. You\'ll need to enter your current password for verification, then your new password twice to confirm.',
        category: "account",
        tags: ["password", "security", "settings"],
        helpfulCount: 203,
        notHelpfulCount: 7,
      },
      {
        id: "acc-2",
        question: "Can I link multiple social accounts to my Siddu profile?",
        answer:
          "Yes, you can link multiple social accounts to your Siddu profile for easier login. Go to Profile Settings > Connected Accounts, where you can connect your Google, Facebook, Apple, or Twitter accounts. This allows you to log in using any of these accounts while maintaining a single Siddu profile.",
        category: "account",
        tags: ["social", "login", "connected accounts"],
        helpfulCount: 118,
        notHelpfulCount: 4,
      },
      {
        id: "acc-3",
        question: "How do I delete my account?",
        answer:
          "To delete your account, go to Profile Settings > Account > Delete Account. You'll be asked to confirm your decision and enter your password. Please note that account deletion is permanent and will remove all your data, including reviews, watchlists, and comments. If you're experiencing issues, consider contacting support before deleting your account.",
        category: "account",
        tags: ["delete", "removal", "privacy"],
        helpfulCount: 89,
        notHelpfulCount: 3,
      },
    ],
    articles: [
      {
        id: "article-acc-1",
        title: "Securing Your Siddu Account",
        summary: "Learn about best practices for keeping your account secure.",
        content: "This is a placeholder for the full article content.",
        category: "account",
        tags: ["security", "password", "protection"],
        lastUpdated: "2023-11-12",
      },
      {
        id: "article-acc-2",
        title: "Managing Your Privacy Settings",
        summary: "Control what information is visible to others and how your data is used.",
        content: "This is a placeholder for the full article content.",
        category: "account",
        tags: ["privacy", "settings", "data"],
        lastUpdated: "2023-11-05",
      },
    ],
  },
  {
    id: "movies",
    name: "Movies & Reviews",
    description: "Information about movie features and writing reviews",
    icon: "film",
    faqs: [
      {
        id: "mov-1",
        question: "How do I write a review for a movie?",
        answer:
          'To write a review, navigate to the movie page you want to review and click the "Write a Review" button. You\'ll need to be logged in to access this feature. Rate the movie on a scale of 1-10, write your review, and add optional tags or spoiler warnings. You can also include images or videos to enhance your review. Once submitted, your review will be published after a brief moderation check.',
        category: "movies",
        tags: ["reviews", "writing", "rating"],
        helpfulCount: 245,
        notHelpfulCount: 8,
      },
      {
        id: "mov-2",
        question: 'What is a "Verified Review" on Siddu?',
        answer:
          'A "Verified Review" badge indicates that the reviewer has been confirmed to have watched the movie. This verification can happen through our partner theaters, streaming services, or by completing a movie quiz that tests knowledge of the film. Verified reviews help ensure authenticity and trustworthiness of the review content on our platform.',
        category: "movies",
        tags: ["verified", "authenticity", "badges"],
        helpfulCount: 178,
        notHelpfulCount: 5,
      },
      {
        id: "mov-3",
        question: "How do I add a movie to my watchlist?",
        answer:
          'To add a movie to your watchlist, simply click the bookmark icon on any movie poster or movie page. You can manage multiple watchlists by clicking "Add to..." and selecting or creating a specific list. Access your watchlists anytime from your profile page or the quick access menu. You can also set reminders for upcoming releases or receive notifications when a movie becomes available on your preferred streaming services.',
        category: "movies",
        tags: ["watchlist", "bookmarks", "save"],
        helpfulCount: 156,
        notHelpfulCount: 3,
      },
    ],
    articles: [
      {
        id: "article-mov-1",
        title: "Writing Effective and Engaging Movie Reviews",
        summary: "Tips and guidelines for creating reviews that stand out.",
        content: "This is a placeholder for the full article content.",
        category: "movies",
        tags: ["reviews", "writing", "guidelines"],
        lastUpdated: "2023-11-18",
        imageUrl: "/placeholder.svg?height=200&width=400&query=Writing movie reviews",
      },
      {
        id: "article-mov-2",
        title: "Understanding Siddu's Movie Ratings System",
        summary: "Learn how our ratings work and what they mean.",
        content: "This is a placeholder for the full article content.",
        category: "movies",
        tags: ["ratings", "scores", "metrics"],
        lastUpdated: "2023-11-08",
      },
    ],
  },
  {
    id: "cricket",
    name: "Cricket Features",
    description: "Help with cricket scores, players, and teams",
    icon: "trophy",
    faqs: [
      {
        id: "cric-1",
        question: "How often are live cricket scores updated?",
        answer:
          "Live cricket scores on Siddu are updated in near real-time, with delays typically under 10 seconds from the actual match. We source our data directly from official cricket boards and verified data providers. For T20 and ODI matches, ball-by-ball updates are provided, while Test matches receive over-by-over updates with key moments highlighted instantly.",
        category: "cricket",
        tags: ["live", "scores", "updates"],
        helpfulCount: 189,
        notHelpfulCount: 6,
      },
      {
        id: "cric-2",
        question: "Can I get notifications for specific teams or players?",
        answer:
          "Yes, you can set up custom notifications for your favorite teams and players. Go to your Profile Settings > Notifications > Cricket, where you can select specific teams, players, tournaments, or match types. You can choose to receive notifications for match starts, innings breaks, wickets, centuries, or final results. These can be delivered via the app, email, or browser notifications based on your preferences.",
        category: "cricket",
        tags: ["notifications", "alerts", "favorites"],
        helpfulCount: 142,
        notHelpfulCount: 4,
      },
      {
        id: "cric-3",
        question: "How do I access detailed player statistics?",
        answer:
          "To access detailed player statistics, navigate to the Cricket section and search for a specific player, or browse through team rosters. On a player's profile page, you'll find comprehensive statistics including batting and bowling averages, strike rates, career milestones, and performance trends. You can filter these stats by format (Test, ODI, T20), opposition, venues, and time periods for deeper analysis.",
        category: "cricket",
        tags: ["statistics", "players", "analysis"],
        helpfulCount: 127,
        notHelpfulCount: 3,
      },
    ],
    articles: [
      {
        id: "article-cric-1",
        title: "Understanding Cricket Statistics on Siddu",
        summary: "A guide to the advanced cricket statistics and metrics available on our platform.",
        content: "This is a placeholder for the full article content.",
        category: "cricket",
        tags: ["statistics", "metrics", "analysis"],
        lastUpdated: "2023-11-14",
      },
      {
        id: "article-cric-2",
        title: "Following Tournaments and Series",
        summary: "How to track ongoing and upcoming cricket tournaments effectively.",
        content: "This is a placeholder for the full article content.",
        category: "cricket",
        tags: ["tournaments", "series", "schedule"],
        lastUpdated: "2023-11-07",
        imageUrl: "/placeholder.svg?height=200&width=400&query=Cricket tournament schedule",
      },
    ],
  },
  {
    id: "technical",
    name: "Technical Support",
    description: "Troubleshooting and technical issues",
    icon: "settings",
    faqs: [
      {
        id: "tech-1",
        question: "Why is the video player not working?",
        answer:
          "If the video player isn't working, try these troubleshooting steps: 1) Check your internet connection, 2) Clear your browser cache and cookies, 3) Try a different browser, 4) Disable any ad-blockers or VPNs temporarily, 5) Update your browser to the latest version. If you're using the mobile app, ensure it's updated to the latest version. If problems persist, check our system status page for any ongoing issues or contact our technical support team.",
        category: "technical",
        tags: ["video", "player", "streaming"],
        helpfulCount: 267,
        notHelpfulCount: 12,
      },
      {
        id: "tech-2",
        question: "How do I use Siddu offline?",
        answer:
          'Siddu offers offline capabilities through our Progressive Web App (PWA) or mobile apps. To use Siddu offline: 1) On mobile browsers, add Siddu to your home screen when prompted, 2) On our mobile apps, enable the "Offline Mode" in Settings, 3) While online, mark content for offline access by tapping the download icon. Offline access includes previously viewed movie details, your watchlists, and saved articles. Live features like cricket scores and streaming require an internet connection.',
        category: "technical",
        tags: ["offline", "download", "pwa"],
        helpfulCount: 153,
        notHelpfulCount: 7,
      },
      {
        id: "tech-3",
        question: "Why am I seeing error messages when trying to access certain features?",
        answer:
          "Error messages can occur for several reasons: 1) You may need to be logged in to access the feature, 2) Your account may not have the necessary permissions, 3) There could be temporary service disruptions, 4) Your browser or app might need updating. Check the specific error code and message for more details. Common error codes include: E001 (authentication required), E002 (service unavailable), E003 (content not available in your region). If problems persist, please contact support with the error details.",
        category: "technical",
        tags: ["errors", "troubleshooting", "access"],
        helpfulCount: 198,
        notHelpfulCount: 9,
      },
    ],
    articles: [
      {
        id: "article-tech-1",
        title: "Optimizing Siddu for Different Devices",
        summary: "Get the best experience across desktop, tablet, and mobile devices.",
        content: "This is a placeholder for the full article content.",
        category: "technical",
        tags: ["devices", "optimization", "performance"],
        lastUpdated: "2023-11-16",
      },
      {
        id: "article-tech-2",
        title: "Troubleshooting Common Issues",
        summary: "Step-by-step guides to resolve frequent technical problems.",
        content: "This is a placeholder for the full article content.",
        category: "technical",
        tags: ["troubleshooting", "fixes", "problems"],
        lastUpdated: "2023-11-09",
        imageUrl: "/placeholder.svg?height=200&width=400&query=Technical troubleshooting",
      },
    ],
  },
]

export const supportChannels: SupportChannel[] = [
  {
    id: "email",
    name: "Email Support",
    description: "Get help via email. We typically respond within 24 hours.",
    icon: "mail",
    url: "mailto:support@siddu.com",
  },
  {
    id: "chat",
    name: "Live Chat",
    description: "Chat with our support team in real-time during business hours.",
    icon: "message-circle",
    url: "/help/chat",
  },
  {
    id: "community",
    name: "Community Forums",
    description: "Ask questions and get answers from other Siddu users.",
    icon: "users",
    url: "/community",
  },
  {
    id: "twitter",
    name: "Twitter Support",
    description: "Tweet us @SidduSupport for quick assistance.",
    icon: "twitter",
    url: "https://twitter.com/SidduSupport",
  },
]
