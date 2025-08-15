"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import {
  Globe,
  AlertTriangle,
  Search,
  Target,
  Users,
  Database,
  Eye,
  Plus,
  Download,
  Upload,
  RefreshCw,
  MapPin,
  Hash,
  Link,
  FileText,
  Network,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface IOC {
  id: string
  type: "ip" | "domain" | "hash" | "url" | "email"
  value: string
  confidence: number
  severity: "critical" | "high" | "medium" | "low"
  source: string
  firstSeen: string
  lastSeen: string
  tags: string[]
  description: string
  relatedThreats: string[]
}

interface ThreatActor {
  id: string
  name: string
  aliases: string[]
  origin: string
  motivation: string
  sophistication: "low" | "medium" | "high" | "advanced"
  targets: string[]
  techniques: string[]
  lastActivity: string
  confidence: number
}

interface ThreatFeed {
  id: string
  name: string
  source: string
  type: "commercial" | "open_source" | "government" | "internal"
  status: "active" | "inactive" | "error"
  lastUpdate: string
  iocCount: number
  reliability: number
}

const mockIOCs: IOC[] = [
  {
    id: "IOC-001",
    type: "ip",
    value: "192.168.1.100",
    confidence: 95,
    severity: "critical",
    source: "Internal Analysis",
    firstSeen: "2025-08-14 09:30",
    lastSeen: "2025-08-14 14:15",
    tags: ["c2", "malware", "apt"],
    description: "Command and control server for APT campaign",
    relatedThreats: ["TI-2025-001", "TI-2025-002"],
  },
  {
    id: "IOC-002",
    type: "hash",
    value: "d41d8cd98f00b204e9800998ecf8427e",
    confidence: 88,
    severity: "high",
    source: "VirusTotal",
    firstSeen: "2025-08-13 16:20",
    lastSeen: "2025-08-14 12:45",
    tags: ["ransomware", "encryption"],
    description: "Ransomware payload hash",
    relatedThreats: ["TI-2025-003"],
  },
]

const mockThreatActors: ThreatActor[] = [
  {
    id: "TA-001",
    name: "APT-29",
    aliases: ["Cozy Bear", "The Dukes"],
    origin: "Russia",
    motivation: "Espionage",
    sophistication: "advanced",
    targets: ["Government", "Healthcare", "Technology"],
    techniques: ["Spear Phishing", "Living off the Land", "Supply Chain"],
    lastActivity: "2025-08-14",
    confidence: 92,
  },
  {
    id: "TA-002",
    name: "Lazarus Group",
    aliases: ["Hidden Cobra", "APT-38"],
    origin: "North Korea",
    motivation: "Financial",
    sophistication: "high",
    targets: ["Financial", "Cryptocurrency", "Entertainment"],
    techniques: ["Watering Hole", "Social Engineering", "Custom Malware"],
    lastActivity: "2025-08-13",
    confidence: 89,
  },
]

const mockThreatFeeds: ThreatFeed[] = [
  {
    id: "TF-001",
    name: "MISP Threat Feed",
    source: "misp.local",
    type: "internal",
    status: "active",
    lastUpdate: "2025-08-14 14:30",
    iocCount: 15420,
    reliability: 95,
  },
  {
    id: "TF-002",
    name: "AlienVault OTX",
    source: "otx.alienvault.com",
    type: "open_source",
    status: "active",
    lastUpdate: "2025-08-14 14:15",
    iocCount: 89234,
    reliability: 87,
  },
]

const iocTypeIcons = {
  ip: Network,
  domain: Globe,
  hash: Hash,
  url: Link,
  email: FileText,
}

export function ThreatIntelligenceEnhanced() {
  const [selectedTab, setSelectedTab] = useState("feeds")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIOCType, setSelectedIOCType] = useState<string>("all")
  const [createIOCOpen, setCreateIOCOpen] = useState(false)
  const [huntingQuery, setHuntingQuery] = useState("")
  const [newIOC, setNewIOC] = useState({
    type: "ip" as const,
    value: "",
    confidence: 80,
    severity: "medium" as const,
    source: "",
    description: "",
    tags: "",
  })

  const { toast } = useToast()

  const filteredIOCs = mockIOCs.filter((ioc) => {
    const matchesSearch =
      ioc.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ioc.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedIOCType === "all" || ioc.type === selectedIOCType
    return matchesSearch && matchesType
  })

  const handleCreateIOC = () => {
    const ioc: IOC = {
      id: `IOC-${String(mockIOCs.length + 1).padStart(3, "0")}`,
      type: newIOC.type,
      value: newIOC.value,
      confidence: newIOC.confidence,
      severity: newIOC.severity,
      source: newIOC.source,
      firstSeen: new Date().toISOString().slice(0, 16).replace("T", " "),
      lastSeen: new Date().toISOString().slice(0, 16).replace("T", " "),
      tags: newIOC.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      description: newIOC.description,
      relatedThreats: [],
    }

    mockIOCs.push(ioc)
    setCreateIOCOpen(false)
    setNewIOC({
      type: "ip",
      value: "",
      confidence: 80,
      severity: "medium",
      source: "",
      description: "",
      tags: "",
    })

    toast({
      title: "IOC Created",
      description: `IOC ${ioc.id} has been created successfully.`,
    })
  }

  const handleThreatHunt = () => {
    if (!huntingQuery.trim()) return

    toast({
      title: "Threat Hunt Initiated",
      description: `Searching for indicators matching: ${huntingQuery}`,
    })

    // Simulate hunt results
    setTimeout(() => {
      toast({
        title: "Hunt Complete",
        description: "Found 3 potential matches across network logs and endpoints.",
      })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Advanced Threat Intelligence
          </h3>
          <p className="text-muted-foreground">
            Comprehensive threat analysis, IOC management, and threat hunting platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Sync Feeds
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="feeds">Threat Feeds</TabsTrigger>
          <TabsTrigger value="iocs">IOC Management</TabsTrigger>
          <TabsTrigger value="hunting">Threat Hunting</TabsTrigger>
          <TabsTrigger value="actors">Threat Actors</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
        </TabsList>

        <TabsContent value="feeds" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockThreatFeeds.map((feed) => (
              <Card key={feed.id} className="roc-border-glow bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{feed.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        feed.status === "active" ? "text-green-500 border-green-500" : "text-red-500 border-red-500"
                      }
                    >
                      {feed.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Source:</span>
                      <span>{feed.source}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="secondary" className="capitalize">
                        {feed.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">IOCs:</span>
                      <span className="font-medium">{feed.iocCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Update:</span>
                      <span>{feed.lastUpdate}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Reliability:</span>
                      <span className="font-medium">{feed.reliability}%</span>
                    </div>
                    <Progress value={feed.reliability} className="h-2" />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Sync
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="iocs" className="space-y-4">
          {/* IOC Management Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search IOCs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Select value={selectedIOCType} onValueChange={setSelectedIOCType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ip">IP Address</SelectItem>
                  <SelectItem value="domain">Domain</SelectItem>
                  <SelectItem value="hash">Hash</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={createIOCOpen} onOpenChange={setCreateIOCOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add IOC
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New IOC</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">IOC Type</Label>
                      <Select value={newIOC.type} onValueChange={(value: any) => setNewIOC({ ...newIOC, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ip">IP Address</SelectItem>
                          <SelectItem value="domain">Domain</SelectItem>
                          <SelectItem value="hash">Hash</SelectItem>
                          <SelectItem value="url">URL</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="severity">Severity</Label>
                      <Select
                        value={newIOC.severity}
                        onValueChange={(value: any) => setNewIOC({ ...newIOC, severity: value })}
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
                  </div>
                  <div>
                    <Label htmlFor="value">IOC Value</Label>
                    <Input
                      id="value"
                      value={newIOC.value}
                      onChange={(e) => setNewIOC({ ...newIOC, value: e.target.value })}
                      placeholder="Enter IOC value"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newIOC.description}
                      onChange={(e) => setNewIOC({ ...newIOC, description: e.target.value })}
                      placeholder="Describe the IOC and its context"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="source">Source</Label>
                      <Input
                        id="source"
                        value={newIOC.source}
                        onChange={(e) => setNewIOC({ ...newIOC, source: e.target.value })}
                        placeholder="e.g., VirusTotal, Internal Analysis"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confidence">Confidence ({newIOC.confidence}%)</Label>
                      <Input
                        id="confidence"
                        type="range"
                        min="0"
                        max="100"
                        value={newIOC.confidence}
                        onChange={(e) => setNewIOC({ ...newIOC, confidence: Number.parseInt(e.target.value) })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={newIOC.tags}
                      onChange={(e) => setNewIOC({ ...newIOC, tags: e.target.value })}
                      placeholder="malware, c2, apt, etc."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setCreateIOCOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateIOC} disabled={!newIOC.value || !newIOC.description}>
                      Add IOC
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* IOC Table */}
          <Card className="roc-border-glow bg-card/50 backdrop-blur-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIOCs.map((ioc) => {
                    const TypeIcon = iocTypeIcons[ioc.type]
                    return (
                      <TableRow key={ioc.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TypeIcon className="h-4 w-4" />
                            <span className="capitalize">{ioc.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{ioc.value}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              ioc.severity === "critical" && "text-red-500 border-red-500",
                              ioc.severity === "high" && "text-orange-500 border-orange-500",
                              ioc.severity === "medium" && "text-yellow-500 border-yellow-500",
                              ioc.severity === "low" && "text-blue-500 border-blue-500",
                            )}
                          >
                            {ioc.severity.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={ioc.confidence} className="w-16 h-2" />
                            <span className="text-sm">{ioc.confidence}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{ioc.source}</TableCell>
                        <TableCell className="text-sm">{ioc.lastSeen}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hunting" className="space-y-4">
          <Card className="roc-border-glow bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Threat Hunting Console
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter hunting query (e.g., process_name:powershell.exe AND network_connection:true)"
                  value={huntingQuery}
                  onChange={(e) => setHuntingQuery(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleThreatHunt} disabled={!huntingQuery.trim()}>
                  <Search className="h-4 w-4 mr-2" />
                  Hunt
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-muted/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="font-medium">Active Hunts</span>
                    </div>
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-xs text-muted-foreground">Currently running</div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">Matches Found</span>
                    </div>
                    <div className="text-2xl font-bold">127</div>
                    <div className="text-xs text-muted-foreground">Last 24 hours</div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Data Sources</span>
                    </div>
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-xs text-muted-foreground">Connected</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {mockThreatActors.map((actor) => (
              <Card key={actor.id} className="roc-border-glow bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{actor.name}</CardTitle>
                    <Badge variant="outline" className="capitalize">
                      {actor.sophistication}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{actor.origin}</span>
                    <span>•</span>
                    <span>{actor.motivation}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Aliases</Label>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {actor.aliases.map((alias) => (
                        <Badge key={alias} variant="secondary" className="text-xs">
                          {alias}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Primary Targets</Label>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {actor.targets.map((target) => (
                        <Badge key={target} variant="outline" className="text-xs">
                          {target}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">TTPs</Label>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {actor.techniques.slice(0, 3).map((technique) => (
                        <Badge key={technique} variant="secondary" className="text-xs">
                          {technique}
                        </Badge>
                      ))}
                      {actor.techniques.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{actor.techniques.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Activity:</span>
                    <span>{actor.lastActivity}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="font-medium">{actor.confidence}%</span>
                    </div>
                    <Progress value={actor.confidence} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-4">
          <Card className="roc-border-glow bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Attribution Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">Geographic Distribution</h4>
                  <div className="space-y-3">
                    {[
                      { country: "Russia", percentage: 35, color: "bg-red-500" },
                      { country: "China", percentage: 28, color: "bg-orange-500" },
                      { country: "North Korea", percentage: 18, color: "bg-yellow-500" },
                      { country: "Iran", percentage: 12, color: "bg-blue-500" },
                      { country: "Other", percentage: 7, color: "bg-gray-500" },
                    ].map((item) => (
                      <div key={item.country} className="flex items-center gap-3">
                        <div className="w-20 text-sm">{item.country}</div>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                        </div>
                        <div className="w-12 text-sm text-right">{item.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Motivation Analysis</h4>
                  <div className="space-y-3">
                    {[
                      { motivation: "Financial", count: 45, color: "bg-green-500" },
                      { motivation: "Espionage", count: 32, color: "bg-blue-500" },
                      { motivation: "Disruption", count: 18, color: "bg-red-500" },
                      { motivation: "Hacktivism", count: 12, color: "bg-purple-500" },
                    ].map((item) => (
                      <div key={item.motivation} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm">{item.motivation}</span>
                        </div>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
