"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Ghost,
  Rocket,
  Theater,
  Zap,
  Smile,
  Trophy,
  Award,
  Crown,
  Users,
  Eye,
  TrendingUp,
  Heart,
  CalendarCheck,
  BadgeCheck,
  ShieldCheck,
  FileText,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { generateMockBadges } from "@/lib/critic/mock-badges"
import type { CriticProfile } from "@/types/critic"

interface CriticBadgesSectionProps {
  profile: CriticProfile
}

const badgeIcons: Record<string, any> = {
  ghost: Ghost,
  rocket: Rocket,
  theater: Theater,
  zap: Zap,
  smile: Smile,
  trophy: Trophy,
  award: Award,
  crown: Crown,
  users: Users,
  "users-2": Users,
  "users-round": Users,
  eye: Eye,
  "trending-up": TrendingUp,
  heart: Heart,
  "calendar-check": CalendarCheck,
  "badge-check": BadgeCheck,
  "shield-check": ShieldCheck,
  "file-text": FileText,
}

export default function CriticBadgesSection({ profile }: CriticBadgesSectionProps) {
  const [selectedBadge, setSelectedBadge] = useState<any>(null)

  const badgesData = useMemo(
    () =>
      generateMockBadges({
        totalReviews: profile?.total_reviews ?? 0,
        totalFollowers: profile?.total_followers ?? 0,
        totalViews: profile?.total_views ?? 0,
        avgRating: profile?.avg_rating ?? 0,
        isVerified: profile?.is_verified ?? false,
      }),
    [profile]
  )

  return (
    <>
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-[#E0E0E0] font-inter">Achievement Badges</CardTitle>
              <p className="text-sm text-[#A0A0A0] font-dmsans mt-2">
                {badgesData.totalEarned} of {badgesData.totalAvailable} badges earned
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#00BFFF] font-inter">{badgesData.totalEarned}</div>
              <div className="text-xs text-[#A0A0A0] font-dmsans">Earned</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {badgesData.badges.map((badge, index) => {
              const Icon = badgeIcons[badge.icon] || Trophy

              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedBadge(badge)}
                  className="cursor-pointer"
                >
                  <Card
                    className={`
                      relative overflow-hidden transition-all
                      ${
                        badge.isEarned
                          ? "bg-[#1A1A1A] border-2 hover:shadow-glow"
                          : "bg-[#1A1A1A]/50 border border-[#3A3A3A] grayscale"
                      }
                    `}
                    style={{
                      borderColor: badge.isEarned ? badge.color : "#3A3A3A",
                    }}
                  >
                    <CardContent className="p-4">
                      {/* Glow Effect for Earned Badges */}
                      {badge.isEarned && (
                        <motion.div
                          className="absolute inset-0 blur-xl opacity-30"
                          style={{ backgroundColor: badge.color }}
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.2, 0.4, 0.2],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}

                      <div className="relative flex flex-col items-center text-center">
                        <Icon
                          className="w-12 h-12 mb-2"
                          style={{ color: badge.isEarned ? badge.color : "#3A3A3A" }}
                        />
                        <h3 className="text-sm font-semibold text-[#E0E0E0] font-inter line-clamp-2">
                          {badge.name}
                        </h3>
                        {!badge.isEarned && (
                          <div className="w-full mt-2">
                            <Progress value={(badge.progress / badge.total) * 100} className="h-1" />
                            <p className="text-xs text-[#A0A0A0] mt-1">
                              {badge.progress}/{badge.total}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Badge Details Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
            <DialogContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold font-inter flex items-center gap-3">
                  {(() => {
                    const Icon = badgeIcons[selectedBadge.icon] || Trophy
                    return <Icon className="w-8 h-8" style={{ color: selectedBadge.color }} />
                  })()}
                  {selectedBadge.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-[#A0A0A0] font-dmsans">{selectedBadge.description}</p>

                {selectedBadge.isEarned ? (
                  <div className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg p-4">
                    <p className="text-sm text-[#10B981] font-semibold mb-2">✓ Badge Earned!</p>
                    <p className="text-xs text-[#A0A0A0]">
                      Earned on {new Date(selectedBadge.earnedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg p-4">
                    <p className="text-sm text-[#A0A0A0] font-semibold mb-2">Progress</p>
                    <Progress value={(selectedBadge.progress / selectedBadge.total) * 100} className="h-2 mb-2" />
                    <p className="text-xs text-[#A0A0A0]">
                      {selectedBadge.progress} / {selectedBadge.total} (
                      {Math.round((selectedBadge.progress / selectedBadge.total) * 100)}%)
                    </p>
                  </div>
                )}

                <div className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg p-4">
                  <p className="text-sm text-[#A0A0A0] font-semibold mb-2">Category</p>
                  <p className="text-sm text-[#E0E0E0] capitalize">{selectedBadge.category}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}

