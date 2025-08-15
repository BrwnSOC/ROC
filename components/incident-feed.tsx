"use client"

import { IncidentCard } from "@/components/incident-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, RefreshCw } from "lucide-react"
import { useState } from "react"

const incidentFeed = [
  {
    id: "INC-2025-001",
    title: "Phishing Email Detected",
    severity: "critical" as const,
    timestamp: "2025-08-14 14:22",
    type: "Phishing",
    assignedTo: "Alex B.",
  },
  {
    id: "INC-2025-002",
    title: "Ransomware Activity",
    severity: "high" as const,
    timestamp: "2025-08-14 13:05",
    type: "Malware",
    assignedTo: "Dana W.",
  },
  {
    id: "INC-2025-003",
    title: "Suspicious Network Traffic",
    severity: "medium" as const,
    timestamp: "2025-08-14 12:45",
    type: "Network Intrusion",
    assignedTo: "Mike R.",
  },
  {
    id: "INC-2025-004",
    title: "Failed Login Attempts",
    severity: "low" as const,
    timestamp: "2025-08-14 11:30",
    type: "Suspicious Activity",
    assignedTo: "Sarah L.",
  },
  {
    id: "INC-2025-005",
    title: "Data Exfiltration Attempt",
    severity: "critical" as const,
    timestamp: "2025-08-14 10:15",
    type: "Data Breach",
    assignedTo: "Alex B.",
  },
  {
    id: "INC-2025-006",
    title: "DDoS Attack on Web Server",
    severity: "high" as const,
    timestamp: "2025-08-14 09:20",
    type: "DDoS Attack",
    assignedTo: "Jordan K.",
  },
]

export function IncidentFeed() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null)

  const filteredIncidents = incidentFeed.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity = !selectedSeverity || incident.severity === selectedSeverity

    return matchesSearch && matchesSeverity
  })

  const severityFilters = ["critical", "high", "medium", "low"]

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Recent Incidents</h3>
          <p className="text-sm text-muted-foreground">{filteredIncidents.length} incidents requiring attention</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-input/50 border-border/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1">
            <Button
              variant={selectedSeverity === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSeverity(null)}
              className="text-xs"
            >
              All
            </Button>
            {severityFilters.map((severity) => (
              <Button
                key={severity}
                variant={selectedSeverity === severity ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSeverity(severity)}
                className="text-xs"
              >
                {severity}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-3">
        {filteredIncidents.length > 0 ? (
          filteredIncidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              id={incident.id}
              title={incident.title}
              severity={incident.severity}
              timestamp={incident.timestamp}
              type={incident.type}
              assignedTo={incident.assignedTo}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No incidents match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
