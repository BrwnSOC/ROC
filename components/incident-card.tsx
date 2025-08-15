"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, Shield, Bug, Zap, Eye, UserPlus, TrendingUp, Clock, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface IncidentCardProps {
  title: string
  severity: "critical" | "high" | "medium" | "low"
  timestamp: string
  type: string
  assignedTo: string
  id?: string
}

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

const typeIcons: Record<string, React.ComponentType<any>> = {
  Phishing: Shield,
  Malware: Bug,
  "Data Breach": AlertTriangle,
  "Network Intrusion": Zap,
  "DDoS Attack": TrendingUp,
  "Suspicious Activity": Eye,
}

const analysts = ["Alex B.", "Dana W.", "Mike R.", "Sarah L.", "Jordan K.", "Taylor M."]

export function IncidentCard({ title, severity, timestamp, type, assignedTo, id = "INC-2025-001" }: IncidentCardProps) {
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [escalateDialogOpen, setEscalateDialogOpen] = useState(false)
  const [selectedAnalyst, setSelectedAnalyst] = useState("")
  const [escalationLevel, setEscalationLevel] = useState("")
  const [escalationReason, setEscalationReason] = useState("")
  const [isAssigning, setIsAssigning] = useState(false)
  const [isEscalating, setIsEscalating] = useState(false)

  const { toast } = useToast()
  const config = severityConfig[severity]
  const SeverityIcon = config.icon
  const TypeIcon = typeIcons[type] || Shield

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
  }

  const handleAssign = async () => {
    if (!selectedAnalyst) return

    setIsAssigning(true)
    try {
      const response = await fetch(`/api/incidents/${id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: selectedAnalyst }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Incident Assigned",
          description: `Successfully assigned to ${selectedAnalyst}`,
        })
        setAssignDialogOpen(false)
        setSelectedAnalyst("")
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: "Assignment Failed",
        description: "Failed to assign incident. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAssigning(false)
    }
  }

  const handleEscalate = async () => {
    if (!escalationLevel || !escalationReason) return

    setIsEscalating(true)
    try {
      const response = await fetch(`/api/incidents/${id}/escalate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ escalationLevel, reason: escalationReason }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Incident Escalated",
          description: `Successfully escalated to ${escalationLevel}`,
        })
        setEscalateDialogOpen(false)
        setEscalationLevel("")
        setEscalationReason("")
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: "Escalation Failed",
        description: "Failed to escalate incident. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEscalating(false)
    }
  }

  return (
    <>
      <Card
        className={cn(
          "roc-border-glow bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200",
          config.borderColor,
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className={cn("p-2 rounded-lg", config.bgColor)}>
                <TypeIcon className={cn("h-4 w-4", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm leading-tight mb-1">{title}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className={cn("text-xs", config.color, config.borderColor)}>
                    <SeverityIcon className="h-3 w-3 mr-1" />
                    {severity.toUpperCase()}
                  </Badge>
                  <span>•</span>
                  <span>{type}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(timestamp)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={`/abstract-geometric-shapes.png?height=24&width=24&query=${assignedTo}`} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(assignedTo)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">Assigned to {assignedTo}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setViewDialogOpen(true)}>
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setAssignDialogOpen(true)}>
                <UserPlus className="h-3 w-3 mr-1" />
                Assign
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setEscalateDialogOpen(true)}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Escalate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TypeIcon className={cn("h-5 w-5", config.color)} />
              {title}
            </DialogTitle>
            <DialogDescription>Incident ID: {id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Severity</Label>
                <Badge variant="outline" className={cn("mt-1", config.color, config.borderColor)}>
                  <SeverityIcon className="h-3 w-3 mr-1" />
                  {severity.toUpperCase()}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Type</Label>
                <p className="text-sm text-muted-foreground mt-1">{type}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Assigned To</Label>
                <p className="text-sm text-muted-foreground mt-1">{assignedTo}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Timestamp</Label>
                <p className="text-sm text-muted-foreground mt-1">{timestamp}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-muted-foreground mt-1">
                This incident requires immediate attention from the security team. Initial analysis suggests potential
                compromise of system resources.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Incident</DialogTitle>
            <DialogDescription>Select an analyst to assign this incident to.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="analyst">Analyst</Label>
              <Select value={selectedAnalyst} onValueChange={setSelectedAnalyst}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an analyst" />
                </SelectTrigger>
                <SelectContent>
                  {analysts.map((analyst) => (
                    <SelectItem key={analyst} value={analyst}>
                      {analyst}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedAnalyst || isAssigning}>
              {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={escalateDialogOpen} onOpenChange={setEscalateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escalate Incident</DialogTitle>
            <DialogDescription>Escalate this incident to a higher priority level.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="escalation-level">Escalation Level</Label>
              <Select value={escalationLevel} onValueChange={setEscalationLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select escalation level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="senior-analyst">Senior Analyst</SelectItem>
                  <SelectItem value="team-lead">Team Lead</SelectItem>
                  <SelectItem value="security-manager">Security Manager</SelectItem>
                  <SelectItem value="ciso">CISO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reason">Escalation Reason</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this incident needs to be escalated..."
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEscalateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEscalate} disabled={!escalationLevel || !escalationReason || isEscalating}>
              {isEscalating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Escalate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
