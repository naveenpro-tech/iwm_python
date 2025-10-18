"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ProfileHeader } from "./profile-header"
import { ProfileNavigation } from "./profile-navigation"
import { ProfileOverview } from "./tabs/profile-overview"
import { ProfilePortfolio } from "./tabs/profile-portfolio"
import { ProfileExperience } from "./tabs/profile-experience"
import { ProfileSkills } from "./tabs/profile-skills"
import { ProfileAbout } from "./tabs/profile-about"
import { ProfileApplications } from "./tabs/profile-applications"
import { ProfileContact } from "./tabs/profile-contact"
import type { TalentProfile } from "../types"

interface ProfilePageProps {
  profile: TalentProfile
  isOwnProfile?: boolean
  isVerifiedIndustry?: boolean
}

type ProfileTab = "overview" | "portfolio" | "experience" | "skills" | "about" | "applications" | "contact"

export function ProfilePage({ profile, isOwnProfile = false, isVerifiedIndustry = false }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview")

  // Determine which tabs to show based on permissions
  const showApplications = isOwnProfile
  const showContact = isOwnProfile || isVerifiedIndustry || profile.privacySettings.contactVisibility === "public"

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProfileOverview profile={profile} isOwnProfile={isOwnProfile} />
      case "portfolio":
        return <ProfilePortfolio profile={profile} />
      case "experience":
        return <ProfileExperience profile={profile} />
      case "skills":
        return <ProfileSkills profile={profile} isVerifiedIndustry={isVerifiedIndustry} />
      case "about":
        return <ProfileAbout profile={profile} />
      case "applications":
        return isOwnProfile ? <ProfileApplications profile={profile} /> : null
      case "contact":
        return showContact ? <ProfileContact profile={profile} /> : null
      default:
        return <ProfileOverview profile={profile} isOwnProfile={isOwnProfile} />
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} isVerifiedIndustry={isVerifiedIndustry} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <ProfileNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showApplications={showApplications}
          showContact={showContact}
        />

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  )
}
