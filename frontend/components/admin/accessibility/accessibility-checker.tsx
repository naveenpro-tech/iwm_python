"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Eye,
  Lightbulb,
  FileText,
  Accessibility,
  Smartphone,
  Monitor,
  Palette,
  Type,
  MousePointer,
  Keyboard,
  Code,
} from "lucide-react"

// Mock accessibility issues
const mockIssues = [
  {
    id: "a11y-1",
    type: "error",
    rule: "color-contrast",
    element: '<button class="text-gray-400 bg-gray-100">Submit</button>',
    description: "Insufficient color contrast (2.8:1) between text and background",
    impact: "high",
    location: "/movies/page.tsx",
    line: 42,
    recommendation: "Increase the contrast ratio to at least 4.5:1 for normal text",
  },
  {
    id: "a11y-2",
    type: "error",
    rule: "aria-hidden-focus",
    element: '<div aria-hidden="true"><button>Close</button></div>',
    description: 'Interactive element with aria-hidden="true" must not be focusable',
    impact: "high",
    location: "/components/modal.tsx",
    line: 23,
    recommendation: "Remove the interactive element from the aria-hidden container or remove aria-hidden",
  },
  {
    id: "a11y-3",
    type: "warning",
    rule: "heading-order",
    element: "<h3>Section Title</h3>",
    description: "Heading levels should only increase by one",
    impact: "moderate",
    location: "/components/section.tsx",
    line: 15,
    recommendation: "Use h2 instead of h3 to maintain proper heading hierarchy",
  },
  {
    id: "a11y-4",
    type: "warning",
    rule: "label",
    element: '<input type="text" placeholder="Search" />',
    description: "Form element does not have an associated label",
    impact: "moderate",
    location: "/components/search-input.tsx",
    line: 8,
    recommendation: "Add a label element associated with the input or use aria-label",
  },
  {
    id: "a11y-5",
    type: "notice",
    rule: "alt-text",
    element: '<img src="/poster.jpg" alt="Movie poster" />',
    description: "Image alt text is generic and may not be descriptive enough",
    impact: "low",
    location: "/components/movie-card.tsx",
    line: 12,
    recommendation: "Provide more specific alt text that describes the image content",
  },
  {
    id: "a11y-6",
    type: "notice",
    rule: "landmark",
    element: '<div class="sidebar">...</div>',
    description: "Page contains content outside of landmarks",
    impact: "low",
    location: "/components/layout.tsx",
    line: 31,
    recommendation: "Wrap content in appropriate landmark regions (e.g., <nav>, <main>, <aside>)",
  },
]

// Mock accessibility score
const mockScore = {
  overall: 78,
  categories: {
    perceivable: 85,
    operable: 72,
    understandable: 90,
    robust: 65,
  },
  breakdown: {
    errors: 2,
    warnings: 2,
    notices: 2,
  },
}

export function AccessibilityChecker() {
  const [isChecking, setIsChecking] = useState(false)
  const [activeTab, setActiveTab] = useState("issues")
  const [urlToCheck, setUrlToCheck] = useState("/admin/dashboard")
  const [issues, setIssues] = useState(mockIssues)
  const [score, setScore] = useState(mockScore)
  const [filter, setFilter] = useState<"all" | "error" | "warning" | "notice">("all")

  // Run accessibility check
  const runCheck = () => {
    setIsChecking(true)

    // Simulate API call delay
    setTimeout(() => {
      setIsChecking(false)
      // In a real app, this would fetch real results
    }, 2000)
  }

  // Get filtered issues
  const getFilteredIssues = () => {
    if (filter === "all") return issues
    return issues.filter((issue) => issue.type === filter)
  }

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-amber-500"
    return "text-red-500"
  }

  // Get progress color
  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 70) return "bg-amber-500"
    return "bg-red-500"
  }

  // Get issue icon
  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "notice":
        return <Lightbulb className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accessibility Checker</CardTitle>
        <CardDescription>Analyze and improve accessibility compliance across the platform</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Enter URL to check (e.g., /admin/dashboard)"
              value={urlToCheck}
              onChange={(e) => setUrlToCheck(e.target.value)}
              className="pr-20"
            />
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUrlToCheck(window.location.pathname)}
                className="h-7 px-2 text-xs"
              >
                Current Page
              </Button>
            </div>
          </div>
          <Button onClick={runCheck} disabled={isChecking}>
            {isChecking ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Accessibility className="h-4 w-4 mr-2" />
                Check Accessibility
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:col-span-2"
          >
            <Tabs defaultValue="issues" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="issues">
                  Issues
                  <Badge variant="secondary" className="ml-1">
                    {issues.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="code">Code View</TabsTrigger>
              </TabsList>

              <TabsContent value="issues" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant={filter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={filter === "error" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("error")}
                      className={filter === "error" ? "" : "text-red-500"}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Errors ({issues.filter((i) => i.type === "error").length})
                    </Button>
                    <Button
                      variant={filter === "warning" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("warning")}
                      className={filter === "warning" ? "" : "text-amber-500"}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Warnings ({issues.filter((i) => i.type === "warning").length})
                    </Button>
                    <Button
                      variant={filter === "notice" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("notice")}
                      className={filter === "notice" ? "" : "text-blue-500"}
                    >
                      <Lightbulb className="h-4 w-4 mr-1" />
                      Notices ({issues.filter((i) => i.type === "notice").length})
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {getFilteredIssues().map((issue, index) => (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">{getIssueIcon(issue.type)}</div>
                              <div>
                                <div className="font-medium">{issue.rule}</div>
                                <div className="text-sm text-muted-foreground">{issue.description}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  <span className="font-mono">{issue.location}</span>
                                  <span className="mx-1">•</span>
                                  <span>Line {issue.line}</span>
                                </div>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                issue.impact === "high"
                                  ? "text-red-500"
                                  : issue.impact === "moderate"
                                    ? "text-amber-500"
                                    : "text-blue-500"
                              }
                            >
                              {issue.impact} impact
                            </Badge>
                          </div>

                          <div className="mt-3 p-2 bg-muted/50 rounded-md font-mono text-xs overflow-x-auto">
                            {issue.element}
                          </div>

                          <div className="mt-3 flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5" />
                            <div className="text-sm">{issue.recommendation}</div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  {getFilteredIssues().length === 0 && (
                    <div className="py-8 text-center border rounded-md">
                      <div className="inline-block p-3 rounded-full bg-muted">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="mt-2 text-sm font-medium">No issues found</p>
                      <p className="text-xs text-muted-foreground">
                        {filter === "all" ? "Great job! No accessibility issues detected." : `No ${filter}s found.`}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-3">Recommended Improvements</h3>
                    <div className="space-y-4">
                      <div className="p-3 border rounded-md">
                        <div className="flex items-center gap-2 font-medium mb-2">
                          <Palette className="h-4 w-4 text-purple-500" />
                          <span>Color Contrast</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Ensure sufficient contrast between text and background colors. Use the WCAG 2.1 AA standard
                          (4.5:1 for normal text, 3:1 for large text).
                        </p>
                        <div className="text-xs bg-muted/50 p-2 rounded-md font-mono">
                          {`// Instead of\n<button className="text-gray-400 bg-gray-100">Submit</button>\n\n// Use\n<button className="text-gray-900 bg-gray-100">Submit</button>`}
                        </div>
                      </div>

                      <div className="p-3 border rounded-md">
                        <div className="flex items-center gap-2 font-medium mb-2">
                          <Type className="h-4 w-4 text-blue-500" />
                          <span>Heading Structure</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Maintain proper heading hierarchy. Headings should increase by only one level at a time (h1,
                          then h2, then h3).
                        </p>
                        <div className="text-xs bg-muted/50 p-2 rounded-md font-mono">
                          {`// Instead of\n<h1>Page Title</h1>\n<h3>Section Title</h3>\n\n// Use\n<h1>Page Title</h1>\n<h2>Section Title</h2>`}
                        </div>
                      </div>

                      <div className="p-3 border rounded-md">
                        <div className="flex items-center gap-2 font-medium mb-2">
                          <MousePointer className="h-4 w-4 text-green-500" />
                          <span>Focus Indicators</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Ensure all interactive elements have visible focus indicators. Never use outline: none without
                          an alternative focus style.
                        </p>
                        <div className="text-xs bg-muted/50 p-2 rounded-md font-mono">
                          {`// Instead of\nbutton:focus {\n  outline: none;\n}\n\n// Use\nbutton:focus {\n  outline: 2px solid hsl(var(--primary));\n  outline-offset: 2px;\n}`}
                        </div>
                      </div>

                      <div className="p-3 border rounded-md">
                        <div className="flex items-center gap-2 font-medium mb-2">
                          <Keyboard className="h-4 w-4 text-amber-500" />
                          <span>Keyboard Navigation</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Ensure all interactive elements are keyboard accessible. Test navigation using Tab, Enter,
                          Space, and arrow keys.
                        </p>
                        <div className="text-xs bg-muted/50 p-2 rounded-md font-mono">
                          {`// Instead of\n<div onClick={handleClick}>Click me</div>\n\n// Use\n<button onClick={handleClick}>Click me</button>`}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code" className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium">Code View</h3>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Full Source
                        </Button>
                        <Button variant="outline" size="sm">
                          <Code className="h-4 w-4 mr-2" />
                          Fix Issues
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-muted/50 p-2 text-sm font-medium border-b">
                        {issues[0]?.location || "/components/example.tsx"}
                      </div>
                      <div className="p-3 font-mono text-xs overflow-x-auto whitespace-pre bg-muted/20 max-h-[300px]">
                        {`import React from "react";
import { Button } from "@/components/ui/button";

export function MovieCard({ title, poster, rating }) {
  return (
    <div className="movie-card">
      <div className="poster-container">
        <img src={poster || "/placeholder.svg"} alt="Movie poster" />
      </div>
      <div className="content">
        <h3>{title}</h3>
        <div className="rating">{rating}/10</div>
        <button className="text-gray-400 bg-gray-100">
          Add to Watchlist
        </button>
      </div>
    </div>
  );
}

export function MovieGrid({ movies }) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          title={movie.title}
          poster={movie.poster}
          rating={movie.rating}
        />
      ))}
    </div>
  );
}`}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Issues in this file:</h4>
                      <div className="space-y-2">
                        {issues.slice(0, 2).map((issue, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            {getIssueIcon(issue.type)}
                            <div>
                              <span className="font-medium">Line {issue.line}:</span> {issue.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Accessibility Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative h-32 w-32 flex items-center justify-center">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle
                        className="text-muted stroke-current"
                        strokeWidth="10"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className={`${getProgressColor(score.overall)} stroke-current`}
                        strokeWidth="10"
                        strokeLinecap="round"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        strokeDasharray={`${score.overall * 2.51} 251.2`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`text-4xl font-bold ${getScoreColor(score.overall)}`}>{score.overall}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {score.overall >= 90 ? "Excellent" : score.overall >= 70 ? "Good" : "Needs Improvement"}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">WCAG 2.1 Categories</h4>

                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Perceivable</span>
                        <span className={getScoreColor(score.categories.perceivable)}>
                          {score.categories.perceivable}%
                        </span>
                      </div>
                      <Progress
                        value={score.categories.perceivable}
                        className={getProgressColor(score.categories.perceivable)}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Operable</span>
                        <span className={getScoreColor(score.categories.operable)}>{score.categories.operable}%</span>
                      </div>
                      <Progress
                        value={score.categories.operable}
                        className={getProgressColor(score.categories.operable)}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Understandable</span>
                        <span className={getScoreColor(score.categories.understandable)}>
                          {score.categories.understandable}%
                        </span>
                      </div>
                      <Progress
                        value={score.categories.understandable}
                        className={getProgressColor(score.categories.understandable)}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Robust</span>
                        <span className={getScoreColor(score.categories.robust)}>{score.categories.robust}%</span>
                      </div>
                      <Progress value={score.categories.robust} className={getProgressColor(score.categories.robust)} />
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Device Compatibility</h4>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                      <div className="flex items-center">
                        <Monitor className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Desktop</span>
                      </div>
                      <Badge variant="outline" className="text-green-500">
                        Good
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                      <div className="flex items-center">
                        <Smartphone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Mobile</span>
                      </div>
                      <Badge variant="outline" className="text-amber-500">
                        Fair
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Screen Reader</span>
                      </div>
                      <Badge variant="outline" className="text-amber-500">
                        Fair
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                      <div className="flex items-center">
                        <Keyboard className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Keyboard</span>
                      </div>
                      <Badge variant="outline" className="text-red-500">
                        Poor
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Export Report
        </Button>
        <Button>
          <Accessibility className="h-4 w-4 mr-2" />
          Fix All Issues
        </Button>
      </CardFooter>
    </Card>
  )
}
