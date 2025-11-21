"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, ChevronDown, ChevronUp, Zap, Database, Lock, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function IntegrationInfo() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl flex items-center">
                <Zap className="h-5 w-5 mr-2 text-primary" />
                External Analytics Integration
              </CardTitle>
              <CardDescription>
                Connect with external analytics platforms (MCP) for enhanced data visualization and insights
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/10">
              Coming Soon
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Unified Data Source</h3>
                <p className="text-sm text-muted-foreground">
                  Combine Siddu platform data with external analytics for comprehensive insights
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Real-time Synchronization</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically sync data between Siddu and external analytics platforms
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Secure Data Transfer</h3>
                <p className="text-sm text-muted-foreground">
                  End-to-end encryption ensures your analytics data remains secure
                </p>
              </div>
            </div>
          </div>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-4"
            >
              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">Supported Integration Platforms</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "Google Analytics",
                    "Mixpanel",
                    "Amplitude",
                    "Segment",
                    "Looker",
                    "Tableau",
                    "Power BI",
                    "Custom API",
                  ].map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-gray-400" />
                      <span className="text-sm">{platform}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">Integration Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm">Phase 1: API Development</span>
                    </div>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-gray-400" />
                      <span className="text-sm">Phase 2: Data Mapping</span>
                    </div>
                    <Badge variant="outline">Q3 2025</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-gray-400" />
                      <span className="text-sm">Phase 3: Full Integration</span>
                    </div>
                    <Badge variant="outline">Q4 2025</Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                <span>Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                <span>Learn More</span>
              </>
            )}
          </Button>
          <Button size="sm">
            <span>Request Early Access</span>
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
