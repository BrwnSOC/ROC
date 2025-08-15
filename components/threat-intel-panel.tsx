"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Globe, AlertTriangle, Shield, Bug, Zap, MapPin, TrendingUp, Clock, RefreshCw, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThreatData {
  id: string
  title: string
  region: string
  severity: "critical" | "high" | "medium" | "low"
  type: string
  description: string
  firstSeen: string
  lastUpdated: string
  affectedSystems: number
  confidence: number
}

const threatIntelData: ThreatData[] = [
  {
    id: "TI-2025-001",
    title: "Zero-Day Exploit",
    region: "North America",
    severity: "critical",
    type: "Vulnerability",
    description: "New zero-day vulnerability targeting enterprise VPN solutions",
    firstSeen: "2025-08-14 09:30",
    lastUpdated: "2025-08-14 14:15",
    affectedSystems: 1247,
    confidence: 95,
  },
  {
    id: "TI-2025-002",
    title: "APT Campaign",
    region: "Europe",
    severity: "high",
    type: "Advanced Persistent Threat",
    description: "Sophisticated phishing campaign targeting financial institutions",
    firstSeen: "2025-08-13 16:20",
    lastUpdated: "2025-08-14 12:45",
    affectedSystems: 892,
    confidence: 88,
  },
  {
    id: "TI-2025-003",
    title: "Ransomware Variant",
    region: "Asia Pacific",
    severity: "high",
    type: "Malware",
    description: "New ransomware strain with improved encryption methods",
    firstSeen: "2025-08-13 11:15",
    lastUpdated: "2025-08-14 10:30",
    affectedSystems: 634,
    confidence: 92,
  },
  {
    id: "TI-2025-004",
    title: "Botnet Activity",
    region: "Global",
    severity: "medium",
    type: "Network Threat",
    description: "Increased botnet activity targeting IoT devices",
    firstSeen: "2025-08-12 14:45",
    lastUpdated: "2025-08-14 08:20",
    affectedSystems: 2156,
    confidence: 76,
  },
  {
    id: "TI-2025-005",
    title: "Supply Chain Attack",
    region: "North America",
    severity: "critical",
    type: "Supply Chain",
    description: "Compromised software update mechanism in popular enterprise tool",
    firstSeen: "2025-08-14 07:10",
    lastUpdated: "2025-08-14 13:55",
    affectedSystems: 3421,
    confidence: 97,
  },
]

const severityConfig = {
  critical: {
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    icon: AlertTriangle,
  },
  high: {
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    icon: Shield,
  },
  medium: {
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    icon: Zap,
  },
  low: {
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    icon: Bug,
  },
}

const regionData = [
  { region: "North America", threats: 2, severity: "critical" },
  { region: "Europe", threats: 1, severity: "high" },
  { region: "Asia Pacific", threats: 1, severity: "high" },
  { region: "Global", threats: 1, severity: "medium" },
]

export function ThreatIntelPanel() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null)

  const filteredThreats = threatIntelData.filter((threat) => {
    const matchesRegion = !selectedRegion || threat.region === selectedRegion
    const matchesSeverity = !selectedSeverity || threat.severity === selectedSeverity
    return matchesRegion && matchesSeverity
  })

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Threat Intelligence</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="threats" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="threats">Active Threats</TabsTrigger>
          <TabsTrigger value="regions">Regional View</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="threats" className="space-y-4">
          {/* Threat Filters */}
          <div className="flex gap-2">
            <Button
              variant={selectedSeverity === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSeverity(null)}
            >
              All
            </Button>
            {Object.keys(severityConfig).map((severity) => (
              <Button
                key={severity}
                variant={selectedSeverity === severity ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSeverity(severity)}
                className="capitalize"
              >
                {severity}
              </Button>
            ))}
          </div>

          {/* Threat List */}
          <div className="space-y-3">
            {filteredThreats.map((threat) => {
              const config = severityConfig[threat.severity]
              const SeverityIcon = config.icon

              return (
                <Card key={threat.id} className={cn("roc-border-glow bg-card/50 backdrop-blur-sm", config.borderColor)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={cn("p-2 rounded-lg", config.bgColor)}>
                          <SeverityIcon className={cn("h-4 w-4", config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{threat.title}</h4>
                            <Badge variant="outline" className={cn("text-xs", config.color, config.borderColor)}>
                              {threat.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{threat.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {threat.region}
                            </div>
                            <div className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {threat.type}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(threat.lastUpdated)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{threat.affectedSystems.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">affected systems</div>
                        <div className="mt-2">
                          <div className="text-xs text-muted-foreground mb-1">Confidence</div>
                          <div className="flex items-center gap-2">
                            <Progress value={threat.confidence} className="w-16 h-2" />
                            <span className="text-xs font-medium">{threat.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="regions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {regionData.map((region) => {
              const config = severityConfig[region.severity as keyof typeof severityConfig]

              return (
                <Card key={region.region} className="roc-border-glow bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {region.region}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">{region.threats}</div>
                        <div className="text-xs text-muted-foreground">active threats</div>
                      </div>
                      <Badge variant="outline" className={cn("text-xs", config.color, config.borderColor)}>
                        {region.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="roc-border-glow bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Threat Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">+23%</div>
                <div className="text-xs text-muted-foreground">vs last week</div>
              </CardContent>
            </Card>

            <Card className="roc-border-glow bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Critical Threats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">2</div>
                <div className="text-xs text-muted-foreground">active now</div>
              </CardContent>
            </Card>

            <Card className="roc-border-glow bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Avg Confidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">89%</div>
                <div className="text-xs text-muted-foreground">threat accuracy</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
