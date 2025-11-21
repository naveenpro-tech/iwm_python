"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Eye, TrendingUp, Award, Clock, Star, Film, AlertCircle, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import type { TalentProfile } from "../../types"

interface ProfileOverviewProps {
  profile: TalentProfile
  isOwnProfile?: boolean
}

export function ProfileOverview({ profile, isOwnProfile = false }: ProfileOverviewProps) {
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  // Get top skills (first 5)
  const topSkills = profile.skills
    .flatMap((category) => category.items)
    .sort((a, b) => (b.endorsements || 0) - (a.endorsements || 0))
    .slice(0, 5)

  // Get recent work (first 3)
  const recentWork = profile.experience.sort((a, b) => b.year - a.year).slice(0, 3)

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Left Column: Stats & Recent Work */}
      <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
        {/* Profile Analytics (Only visible to profile owner) */}
        {isOwnProfile && (
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2 text-[#00BFFF]" />
                Profile Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{profile.monthlyViews}</p>
                  <p className="text-sm text-gray-400">Profile views this month</p>
                </div>
                <div className="flex items-center text-green-400">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">+12%</span>
                </div>
              </div>

              {profile.lastViewedBy && profile.lastViewedBy.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Recent Industry Engagements</p>
                  <div className="space-y-2">
                    {profile.lastViewedBy.slice(0, 3).map((viewer, index) => (
                      <div key={index} className="flex items-center justify-between bg-[#1A1A1A] p-2 rounded">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#3A3A3A] flex items-center justify-center mr-2">
                            {viewer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm">{viewer.name}</p>
                            <p className="text-xs text-gray-400">{viewer.role}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">{new Date(viewer.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Profile Completeness (Only visible to profile owner) */}
        {isOwnProfile && (
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-[#00BFFF]" />
                Profile Completeness
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completeness</span>
                  <span>{profile.profileCompleteness}%</span>
                </div>
                <Progress value={profile.profileCompleteness} className="h-2 bg-[#1A1A1A]" />
              </div>

              {profile.profileCompleteness < 100 && (
                <div className="bg-[#1A1A1A] p-3 rounded">
                  <p className="text-sm font-medium mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-yellow-400" />
                    Complete your profile
                  </p>
                  <ul className="text-xs text-gray-400 space-y-1">
                    {!profile.showreel && <li>• Add a showreel to showcase your work</li>}
                    {!profile.resume && <li>• Upload your resume/CV</li>}
                    {(!profile.additionalPhotos || profile.additionalPhotos.length === 0) && (
                      <li>• Add photos to your portfolio</li>
                    )}
                  </ul>
                  <Button className="mt-3 w-full bg-[#00BFFF] hover:bg-[#0099CC] text-black text-xs">
                    Complete Profile
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Badge className={`${profile.isVerified ? "bg-green-500" : "bg-yellow-500"} text-black`}>
                    {profile.verificationLevel || "Basic"} Verification
                  </Badge>
                </div>
                {!profile.isVerified && (
                  <Button variant="link" className="text-[#00BFFF] p-0 h-auto text-xs">
                    Verify Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Stats */}
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle>Key Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#1A1A1A] p-3 rounded-lg">
                <div className="flex items-center text-[#00BFFF] mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Experience</span>
                </div>
                <p className="text-xl font-bold">{profile.yearsOfExperience} years</p>
              </div>

              <div className="bg-[#1A1A1A] p-3 rounded-lg">
                <div className="flex items-center text-[#00BFFF] mb-2">
                  <Film className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Projects</span>
                </div>
                <p className="text-xl font-bold">{profile.experience.length}</p>
              </div>

              <div className="bg-[#1A1A1A] p-3 rounded-lg">
                <div className="flex items-center text-[#00BFFF] mb-2">
                  <Star className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Skills</span>
                </div>
                <p className="text-xl font-bold">
                  {profile.skills.reduce((acc, category) => acc + category.items.length, 0)}
                </p>
              </div>

              <div className="bg-[#1A1A1A] p-3 rounded-lg">
                <div className="flex items-center text-[#00BFFF] mb-2">
                  <Award className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Followers</span>
                </div>
                <p className="text-xl font-bold">{profile.followerCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Work */}
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle>Recent Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentWork.length > 0 ? (
              <div className="space-y-3">
                {recentWork.map((work) => (
                  <div key={work.id} className="bg-[#1A1A1A] p-3 rounded-lg flex items-start gap-3">
                    <div className="w-12 h-16 bg-[#3A3A3A] rounded overflow-hidden flex-shrink-0">
                      {work.media && work.media[0] ? (
                        <Image
                          src={work.media[0].url || "/placeholder.svg"}
                          alt={work.title}
                          width={48}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{work.title}</h4>
                      <p className="text-sm text-gray-400">{work.role}</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="text-xs border-[#3A3A3A] text-gray-400">
                          {work.year}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-[#3A3A3A] text-gray-400 ml-2">
                          {work.productionType.charAt(0).toUpperCase() + work.productionType.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="link" className="text-[#00BFFF] p-0 h-auto">
                  View All Experience
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400">No experience added yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Right Column: Skills & Showcase */}
      <motion.div className="space-y-6" variants={itemVariants}>
        {/* Top Skills */}
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle>Top Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {topSkills.length > 0 ? (
              <div className="space-y-3">
                {topSkills.map((skill, index) => (
                  <div key={index} className="bg-[#1A1A1A] p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{skill.name}</span>
                      {skill.endorsements && skill.endorsements > 0 && (
                        <Badge className="bg-[#00BFFF] text-black">
                          {skill.endorsements} {skill.endorsements === 1 ? "endorsement" : "endorsements"}
                        </Badge>
                      )}
                    </div>
                    {skill.proficiency && (
                      <div className="mt-2">
                        <div className="w-full bg-[#3A3A3A] h-1.5 rounded-full">
                          <div
                            className="bg-[#00BFFF] h-1.5 rounded-full"
                            style={{
                              width:
                                skill.proficiency === "beginner"
                                  ? "33%"
                                  : skill.proficiency === "intermediate"
                                    ? "66%"
                                    : "100%",
                            }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-400 capitalize">{skill.proficiency}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <Button variant="link" className="text-[#00BFFF] p-0 h-auto">
                  View All Skills
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400">No skills added yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Siddu Showcase Integration */}
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle>Siddu Showcase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-[#1A1A1A] rounded-lg p-4 text-center">
              <p className="text-gray-400 mb-3">Connect your Siddu Showcase content</p>
              <Button className="bg-[#00BFFF] hover:bg-[#0099CC] text-black">Connect Showcase</Button>
            </div>
          </CardContent>
        </Card>

        {/* Social Proof */}
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle>Industry Endorsements</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.skills.some((category) =>
              category.items.some((skill) => skill.endorsements && skill.endorsements > 0),
            ) ? (
              <div className="space-y-3">
                {profile.skills
                  .flatMap((category) => category.items)
                  .filter((skill) => skill.endorsements && skill.endorsements > 0 && skill.endorsers)
                  .slice(0, 3)
                  .map((skill, index) => (
                    <div key={index} className="bg-[#1A1A1A] p-3 rounded-lg">
                      <p className="text-sm font-medium mb-1">{skill.name}</p>
                      <div className="flex items-center">
                        <div className="flex -space-x-2 mr-2">
                          {/* This would show endorser avatars */}
                          <div className="w-6 h-6 rounded-full bg-[#3A3A3A] border border-[#1A1A1A]"></div>
                          <div className="w-6 h-6 rounded-full bg-[#4A4A4A] border border-[#1A1A1A]"></div>
                          {skill.endorsements && skill.endorsements > 2 && (
                            <div className="w-6 h-6 rounded-full bg-[#00BFFF] border border-[#1A1A1A] flex items-center justify-center text-xs text-black">
                              +{skill.endorsements - 2}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">Endorsed by {skill.endorsements} industry professionals</p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400">No endorsements yet</p>
                {!isOwnProfile && (
                  <Button className="mt-3 bg-[#00BFFF] hover:bg-[#0099CC] text-black">Endorse Skills</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
