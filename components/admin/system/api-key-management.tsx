"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Copy, Eye, EyeOff, Filter, Key, Plus, RefreshCw, Search, Shield, Trash, X } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"

// Types
type ApiKeyStatus = "active" | "expired" | "revoked" | "testing"
type ApiKeyService = "TMDB" | "OMDB" | "DeepSeek AI" | "Google API" | "Where to Watch" | "Cricket API" | "Other"
type ApiKeyPermission = "read" | "write" | "admin"

interface ApiKey {
  id: string
  name: string
  value: string
  service: ApiKeyService
  permissions: ApiKeyPermission[]
  createdAt: Date
  expiresAt: Date | null
  lastUsed: Date | null
  status: ApiKeyStatus
  environment: "production" | "development" | "testing"
  createdBy: string
}

// Mock data
const mockApiKeys: ApiKey[] = [
  {
    id: "key_01HGXYZ123456789",
    name: "TMDB Production API Key",
    value: "tmdb_1234567890abcdef1234567890abcdef",
    service: "TMDB",
    permissions: ["read"],
    createdAt: new Date(2023, 5, 15),
    expiresAt: new Date(2024, 5, 15),
    lastUsed: new Date(2023, 10, 28, 14, 35),
    status: "active",
    environment: "production",
    createdBy: "admin@siddu.com",
  },
  {
    id: "key_01HGXYZ987654321",
    name: "OMDB Development Key",
    value: "omdb_abcdef1234567890abcdef1234567890",
    service: "OMDB",
    permissions: ["read", "write"],
    createdAt: new Date(2023, 7, 22),
    expiresAt: new Date(2024, 7, 22),
    lastUsed: new Date(2023, 10, 27, 9, 12),
    status: "active",
    environment: "development",
    createdBy: "developer@siddu.com",
  },
  {
    id: "key_01HGXYZ567890123",
    name: "DeepSeek AI Integration",
    value: "deepseek_7890abcdef1234567890abcdef12345",
    service: "DeepSeek AI",
    permissions: ["read", "write", "admin"],
    createdAt: new Date(2023, 8, 10),
    expiresAt: null,
    lastUsed: new Date(2023, 10, 28, 16, 45),
    status: "active",
    environment: "production",
    createdBy: "ai-team@siddu.com",
  },
  {
    id: "key_01HGXYZ456789012",
    name: "Google Maps API",
    value: "google_def1234567890abcdef1234567890abc",
    service: "Google API",
    permissions: ["read"],
    createdAt: new Date(2023, 4, 5),
    expiresAt: new Date(2023, 10, 5),
    lastUsed: new Date(2023, 10, 4, 11, 22),
    status: "expired",
    environment: "production",
    createdBy: "maps-team@siddu.com",
  },
  {
    id: "key_01HGXYZ345678901",
    name: "Where to Watch - Testing",
    value: "w2w_ef1234567890abcdef1234567890abcd",
    service: "Where to Watch",
    permissions: ["read", "write"],
    createdAt: new Date(2023, 9, 18),
    expiresAt: new Date(2024, 9, 18),
    lastUsed: null,
    status: "active",
    environment: "testing",
    createdBy: "tester@siddu.com",
  },
  {
    id: "key_01HGXYZ234567890",
    name: "Cricket API - Revoked",
    value: "cricket_f1234567890abcdef1234567890abcde",
    service: "Cricket API",
    permissions: ["read", "write"],
    createdAt: new Date(2023, 6, 30),
    expiresAt: new Date(2024, 6, 30),
    lastUsed: new Date(2023, 8, 15, 8, 30),
    status: "revoked",
    environment: "production",
    createdBy: "cricket-admin@siddu.com",
  },
]

// Helper functions
const maskApiKey = (key: string): string => {
  const prefix = key.split("_")[0]
  const maskedPart = "•".repeat(24)
  const suffix = key.slice(-4)
  return `${prefix}_${maskedPart}${suffix}`
}

const getStatusColor = (status: ApiKeyStatus): string => {
  switch (status) {
    case "active":
      return "bg-green-500 hover:bg-green-600"
    case "expired":
      return "bg-amber-500 hover:bg-amber-600"
    case "revoked":
      return "bg-red-500 hover:bg-red-600"
    case "testing":
      return "bg-blue-500 hover:bg-blue-600"
    default:
      return "bg-gray-500 hover:bg-gray-600"
  }
}

const formatDate = (date: Date | null): string => {
  if (!date) return "Never"
  return format(date, "MMM d, yyyy 'at' h:mm a")
}

const formatRelativeTime = (date: Date | null): string => {
  if (!date) return "Never"

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

  return formatDate(date)
}

export function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys)
  const [searchTerm, setSearchTerm] = useState("")
  const [serviceFilter, setServiceFilter] = useState<ApiKeyService | "All">("All")
  const [statusFilter, setStatusFilter] = useState<ApiKeyStatus | "All">("All")
  const [environmentFilter, setEnvironmentFilter] = useState<"production" | "development" | "testing" | "All">("All")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showRevokeDialog, setShowRevokeDialog] = useState(false)
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null)
  const [showApiValue, setShowApiValue] = useState<Record<string, boolean>>({})
  const [testingKeyId, setTestingKeyId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")

  // New key form state
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyService, setNewKeyService] = useState<ApiKeyService>("TMDB")
  const [newKeyPermissions, setNewKeyPermissions] = useState<ApiKeyPermission[]>(["read"])
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<"production" | "development" | "testing">("development")
  const [newKeyExpiration, setNewKeyExpiration] = useState<"30days" | "90days" | "1year" | "never">("90days")

  // Filter keys
  const filteredKeys = apiKeys.filter((key) => {
    const matchesSearch =
      key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesService = serviceFilter === "All" || key.service === serviceFilter
    const matchesStatus = statusFilter === "All" || key.status === statusFilter
    const matchesEnvironment = environmentFilter === "All" || key.environment === environmentFilter

    return matchesSearch && matchesService && matchesStatus && matchesEnvironment
  })

  // Toggle show/hide API key value
  const toggleShowApiValue = (id: string) => {
    setShowApiValue((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Copy API key to clipboard
  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value)
    toast({
      title: "API Key Copied",
      description: "The API key has been copied to your clipboard.",
      duration: 3000,
    })
  }

  // Test API key connection
  const testApiKey = (id: string) => {
    setTestingKeyId(id)

    // Simulate API testing
    setTimeout(() => {
      const success = Math.random() > 0.2 // 80% success rate for demo

      if (success) {
        toast({
          title: "Connection Successful",
          description: "The API key connection test was successful.",
          duration: 3000,
        })
      } else {
        toast({
          title: "Connection Failed",
          description: "The API key connection test failed. Please check the key and try again.",
          variant: "destructive",
          duration: 5000,
        })
      }

      setTestingKeyId(null)
    }, 2000)
  }

  // Create new API key
  const createNewApiKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Validation Error",
        description: "API key name is required.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    // Calculate expiration date
    let expiresAt: Date | null = null
    const now = new Date()

    switch (newKeyExpiration) {
      case "30days":
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        break
      case "90days":
        expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
        break
      case "1year":
        expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
        break
      case "never":
        expiresAt = null
        break
    }

    // Generate a fake API key
    const prefix = newKeyService.toLowerCase().replace(/\s+/g, "")
    const randomPart = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const apiKeyValue = `${prefix}_${randomPart}`

    const newKey: ApiKey = {
      id: `key_${Date.now().toString(36)}`,
      name: newKeyName,
      value: apiKeyValue,
      service: newKeyService,
      permissions: newKeyPermissions,
      createdAt: new Date(),
      expiresAt: expiresAt,
      lastUsed: null,
      status: "active",
      environment: newKeyEnvironment,
      createdBy: "current-user@siddu.com", // In a real app, this would be the current user
    }

    setApiKeys([newKey, ...apiKeys])
    setShowCreateDialog(false)

    // Reset form
    setNewKeyName("")
    setNewKeyService("TMDB")
    setNewKeyPermissions(["read"])
    setNewKeyEnvironment("development")
    setNewKeyExpiration("90days")

    // Show success toast with the new API key
    toast({
      title: "API Key Created",
      description: (
        <div className="mt-2 space-y-2">
          <p>Your new API key has been created successfully.</p>
          <div className="p-2 bg-secondary rounded-md font-mono text-xs break-all">{apiKeyValue}</div>
          <p className="text-sm text-yellow-400">
            <AlertCircle className="inline-block mr-1 h-4 w-4" />
            Save this key now. You won't be able to see it again!
          </p>
        </div>
      ),
      duration: 10000,
    })
  }

  // Revoke API key
  const revokeApiKey = () => {
    if (!selectedKeyId) return

    setApiKeys(apiKeys.map((key) => (key.id === selectedKeyId ? { ...key, status: "revoked" } : key)))

    setShowRevokeDialog(false)
    setSelectedKeyId(null)

    toast({
      title: "API Key Revoked",
      description: "The API key has been revoked successfully.",
      duration: 3000,
    })
  }

  // Toggle permission in new key form
  const togglePermission = (permission: ApiKeyPermission) => {
    if (newKeyPermissions.includes(permission)) {
      setNewKeyPermissions(newKeyPermissions.filter((p) => p !== permission))
    } else {
      setNewKeyPermissions([...newKeyPermissions, permission])
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Key Management</h1>
          <p className="text-muted-foreground">Manage API keys for external service integrations</p>
        </div>

        <Button onClick={() => setShowCreateDialog(true)} className="bg-primary">
          <Plus className="mr-2 h-4 w-4" />
          Create New API Key
        </Button>
      </div>

      {/* Filters and search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5 lg:col-span-4 xl:col-span-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search API keys..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="md:col-span-7 lg:col-span-8 xl:col-span-9 flex flex-wrap gap-3 items-center">
          <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <span className="text-sm text-muted-foreground mr-1 hidden sm:block">Filters:</span>

          <Select value={serviceFilter} onValueChange={(value) => setServiceFilter(value as any)}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Services</SelectItem>
              <SelectItem value="TMDB">TMDB</SelectItem>
              <SelectItem value="OMDB">OMDB</SelectItem>
              <SelectItem value="DeepSeek AI">DeepSeek AI</SelectItem>
              <SelectItem value="Google API">Google API</SelectItem>
              <SelectItem value="Where to Watch">Where to Watch</SelectItem>
              <SelectItem value="Cricket API">Cricket API</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
            </SelectContent>
          </Select>

          <Select value={environmentFilter} onValueChange={(value) => setEnvironmentFilter(value as any)}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Environments</SelectItem>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="testing">Testing</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto">
            <div className="border rounded-md p-1 flex">
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                className="px-2.5"
                onClick={() => setViewMode("table")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-table-2"
                >
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                </svg>
              </Button>
              <Button
                variant={viewMode === "cards" ? "secondary" : "ghost"}
                size="sm"
                className="px-2.5"
                onClick={() => setViewMode("cards")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-layout-grid"
                >
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* API Keys List */}
      {filteredKeys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-card">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Key className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No API Keys Found</h3>
          <p className="text-muted-foreground text-center max-w-md mt-2">
            {searchTerm || serviceFilter !== "All" || statusFilter !== "All" || environmentFilter !== "All"
              ? "Try adjusting your search or filters to find what you're looking for."
              : "You haven't created any API keys yet. Click the 'Create New API Key' button to get started."}
          </p>
          {(searchTerm || serviceFilter !== "All" || statusFilter !== "All" || environmentFilter !== "All") && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm("")
                setServiceFilter("All")
                setStatusFilter("All")
                setEnvironmentFilter("All")
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Table View */}
          {viewMode === "table" && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Name</TableHead>
                    <TableHead className="w-[300px]">API Key</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                      {filteredKeys.map((key) => (
                        <motion.tr
                          key={key.id}
                          variants={itemVariants}
                          className="group"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{key.name}</span>
                              <span className="text-xs text-muted-foreground">{key.environment}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <code className="bg-secondary px-2 py-1 rounded text-xs font-mono flex-1 overflow-hidden text-ellipsis">
                                {showApiValue[key.id] ? key.value : maskApiKey(key.value)}
                              </code>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => toggleShowApiValue(key.id)}
                                    >
                                      {showApiValue[key.id] ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>{showApiValue[key.id] ? "Hide" : "Show"} API key</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => copyToClipboard(key.value)}
                                      disabled={key.status === "revoked"}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Copy to clipboard</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">
                              {key.service}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(key.status)}>
                              {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{formatDate(key.createdAt)}</TableCell>
                          <TableCell className="text-sm">
                            {key.expiresAt ? formatDate(key.expiresAt) : "Never"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {key.lastUsed ? formatRelativeTime(key.lastUsed) : "Never"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => testApiKey(key.id)}
                                      disabled={key.status !== "active" || testingKeyId === key.id}
                                    >
                                      {testingKeyId === key.id ? (
                                        <svg
                                          className="animate-spin h-4 w-4"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                        >
                                          <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                          ></circle>
                                          <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                          ></path>
                                        </svg>
                                      ) : (
                                        <RefreshCw className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Test connection</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 text-destructive"
                                      onClick={() => {
                                        setSelectedKeyId(key.id)
                                        setShowRevokeDialog(true)
                                      }}
                                      disabled={key.status !== "active"}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Revoke key</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Card View */}
          {viewMode === "cards" && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredKeys.map((key) => (
                <motion.div key={key.id} variants={itemVariants}>
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{key.name}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Badge variant="outline" className="mr-2 font-normal">
                              {key.service}
                            </Badge>
                            <Badge className={getStatusColor(key.status)}>
                              {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                            </Badge>
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {key.environment}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium mb-1">API Key</div>
                          <div className="flex items-center space-x-2">
                            <code className="bg-secondary px-2 py-1 rounded text-xs font-mono flex-1 overflow-hidden text-ellipsis">
                              {showApiValue[key.id] ? key.value : maskApiKey(key.value)}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              onClick={() => toggleShowApiValue(key.id)}
                            >
                              {showApiValue[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              onClick={() => copyToClipboard(key.value)}
                              disabled={key.status === "revoked"}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <div className="text-muted-foreground">Created</div>
                            <div>{formatDate(key.createdAt)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Expires</div>
                            <div>{key.expiresAt ? formatDate(key.expiresAt) : "Never"}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Last Used</div>
                            <div>{key.lastUsed ? formatRelativeTime(key.lastUsed) : "Never"}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Permissions</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {key.permissions.map((perm) => (
                                <Badge key={perm} variant="secondary" className="text-xs capitalize">
                                  {perm}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testApiKey(key.id)}
                        disabled={key.status !== "active" || testingKeyId === key.id}
                      >
                        {testingKeyId === key.id ? (
                          <svg
                            className="animate-spin h-4 w-4 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Test Connection
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => {
                          setSelectedKeyId(key.id)
                          setShowRevokeDialog(true)
                        }}
                        disabled={key.status !== "active"}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Revoke
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}

      {/* Create API Key Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>Create a new API key to authenticate with external services.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">API Key Name</Label>
              <Input
                id="name"
                placeholder="e.g., TMDB Production API Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Choose a descriptive name to identify this API key.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="service">Service</Label>
                <Select value={newKeyService} onValueChange={(value) => setNewKeyService(value as ApiKeyService)}>
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TMDB">TMDB</SelectItem>
                    <SelectItem value="OMDB">OMDB</SelectItem>
                    <SelectItem value="DeepSeek AI">DeepSeek AI</SelectItem>
                    <SelectItem value="Google API">Google API</SelectItem>
                    <SelectItem value="Where to Watch">Where to Watch</SelectItem>
                    <SelectItem value="Cricket API">Cricket API</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="environment">Environment</Label>
                <Select value={newKeyEnvironment} onValueChange={(value) => setNewKeyEnvironment(value as any)}>
                  <SelectTrigger id="environment">
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="testing">Testing</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Permissions</Label>
              <div className="flex flex-wrap gap-4 pt-1">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="read-permission"
                    checked={newKeyPermissions.includes("read")}
                    onCheckedChange={() => togglePermission("read")}
                  />
                  <Label htmlFor="read-permission" className="cursor-pointer">
                    Read
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="write-permission"
                    checked={newKeyPermissions.includes("write")}
                    onCheckedChange={() => togglePermission("write")}
                  />
                  <Label htmlFor="write-permission" className="cursor-pointer">
                    Write
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="admin-permission"
                    checked={newKeyPermissions.includes("admin")}
                    onCheckedChange={() => togglePermission("admin")}
                  />
                  <Label htmlFor="admin-permission" className="cursor-pointer">
                    Admin
                  </Label>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Select the permissions for this API key.</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expiration">Expiration</Label>
              <Select value={newKeyExpiration} onValueChange={(value) => setNewKeyExpiration(value as any)}>
                <SelectTrigger id="expiration">
                  <SelectValue placeholder="Select expiration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="90days">90 Days</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="never">Never Expires</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Choose when this API key should expire.</p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-md p-3 flex items-start space-x-3">
              <Shield className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-500">Security Notice</h4>
                <p className="text-xs text-amber-500/90 mt-1">
                  API keys grant access to your account and services. Keep them secure and never share them in public
                  repositories or client-side code. The API key will only be displayed once upon creation.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createNewApiKey}>Create API Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke API Key Dialog */}
      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Revoke API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke this API key? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-destructive/10 border border-destructive/30 rounded-md p-3 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-destructive">Warning</h4>
                <p className="text-xs text-destructive/90 mt-1">
                  Revoking this API key will immediately invalidate it. Any services using this key will no longer be
                  able to authenticate.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRevokeDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={revokeApiKey}>
              Revoke Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
