"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  MapPin,
  Calendar,
  Clock,
  Bookmark,
  Users,
  Briefcase,
  CheckCircle,
  Share2,
  ArrowLeft,
  Flag,
  Send,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { mockCastingCalls } from "../mock-data"
import type { Role } from "@/types"

interface CastingCallDetailPageProps {
  callId: string
}

export default function CastingCallDetailPage({ callId }: CastingCallDetailPageProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // In a real app, you would fetch this data from an API
  const call = mockCastingCalls.find((c) => c.id === callId) || mockCastingCalls[0]

  const actingRoles = call.roles.filter((role) => role.type === "acting")
  const crewRoles = call.roles.filter((role) => role.type === "crew")

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const daysToDeadline = Math.ceil(
    (new Date(call.submissionDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Hero Section */}
      <div className="relative h-64 md:h-96">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent z-10" />
        <img
          src={call.posterImage || "/placeholder.svg?height=400&width=1200&query=film production"}
          alt={call.projectTitle}
          className="w-full h-full object-cover"
        />

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <Link href="/talent-hub/calls">
            <Button variant="ghost" size="sm" className="bg-black/50 backdrop-blur-sm hover:bg-black/70">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Listings
            </Button>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <Button variant="ghost" size="sm" className="bg-black/50 backdrop-blur-sm hover:bg-black/70">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`bg-black/50 backdrop-blur-sm hover:bg-black/70 ${
              isBookmarked ? "text-[#00BFFF]" : "text-white"
            }`}
            onClick={toggleBookmark}
          >
            <Bookmark className="w-4 h-4 mr-2" fill={isBookmarked ? "#00BFFF" : "none"} />
            {isBookmarked ? "Saved" : "Save"}
          </Button>
        </div>

        {/* Title and Basic Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 mb-2">
              {call.isVerified && (
                <Badge className="bg-[#00BFFF] text-black border-0">
                  <CheckCircle className="w-3 h-3 mr-1" /> Verified
                </Badge>
              )}
              <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-0">
                {call.projectType.replace("-", " ")}
              </Badge>
              <Badge
                className={`${
                  daysToDeadline <= 3 ? "bg-red-500" : daysToDeadline <= 7 ? "bg-amber-500" : "bg-green-600"
                } text-white border-0`}
              >
                {daysToDeadline <= 0 ? "Closing today" : `${daysToDeadline} days left`}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{call.projectTitle}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-[#00BFFF]" />
                <span>
                  {call.location.city}, {call.location.state}, {call.location.country}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-[#00BFFF]" />
                <span>
                  Shooting: {new Date(call.productionTimeline.start).toLocaleDateString()} -{" "}
                  {new Date(call.productionTimeline.end).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-[#00BFFF]" />
                <span>Posted {formatDistanceToNow(new Date(call.postedDate), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="overview" onValueChange={setActiveTab}>
              <TabsList className="bg-[#282828] w-full">
                <TabsTrigger
                  value="overview"
                  className="flex-1 data-[state=active]:bg-[#00BFFF] data-[state=active]:text-black"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="roles"
                  className="flex-1 data-[state=active]:bg-[#00BFFF] data-[state=active]:text-black"
                >
                  Roles ({call.roles.length})
                </TabsTrigger>
                <TabsTrigger
                  value="company"
                  className="flex-1 data-[state=active]:bg-[#00BFFF] data-[state=active]:text-black"
                >
                  Company
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card className="bg-[#282828] border-[#3A3A3A] p-6">
                  <h2 className="text-xl font-semibold mb-4">Project Description</h2>
                  <p className="text-[#E0E0E0] whitespace-pre-line">{call.description}</p>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-3">Project Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[#A0A0A0]">Production Company</p>
                        <p>{call.productionCompany}</p>
                      </div>
                      <div>
                        <p className="text-[#A0A0A0]">Project Type</p>
                        <p className="capitalize">{call.projectType.replace("-", " ")}</p>
                      </div>
                      <div>
                        <p className="text-[#A0A0A0]">Production Timeline</p>
                        <p>
                          {new Date(call.productionTimeline.start).toLocaleDateString()} -{" "}
                          {new Date(call.productionTimeline.end).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#A0A0A0]">Location</p>
                        <p>
                          {call.location.city}, {call.location.state}, {call.location.country}
                        </p>
                      </div>
                      {call.budgetRange && (
                        <div>
                          <p className="text-[#A0A0A0]">Budget Range</p>
                          <p className="capitalize">{call.budgetRange}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-3">Submission Guidelines</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[#A0A0A0]">Application Deadline</p>
                        <p>{new Date(call.submissionDeadline).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[#A0A0A0]">Required Materials</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {call.submissionGuidelines?.requiredMaterials?.map((material) => (
                            <Badge key={material} variant="secondary" className="bg-[#3A3A3A]">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {call.submissionGuidelines?.specialInstructions && (
                        <div>
                          <p className="text-[#A0A0A0]">Special Instructions</p>
                          <p className="text-[#E0E0E0] whitespace-pre-line">
                            {call.submissionGuidelines.specialInstructions}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="roles" className="mt-6 space-y-6">
                {actingRoles.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-[#00BFFF]" />
                      <h2 className="text-xl font-semibold">Acting Roles ({actingRoles.length})</h2>
                    </div>
                    <div className="space-y-4">
                      {actingRoles.map((role) => (
                        <RoleCard key={role.id} role={role} />
                      ))}
                    </div>
                  </div>
                )}

                {crewRoles.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase className="w-5 h-5 text-[#00BFFF]" />
                      <h2 className="text-xl font-semibold">Crew Positions ({crewRoles.length})</h2>
                    </div>
                    <div className="space-y-4">
                      {crewRoles.map((role) => (
                        <RoleCard key={role.id} role={role} />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="company" className="mt-6">
                <Card className="bg-[#282828] border-[#3A3A3A] p-6">
                  <h2 className="text-xl font-semibold mb-4">About {call.productionCompany}</h2>
                  <p className="text-[#E0E0E0] mb-6">
                    Information about the production company would be displayed here, including their history, previous
                    projects, and contact information.
                  </p>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Previous Projects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* This would be populated with actual data in a real implementation */}
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-[#1A1A1A] rounded-md p-3">
                          <p className="font-medium">Project Title {i}</p>
                          <p className="text-sm text-[#A0A0A0]">2023</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-3">Company Verification</h3>
                    <div className="flex items-center gap-2 text-[#00BFFF]">
                      <CheckCircle className="w-5 h-5" />
                      <p>This company has been verified by Siddu Talent Hub</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Apply Section */}
          <div className="lg:w-80">
            <div className="sticky top-24">
              <Card className="bg-[#282828] border-[#3A3A3A] p-6">
                <h2 className="text-xl font-semibold mb-4">Apply Now</h2>
                <p className="text-[#A0A0A0] mb-6">
                  Application deadline: {new Date(call.submissionDeadline).toLocaleDateString()}
                </p>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-[#00BFFF] hover:bg-[#0099CC] text-black mb-4">
                      <Send className="w-4 h-4 mr-2" />
                      Apply for This Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#282828] border-[#3A3A3A]">
                    <DialogHeader>
                      <DialogTitle>Apply for "{call.projectTitle}"</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-[#A0A0A0] mb-4">
                        This would open an application form specific to this casting call.
                      </p>
                      <p className="text-[#E0E0E0]">
                        The form would include fields for selecting which role(s) to apply for, uploading required
                        materials, and providing additional information requested by the casting director.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full border-[#3A3A3A] mb-6" onClick={toggleBookmark}>
                  <Bookmark className="w-4 h-4 mr-2" fill={isBookmarked ? "#00BFFF" : "none"} />
                  {isBookmarked ? "Saved to Watchlist" : "Save for Later"}
                </Button>

                <div className="border-t border-[#3A3A3A] pt-4 mt-4">
                  <p className="text-sm text-[#A0A0A0] mb-2">Have concerns about this listing?</p>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 p-0">
                    <Flag className="w-4 h-4 mr-2" />
                    Report This Listing
                  </Button>
                </div>
              </Card>

              <Card className="bg-[#282828] border-[#3A3A3A] p-6 mt-6">
                <h2 className="text-lg font-semibold mb-4">Similar Opportunities</h2>
                <div className="space-y-4">
                  {/* This would be populated with actual similar opportunities */}
                  {mockCastingCalls
                    .filter((c) => c.id !== call.id)
                    .slice(0, 3)
                    .map((similarCall) => (
                      <Link href={`/talent-hub/calls/${similarCall.id}`} key={similarCall.id}>
                        <div className="flex gap-3 hover:bg-[#3A3A3A] p-2 rounded-md transition-colors">
                          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={
                                similarCall.posterImage ||
                                "/placeholder.svg?height=48&width=48&query=film production" ||
                                "/placeholder.svg"
                              }
                              alt={similarCall.projectTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium line-clamp-1">{similarCall.projectTitle}</p>
                            <p className="text-xs text-[#A0A0A0]">
                              {similarCall.roles.length} role{similarCall.roles.length !== 1 && "s"}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface RoleCardProps {
  role: Role
}

function RoleCard({ role }: RoleCardProps) {
  return (
    <Card className="bg-[#282828] border-[#3A3A3A] p-6">
      <div className="flex justify-betweenitems-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">{role.title}</h3>
            <Badge variant="outline" className="capitalize">
              {role.category}
            </Badge>
            <Badge variant="secondary" className="bg-[#3A3A3A] capitalize">
              {role.compensation.replace("-", " ")}
            </Badge>
          </div>
          {role.department && (
            <p className="text-[#A0A0A0] mb-2">
              Department: <span className="text-white capitalize">{role.department}</span>
            </p>
          )}
        </div>
        <Badge variant="outline" className="bg-[#3A3A3A] border-0 capitalize">
          {role.auditionType.replace("-", " ")}
        </Badge>
      </div>

      <p className="text-[#E0E0E0] mt-4 mb-6">{role.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {role.requirements.ageRange && (
          <div>
            <p className="text-[#A0A0A0]">Age Range</p>
            <p>
              {role.requirements.ageRange.min} - {role.requirements.ageRange.max}
            </p>
          </div>
        )}

        {role.requirements.gender && role.requirements.gender.length > 0 && (
          <div>
            <p className="text-[#A0A0A0]">Gender</p>
            <p>{role.requirements.gender.join(", ")}</p>
          </div>
        )}

        {role.requirements.ethnicity && role.requirements.ethnicity.length > 0 && (
          <div>
            <p className="text-[#A0A0A0]">Ethnicity</p>
            <p>{role.requirements.ethnicity.join(", ")}</p>
          </div>
        )}

        {role.requirements.experienceLevel && (
          <div>
            <p className="text-[#A0A0A0]">Experience Level</p>
            <p className="capitalize">{role.requirements.experienceLevel}</p>
          </div>
        )}

        {role.requirements.unionStatus && (
          <div>
            <p className="text-[#A0A0A0]">Union Status</p>
            <p className="uppercase">{role.requirements.unionStatus}</p>
          </div>
        )}

        {role.requirements.skills && role.requirements.skills.length > 0 && (
          <div className="md:col-span-2">
            <p className="text-[#A0A0A0]">Required Skills</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {role.requirements.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-[#3A3A3A]">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {role.requirements.languages && role.requirements.languages.length > 0 && (
          <div className="md:col-span-2">
            <p className="text-[#A0A0A0]">Language Requirements</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {role.requirements.languages.map((lang, index) => (
                <Badge key={index} variant="secondary" className="bg-[#3A3A3A]">
                  {lang.language} ({lang.proficiency})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {role.requirements.physicalAttributes && (
          <div className="md:col-span-2">
            <p className="text-[#A0A0A0]">Physical Attributes</p>
            <p>{role.requirements.physicalAttributes}</p>
          </div>
        )}
      </div>

      {role.paymentDetails && (
        <div className="mt-6 p-3 bg-[#1A1A1A] rounded-md">
          <p className="text-[#A0A0A0]">Payment Details</p>
          <p>{role.paymentDetails}</p>
        </div>
      )}

      <Button className="mt-6 bg-[#00BFFF] hover:bg-[#0099CC] text-black">
        <Send className="w-4 h-4 mr-2" />
        Apply for This Role
      </Button>
    </Card>
  )
}
