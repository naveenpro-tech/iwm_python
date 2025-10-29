"use client"

import React from "react"
import { Controller, type Control, type FieldValues } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface ProfileFormFieldsProps {
  control: Control<any>
  errors: Record<string, any>
  className?: string
}

/**
 * Profile form fields component
 * Renders username, email, fullName, and bio fields
 */
export const ProfileFormFields = React.forwardRef<HTMLDivElement, ProfileFormFieldsProps>(
  ({ control, errors, className }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-6", className)}>
        {/* Username and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="username" className="text-gray-300">
              Username
            </Label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    id="username"
                    {...field}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    id="email"
                    type="email"
                    {...field}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </>
              )}
            />
          </div>
        </div>

        {/* Full Name */}
        <div>
          <Label htmlFor="fullName" className="text-gray-300">
            Full Name
          </Label>
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <>
                <Input
                  id="fullName"
                  {...field}
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Bio */}
        <div>
          <Label htmlFor="bio" className="text-gray-300">
            Bio
          </Label>
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <>
                <Textarea
                  id="bio"
                  {...field}
                  className="bg-gray-700 border-gray-600 text-white mt-1 min-h-[100px]"
                  placeholder="Tell us a bit about yourself..."
                />
                {errors.bio && (
                  <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>
                )}
              </>
            )}
          />
        </div>
      </div>
    )
  }
)

ProfileFormFields.displayName = "ProfileFormFields"

