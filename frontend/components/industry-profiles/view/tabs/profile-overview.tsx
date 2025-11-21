"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Film, Award, Newspaper, Calendar, Eye, TrendingUp, Users } from "lucide-react"
import Image from "next/image"
import type { IndustryProfessionalProfile } from "../../types"

interface ProfileOverviewProps {
  profile: IndustryProfessionalProfile
  isOwnProfile?: boolean
}

export function ProfileOverview({ profile, isOwnProfile = false }: ProfileOverviewProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Biography */}
        <motion.div variants={itemVariants}>
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                {profile.bio.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="text-[#E0E0E0] leading-relaxed mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Filmography */}
        <motion.div variants={itemVariants}>
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Film className="w-5 h-5 mr-2" />
                Recent Projects
              </CardTitle>
              <button onClick={() => {}} className="text-sm text-[#00BFFF] hover:text-[#0099CC] transition-colors">
                View All
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.filmography.slice(0, 3).map((film) => (
                  <div key={film.id} className="flex items-start space-x-4">
                    <div className="w-16 h-24 bg-[#3A3A3A] rounded overflow-hidden flex-shrink-0">
                      {film.posterUrl ? (
                        <Image
                          src={film.posterUrl || "/placeholder.svg"}
                          alt={film.title}
                          width={64}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[#E0E0E0]">{film.title}</h4>
                      <p className="text-sm text-[#A0A0A0]">{film.role}</p>
                      <p className="text-sm text-[#A0A0A0]">{film.year}</p>
                      {film.description && (
                        <p className="text-sm text-[#A0A0A0] mt-1 line-clamp-2">{film.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Awards */}
        {profile.awards && profile.awards.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="bg-[#282828] border-[#3A3A3A]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Recent Awards
                </CardTitle>
                <button onClick={() => {}} className="text-sm text-[#00BFFF] hover:text-[#0099CC] transition-colors">
                  View All
                </button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile.awards.slice(0, 3).map((award) => (
                    <div key={award.id} className="flex items-start space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          award.isNomination ? "bg-[#3A3A3A]" : "bg-[#FFD700]/20"
                        }`}
                      >
                        <Award className={`w-5 h-5 ${award.isNomination ? "text-gray-300" : "text-[#FFD700]"}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#E0E0E0]">
                          {award.name}
                          {award.isNomination && <span className="ml-2 text-sm text-gray-400">(Nomination)</span>}
                        </h4>
                        {award.category && <p className="text-sm text-[#A0A0A0]">{award.category}</p>}
                        <p className="text-sm text-[#A0A0A0]">
                          {award.year} • {award.project}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Analytics (for profile owner) */}
        {isOwnProfile && (
          <motion.div variants={itemVariants}>
            <Card className="bg-[#282828] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Profile Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-2 text-[#00BFFF]" />
                    <span className="text-sm text-[#A0A0A0]">Total Views</span>
                  </div>
                  <span className="font-semibold">{profile.viewCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-[#00BFFF]" />
                    <span className="text-sm text-[#A0A0A0]">Monthly Views</span>
                  </div>
                  <span className="font-semibold">{profile.monthlyViews.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-[#00BFFF]" />
                    <span className="text-sm text-[#A0A0A0]">Followers</span>
                  </div>
                  <span className="font-semibold">{profile.followerCount.toLocaleString()}</span>
                </div>

                {profile.lastViewedBy && profile.lastViewedBy.length > 0 && (
                  <div className="pt-4 border-t border-[#3A3A3A]">
                    <p className="text-sm text-[#A0A0A0] mb-3">Recent Profile Visitors</p>
                    <div className="space-y-2">
                      {profile.lastViewedBy.slice(0, 3).map((viewer, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div>
                            <p className="text-[#E0E0E0]">{viewer.name}</p>
                            <p className="text-xs text-[#A0A0A0]">{viewer.role}</p>
                          </div>
                          <span className="text-xs text-[#A0A0A0]">{new Date(viewer.date).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div variants={itemVariants}>
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A0A0A0]">Total Projects</span>
                <span className="font-semibold">{profile.filmography?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A0A0A0]">Awards Won</span>
                <span className="font-semibold">{profile.awards?.filter((a) => !a.isNomination).length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A0A0A0]">Nominations</span>
                <span className="font-semibold">{profile.awards?.filter((a) => a.isNomination).length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A0A0A0]">Press Articles</span>
                <span className="font-semibold">{profile.pressKit?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Press */}
        {profile.pressKit && profile.pressKit.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="bg-[#282828] border-[#3A3A3A]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Newspaper className="w-5 h-5 mr-2" />
                  Recent Press
                </CardTitle>
                <button onClick={() => {}} className="text-sm text-[#00BFFF] hover:text-[#0099CC] transition-colors">
                  View All
                </button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile.pressKit.slice(0, 2).map((item) => (
                    <div key={item.id} className="space-y-1">
                      <h4 className="font-medium text-[#E0E0E0] text-sm line-clamp-2">{item.title}</h4>
                      <p className="text-xs text-[#A0A0A0]">
                        {item.source} • {item.date ? new Date(item.date).toLocaleDateString() : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
