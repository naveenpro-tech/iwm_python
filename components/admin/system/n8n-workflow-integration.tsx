"use client"

import { Textarea } from "@/components/ui/textarea"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Play,
  Pause,
  RefreshCw,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Code,
  Workflow,
} from "lucide-react"

// Mock workflow data
const workflows = [
  {
    id: "wf_001",
    name: "Content Moderation Automation",
    description: "Automatically flags content based on predefined rules and sends for review",
    status: "active",
    lastRun: "2024-05-25 10:15:42",
    lastRunStatus: "success",
    triggerCount: 245,
    category: "moderation",
  },
  {
    id: "wf_002",
    name: "User Verification Process",
    description: "Handles the multi-step verification process for industry professionals",
    status: "active",
    lastRun: "2024-05-25 09:30:18",
    lastRunStatus: "success",
    triggerCount: 128,
    category: "users",
  },
  {
    id: "wf_003",
    name: "Content Syndication",
    description: "Syndicates content updates to partner platforms and social media",
    status: "paused",
    lastRun: "2024-05-24 15:45:33",
    lastRunStatus: "error",
    triggerCount: 532,
    category: "content",
  },
  {
    id: "wf_004",
    name: "Database Backup Verification",
    description: "Verifies database backups and sends notifications on completion",
    status: "active",
    lastRun: "2024-05-25 04:00:00",
    lastRunStatus: "success",
    triggerCount: 25,
    category: "system",
  },
  {
    id: "wf_005",
    name: "Cricket Score Updates",
    description: "Fetches and processes live cricket scores from external APIs",
    status: "active",
    lastRun: "2024-05-25 11:05:22",
    lastRunStatus: "warning",
    triggerCount: 1245,
    category: "cricket",
  },
]

export function N8nWorkflowIntegration() {
  const [activeTab, setActiveTab] = useState("workflows")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState("connected")

  const refreshWorkflows = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/10">
            <CheckCircle className="h-3 w-3 mr-1" />
            Success
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 hover:bg-red-500/10">
            <XCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/10">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Warning
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Workflow className="h-5 w-5 mr-2" />
              n8n Workflow Automation
            </CardTitle>
            <CardDescription>Manage automated workflows and integrations</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center px-2 py-1 rounded-full text-xs ${
                connectionStatus === "connected" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              }`}
            >
              <div
                className={`h-2 w-2 rounded-full mr-1 ${
                  connectionStatus === "connected" ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              {connectionStatus === "connected" ? "Connected" : "Disconnected"}
            </div>
            <Button variant="outline" size="sm" onClick={refreshWorkflows} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="workflows" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  All
                </Button>
                <Button variant="outline" size="sm">
                  Active
                </Button>
                <Button variant="outline" size="sm">
                  Paused
                </Button>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Workflow
              </Button>
            </div>

            <div className="space-y-3">
              {workflows.map((workflow, index) => (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <h3 className="text-base font-medium">{workflow.name}</h3>
                              <Badge
                                variant="outline"
                                className={`ml-2 ${
                                  workflow.category === "moderation"
                                    ? "bg-purple-500/10 text-purple-500"
                                    : workflow.category === "users"
                                      ? "bg-blue-500/10 text-blue-500"
                                      : workflow.category === "content"
                                        ? "bg-green-500/10 text-green-500"
                                        : workflow.category === "system"
                                          ? "bg-amber-500/10 text-amber-500"
                                          : "bg-cyan-500/10 text-cyan-500"
                                }`}
                              >
                                {workflow.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
                          </div>
                          <div className="flex items-center">
                            {workflow.status === "active" ? (
                              <Button variant="outline" size="sm" className="gap-1">
                                <Pause className="h-3 w-3" />
                                Pause
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" className="gap-1">
                                <Play className="h-3 w-3" />
                                Resume
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="ml-2">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Last Run</div>
                            <div className="flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                              {workflow.lastRun}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Status</div>
                            <div className="mt-1">{getStatusBadge(workflow.lastRunStatus)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Trigger Count</div>
                            <div className="font-medium mt-1">{workflow.triggerCount.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t p-2 bg-muted/30 flex justify-end">
                        <Button variant="ghost" size="sm" className="text-xs h-7">
                          View Logs
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs h-7">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs h-7">
                          Run Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="connections" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium">External Service Connections</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Connection
              </Button>
            </div>

            <div className="space-y-3">
              {[
                {
                  name: "TMDB API",
                  type: "REST API",
                  status: "connected",
                  lastSync: "2024-05-25 10:30:22",
                },
                {
                  name: "OMDB API",
                  type: "REST API",
                  status: "connected",
                  lastSync: "2024-05-25 09:15:45",
                },
                {
                  name: "DeepSeek AI",
                  type: "AI Service",
                  status: "connected",
                  lastSync: "2024-05-25 11:05:18",
                },
                {
                  name: "Cricket Score API",
                  type: "REST API",
                  status: "warning",
                  lastSync: "2024-05-25 08:45:33",
                },
                {
                  name: "Google Analytics",
                  type: "Analytics",
                  status: "connected",
                  lastSync: "2024-05-25 00:15:00",
                },
              ].map((connection, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{connection.name}</h4>
                        <div className="text-sm text-muted-foreground">{connection.type}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex items-center px-2 py-1 rounded-full text-xs ${
                            connection.status === "connected"
                              ? "bg-green-500/10 text-green-500"
                              : connection.status === "warning"
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          <div
                            className={`h-2 w-2 rounded-full mr-1 ${
                              connection.status === "connected"
                                ? "bg-green-500"
                                : connection.status === "warning"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                          ></div>
                          {connection.status === "connected"
                            ? "Connected"
                            : connection.status === "warning"
                              ? "Degraded"
                              : "Disconnected"}
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="text-muted-foreground">Last Sync: </span>
                      {connection.lastSync}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">n8n Connection Settings</CardTitle>
                <CardDescription>Configure your n8n instance connection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="n8n-url">n8n Instance URL</Label>
                  <Input id="n8n-url" defaultValue="https://n8n.siddu-global.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="n8n-api-key">API Key</Label>
                  <Input id="n8n-api-key" type="password" defaultValue="••••••••••••••••••••••" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="webhook-enabled">Enable Webhooks</Label>
                    <p className="text-sm text-muted-foreground">Allow n8n to trigger workflows via webhooks</p>
                  </div>
                  <Switch id="webhook-enabled" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="error-notifications">Error Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications when workflows encounter errors</p>
                  </div>
                  <Switch id="error-notifications" defaultChecked />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 border-t pt-4">
                <Button variant="outline">Test Connection</Button>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Model Context Protocol</CardTitle>
                <CardDescription>Configure AI model context settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="context-protocol">Protocol Version</Label>
                  <div className="flex gap-2">
                    <Select defaultValue="v2">
                      <SelectTrigger id="context-protocol" className="w-[180px]">
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="v1">Version 1.0</SelectItem>
                        <SelectItem value="v2">Version 2.0 (Current)</SelectItem>
                        <SelectItem value="v3-beta">Version 3.0 (Beta)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">View Documentation</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="context-size">Maximum Context Size</Label>
                  <div className="flex gap-2 items-center">
                    <Input id="context-size" type="number" defaultValue="4096" className="w-[180px]" />
                    <span className="text-sm text-muted-foreground">tokens</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="context-code">Custom Context Template</Label>
                    <Button variant="ghost" size="sm">
                      <Code className="h-4 w-4 mr-1" />
                      Format
                    </Button>
                  </div>
                  <Textarea
                    id="context-code"
                    className="font-mono text-xs mt-2 h-32"
                    defaultValue={`{
  "protocol_version": "2.0",
  "model_context": {
    "system_prompt": "You are Siddu, an AI assistant for the Siddu Global Entertainment Hub.",
    "temperature": 0.7,
    "max_tokens": 1024,
    "context_window": 4096,
    "custom_parameters": {
      "cinema_knowledge_depth": "expert",
      "cricket_knowledge_depth": "expert",
      "response_style": "informative_conversational"
    }
  }
}`}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 border-t pt-4">
                <Button variant="outline">Reset to Default</Button>
                <Button>Save Configuration</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
