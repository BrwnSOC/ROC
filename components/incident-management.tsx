"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Plus,
  MoreHorizontal,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  ArrowRight,
} from "lucide-react"

interface Incident {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "in-progress" | "resolved" | "closed"
  type: string
  assignedTo: string
  reporter: string
  timestamp: string
  lastUpdated: string
  tags: string[]
  priority: number
}

const mockIncidents: Incident[] = [
  {
    id: "INC-2025-001",
    title: "Phishing Email Detected",
    description: "Suspicious email campaign targeting finance department with credential harvesting attempts.",
    severity: "critical",
    status: "open",
    type: "Phishing",
    assignedTo: "Alex B.",
    reporter: "System Alert",
    timestamp: "2025-08-14 14:22",
    lastUpdated: "2025-08-14 14:22",
    tags: ["email", "credentials", "finance"],
    priority: 1,
  },
  {
    id: "INC-2025-002",
    title: "Ransomware Activity",
    description: "Detected encryption activity on multiple endpoints in the marketing department.",
    severity: "critical",
    status: "in-progress",
    type: "Malware",
    assignedTo: "Dana W.",
    reporter: "EDR System",
    timestamp: "2025-08-14 13:05",
    lastUpdated: "2025-08-14 14:15",
    tags: ["ransomware", "endpoints", "marketing"],
    priority: 1,
  },
  {
    id: "INC-2025-003",
    title: "Suspicious Network Traffic",
    description: "Unusual outbound traffic patterns detected from internal servers.",
    severity: "high",
    status: "open",
    type: "Network Intrusion",
    assignedTo: "Mike R.",
    reporter: "Network Monitor",
    timestamp: "2025-08-14 12:45",
    lastUpdated: "2025-08-14 12:45",
    tags: ["network", "traffic", "servers"],
    priority: 2,
  },
]

const statusConfig = {
  open: { color: "text-red-500", bg: "bg-red-500/10", icon: AlertTriangle },
  "in-progress": { color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Clock },
  resolved: { color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle },
  closed: { color: "text-gray-500", bg: "bg-gray-500/10", icon: XCircle },
}

export function IncidentManagement() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents)
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("timestamp")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false)
  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    severity: "medium" as const,
    type: "",
    assignedTo: "",
    tags: "",
  })

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
      let aValue: any = a[sortBy as keyof Incident]
      let bValue: any = b[sortBy as keyof Incident]

      if (sortBy === "timestamp" || sortBy === "lastUpdated") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
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

  const handleCreateIncident = () => {
    const incident: Incident = {
      id: `INC-2025-${String(incidents.length + 1).padStart(3, "0")}`,
      title: newIncident.title,
      description: newIncident.description,
      severity: newIncident.severity,
      status: "open",
      type: newIncident.type,
      assignedTo: newIncident.assignedTo,
      reporter: "Manual Entry",
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
      tags: newIncident.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      priority: newIncident.severity === "critical" ? 1 : newIncident.severity === "high" ? 2 : 3,
    }

    setIncidents([incident, ...incidents])
    setCreateDialogOpen(false)
    setNewIncident({
      title: "",
      description: "",
      severity: "medium",
      type: "",
      assignedTo: "",
      tags: "",
    })

    toast({
      title: "Incident Created",
      description: `Incident ${incident.id} has been created successfully.`,
    })
  }

  const handleBulkStatusUpdate = (newStatus: string) => {
    setIncidents(
      incidents.map((incident) =>
        selectedIncidents.includes(incident.id)
          ? {
              ...incident,
              status: newStatus as any,
              lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
            }
          : incident,
      ),
    )
    setSelectedIncidents([])
    setBulkActionDialogOpen(false)

    toast({
      title: "Bulk Update Complete",
      description: `Updated ${selectedIncidents.length} incidents to ${newStatus} status.`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Incident Management</h3>
          <p className="text-muted-foreground">
            {filteredAndSortedIncidents.length} incidents • {selectedIncidents.length} selected
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Incident
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Incident</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newIncident.title}
                      onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                      placeholder="Incident title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Input
                      id="type"
                      value={newIncident.type}
                      onChange={(e) => setNewIncident({ ...newIncident, type: e.target.value })}
                      placeholder="e.g., Phishing, Malware"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newIncident.description}
                    onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                    placeholder="Detailed description of the incident"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="severity">Severity</Label>
                    <Select
                      value={newIncident.severity}
                      onValueChange={(value: any) => setNewIncident({ ...newIncident, severity: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Select
                      value={newIncident.assignedTo}
                      onValueChange={(value) => setNewIncident({ ...newIncident, assignedTo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select analyst" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alex B.">Alex B.</SelectItem>
                        <SelectItem value="Dana W.">Dana W.</SelectItem>
                        <SelectItem value="Mike R.">Mike R.</SelectItem>
                        <SelectItem value="Sarah L.">Sarah L.</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={newIncident.tags}
                      onChange={(e) => setNewIncident({ ...newIncident, tags: e.target.value })}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateIncident} disabled={!newIncident.title || !newIncident.description}>
                    Create Incident
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {selectedIncidents.length > 0 && (
            <Dialog open={bulkActionDialogOpen} onOpenChange={setBulkActionDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <MoreHorizontal className="h-4 w-4" />
                  Bulk Actions ({selectedIncidents.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Actions</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Apply actions to {selectedIncidents.length} selected incidents
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => handleBulkStatusUpdate("in-progress")}>
                      <Play className="h-4 w-4 mr-2" />
                      Mark In Progress
                    </Button>
                    <Button variant="outline" onClick={() => handleBulkStatusUpdate("resolved")}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Resolved
                    </Button>
                    <Button variant="outline" onClick={() => handleBulkStatusUpdate("closed")}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Close Incidents
                    </Button>
                    <Button variant="outline">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Bulk Assign
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="roc-border-glow bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search incidents..."
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
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
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
                <SelectItem value="timestamp">Created</SelectItem>
                <SelectItem value="lastUpdated">Updated</SelectItem>
                <SelectItem value="severity">Severity</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Incident List */}
      <Card className="roc-border-glow bg-card/50 backdrop-blur-sm">
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
              Incidents ({filteredAndSortedIncidents.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAndSortedIncidents.map((incident) => {
              const StatusIcon = statusConfig[incident.status].icon
              return (
                <div
                  key={incident.id}
                  className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-muted/20"
                >
                  <Checkbox
                    checked={selectedIncidents.includes(incident.id)}
                    onCheckedChange={(checked) => handleSelectIncident(incident.id, checked as boolean)}
                  />

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{incident.title}</h4>
                        <p className="text-sm text-muted-foreground">{incident.description}</p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {incident.id}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <StatusIcon className={`h-4 w-4 ${statusConfig[incident.status].color}`} />
                        <span className="capitalize">{incident.status.replace("-", " ")}</span>
                      </div>

                      <Badge
                        variant="outline"
                        className={`${
                          incident.severity === "critical"
                            ? "border-red-500 text-red-500"
                            : incident.severity === "high"
                              ? "border-orange-500 text-orange-500"
                              : incident.severity === "medium"
                                ? "border-yellow-500 text-yellow-500"
                                : "border-blue-500 text-blue-500"
                        }`}
                      >
                        {incident.severity.toUpperCase()}
                      </Badge>

                      <span className="text-muted-foreground">{incident.type}</span>
                      <span className="text-muted-foreground">Assigned to {incident.assignedTo}</span>
                      <span className="text-muted-foreground">{incident.timestamp}</span>
                    </div>

                    {incident.tags.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {incident.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {filteredAndSortedIncidents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No incidents match your current filters.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
