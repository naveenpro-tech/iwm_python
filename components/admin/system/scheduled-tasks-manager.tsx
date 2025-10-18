"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  Play,
  Pause,
  RefreshCw,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowUpDown,
  Search,
  Filter,
  Edit,
  Code,
  RotateCcw,
  Eye,
} from "lucide-react"

// Mock scheduled tasks
const scheduledTasks = [
  {
    id: "task_001",
    name: "Database Backup",
    description: "Create a full backup of the database",
    schedule: "0 4 * * *", // Every day at 4 AM
    lastRun: "2024-05-25 04:00:00",
    nextRun: "2024-05-26 04:00:00",
    status: "active",
    lastStatus: "success",
    type: "system",
    duration: "00:05:32",
  },
  {
    id: "task_002",
    name: "Cache Purge",
    description: "Clear expired cache entries",
    schedule: "0 3 * * *", // Every day at 3 AM
    lastRun: "2024-05-25 03:00:00",
    nextRun: "2024-05-26 03:00:00",
    status: "active",
    lastStatus: "success",
    type: "system",
    duration: "00:01:15",
  },
  {
    id: "task_003",
    name: "Weekly Analytics Report",
    description: "Generate and email weekly analytics report",
    schedule: "0 9 * * 1", // Every Monday at 9 AM
    lastRun: "2024-05-20 09:00:00",
    nextRun: "2024-05-27 09:00:00",
    status: "active",
    lastStatus: "success",
    type: "report",
    duration: "00:03:45",
  },
  {
    id: "task_004",
    name: "User Engagement Metrics",
    description: "Calculate and store user engagement metrics",
    schedule: "0 2 * * *", // Every day at 2 AM
    lastRun: "2024-05-25 02:00:00",
    nextRun: "2024-05-26 02:00:00",
    status: "active",
    lastStatus: "success",
    type: "analytics",
    duration: "00:08:22",
  },
  {
    id: "task_005",
    name: "Content Recommendation Update",
    description: "Update content recommendation algorithms",
    schedule: "0 1 * * *", // Every day at 1 AM
    lastRun: "2024-05-25 01:00:00",
    nextRun: "2024-05-26 01:00:00",
    status: "active",
    lastStatus: "warning",
    type: "content",
    duration: "00:12:05",
  },
  {
    id: "task_006",
    name: "Inactive User Notification",
    description: "Send notifications to inactive users",
    schedule: "0 10 * * 3", // Every Wednesday at 10 AM
    lastRun: "2024-05-22 10:00:00",
    nextRun: "2024-05-29 10:00:00",
    status: "paused",
    lastStatus: "success",
    type: "notification",
    duration: "00:04:18",
  },
  {
    id: "task_007",
    name: "Database Optimization",
    description: "Run database optimization and cleanup",
    schedule: "0 2 * * 0", // Every Sunday at 2 AM
    lastRun: "2024-05-19 02:00:00",
    nextRun: "2024-05-26 02:00:00",
    status: "active",
    lastStatus: "failed",
    type: "system",
    duration: "00:15:42",
  },
]

// Mock task execution logs
const taskLogs = [
  {
    id: "log_001",
    taskId: "task_001",
    taskName: "Database Backup",
    startTime: "2024-05-25 04:00:00",
    endTime: "2024-05-25 04:05:32",
    status: "success",
    output: "Backup completed successfully. Size: 2.8 GB",
  },
  {
    id: "log_002",
    taskId: "task_002",
    taskName: "Cache Purge",
    startTime: "2024-05-25 03:00:00",
    endTime: "2024-05-25 03:01:15",
    status: "success",
    output: "Cleared 12,458 expired cache entries",
  },
  {
    id: "log_003",
    taskId: "task_005",
    taskName: "Content Recommendation Update",
    startTime: "2024-05-25 01:00:00",
    endTime: "2024-05-25 01:12:05",
    status: "warning",
    output: "Update completed with warnings. Some user preferences could not be processed.",
  },
  {
    id: "log_004",
    taskId: "task_007",
    taskName: "Database Optimization",
    startTime: "2024-05-19 02:00:00",
    endTime: "2024-05-19 02:15:42",
    status: "failed",
    output: "Error: Optimization failed due to insufficient disk space. Please free up space and try again.",
  },
  {
    id: "log_005",
    taskId: "task_003",
    taskName: "Weekly Analytics Report",
    startTime: "2024-05-20 09:00:00",
    endTime: "2024-05-20 09:03:45",
    status: "success",
    output: "Report generated and sent to 5 recipients",
  },
]

export function ScheduledTasksManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [selectedLog, setSelectedLog] = useState<any>(null)
  const [isRunningTask, setIsRunningTask] = useState(false)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleViewLog = (task: any) => {
    setSelectedTask(task)
    const taskLogs = getTaskLogs(task.id)
    setSelectedLog(taskLogs.length > 0 ? taskLogs[0] : null)
    setIsLogDialogOpen(true)
  }

  const handleRunTask = (task: any) => {
    setIsRunningTask(true)
    // Simulate running task
    setTimeout(() => {
      setIsRunningTask(false)
    }, 2000)
  }

  // Get logs for a specific task
  const getTaskLogs = (taskId: string) => {
    return taskLogs.filter((log) => log.taskId === taskId)
  }

  // Filter tasks based on search query and selected type
  const filteredTasks = scheduledTasks.filter((task) => {
    const matchesSearch = searchQuery
      ? task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchesType = selectedType ? task.type === selectedType : true
    return matchesSearch && matchesType
  })

  // Sort tasks based on sort column and direction
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Scheduled Tasks Manager
            </CardTitle>
            <CardDescription>Manage and monitor scheduled system tasks</CardDescription>
          </div>
          <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Scheduled Task</DialogTitle>
                <DialogDescription>Create a new scheduled task for the system.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="task-name">Task Name</Label>
                  <Input id="task-name" placeholder="e.g., Database Backup" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea
                    id="task-description"
                    placeholder="Describe the purpose of this task..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-type">Task Type</Label>
                  <Select>
                    <SelectTrigger id="task-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="notification">Notification</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-schedule">Schedule (Cron Expression)</Label>
                  <div className="flex gap-2">
                    <Input id="task-schedule" placeholder="e.g., 0 4 * * *" className="font-mono" />
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Builder
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Format: minute hour day-of-month month day-of-week</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-command">Command or Script</Label>
                  <Textarea
                    id="task-command"
                    placeholder="Enter command or script to execute..."
                    className="min-h-[100px] font-mono text-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="task-active">Active</Label>
                    <p className="text-sm text-muted-foreground">Enable this scheduled task</p>
                  </div>
                  <Switch id="task-active" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="task-logging">Enable Logging</Label>
                    <p className="text-sm text-muted-foreground">Store execution logs for this task</p>
                  </div>
                  <Switch id="task-logging" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="task-notifications">Failure Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications on task failure</p>
                  </div>
                  <Switch id="task-notifications" defaultChecked />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewTaskDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewTaskDialogOpen(false)}>Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedType(null)}
              className={selectedType === null ? "bg-primary text-primary-foreground" : ""}
            >
              All Types
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedType("system")}
              className={selectedType === "system" ? "bg-primary text-primary-foreground" : ""}
            >
              System
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedType("analytics")}
              className={selectedType === "analytics" ? "bg-primary text-primary-foreground" : ""}
            >
              Analytics
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedType("report")}
              className={selectedType === "report" ? "bg-primary text-primary-foreground" : ""}
            >
              Reports
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            Advanced Filter
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                  <div className="flex items-center">
                    Name
                    {sortColumn === "name" && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("schedule")}>
                  <div className="flex items-center">
                    Schedule
                    {sortColumn === "schedule" && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("lastRun")}>
                  <div className="flex items-center">
                    Last Run
                    {sortColumn === "lastRun" && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("nextRun")}>
                  <div className="flex items-center">
                    Next Run
                    {sortColumn === "nextRun" && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                  <div className="flex items-center">
                    Status
                    {sortColumn === "status" && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("lastStatus")}>
                  <div className="flex items-center">
                    Last Result
                    {sortColumn === "lastStatus" && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("duration")}>
                  <div className="flex items-center">
                    Duration
                    {sortColumn === "duration" && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.map((task, index) => (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <TableCell className="font-medium">
                    <div>
                      {task.name}
                      <div className="text-xs text-muted-foreground">{task.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted rounded px-2 py-1">{task.schedule}</code>
                  </TableCell>
                  <TableCell>{task.lastRun}</TableCell>
                  <TableCell>{task.nextRun}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        task.status === "active" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                      }
                    >
                      {task.status === "active" ? (
                        <Play className="h-3 w-3 mr-1" />
                      ) : (
                        <Pause className="h-3 w-3 mr-1" />
                      )}
                      {task.status === "active" ? "Active" : "Paused"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        task.lastStatus === "success"
                          ? "bg-green-500/10 text-green-500"
                          : task.lastStatus === "warning"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-red-500/10 text-red-500"
                      }
                    >
                      {task.lastStatus === "success" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : task.lastStatus === "warning" ? (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {task.lastStatus.charAt(0).toUpperCase() + task.lastStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                      {task.duration}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleRunTask(task)} disabled={isRunningTask}>
                        {isRunningTask ? (
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4 mr-1" />
                        )}
                        Run
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleViewLog(task)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Logs
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
          {selectedTask && (
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Task Logs: {selectedTask.name}</DialogTitle>
                <DialogDescription>View execution logs for this scheduled task.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Schedule</div>
                    <code className="text-xs bg-muted rounded px-2 py-1">{selectedTask.schedule}</code>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Type</div>
                    <Badge variant="outline">
                      {selectedTask.type.charAt(0).toUpperCase() + selectedTask.type.slice(1)}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge
                      variant="outline"
                      className={
                        selectedTask.status === "active"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-amber-500/10 text-amber-500"
                      }
                    >
                      {selectedTask.status === "active" ? "Active" : "Paused"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Recent Executions</div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Start Time</TableHead>
                          <TableHead>End Time</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getTaskLogs(selectedTask.id).map((log) => (
                          <TableRow key={log.id} className="cursor-pointer" onClick={() => setSelectedLog(log)}>
                            <TableCell>{log.startTime}</TableCell>
                            <TableCell>{log.endTime}</TableCell>
                            <TableCell>
                              {new Date(new Date(log.endTime).getTime() - new Date(log.startTime).getTime())
                                .toISOString()
                                .substr(11, 8)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  log.status === "success"
                                    ? "bg-green-500/10 text-green-500"
                                    : log.status === "warning"
                                      ? "bg-amber-500/10 text-amber-500"
                                      : "bg-red-500/10 text-red-500"
                                }
                              >
                                {log.status === "success" ? (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                ) : log.status === "warning" ? (
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                ) : (
                                  <XCircle className="h-3 w-3 mr-1" />
                                )}
                                {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Retry
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {selectedLog && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Execution Output</div>
                    <div className="p-4 rounded-md bg-muted/50 font-mono text-sm whitespace-pre-wrap">
                      {selectedLog.output}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="text-sm font-medium">Task Command</div>
                  <div className="p-4 rounded-md bg-muted/50 font-mono text-sm">
                    {`#!/bin/bash\n\n# Example command for ${selectedTask.name}\necho "Starting ${selectedTask.name}..."\n\n# Task-specific commands would go here\n\necho "Task completed successfully."`}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsLogDialogOpen(false)}>
                  Close
                </Button>
                <Button>
                  <Code className="h-4 w-4 mr-1" />
                  Edit Task
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </CardContent>
    </Card>
  )
}
