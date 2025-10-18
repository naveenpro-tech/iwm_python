"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Search, Users, Star, TrendingUp, Calendar, ArrowRight, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function TalentHubPage() {
  const [activeTab, setActiveTab] = useState("all")
  const heroRef = useRef<HTMLDivElement>(null)
  const featuredRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const newsRef = useRef<HTMLDivElement>(null)

  const isHeroInView = useInView(heroRef, { once: true })
  const isFeaturedInView = useInView(featuredRef, { once: true, margin: "-100px" })
  const isSpotlightInView = useInView(spotlightRef, { once: true, margin: "-100px" })
  const isNewsInView = useInView(newsRef, { once: true, margin: "-100px" })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        className="relative"
        initial="hidden"
        animate={isHeroInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1A1A1A] z-10" />
        <div className="absolute inset-0">
          <Image src="/film-production-set.png" alt="Talent Hub" fill className="object-cover" priority />
        </div>
        <div className="relative z-20 pt-20 pb-32 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div className="max-w-3xl mx-auto text-center" variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-inter">
              Connect with the Global Film Industry
            </h1>
            <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Find your next role, discover exceptional talent, and build your career in the entertainment industry
            </p>

            <div className="relative max-w-2xl mx-auto">
              <Input
                type="text"
                placeholder="Search for roles, talent, or projects..."
                className="bg-[#282828]/80 backdrop-blur-sm border-[#3A3A3A] h-14 pl-12 pr-4 rounded-full text-base"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Button className="absolute right-1.5 top-1.5 rounded-full bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A] font-medium px-6">
                Search
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/talent-hub/calls">
                <Button variant="outline" className="rounded-full border-[#3A3A3A] hover:bg-[#282828] gap-2">
                  <Users size={16} />
                  <span>Browse Roles</span>
                </Button>
              </Link>
              <Link href="/talent-hub/post">
                <Button variant="outline" className="rounded-full border-[#3A3A3A] hover:bg-[#282828] gap-2">
                  <Star size={16} />
                  <span>Post a Casting Call</span>
                </Button>
              </Link>
              <Link href="/talent-hub/profile/create">
                <Button variant="outline" className="rounded-full border-[#3A3A3A] hover:bg-[#282828] gap-2">
                  <TrendingUp size={16} />
                  <span>Create Profile</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Featured Casting Calls Section */}
      <motion.section
        ref={featuredRef}
        className="py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto"
        initial="hidden"
        animate={isFeaturedInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="flex flex-col md:flex-row md:items-end justify-between mb-8" variants={itemVariants}>
          <div>
            <h2 className="text-3xl font-bold mb-2 font-inter">Featured Casting Calls</h2>
            <p className="text-gray-400">Exciting opportunities from verified productions</p>
          </div>

          <div className="mt-4 md:mt-0">
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="bg-[#282828] p-1">
                <TabsTrigger value="all" className={activeTab === "all" ? "bg-[#00BFFF] text-[#1A1A1A]" : ""}>
                  All Roles
                </TabsTrigger>
                <TabsTrigger value="acting" className={activeTab === "acting" ? "bg-[#00BFFF] text-[#1A1A1A]" : ""}>
                  Acting
                </TabsTrigger>
                <TabsTrigger value="crew" className={activeTab === "crew" ? "bg-[#00BFFF] text-[#1A1A1A]" : ""}>
                  Crew
                </TabsTrigger>
                <TabsTrigger value="other" className={activeTab === "other" ? "bg-[#00BFFF] text-[#1A1A1A]" : ""}>
                  Other
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants}>
          {/* Casting Call Card 1 */}
          <motion.div variants={itemVariants}>
            <Card className="bg-[#282828] border-[#3A3A3A] overflow-hidden h-full flex flex-col">
              <div className="relative h-48">
                <Image src="/futuristic-film-set.png" alt="Sci-Fi Feature Film" fill className="object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-[#00BFFF] text-[#1A1A1A] font-medium">Featured</Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">Lead & Supporting Roles</CardTitle>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    Verified
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1 text-gray-400">
                  <Calendar size={14} />
                  <span>Posted 2 days ago</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <p className="text-sm text-gray-300 mb-3">
                  Casting multiple roles for an upcoming sci-fi feature film set in a dystopian future. Seeking diverse
                  talent of all backgrounds.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="bg-[#333333]">
                    Sci-Fi
                  </Badge>
                  <Badge variant="secondary" className="bg-[#333333]">
                    Feature Film
                  </Badge>
                  <Badge variant="secondary" className="bg-[#333333]">
                    Paid
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <MapPin size={14} />
                  <span>Los Angeles, CA (On Location)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock size={14} />
                  <span>Application Deadline: Aug 15, 2025</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href="/talent-hub/calls/sci-fi-feature" className="w-full">
                  <Button className="w-full bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A]">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Casting Call Card 2 */}
          <motion.div variants={itemVariants}>
            <Card className="bg-[#282828] border-[#3A3A3A] overflow-hidden h-full flex flex-col">
              <div className="relative h-48">
                <Image src="/placeholder-mtlqy.png" alt="Bollywood Musical" fill className="object-cover" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">Dancers & Choreographers</CardTitle>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    Verified
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1 text-gray-400">
                  <Calendar size={14} />
                  <span>Posted 5 days ago</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <p className="text-sm text-gray-300 mb-3">
                  Major Bollywood production seeking experienced dancers and choreographers for an upcoming musical
                  feature. All dance styles welcome.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="bg-[#333333]">
                    Musical
                  </Badge>
                  <Badge variant="secondary" className="bg-[#333333]">
                    Dance
                  </Badge>
                  <Badge variant="secondary" className="bg-[#333333]">
                    Paid
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <MapPin size={14} />
                  <span>Mumbai, India</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock size={14} />
                  <span>Application Deadline: Sep 10, 2025</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href="/talent-hub/calls/bollywood-musical" className="w-full">
                  <Button className="w-full bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A]">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Casting Call Card 3 */}
          <motion.div variants={itemVariants}>
            <Card className="bg-[#282828] border-[#3A3A3A] overflow-hidden h-full flex flex-col">
              <div className="relative h-48">
                <Image
                  src="/placeholder.svg?height=300&width=600&query=film crew setting up camera equipment on location"
                  alt="Documentary Series"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">Production Crew</CardTitle>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    Verified
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1 text-gray-400">
                  <Calendar size={14} />
                  <span>Posted 1 week ago</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <p className="text-sm text-gray-300 mb-3">
                  Award-winning documentary team seeking experienced camera operators, sound technicians, and production
                  assistants for global series.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="bg-[#333333]">
                    Documentary
                  </Badge>
                  <Badge variant="secondary" className="bg-[#333333]">
                    Crew
                  </Badge>
                  <Badge variant="secondary" className="bg-[#333333]">
                    Travel Required
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <MapPin size={14} />
                  <span>Multiple Locations</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock size={14} />
                  <span>Application Deadline: Jul 30, 2025</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href="/talent-hub/calls/documentary-crew" className="w-full">
                  <Button className="w-full bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A]">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div className="mt-8 text-center" variants={itemVariants}>
          <Link href="/talent-hub/calls">
            <Button variant="outline" className="rounded-full border-[#3A3A3A] hover:bg-[#282828] gap-2">
              <span>View All Casting Calls</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Talent Spotlight Section */}
      <motion.section
        ref={spotlightRef}
        className="py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto bg-[#1E1E1E]"
        initial="hidden"
        animate={isSpotlightInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="flex flex-col md:flex-row md:items-end justify-between mb-8" variants={itemVariants}>
          <div>
            <h2 className="text-3xl font-bold mb-2 font-inter">Talent Spotlight</h2>
            <p className="text-gray-400">Discover exceptional professionals making waves in the industry</p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link href="/talent-hub/talent">
              <Button variant="link" className="text-[#00BFFF] gap-2 p-0">
                <span>View All Featured Talent</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants}>
          {/* Talent Card 1 */}
          <motion.div variants={itemVariants}>
            <Card className="bg-[#282828] border-[#3A3A3A] overflow-hidden h-full flex flex-col">
              <div className="relative h-64">
                <Image
                  src="/placeholder.svg?height=400&width=300&query=professional headshot of female actress with dramatic lighting"
                  alt="Priya Sharma"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-[#00BFFF] text-[#1A1A1A] font-medium">Rising Star</Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">Priya Sharma</CardTitle>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    Verified
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">Actress / Dancer</CardDescription>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="bg-[#333333]">
                    Film
                  </Badge>
                  <Badge variant="secondary" className="bg-[#333333]">
                    Television
                  </Badge>
                  <Badge variant="secondary" className="bg-[#333333]">
                    Theater
                  </Badge>
                </div>
                <p className="text-sm text-gray-300">
                  Award-winning actress with experience in international productions. Trained in classical dance and
                  martial arts.
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href="/talent-hub/profile/priya-sharma" className="w-full">
                  <Button variant="outline" className="w-full border-[#3A3A3A] hover:bg-[#333333]">
                    View Profile
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Talent Card 2 */}
          <motion.div variants={itemVariants}>
            <Card className="bg-[#282828] border-[#3A3A3A] overflow-hidden h-full flex flex-col">
              <div className="relative h-64">
                <Image
                  src="/placeholder.svg?height=400&width=300&query=professional headshot of male cinematographer with camera"
                  alt="Marcus Chen"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">Marcus Chen</CardTitle>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    Verified
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">Cinematographer</CardDescription>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="bg-[#333333]">
                    Feature Films
                  </Badge>
                  <Badge variant="secondary" className="bg-[#333333]">
                    Commercials
                  </Badge>
                </div>
                <p className="text-sm text-gray-300">
                  Experienced cinematographer with a unique visual style. Specializes in natural lighting and dynamic
                  camera movement.
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href="/talent-hub/profile/marcus-chen" className="w-full">
                  <Button variant="outline" className="w-full border-[#3A3A3A] hover:bg-[#333333]">
                    View Profile
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Talent Card 3 */}
          <motion.div variants={itemVariants}>
            <Card className="bg-[#282828] border-[#3A3A3A] overflow-hidden h-full flex flex-col">
              <div className="relative h-64">
                <Image
                  src="/placeholder.svg?height=400&width=300&query=professional headshot of female screenwriter working"
                  alt="Olivia Rodriguez"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">Olivia Rodriguez</CardTitle>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    Verified
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">Screenwriter / Director</CardDescription>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="bg-[#333333]">
                    Drama
                  </Badge>
                  <Badge variant="secondary" className="bg-[#333333]">
                    Thriller
                  </Badge>
                </div>
                <p className="text-sm text-gray-300">
                  Award-winning screenwriter with a focus on character-driven narratives. Recently transitioned to
                  directing.
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href="/talent-hub/profile/olivia-rodriguez" className="w-full">
                  <Button variant="outline" className="w-full border-[#3A3A3A] hover:bg-[#333333]">
                    View Profile
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Talent Card 4 */}
          <motion.div variants={itemVariants}>
            <Card className="bg-[#282828] border-[#3A3A3A] overflow-hidden h-full flex flex-col">
              <div className="relative h-64">
                <Image
                  src="/placeholder.svg?height=400&width=300&query=professional headshot of male actor with dramatic lighting"
                  alt="Amir Khan"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-[#00BFFF] text-[#1A1A1A] font-medium">Featured</Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">Amir Khan</CardTitle>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    Verified
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">Actor / Producer</CardDescription>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="bg-[#333333]">
                    Film
                  </Badge>
                  <Badge variant="secondary" className="bg-[#333333]">
                    Web Series
                  </Badge>
                </div>
                <p className="text-sm text-gray-300">
                  Versatile actor with experience in multiple languages. Recently ventured into production with indie
                  projects.
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href="/talent-hub/profile/amir-khan" className="w-full">
                  <Button variant="outline" className="w-full border-[#3A3A3A] hover:bg-[#333333]">
                    View Profile
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Industry News & Updates Section */}
      <motion.section
        ref={newsRef}
        className="py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto"
        initial="hidden"
        animate={isNewsInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="flex flex-col md:flex-row md:items-end justify-between mb-8" variants={itemVariants}>
          <div>
            <h2 className="text-3xl font-bold mb-2 font-inter">Industry News & Updates</h2>
            <p className="text-gray-400">Stay informed with the latest from the entertainment world</p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link href="/talent-hub/news">
              <Button variant="link" className="text-[#00BFFF] gap-2 p-0">
                <span>View All News</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8" variants={containerVariants}>
          {/* Main News Column */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <Card className="bg-[#282828] border-[#3A3A3A] overflow-hidden">
              <div className="relative h-64 md:h-80">
                <Image
                  src="/placeholder.svg?height=500&width=800&query=film festival red carpet with celebrities"
                  alt="International Film Festival"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge className="mb-2 bg-[#00BFFF] text-[#1A1A1A]">Breaking News</Badge>
                  <h3 className="text-2xl font-bold mb-2">
                    International Film Festival Announces Open Submissions for Emerging Filmmakers
                  </h3>
                  <p className="text-gray-200">
                    New category created specifically for first-time directors from underrepresented regions
                  </p>
                </div>
              </div>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">June 15, 2025</span>
                  </div>
                  <Badge variant="outline" className="border-[#3A3A3A]">
                    Film Festivals
                  </Badge>
                </div>
                <p className="text-gray-300 mb-4">
                  The prestigious International Film Festival has announced a groundbreaking new category specifically
                  designed for emerging filmmakers from underrepresented regions. This initiative aims to discover and
                  promote diverse voices in cinema.
                </p>
                <p className="text-gray-300 mb-4">
                  Submissions will open next month, with selected projects receiving mentorship from established
                  industry professionals and a chance to premiere at the festival's main competition.
                </p>
                <Link href="/talent-hub/news/film-festival-announcement">
                  <Button variant="link" className="text-[#00BFFF] p-0">
                    Read Full Article
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* News Sidebar */}
          <motion.div className="space-y-6" variants={containerVariants}>
            {/* News Item 1 */}
            <motion.div variants={itemVariants}>
              <Card className="bg-[#282828] border-[#3A3A3A] overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-1/3 h-32">
                    <Image
                      src="/placeholder.svg?height=200&width=200&query=film studio with green screen"
                      alt="Studio Expansion"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="w-full md:w-2/3 p-4">
                    <Badge variant="outline" className="border-[#3A3A3A] mb-2">
                      Industry
                    </Badge>
                    <h3 className="text-lg font-bold mb-1">
                      Major Studio Announces Expansion, Creating Hundreds of Jobs
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">June 10, 2025</p>
                    <Link href="/talent-hub/news/studio-expansion">
                      <Button variant="link" className="text-[#00BFFF] p-0 h-auto text-sm">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* News Item 2 */}
            <motion.div variants={itemVariants}>
              <Card className="bg-[#282828] border-[#3A3A3A] overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-1/3 h-32">
                    <Image
                      src="/placeholder.svg?height=200&width=200&query=actor receiving award on stage"
                      alt="Award Winner"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="w-full md:w-2/3 p-4">
                    <Badge variant="outline" className="border-[#3A3A3A] mb-2">
                      Awards
                    </Badge>
                    <h3 className="text-lg font-bold mb-1">Rising Star Wins Best Newcomer Award at Film Gala</h3>
                    <p className="text-sm text-gray-400 mb-2">June 5, 2025</p>
                    <Link href="/talent-hub/news/newcomer-award">
                      <Button variant="link" className="text-[#00BFFF] p-0 h-auto text-sm">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* News Item 3 */}
            <motion.div variants={itemVariants}>
              <Card className="bg-[#282828] border-[#3A3A3A] overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-1/3 h-32">
                    <Image
                      src="/placeholder.svg?height=200&width=200&query=film crew with diversity"
                      alt="Diversity Initiative"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="w-full md:w-2/3 p-4">
                    <Badge variant="outline" className="border-[#3A3A3A] mb-2">
                      Diversity
                    </Badge>
                    <h3 className="text-lg font-bold mb-1">
                      New Initiative Launches to Promote Diversity in Film Production
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">May 28, 2025</p>
                    <Link href="/talent-hub/news/diversity-initiative">
                      <Button variant="link" className="text-[#00BFFF] p-0 h-auto text-sm">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Join the Community Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-[#00BFFF]/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 font-inter">Join the Siddu Talent Community</h2>
          <p className="text-xl mb-8 text-gray-200">
            Connect with filmmakers and talent from around the world. Your next opportunity is waiting.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/talent-hub/profile/create">
              <Button className="bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A] font-medium px-8 py-6 text-lg">
                Create Your Talent Profile
              </Button>
            </Link>
            <Link href="/talent-hub/calls">
              <Button
                variant="outline"
                className="border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10 px-8 py-6 text-lg"
              >
                Browse Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
