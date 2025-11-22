"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Film, Users, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export function GuestLandingPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/inception-dream-levels.png" // Using an existing high-quality image
                        alt="Movie Collage"
                        fill
                        className="object-cover opacity-40"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-7xl font-bold font-inter mb-6 tracking-tight"
                    >
                        Discover Your Next <br />
                        <span className="text-[#00BFFF] drop-shadow-[0_0_15px_rgba(0,191,255,0.5)]">Cinematic Obsession</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-dmsans"
                    >
                        Join the ultimate community for film lovers. Track what you watch,
                        discover hidden gems, and share your passion with the world.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/signup">
                            <Button className="bg-[#00BFFF] text-black hover:bg-[#009ACD] text-lg px-8 py-6 rounded-full font-bold transition-all transform hover:scale-105">
                                Get Started — It's Free
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full font-medium">
                                Log In
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-inter">Why Movie Madders?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">More than just a database. It's a home for your movie life.</p>
                    </div>

                    <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-12 overflow-x-auto snap-x snap-mandatory pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                        <div className="snap-center shrink-0 w-[85vw] md:w-auto">
                            <FeatureCard
                                icon={<Film className="w-10 h-10 text-[#00BFFF]" />}
                                title="Track Your Journey"
                                description="Keep a diary of every film you watch. Rate, review, and build your personal collection."
                            />
                        </div>
                        <div className="snap-center shrink-0 w-[85vw] md:w-auto">
                            <FeatureCard
                                icon={<TrendingUp className="w-10 h-10 text-[#FFD700]" />}
                                title="Discover Gems"
                                description="Get personalized recommendations based on your taste, not just what's popular."
                            />
                        </div>
                        <div className="snap-center shrink-0 w-[85vw] md:w-auto">
                            <FeatureCard
                                icon={<Users className="w-10 h-10 text-[#FF1744]" />}
                                title="Join the Community"
                                description="Follow friends, read reviews from trusted critics, and discuss your favorite scenes."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-black border-t border-[#282828]">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 font-inter">Ready to dive in?</h2>
                    <p className="text-xl text-gray-300 mb-10">
                        Thousands of movies are waiting to be discovered. Start your journey today.
                    </p>
                    <Link href="/signup">
                        <Button className="bg-white text-black hover:bg-gray-200 text-lg px-10 py-6 rounded-full font-bold">
                            Create Your Account <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-[#282828] hover:border-[#00BFFF]/50 transition-colors">
            <div className="mb-6 bg-black/50 w-20 h-20 rounded-full flex items-center justify-center">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-white font-inter">{title}</h3>
            <p className="text-gray-400 leading-relaxed font-dmsans">
                {description}
            </p>
        </div>
    )
}
