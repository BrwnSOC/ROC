"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Calendar, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CaseData {
  caseID: string
  status: "Open" | "In Progress" | "Resolved" | "Closed"
  analyst: string
  priority: "Critical" | "High" | "Medium" | "Low"
  dueDate: string
  title: string
  type: string
  createdDate: string
}

const caseTableData: CaseData[] = [
  {
    caseID: "ROC-2025-001",
    status: "Open",
    analyst: "Alex B.",
    priority: "High",
    dueDate: "2025-08-15",
    title: "Phishing Campaign Investigation",
    type: "Email Security",
    createdDate: "2025-08-13",
  },
  {
    caseID: "ROC-2025-002",
    status: "In Progress",
    analyst: "Dana W.",
    priority: "Critical",
    dueDate: "2025-08-14",
    title: "Ransomware Incident Response",
    type: "Malware Analysis",
    createdDate: "2025-08-13",
  },
  {
    caseID: "ROC-2025-003",
    status: "Resolved",
    analyst: "Mike R.",
    priority: "Medium",
    dueDate: "2025-08-16",
    title: "Network Intrusion Analysis",
    type: "Network Security",
    createdDate: "2025-08-12",
  },
  {
    caseID: "ROC-2025-004",
    status: "Open",
    analyst: "Sarah L.",
    priority: "Low",
    dueDate: "2025-08-18",
    title: "Suspicious User Activity",
    type: "User Behavior",
    createdDate: "2025-08-13",
  },
  {
    caseID: "ROC-2025-005",
    status: "Closed",
    analyst: "Jordan K.",
    priority: "High",
    dueDate: "2025-08-13",
    title: "DDoS Attack Mitigation",
    type: "Infrastructure",
    createdDate: "2025-08-11",
  },
]

const statusConfig = {
  Open: {
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    icon: AlertCircle,
  },
  "In Progress": {
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    icon: Clock,
  },
  Resolved: {
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    icon: CheckCircle,
  },
  Closed: {
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
    icon: XCircle,
  },
}

const priorityConfig = {
  Critical: {
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  High: {
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  Medium: {
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },
  Low: {
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
}

export function CaseTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)

  const filteredCases = caseTableData.filter((caseItem) => {
    const matchesSearch =
      caseItem.caseID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.analyst.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !statusFilter || caseItem.status === statusFilter
    const matchesPriority = !priorityFilter || caseItem.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const isOverdue = (dueDate: string, status: string) => {
    if (status === "Resolved" || status === "Closed") return false
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Case Management</h3>
          <p className="text-sm text-muted-foreground">
            {filteredCases.length} cases •{" "}
            {filteredCases.filter((c) => c.status === "Open" || c.status === "In Progress").length} active
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 roc-glow">New Case</Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-input/50 border-border/50"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Status {statusFilter && `(${statusFilter})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Open")}>Open</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("In Progress")}>In Progress</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Resolved")}>Resolved</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Closed")}>Closed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Priority {priorityFilter && `(${priorityFilter})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setPriorityFilter(null)}>All Priorities</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter("Critical")}>Critical</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter("High")}>High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter("Medium")}>Medium</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter("Low")}>Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Cases Table */}
      <div className="rounded-md border border-border/40 bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-border/40">
              <TableHead className="w-[120px]">Case ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[100px]">Priority</TableHead>
              <TableHead className="w-[120px]">Analyst</TableHead>
              <TableHead className="w-[100px]">Due Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCases.length > 0 ? (
              filteredCases.map((caseItem) => {
                const statusConf = statusConfig[caseItem.status]
                const priorityConf = priorityConfig[caseItem.priority]
                const StatusIcon = statusConf.icon
                const overdue = isOverdue(caseItem.dueDate, caseItem.status)

                return (
                  <TableRow key={caseItem.caseID} className="border-border/40 hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{caseItem.caseID}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{caseItem.title}</div>
                        <div className="text-xs text-muted-foreground">{caseItem.type}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", statusConf.color, statusConf.borderColor)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {caseItem.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", priorityConf.color, priorityConf.borderColor)}>
                        {caseItem.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={`/abstract-geometric-shapes.png?key=analyst&height=24&width=24&query=${caseItem.analyst}`}
                          />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {getInitials(caseItem.analyst)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{caseItem.analyst}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={cn("flex items-center gap-1 text-sm", overdue && "text-destructive")}>
                        <Calendar className="h-3 w-3" />
                        {formatDate(caseItem.dueDate)}
                        {overdue && <span className="text-xs">(Overdue)</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Case</DropdownMenuItem>
                          <DropdownMenuItem>Reassign</DropdownMenuItem>
                          <DropdownMenuItem>Close Case</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No cases match your current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
