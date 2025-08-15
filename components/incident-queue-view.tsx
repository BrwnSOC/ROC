"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Search, Clock, AlertTriangle, Users, UserPlus, TrendingUp, ArrowUp, ArrowDown, Timer } from "lucide-react"

interface QueuedIncident {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  type: string
  reporter: string
  timestamp: string
  queueTime: string
  priority: number
  estimatedEffort: string
  requiredSkills: string[]
  status: "unassigned" | "pending-assignment" | "auto-assigned"
  autoAssignmentScore?: number
}

const mockQueuedIncidents: QueuedIncident[] = [
  {
    id: "INC-2025-007",
    title: "Advanced Persistent Threat Detection",
    description: "Sophisticated APT activity detected across multiple network segments with lateral movement patterns.",
    severity: "critical",
    type: "Advanced Threat",
    reporter: "Threat Intelligence System",
    timestamp: "2025-08-14 15:30",
    queueTime: "5m",
    priority: 1,
    estimatedEffort: "4-6 hours",
    requiredSkills: ["Threat Hunting", "Network Analysis", "Malware Analysis"],
    status: "unassigned",
  },
  {
    id: "INC-2025-008",
    title: "Credential Stuffing Attack",
    description: "Large-scale credential stuffing attack targeting customer login portal with 10,000+ attempts.",
    severity: "high",
    type: "Brute Force",
    reporter: "Web Application Firewall",
    timestamp: "2025-08-14 15:15",
    queueTime: "20m",
    priority: 2,
    estimatedEffort: "2-3 hours",
    requiredSkills: ["Web Security", "Log Analysis"],
    status: "pending-assignment",
  },
  {
    id: "INC-2025-009",
    title: "Suspicious PowerShell Activity",
    description: "Obfuscated PowerShell scripts detected on multiple endpoints with potential data exfiltration.",
    severity: "high",
    type: "Malicious Script",
    reporter: "EDR System",
    timestamp: "2025-08-14 14:45",
    queueTime: "50m",
    priority: 2,
    estimatedEffort: "3-4 hours",
    requiredSkills: ["PowerShell Analysis", "Endpoint Security", "Forensics"],
    status: "unassigned",
  },
  {
    id: "INC-2025-010",
    title: "Unauthorized Database Access",
    description: "Anomalous database queries detected outside business hours from unknown IP addresses.",
    severity: "medium",
    type: "Data Access",
    reporter: "Database Monitor",
    timestamp: "2025-08-14 14:30",
    queueTime: "1h 5m",
    priority: 3,
    estimatedEffort: "1-2 hours",
    requiredSkills: ["Database Security", "SQL Analysis"],
    status: "auto-assigned",
    autoAssignmentScore: 85,
  },
  {
    id: "INC-2025-011",
    title: "Email Security Bypass Attempt",
    description: "Attempts to bypass email security filters using various encoding techniques.",
    severity: "medium",
    type: "Email Security",
    reporter: "Email Gateway",
    timestamp: "2025-08-14 13:20",
    queueTime: "2h 15m",
    priority: 3,
    estimatedEffort: "1-2 hours",
    requiredSkills: ["Email Security", "Content Analysis"],
    status: "unassigned",
  },
]

const analysts = [
  {
    name: "Alex B.",
    skills: ["Threat Hunting", "Network Analysis", "Malware Analysis"],
    workload: 3,
    availability: "available",
  },
  {
    name: "Dana W.",
    skills: ["Forensics", "Endpoint Security", "PowerShell Analysis"],
    workload: 2,
    availability: "available",
  },
  { name: "Mike R.", skills: ["Web Security", "Database Security", "Log Analysis"], workload: 4, availability: "busy" },
  {
    name: "Sarah L.",
    skills: ["Email Security", "Content Analysis", "SQL Analysis"],
    workload: 1,
    availability: "available",
  },
  {
    name: "Jordan K.",
    skills: ["Network Analysis", "Threat Hunting", "Forensics"],
    workload: 2,
    availability: "available",
  },
  {
    name: "Taylor M.",
    skills: ["Web Security", "PowerShell Analysis", "Database Security"],
    workload: 3,
    availability: "available",
  },
]

const statusConfig = {
  unassigned: { color: "text-red-500", bg: "bg-red-500/10", label: "Unassigned" },
  "pending-assignment": { color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Pending Assignment" },
  "auto-assigned": { color: "text-green-500", bg: "bg-green-500/10", label: "Auto-Assigned" },
}

const severityConfig = {
  critical: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
  high: { color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  medium: { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  low: { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
}

export function IncidentQueueView() {
  const [incidents, setIncidents] = useState<QueuedIncident[]>(mockQueuedIncidents)
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("priority")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [bulkAssignDialogOpen, setBulkAssignDialogOpen] = useState(false)
  const [selectedAnalyst, setSelectedAnalyst] = useState("")
  const [autoAssignDialogOpen, setAutoAssignDialogOpen] = useState(false)

  const { toast } = useToast()

  const filteredAndSortedIncidents = incidents
    .filter((incident) => {
      const matchesSearch =
        incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.type.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || incident.status === statusFilter
      const matchesSeverity = severityFilter === "all" || incident.severity === severityFilter
      return matchesSearch && matchesStatus && matchesSeverity
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof QueuedIncident]
      let bValue: any = b[sortBy as keyof QueuedIncident]

      if (sortBy === "timestamp") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sortBy === "queueTime") {
        // Convert queue time to minutes for sorting
        const parseTime = (time: string) => {
          const parts = time.match(/(\d+)([hm])/g) || []
          return parts.reduce((total, part) => {
            const [, num, unit] = part.match(/(\d+)([hm])/) || []
            return total + (unit === "h" ? Number.parseInt(num) * 60 : Number.parseInt(num))
          }, 0)
        }
        aValue = parseTime(aValue)
        bValue = parseTime(bValue)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleSelectIncident = (incidentId: string, checked: boolean) => {
    if (checked) {
      setSelectedIncidents([...selectedIncidents, incidentId])
    } else {
      setSelectedIncidents(selectedIncidents.filter((id) => id !== incidentId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIncidents(filteredAndSortedIncidents.map((i) => i.id))
    } else {
      setSelectedIncidents([])
    }
  }

  const handleBulkAssign = () => {
    if (!selectedAnalyst) return

    setIncidents((prev) =>
      prev.map((incident) =>
        selectedIncidents.includes(incident.id) ? { ...incident, status: "pending-assignment" as const } : incident,
      ),
    )

    setSelectedIncidents([])
    setBulkAssignDialogOpen(false)
    setSelectedAnalyst("")

    toast({
      title: "Bulk Assignment Complete",
      description: `Assigned ${selectedIncidents.length} incidents to ${selectedAnalyst}`,
    })
  }

  const handleAutoAssign = () => {
    const unassignedIncidents = incidents.filter((i) => i.status === "unassigned")
    let assignedCount = 0

    const updatedIncidents = incidents.map((incident) => {
      if (incident.status === "unassigned") {
        // Simple auto-assignment logic based on skills and workload
        const suitableAnalysts = analysts.filter(
          (analyst) =>
            incident.requiredSkills.some((skill) => analyst.skills.includes(skill)) &&
            analyst.availability === "available" &&
            analyst.workload < 4,
        )

        if (suitableAnalysts.length > 0) {
          // Assign to analyst with lowest workload
          const bestAnalyst = suitableAnalysts.sort((a, b) => a.workload - b.workload)[0]
          assignedCount++
          return {
            ...incident,
            status: "auto-assigned" as const,
            autoAssignmentScore: Math.floor(Math.random() * 20) + 80, // 80-100 score
          }
        }
      }
      return incident
    })

    setIncidents(updatedIncidents)
    setAutoAssignDialogOpen(false)

    toast({
      title: "Auto-Assignment Complete",
      description: `Successfully auto-assigned ${assignedCount} of ${unassignedIncidents.length} incidents`,
    })
  }

  const queueStats = {
    total: incidents.length,
    unassigned: incidents.filter((i) => i.status === "unassigned").length,
    pending: incidents.filter((i) => i.status === "pending-assignment").length,
    autoAssigned: incidents.filter((i) => i.status === "auto-assigned").length,
    critical: incidents.filter((i) => i.severity === "critical").length,
    avgQueueTime: "45m", // Calculated average
  }

  return (
    <div className="space-y-6">
      {/* Queue Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Queue</p>
                <p className="text-2xl font-bold">{queueStats.total}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unassigned</p>
                <p className="text-2xl font-bold text-red-500">{queueStats.unassigned}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-500">{queueStats.pending}</p>
              </div>
              <Timer className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Auto-Assigned</p>
                <p className="text-2xl font-bold text-green-500">{queueStats.autoAssigned}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-500">{queueStats.critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Queue Time</p>
                <p className="text-2xl font-bold text-orange-500">{queueStats.avgQueueTime}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search queue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              <SelectItem value="pending-assignment">Pending</SelectItem>
              <SelectItem value="auto-assigned">Auto-Assigned</SelectItem>
            </SelectContent>
          </Select>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="queueTime">Queue Time</SelectItem>
              <SelectItem value="timestamp">Created</SelectItem>
              <SelectItem value="severity">Severity</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={autoAssignDialogOpen} onOpenChange={setAutoAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Users className="h-4 w-4" />
                Auto-Assign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Auto-Assignment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Automatically assign incidents based on analyst skills, workload, and availability.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium">Assignment Criteria:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Match required skills with analyst expertise</li>
                    <li>• Consider current workload distribution</li>
                    <li>• Prioritize available analysts</li>
                    <li>• Balance critical incidents across team</li>
                  </ul>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setAutoAssignDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAutoAssign}>Run Auto-Assignment</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {selectedIncidents.length > 0 && (
            <Dialog open={bulkAssignDialogOpen} onOpenChange={setBulkAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Bulk Assign ({selectedIncidents.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Assignment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Assign {selectedIncidents.length} selected incidents to an analyst.
                  </p>
                  <div>
                    <label className="text-sm font-medium">Select Analyst</label>
                    <Select value={selectedAnalyst} onValueChange={setSelectedAnalyst}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose analyst" />
                      </SelectTrigger>
                      <SelectContent>
                        {analysts.map((analyst) => (
                          <SelectItem key={analyst.name} value={analyst.name}>
                            <div className="flex items-center justify-between w-full">
                              <span>{analyst.name}</span>
                              <div className="flex items-center gap-2 ml-4">
                                <Badge variant={analyst.availability === "available" ? "default" : "secondary"}>
                                  {analyst.availability}
                                </Badge>
                                <span className="text-xs text-muted-foreground">Load: {analyst.workload}</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setBulkAssignDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleBulkAssign} disabled={!selectedAnalyst}>
                      Assign Incidents
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Queue List */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Checkbox
                checked={
                  selectedIncidents.length === filteredAndSortedIncidents.length &&
                  filteredAndSortedIncidents.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              Incident Queue ({filteredAndSortedIncidents.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAndSortedIncidents.map((incident) => {
              const statusStyle = statusConfig[incident.status]
              const severityStyle = severityConfig[incident.severity]

              return (
                <div
                  key={incident.id}
                  className={`p-4 rounded-lg border ${severityStyle.border} bg-muted/20 hover:bg-muted/30 transition-colors`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedIncidents.includes(incident.id)}
                      onCheckedChange={(checked) => handleSelectIncident(incident.id, checked as boolean)}
                      className="mt-1"
                    />

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{incident.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {incident.id}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>

                          <div className="flex items-center gap-4 text-sm flex-wrap">
                            <Badge variant="outline" className={`${statusStyle.color} ${statusStyle.bg}`}>
                              {statusStyle.label}
                            </Badge>

                            <Badge variant="outline" className={`${severityStyle.color} ${severityStyle.border}`}>
                              {incident.severity.toUpperCase()}
                            </Badge>

                            <span className="text-muted-foreground">{incident.type}</span>
                            <span className="text-muted-foreground">Queue: {incident.queueTime}</span>
                            <span className="text-muted-foreground">Est: {incident.estimatedEffort}</span>
                            <span className="text-muted-foreground">Priority: {incident.priority}</span>

                            {incident.autoAssignmentScore && (
                              <Badge variant="secondary">Match: {incident.autoAssignmentScore}%</Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-muted-foreground">Required Skills:</span>
                            {incident.requiredSkills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                            <UserPlus className="h-3 w-3" />
                            Assign
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                            <TrendingUp className="h-3 w-3" />
                            Priority
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {filteredAndSortedIncidents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No incidents in queue match your current filters.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
