"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { ProfileSchema, type ProfileFormData } from "@/lib/validation/settings"
import {
  AvatarUpload,
  ProfileHeader,
  ProfileFormFields,
  ProfileFormActions,
} from "@/components/settings/profile"
import { apiGet, apiPut } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"

interface UserProfile {
  id: string
  email: string
  name: string
  avatarUrl?: string | null
}

export function ProfileSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserProfile | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      username: "",
      fullName: "",
      bio: "",
      avatarUrl: "",
    },
  })

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet<UserProfile>("/api/v1/auth/me")
        setUserData(data)

        // Extract username from email (before @)
        const username = data.email.split("@")[0]

        reset({
          username,
          fullName: data.name || "",
          bio: "",
          avatarUrl: data.avatarUrl || "",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [reset, toast])

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      await apiPut("/api/v1/auth/me", {
        name: data.fullName,
        avatar_url: data.avatarUrl || null,
        bio: data.bio || null,
      })

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })

      reset(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    reset()
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      // TODO: Implement avatar upload to cloud storage (S3, Cloudinary, etc.)
      console.log("Uploading avatar:", file.name)

      toast({
        title: "Info",
        description: "Avatar upload not yet implemented. Coming soon!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700 text-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl">Profile Settings</CardTitle>
          <CardDescription className="text-gray-400">Manage your public profile information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const username = userData?.email.split("@")[0] || ""
  const fullName = userData?.name || ""
  const avatarUrl = userData?.avatarUrl || ""

  return (
    <Card className="bg-gray-800 border-gray-700 text-gray-100">
      <CardHeader>
        <CardTitle className="text-2xl">Profile Settings</CardTitle>
        <CardDescription className="text-gray-400">Manage your public profile information.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <AvatarUpload
              avatarUrl={avatarUrl}
              username={username}
              onUpload={handleAvatarUpload}
            />
            <ProfileHeader
              fullName={fullName}
              username={username}
            />
          </div>

          <ProfileFormFields
            control={control}
            errors={errors}
          />
        </CardContent>
        <CardFooter className="border-t border-gray-700 pt-6">
          <ProfileFormActions
            isSubmitting={isSubmitting}
            isDirty={isDirty}
            onCancel={handleCancel}
          />
        </CardFooter>
      </form>
    </Card>
  )
}
