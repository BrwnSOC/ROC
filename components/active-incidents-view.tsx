"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Search, RefreshCw, AlertTriangle, Clock, Play, CheckCircle, TrendingUp } from "lucide-react"

interface ActiveIncident {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "in-progress"
  type: string
  assignedTo: string
  reporter: string
  timestamp: string
  lastUpdated: string
  tags: string[]
  priority: number
  responseTime: string
}

const mockActiveIncidents: ActiveIncident[] = [
  {
    id: "INC-2025-001",
    title: "Phishing Email Campaign Detected",
    description: "Large-scale phishing campaign targeting finance department with credential harvesting attempts.",
    severity: "critical",
    status: "open",
    type: "Phishing",
    assignedTo: "Alex B.",
    reporter: "Email Security System",
    timestamp: "2025-08-14 14:22",
    lastUpdated: "2025-08-14 14:22",
    tags: ["email", "credentials", "finance", "campaign"],
    priority: 1,
    responseTime: "2m",
  },
  {
    id: "INC-2025-002",
    title: "Ransomware Activity on Endpoints",
    description: "Active ransomware encryption detected on multiple endpoints in marketing department.",
    severity: "critical",
    status: "in-progress",
    type: "Malware",
    assignedTo: "Dana W.",
    reporter: "EDR System",
    timestamp: "2025-08-14 13:05",
    lastUpdated: "2025-08-14 14:15",
    tags: ["ransomware", "endpoints", "marketing", "encryption"],
    priority: 1,
    responseTime: "1h 17m",
  },
  {
    id: "INC-2025-003",
    title: "Suspicious Network Traffic Patterns",
    description: "Unusual outbound traffic patterns detected from internal servers to unknown external IPs.",
    severity: "high",
    status: "open",
    type: "Network Intrusion",
    assignedTo: "Mike R.",
    reporter: "Network Monitor",
    timestamp: "2025-08-14 12:45",
    lastUpdated: "2025-08-14 12:45",
    tags: ["network", "traffic", "servers", "exfiltration"],
    priority: 2,
    responseTime: "1h 37m",
  },
  {
    id: "INC-2025-004",
    title: "Privilege Escalation Attempt",
    description: "Multiple failed privilege escalation attempts detected on domain controller.",
    severity: "high",
    status: "in-progress",
    type: "Privilege Escalation",
    assignedTo: "Sarah L.",
    reporter: "Active Directory Monitor",
    timestamp: "2025-08-14 11:30",
    lastUpdated: "2025-08-14 13:45",
    tags: ["privilege", "domain", "controller", "escalation"],
    priority: 2,
    responseTime: "2h 52m",
  },
]

const statusConfig = {
  open: { color: "text-red-500", bg: "bg-red-500/10", icon: AlertTriangle, label: "Open" },
  "in-progress": { color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Clock, label: "In Progress" },
}

const severityConfig = {
  critical: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
  high: { color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  medium: { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  low: { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
}

export function ActiveIncidentsView() {
  const [incidents, setIncidents] = useState<ActiveIncident[]>(mockActiveIncidents)
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("priority")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { toast } = useToast()

  const filteredIncidents = incidents
    .filter((incident) => {
      const matchesSearch =
        incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.type.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSeverity = severityFilter === "all" || incident.severity === severityFilter
      const matchesStatus = statusFilter === "all" || incident.status === statusFilter
      return matchesSearch && matchesSeverity && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "priority") return a.priority - b.priority
      if (sortBy === "timestamp") return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      if (sortBy === "severity") {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
        return severityOrder[a.severity] - severityOrder[b.severity]
      }
      return 0
    })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({
      title: "Incidents Refreshed",
      description: "Active incidents list has been updated.",
    })
  }

  const handleQuickAction = (action: string, incidentId: string) => {
    const incident = incidents.find((i) => i.id === incidentId)
    if (!incident) return

    let newStatus: "open" | "in-progress" | "resolved" = incident.status
    let message = ""

    switch (action) {
      case "start":
        newStatus = "in-progress"
        message = "Incident investigation started"
        break
      case "resolve":
        // Remove from active incidents by filtering out
        setIncidents((prev) => prev.filter((i) => i.id !== incidentId))
        message = "Incident marked as resolved"
        toast({ title: "Incident Resolved", description: message })
        return
      case "escalate":
        message = "Incident escalated to senior analyst"
        break
    }

    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incidentId
          ? { ...i, status: newStatus, lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " ") }
          : i,
      ),
    )

    toast({
      title: "Action Completed",
      description: message,
    })
  }

  const criticalCount = incidents.filter((i) => i.severity === "critical").length
  const highCount = incidents.filter((i) => i.severity === "high").length
  const openCount = incidents.filter((i) => i.status === "open").length
  const inProgressCount = incidents.filter((i) => i.status === "in-progress").length

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-500">{criticalCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-orange-500">{highCount}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open</p>
                <p className="text-2xl font-bold text-red-500">{openCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-yellow-500">{inProgressCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search active incidents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
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
                <SelectItem value="timestamp">Created</SelectItem>
                <SelectItem value="severity">Severity</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Incidents List */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Active Incidents ({filteredIncidents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredIncidents.map((incident) => {
              const StatusIcon = statusConfig[incident.status].icon
              const severityStyle = severityConfig[incident.severity]

              return (
                <div
                  key={incident.id}
                  className={`p-4 rounded-lg border ${severityStyle.border} bg-muted/20 hover:bg-muted/30 transition-colors`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{incident.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {incident.id}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <StatusIcon className={`h-4 w-4 ${statusConfig[incident.status].color}`} />
                          <span className="capitalize">{statusConfig[incident.status].label}</span>
                        </div>

                        <Badge variant="outline" className={`${severityStyle.color} ${severityStyle.border}`}>
                          {incident.severity.toUpperCase()}
                        </Badge>

                        <span className="text-muted-foreground">{incident.type}</span>
                        <span className="text-muted-foreground">Response Time: {incident.responseTime}</span>
                        <span className="text-muted-foreground">Assigned to {incident.assignedTo}</span>
                      </div>

                      {incident.tags.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap mt-2">
                          {incident.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {incident.status === "open" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickAction("start", incident.id)}
                          className="gap-1"
                        >
                          <Play className="h-3 w-3" />
                          Start
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickAction("resolve", incident.id)}
                        className="gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickAction("escalate", incident.id)}
                        className="gap-1"
                      >
                        <TrendingUp className="h-3 w-3" />
                        Escalate
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}

            {filteredIncidents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active incidents match your current filters.</p>
                <p className="text-sm">All incidents may be resolved or closed.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
