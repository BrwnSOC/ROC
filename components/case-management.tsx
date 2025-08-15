"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Search,
  FileText,
  Users,
  Clock,
  Eye,
  Edit,
  MessageSquare,
  Paperclip,
  Calendar,
  Target,
} from "lucide-react"

interface CaseEvidence {
  id: string
  name: string
  type: "file" | "screenshot" | "log" | "network" | "email"
  size: string
  uploadedBy: string
  uploadedAt: string
  description: string
}

interface CaseActivity {
  id: string
  type: "created" | "updated" | "comment" | "evidence" | "status_change"
  user: string
  timestamp: string
  description: string
  details?: string
}

interface CaseData {
  id: string
  title: string
  description: string
  status: "open" | "investigating" | "analysis" | "resolved" | "closed"
  priority: "critical" | "high" | "medium" | "low"
  type: string
  assignedTo: string
  reporter: string
  createdDate: string
  dueDate: string
  lastUpdated: string
  progress: number
  tags: string[]
  evidence: CaseEvidence[]
  activities: CaseActivity[]
  relatedIncidents: string[]
}

const mockCases: CaseData[] = [
  {
    id: "ROC-2025-001",
    title: "Phishing Campaign Investigation",
    description:
      "Comprehensive investigation into coordinated phishing campaign targeting finance department employees.",
    status: "investigating",
    priority: "high",
    type: "Email Security",
    assignedTo: "Alex B.",
    reporter: "Sarah L.",
    createdDate: "2025-08-13",
    dueDate: "2025-08-20",
    lastUpdated: "2025-08-14 15:30",
    progress: 65,
    tags: ["phishing", "finance", "email", "credentials"],
    evidence: [
      {
        id: "EV-001",
        name: "phishing_email.eml",
        type: "email",
        size: "2.3 KB",
        uploadedBy: "Alex B.",
        uploadedAt: "2025-08-13 14:22",
        description: "Original phishing email with headers",
      },
      {
        id: "EV-002",
        name: "network_logs.txt",
        type: "log",
        size: "156 KB",
        uploadedBy: "Mike R.",
        uploadedAt: "2025-08-13 16:45",
        description: "Network traffic logs during incident timeframe",
      },
    ],
    activities: [
      {
        id: "ACT-001",
        type: "created",
        user: "Sarah L.",
        timestamp: "2025-08-13 14:00",
        description: "Case created from incident INC-2025-001",
      },
      {
        id: "ACT-002",
        type: "evidence",
        user: "Alex B.",
        timestamp: "2025-08-13 14:22",
        description: "Added phishing email evidence",
        details: "Original email with full headers for analysis",
      },
    ],
    relatedIncidents: ["INC-2025-001", "INC-2025-003"],
  },
]

const statusConfig = {
  open: { color: "text-blue-500", bg: "bg-blue-500/10", label: "Open" },
  investigating: { color: "text-orange-500", bg: "bg-orange-500/10", label: "Investigating" },
  analysis: { color: "text-purple-500", bg: "bg-purple-500/10", label: "Analysis" },
  resolved: { color: "text-green-500", bg: "bg-green-500/10", label: "Resolved" },
  closed: { color: "text-gray-500", bg: "bg-gray-500/10", label: "Closed" },
}

export function CaseManagement() {
  const [cases, setCases] = useState<CaseData[]>(mockCases)
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [caseDetailOpen, setCaseDetailOpen] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [newCase, setNewCase] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    type: "",
    assignedTo: "",
    dueDate: "",
    tags: "",
  })

  const { toast } = useToast()

  const filteredCases = cases.filter(
    (caseItem) =>
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateCase = () => {
    const caseData: CaseData = {
      id: `ROC-2025-${String(cases.length + 1).padStart(3, "0")}`,
      title: newCase.title,
      description: newCase.description,
      status: "open",
      priority: newCase.priority,
      type: newCase.type,
      assignedTo: newCase.assignedTo,
      reporter: "Current User",
      createdDate: new Date().toISOString().slice(0, 10),
      dueDate: newCase.dueDate,
      lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
      progress: 0,
      tags: newCase.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      evidence: [],
      activities: [
        {
          id: "ACT-001",
          type: "created",
          user: "Current User",
          timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
          description: "Case created",
        },
      ],
      relatedIncidents: [],
    }

    setCases([caseData, ...cases])
    setCreateDialogOpen(false)
    setNewCase({
      title: "",
      description: "",
      priority: "medium",
      type: "",
      assignedTo: "",
      dueDate: "",
      tags: "",
    })

    toast({
      title: "Case Created",
      description: `Case ${caseData.id} has been created successfully.`,
    })
  }

  const handleAddComment = () => {
    if (!selectedCase || !newComment.trim()) return

    const activity: CaseActivity = {
      id: `ACT-${Date.now()}`,
      type: "comment",
      user: "Current User",
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      description: "Added comment",
      details: newComment,
    }

    const updatedCase = {
      ...selectedCase,
      activities: [activity, ...selectedCase.activities],
      lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
    }

    setCases(cases.map((c) => (c.id === selectedCase.id ? updatedCase : c)))
    setSelectedCase(updatedCase)
    setNewComment("")

    toast({
      title: "Comment Added",
      description: "Your comment has been added to the case.",
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "created":
        return <Plus className="h-4 w-4" />
      case "comment":
        return <MessageSquare className="h-4 w-4" />
      case "evidence":
        return <Paperclip className="h-4 w-4" />
      case "status_change":
        return <Target className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Case Management</h3>
          <p className="text-muted-foreground">
            {filteredCases.length} cases • {filteredCases.filter((c) => c.status !== "closed").length} active
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Case</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Case Title</Label>
                  <Input
                    id="title"
                    value={newCase.title}
                    onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                    placeholder="Investigation title"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Case Type</Label>
                  <Input
                    id="type"
                    value={newCase.type}
                    onChange={(e) => setNewCase({ ...newCase, type: e.target.value })}
                    placeholder="e.g., Email Security, Malware Analysis"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCase.description}
                  onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                  placeholder="Detailed case description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newCase.priority}
                    onValueChange={(value: any) => setNewCase({ ...newCase, priority: value })}
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
                    value={newCase.assignedTo}
                    onValueChange={(value) => setNewCase({ ...newCase, assignedTo: value })}
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
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newCase.dueDate}
                    onChange={(e) => setNewCase({ ...newCase, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={newCase.tags}
                  onChange={(e) => setNewCase({ ...newCase, tags: e.target.value })}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCase} disabled={!newCase.title || !newCase.description}>
                  Create Case
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="roc-border-glow bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cases Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCases.map((caseItem) => {
          const config = statusConfig[caseItem.status]
          return (
            <Card
              key={caseItem.id}
              className="roc-border-glow bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">{caseItem.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {caseItem.id}
                    </Badge>
                  </div>
                  <Badge variant="outline" className={`${config.color} border-current`}>
                    {config.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{caseItem.progress}%</span>
                  </div>
                  <Progress value={caseItem.progress} className="h-2" />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{caseItem.assignedTo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Due {caseItem.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span>{caseItem.evidence.length} evidence items</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-wrap">
                  {caseItem.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {caseItem.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{caseItem.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs bg-transparent"
                    onClick={() => {
                      setSelectedCase(caseItem)
                      setCaseDetailOpen(true)
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Case Detail Dialog */}
      <Dialog open={caseDetailOpen} onOpenChange={setCaseDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedCase && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {selectedCase.title}
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="evidence">Evidence ({selectedCase.evidence.length})</TabsTrigger>
                  <TabsTrigger value="activity">Activity ({selectedCase.activities.length})</TabsTrigger>
                  <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge variant="outline" className={`mt-1 ${statusConfig[selectedCase.status].color}`}>
                        {statusConfig[selectedCase.status].label}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Priority</Label>
                      <Badge variant="outline" className="mt-1 capitalize">
                        {selectedCase.priority}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Assigned To</Label>
                      <p className="text-sm text-muted-foreground mt-1">{selectedCase.assignedTo}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Due Date</Label>
                      <p className="text-sm text-muted-foreground mt-1">{selectedCase.dueDate}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedCase.description}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Progress</Label>
                    <div className="mt-2">
                      <Progress value={selectedCase.progress} className="h-3" />
                      <p className="text-xs text-muted-foreground mt-1">{selectedCase.progress}% complete</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="evidence" className="space-y-4">
                  <div className="space-y-3">
                    {selectedCase.evidence.map((evidence) => (
                      <div key={evidence.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
                        <div className="p-2 rounded bg-muted">
                          <Paperclip className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{evidence.name}</h5>
                          <p className="text-xs text-muted-foreground">{evidence.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>{evidence.size}</span>
                            <span>•</span>
                            <span>Uploaded by {evidence.uploadedBy}</span>
                            <span>•</span>
                            <span>{evidence.uploadedAt}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Evidence
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <div className="space-y-3">
                    {selectedCase.activities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50">
                        <div className="p-2 rounded bg-muted">{getActivityIcon(activity.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{activity.user}</span>
                            <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          {activity.details && (
                            <p className="text-sm mt-1 p-2 bg-muted/50 rounded">{activity.details}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="collaboration" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="comment">Add Comment</Label>
                      <Textarea
                        id="comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share updates, findings, or questions..."
                        rows={3}
                      />
                      <Button onClick={handleAddComment} className="mt-2" disabled={!newComment.trim()}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Add Comment
                      </Button>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Team Members</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">AB</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">DW</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">MR</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
