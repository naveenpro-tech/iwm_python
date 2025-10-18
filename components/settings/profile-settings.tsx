"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Camera } from "lucide-react"

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20),
  email: z.string().email("Invalid email address"),
  fullName: z.string().optional(),
  bio: z.string().max(160, "Bio must be 160 characters or less").optional(),
  avatarUrl: z.string().url("Invalid URL").optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

// Mock user data - replace with actual data fetching
const mockUser = {
  username: "cinemafan123",
  email: "user@example.com",
  fullName: "Alex Ryder",
  bio: "Lover of all things film. Aspiring critic. Cricket enthusiast on weekends.",
  avatarUrl: "/placeholder.svg?height=128&width=128&text=AR",
}

export function ProfileSettings() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: mockUser,
  })

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    console.log("Profile data submitted:", data)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // Handle success/error (e.g., show toast)
    alert("Profile updated successfully!")
  }

  return (
    <Card className="bg-gray-800 border-gray-700 text-gray-100">
      <CardHeader>
        <CardTitle className="text-2xl">Profile Settings</CardTitle>
        <CardDescription className="text-gray-400">Manage your public profile information.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <Avatar className="h-24 w-24">
                <AvatarImage src={mockUser.avatarUrl || "/placeholder.svg"} alt={mockUser.username} />
                <AvatarFallback>{mockUser.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-gray-700/80 border-gray-600 hover:bg-gray-600 group-hover:opacity-100 opacity-0 transition-opacity"
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Change avatar</span>
              </Button>
              <Input type="file" id="avatarUpload" className="hidden" accept="image/*" /> {/* Hidden file input */}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{mockUser.fullName || mockUser.username}</h3>
              <p className="text-sm text-gray-400">@{mockUser.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="username" className="text-gray-300">
                Username
              </Label>
              <Input id="username" {...register("username")} className="bg-gray-700 border-gray-600 text-white mt-1" />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="bg-gray-700 border-gray-600 text-white mt-1"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="fullName" className="text-gray-300">
              Full Name
            </Label>
            <Input id="fullName" {...register("fullName")} className="bg-gray-700 border-gray-600 text-white mt-1" />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <Label htmlFor="bio" className="text-gray-300">
              Bio
            </Label>
            <Textarea
              id="bio"
              {...register("bio")}
              className="bg-gray-700 border-gray-600 text-white mt-1 min-h-[100px]"
              placeholder="Tell us a bit about yourself..."
            />
            {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-700 pt-6">
          <Button type="submit" disabled={isSubmitting} className="bg-sky-600 hover:bg-sky-500 text-white">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
