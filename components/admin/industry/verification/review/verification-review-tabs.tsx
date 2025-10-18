"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileInfoTab } from "./tabs/profile-info-tab"
import { DocumentsTab } from "./tabs/documents-tab"
import { FilmographyTab } from "./tabs/filmography-tab"
import { SocialMediaTab } from "./tabs/social-media-tab"
import { VerificationHistoryTab } from "./tabs/verification-history-tab"

export function VerificationReviewTabs({ id }: { id: string }) {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid grid-cols-5 w-full">
        <TabsTrigger value="profile">Profile Info</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="filmography">Filmography</TabsTrigger>
        <TabsTrigger value="social">Social Media</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <ProfileInfoTab id={id} />
      </TabsContent>
      <TabsContent value="documents">
        <DocumentsTab id={id} />
      </TabsContent>
      <TabsContent value="filmography">
        <FilmographyTab id={id} />
      </TabsContent>
      <TabsContent value="social">
        <SocialMediaTab id={id} />
      </TabsContent>
      <TabsContent value="history">
        <VerificationHistoryTab id={id} />
      </TabsContent>
    </Tabs>
  )
}
