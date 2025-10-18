import { MovieDetailsEnhanced } from "@/components/movie-details-enhanced"

// Sample movie data
const inceptionMovie = {
  id: "inception",
  title: "Inception",
  tagline: "Your mind is the scene of the crime",
  posterUrl: "/inception-movie-poster.png",
  backdropUrl: "/dark-blue-city-skyline.png",
  releaseYear: 2010,
  duration: 148,
  rating: 8.8,
  genres: ["Sci-Fi", "Action", "Thriller", "Adventure"],
  synopsis:
    "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb's rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved. Now Cobb is being offered a chance at redemption. One last job could give him his life back but only if he can accomplish the impossible—inception. Instead of the perfect heist, Cobb and his team of specialists have to pull off the reverse: their task is not to steal an idea but to plant one. If they succeed, it could be the perfect crime. But no amount of careful planning or expertise can prepare the team for the dangerous enemy that seems to predict their every move. An enemy that only Cobb could have seen coming.",
  director: "Christopher Nolan",
  cast: [
    {
      id: "leonardo-dicaprio",
      name: "Leonardo DiCaprio",
      character: "Dom Cobb",
      profileUrl: "/leonardo-dicaprio.png",
    },
    {
      id: "joseph-gordon-levitt",
      name: "Joseph Gordon-Levitt",
      character: "Arthur",
      profileUrl: "/joseph-gordon-levitt.png",
    },
    {
      id: "elliot-page",
      name: "Elliot Page",
      character: "Ariadne",
      profileUrl: "/elliot-page.png",
    },
    {
      id: "tom-hardy",
      name: "Tom Hardy",
      character: "Eames",
      profileUrl: "/tom-hardy.png",
    },
    {
      id: "ken-watanabe",
      name: "Ken Watanabe",
      character: "Saito",
      profileUrl: "/ken-watanabe.png",
    },
    {
      id: "dileep-rao",
      name: "Dileep Rao",
      character: "Yusuf",
      profileUrl: "/dileep-rao.png",
    },
    {
      id: "cillian-murphy",
      name: "Cillian Murphy",
      character: "Robert Fischer",
      profileUrl: "/cillian-murphy-portrait.png",
    },
    {
      id: "michael-caine",
      name: "Michael Caine",
      character: "Miles",
      profileUrl: "/michael-caine.png",
    },
  ],
  streamingServices: [
    {
      id: "netflix",
      name: "Netflix",
      logoUrl: "/netflix-inspired-logo.png",
      url: "#",
    },
    {
      id: "amazon",
      name: "Amazon Prime Video",
      logoUrl: "/amazon-prime-video-logo.png",
      url: "#",
    },
    {
      id: "hbo",
      name: "HBO Max",
      logoUrl: "/hbo-max-logo.png",
      url: "#",
    },
  ],
}

export default function EnhancedMovieDetailsPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the movie data based on the ID
  // For this demo, we'll just use our sample data
  return (
    <div>
      <MovieDetailsEnhanced movie={inceptionMovie} />
    </div>
  )
}
