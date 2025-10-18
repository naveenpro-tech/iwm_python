"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Users, Briefcase } from "lucide-react"
import type { FormData, Role } from "../../types"
import { motion, AnimatePresence } from "framer-motion"

interface RoleDetailsStepProps {
  data: Partial<FormData>
  onUpdate: (data: Partial<FormData>) => void
}

export default function RoleDetailsStep({ data, onUpdate }: RoleDetailsStepProps) {
  const [roleType, setRoleType] = useState<"acting" | "crew">("acting")
  const [currentRole, setCurrentRole] = useState<Partial<Role>>({
    type: "acting",
    compensation: "paid",
    requirements: {
      experienceLevel: "intermediate",
    },
  })

  const handleAddRole = () => {
    if (currentRole.title && currentRole.description) {
      const newRole: Role = {
        id: Date.now().toString(),
        type: roleType,
        title: currentRole.title,
        description: currentRole.description,
        category: currentRole.category || "",
        department: currentRole.department,
        compensation: currentRole.compensation || "paid",
        paymentDetails: currentRole.paymentDetails,
        requirements: currentRole.requirements || { experienceLevel: "intermediate" },
        auditionType: currentRole.auditionType || "self-tape",
      }

      onUpdate({
        roles: [...(data.roles || []), newRole],
      })

      // Reset current role
      setCurrentRole({
        type: roleType,
        compensation: "paid",
        requirements: {
          experienceLevel: "intermediate",
        },
      })
    }
  }

  const handleRemoveRole = (roleId: string) => {
    onUpdate({
      roles: data.roles?.filter((role) => role.id !== roleId),
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-6">Role Details</h2>

        {/* Role Type Toggle */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={roleType === "acting" ? "default" : "outline"}
            onClick={() => {
              setRoleType("acting")
              setCurrentRole({ ...currentRole, type: "acting" })
            }}
            className={roleType === "acting" ? "bg-[#00BFFF] text-black" : "border-[#282828]"}
          >
            <Users className="w-4 h-4 mr-2" />
            Acting Role
          </Button>
          <Button
            variant={roleType === "crew" ? "default" : "outline"}
            onClick={() => {
              setRoleType("crew")
              setCurrentRole({ ...currentRole, type: "crew" })
            }}
            className={roleType === "crew" ? "bg-[#00BFFF] text-black" : "border-[#282828]"}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Crew Position
          </Button>
        </div>

        {/* Current Role Form */}
        <Card className="p-6 bg-[#282828] border-[#3A3A3A] mb-6">
          <div className="space-y-4">
            {/* Role Title */}
            <div className="space-y-2">
              <Label htmlFor="roleTitle">{roleType === "acting" ? "Character Name" : "Position Title"} *</Label>
              <Input
                id="roleTitle"
                value={currentRole.title || ""}
                onChange={(e) => setCurrentRole({ ...currentRole, title: e.target.value })}
                placeholder={roleType === "acting" ? "e.g., Lead Detective" : "e.g., Director of Photography"}
                className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
              />
            </div>

            {/* Role Description */}
            <div className="space-y-2">
              <Label htmlFor="roleDescription">Role Description *</Label>
              <Textarea
                id="roleDescription"
                value={currentRole.description || ""}
                onChange={(e) => setCurrentRole({ ...currentRole, description: e.target.value })}
                placeholder="Describe the role and responsibilities"
                rows={3}
                className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
              />
            </div>

            {/* Role Category */}
            <div className="space-y-2">
              <Label htmlFor="roleCategory">{roleType === "acting" ? "Role Category" : "Position Level"} *</Label>
              <Select
                value={currentRole.category}
                onValueChange={(value) => setCurrentRole({ ...currentRole, category: value })}
              >
                <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {roleType === "acting" ? (
                    <>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="supporting">Supporting</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="extra">Extra</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="head">Department Head</SelectItem>
                      <SelectItem value="senior">Senior Position</SelectItem>
                      <SelectItem value="assistant">Assistant</SelectItem>
                      <SelectItem value="intern">Intern</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Department (for crew) */}
            {roleType === "crew" && (
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={currentRole.department}
                  onValueChange={(value) => setCurrentRole({ ...currentRole, department: value })}
                >
                  <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A]">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="camera">Camera</SelectItem>
                    <SelectItem value="sound">Sound</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="post">Post-Production</SelectItem>
                    <SelectItem value="costume">Costume</SelectItem>
                    <SelectItem value="makeup">Makeup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Compensation */}
            <div className="space-y-2">
              <Label>Compensation *</Label>
              <RadioGroup
                value={currentRole.compensation}
                onValueChange={(value) => setCurrentRole({ ...currentRole, compensation: value as any })}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paid" id="paid" />
                    <Label htmlFor="paid" className="font-normal cursor-pointer">
                      Paid
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unpaid" id="unpaid" />
                    <Label htmlFor="unpaid" className="font-normal cursor-pointer">
                      Unpaid
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="deferred" id="deferred" />
                    <Label htmlFor="deferred" className="font-normal cursor-pointer">
                      Deferred
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit-only" id="credit-only" />
                    <Label htmlFor="credit-only" className="font-normal cursor-pointer">
                      Credit Only
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Payment Details (if paid) */}
            {currentRole.compensation === "paid" && (
              <div className="space-y-2">
                <Label htmlFor="paymentDetails">Payment Details</Label>
                <Input
                  id="paymentDetails"
                  value={currentRole.paymentDetails || ""}
                  onChange={(e) => setCurrentRole({ ...currentRole, paymentDetails: e.target.value })}
                  placeholder="e.g., $500/day, Union scale"
                  className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF]"
                />
              </div>
            )}

            {/* Audition Type */}
            <div className="space-y-2">
              <Label htmlFor="auditionType">Audition Type *</Label>
              <Select
                value={currentRole.auditionType}
                onValueChange={(value) => setCurrentRole({ ...currentRole, auditionType: value as any })}
              >
                <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A]">
                  <SelectValue placeholder="Select audition type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="self-tape">Self-Tape</SelectItem>
                  <SelectItem value="video-call">Video Call</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAddRole} className="w-full bg-[#00BFFF] hover:bg-[#0099CC] text-black">
              <Plus className="w-4 h-4 mr-2" />
              Add Role
            </Button>
          </div>
        </Card>

        {/* Added Roles List */}
        {data.roles && data.roles.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Added Roles ({data.roles.length})</h3>
            <AnimatePresence>
              {data.roles.map((role) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-4 bg-[#282828] border-[#3A3A3A]">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {role.type === "acting" ? (
                            <Users className="w-4 h-4 text-[#00BFFF]" />
                          ) : (
                            <Briefcase className="w-4 h-4 text-[#00BFFF]" />
                          )}
                          <h4 className="font-semibold">{role.title}</h4>
                          <span className="text-sm text-[#A0A0A0]">({role.category})</span>
                        </div>
                        <p className="text-sm text-[#A0A0A0] mb-2">{role.description}</p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-[#00BFFF]">{role.compensation}</span>
                          {role.department && <span className="text-[#A0A0A0]">{role.department}</span>}
                          <span className="text-[#A0A0A0]">{role.auditionType}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRole(role.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
