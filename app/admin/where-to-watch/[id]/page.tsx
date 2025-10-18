"use client"

import Link from "next/link"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Globe, Upload, X } from "lucide-react"
import NextLink from "next/link"
import Image from "next/image"

export default function StreamingServiceDetailPage() {
  const params = useParams()
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  // Mock data for Netflix
  const service = {
    id: "1",
    name: "Netflix",
    logo: "/netflix-inspired-logo.png",
    website: "https://netflix.com",
    apiEndpoint: "https://api.netflix.com",
    requiresAuth: true,
    active: true,
    regions: [
      { code: "US", name: "United States", active: true },
      { code: "UK", name: "United Kingdom", active: true },
      { code: "CA", name: "Canada", active: true },
      { code: "AU", name: "Australia", active: true },
      { code: "IN", name: "India", active: true },
      { code: "JP", name: "Japan", active: true },
      { code: "KR", name: "South Korea", active: true },
      { code: "DE", name: "Germany", active: true },
      { code: "FR", name: "France", active: true },
      { code: "ES", name: "Spain", active: true },
    ],
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <NextLink href="/admin/where-to-watch">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </NextLink>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded overflow-hidden">
              <Image src={service.logo || "/placeholder.svg"} alt={service.name} fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{service.name}</h1>
              <p className="text-muted-foreground mt-1">Streaming Service Management</p>
            </div>
          </div>
        </div>
        <Button className="gap-2" disabled={!hasChanges}>
          <Save size={16} />
          Save Changes
        </Button>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="details">Service Details</TabsTrigger>
          <TabsTrigger value="regions">Regional Settings</TabsTrigger>
          <TabsTrigger value="integration">API Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service-name">Service Name</Label>
                  <Input id="service-name" defaultValue={service.name} onChange={() => setHasChanges(true)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-website">Website URL</Label>
                  <Input id="service-website" defaultValue={service.website} onChange={() => setHasChanges(true)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Service Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded overflow-hidden bg-muted">
                    <Image src={service.logo || "/placeholder.svg"} alt={service.name} fill className="object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Upload size={14} />
                      Upload New Logo
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <X size={14} />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="service-active">Service Status</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable this streaming service</p>
                </div>
                <Switch id="service-active" checked={service.active} onCheckedChange={() => setHasChanges(true)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Linking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="link-pattern">URL Pattern</Label>
                <Input
                  id="link-pattern"
                  defaultValue="https://www.netflix.com/title/{id}"
                  onChange={() => setHasChanges(true)}
                />
                <p className="text-sm text-muted-foreground">Use {"{id}"} as a placeholder for the content ID</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="link-example">Example URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="link-example"
                    defaultValue="https://www.netflix.com/title/80100172"
                    readOnly
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" className="gap-1">
                    <Link size={14} />
                    Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Regional Availability</CardTitle>
              <Button size="sm" className="gap-2">
                <Globe size={16} />
                Add Region
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {service.regions.map((region, index) => (
                  <motion.div
                    key={region.code}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{region.code}</Badge>
                      <span>{region.name}</span>
                    </div>
                    <Switch checked={region.active} onCheckedChange={() => setHasChanges(true)} />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <Input id="api-endpoint" defaultValue={service.apiEndpoint} onChange={() => setHasChanges(true)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  defaultValue="••••••••••••••••"
                  onChange={() => setHasChanges(true)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requires-auth">Authentication Required</Label>
                  <p className="text-sm text-muted-foreground">Does this API require authentication for requests?</p>
                </div>
                <Switch id="requires-auth" checked={service.requiresAuth} onCheckedChange={() => setHasChanges(true)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-verify">Automatic Link Verification</Label>
                  <p className="text-sm text-muted-foreground">Periodically check if streaming links are still valid</p>
                </div>
                <Switch id="auto-verify" defaultChecked onCheckedChange={() => setHasChanges(true)} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-update">Automatic Content Updates</Label>
                  <p className="text-sm text-muted-foreground">Automatically update content availability from API</p>
                </div>
                <Switch id="auto-update" defaultChecked onCheckedChange={() => setHasChanges(true)} />
              </div>

              <div className="flex justify-end">
                <Button variant="outline" size="sm">
                  Test API Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
