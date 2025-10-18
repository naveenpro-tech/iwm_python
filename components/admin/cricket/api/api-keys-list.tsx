"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Check, Copy, Edit, EyeOff, Plus, RefreshCw, Trash } from "lucide-react"
import { useState } from "react"

export function ApiKeysList() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // In a real implementation, this would fetch API keys from an API
  const apiKeys = [
    {
      id: "key-1",
      name: "CricAPI",
      key: "••••••••••••••••••••••••••1234",
      status: "connected",
      lastUsed: "10 minutes ago",
    },
    {
      id: "key-2",
      name: "Sportsradar",
      key: "••••••••••••••••••••••••••5678",
      status: "connected",
      lastUsed: "2 hours ago",
    },
    {
      id: "key-3",
      name: "Cricket Data Provider",
      key: "••••••••••••••••••••••••••9012",
      status: "disconnected",
      lastUsed: "3 days ago",
    },
  ]

  const copyToClipboard = (id: string) => {
    // In a real implementation, this would copy the actual key
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-500">Connected</Badge>
      case "disconnected":
        return <Badge variant="destructive">Disconnected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage external cricket data API integrations</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add New API
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiKeys.map((apiKey, index) => (
          <motion.div
            key={apiKey.id}
            className="p-4 border rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{apiKey.name}</h3>
                  {getStatusBadge(apiKey.status)}
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-secondary px-2 py-1 rounded">{apiKey.key}</code>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(apiKey.id)}>
                    {copiedKey === apiKey.id ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="sr-only">Copy API key</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Last used: {apiKey.lastUsed}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Test
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        ))}

        <div className="p-4 border border-dashed rounded-lg">
          <div className="space-y-4">
            <h3 className="font-medium">Add New API Key</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="api-name">API Name</Label>
                <Input id="api-name" placeholder="e.g., CricAPI" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex">
                  <Input id="api-key" type="password" placeholder="Enter API key" className="rounded-r-none" />
                  <Button variant="secondary" className="rounded-l-none">
                    <EyeOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add API Key
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
