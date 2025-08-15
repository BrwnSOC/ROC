"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  AlertTriangle,
  Shield,
  Bug,
  Zap,
  Network,
  Mail,
  Database,
  Users,
  Globe,
  Loader2,
  Save,
  Send,
  X,
} from "lucide-react"

interface IncidentFormData {
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low" | ""
  type: string
  customType: string
  assignedTo: string
  reporter: string
  reporterEmail: string
  affectedSystems: string[]
  customSystem: string
  tags: string[]
  customTag: string
  priority: string
  source: string
  location: string
  impactAssessment: string
  immediateActions: string
}

const incidentTypes = [
  { value: "phishing", label: "Phishing Attack", icon: Mail },
  { value: "malware", label: "Malware/Ransomware", icon: Bug },
  { value: "data-breach", label: "Data Breach", icon: Database },
  { value: "network-intrusion", label: "Network Intrusion", icon: Network },
  { value: "ddos", label: "DDoS Attack", icon: Globe },
  { value: "insider-threat", label: "Insider Threat", icon: Users },
  { value: "privilege-escalation", label: "Privilege Escalation", icon: Shield },
  { value: "suspicious-activity", label: "Suspicious Activity", icon: AlertTriangle },
  { value: "custom", label: "Other (Custom)", icon: Zap },
]

const analysts = ["Alex B.", "Dana W.", "Mike R.", "Sarah L.", "Jordan K.", "Taylor M.", "Chris P.", "Morgan S."]

const affectedSystemOptions = [
  "Email Server",
  "Web Server",
  "Database Server",
  "Domain Controller",
  "File Server",
  "Workstations",
  "Mobile Devices",
  "Network Infrastructure",
  "Cloud Services",
  "Third-party Applications",
]

const commonTags = [
  "urgent",
  "external",
  "internal",
  "automated",
  "manual",
  "confirmed",
  "suspected",
  "ongoing",
  "contained",
  "finance",
  "hr",
  "it",
  "marketing",
  "operations",
]

export function CreateIncidentForm() {
  const [formData, setFormData] = useState<IncidentFormData>({
    title: "",
    description: "",
    severity: "",
    type: "",
    customType: "",
    assignedTo: "",
    reporter: "",
    reporterEmail: "",
    affectedSystems: [],
    customSystem: "",
    tags: [],
    customTag: "",
    priority: "",
    source: "",
    location: "",
    impactAssessment: "",
    immediateActions: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (field: keyof IncidentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSystemToggle = (system: string) => {
    setFormData((prev) => ({
      ...prev,
      affectedSystems: prev.affectedSystems.includes(system)
        ? prev.affectedSystems.filter((s) => s !== system)
        : [...prev.affectedSystems, system],
    }))
  }

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const addCustomSystem = () => {
    if (formData.customSystem.trim() && !formData.affectedSystems.includes(formData.customSystem.trim())) {
      setFormData((prev) => ({
        ...prev,
        affectedSystems: [...prev.affectedSystems, prev.customSystem.trim()],
        customSystem: "",
      }))
    }
  }

  const addCustomTag = () => {
    if (formData.customTag.trim() && !formData.tags.includes(formData.customTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.customTag.trim()],
        customTag: "",
      }))
    }
  }

  const removeSystem = (system: string) => {
    setFormData((prev) => ({
      ...prev,
      affectedSystems: prev.affectedSystems.filter((s) => s !== system),
    }))
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const validateForm = () => {
    const required = ["title", "description", "severity", "type", "reporter", "reporterEmail"]
    const missing = required.filter((field) => !formData[field as keyof IncidentFormData])

    if (missing.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields: ${missing.join(", ")}`,
        variant: "destructive",
      })
      return false
    }

    if (formData.type === "custom" && !formData.customType.trim()) {
      toast({
        title: "Validation Error",
        description: "Please specify the custom incident type",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (asDraft = false) => {
    if (!asDraft && !validateForm()) return

    setIsSubmitting(true)
    setIsDraft(asDraft)

    try {
      const incidentData = {
        ...formData,
        type: formData.type === "custom" ? formData.customType : formData.type,
        status: asDraft ? "draft" : "open",
        priority: formData.severity === "critical" ? 1 : formData.severity === "high" ? 2 : 3,
      }

      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incidentData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: asDraft ? "Draft Saved" : "Incident Created",
          description: asDraft
            ? "Incident draft has been saved successfully"
            : `Incident ${result.data.id} has been created and assigned`,
        })

        if (!asDraft) {
          router.push("/incidents/active")
        } else {
          // Reset form for new incident
          setFormData({
            title: "",
            description: "",
            severity: "",
            type: "",
            customType: "",
            assignedTo: "",
            reporter: "",
            reporterEmail: "",
            affectedSystems: [],
            customSystem: "",
            tags: [],
            customTag: "",
            priority: "",
            source: "",
            location: "",
            impactAssessment: "",
            immediateActions: "",
          })
        }
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to create incident. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setIsDraft(false)
    }
  }

  const selectedTypeData = incidentTypes.find((t) => t.value === formData.type)
  const TypeIcon = selectedTypeData?.icon || AlertTriangle

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TypeIcon className="h-5 w-5 text-primary" />
            Incident Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Incident Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Brief, descriptive title of the incident"
                className="mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Detailed description of the incident, including what was observed, when it occurred, and any relevant context"
                rows={4}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="severity" className="text-sm font-medium">
                Severity *
              </Label>
              <Select value={formData.severity} onValueChange={(value: any) => handleInputChange("severity", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select severity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical - Immediate Response Required</SelectItem>
                  <SelectItem value="high">High - Response Within 1 Hour</SelectItem>
                  <SelectItem value="medium">Medium - Response Within 4 Hours</SelectItem>
                  <SelectItem value="low">Low - Response Within 24 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type" className="text-sm font-medium">
                Incident Type *
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  {incidentTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {formData.type === "custom" && (
              <div className="md:col-span-2">
                <Label htmlFor="customType" className="text-sm font-medium">
                  Custom Incident Type *
                </Label>
                <Input
                  id="customType"
                  value={formData.customType}
                  onChange={(e) => handleInputChange("customType", e.target.value)}
                  placeholder="Specify the custom incident type"
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* Reporter Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reporter" className="text-sm font-medium">
                Reporter Name *
              </Label>
              <Input
                id="reporter"
                value={formData.reporter}
                onChange={(e) => handleInputChange("reporter", e.target.value)}
                placeholder="Name of person reporting the incident"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="reporterEmail" className="text-sm font-medium">
                Reporter Email *
              </Label>
              <Input
                id="reporterEmail"
                type="email"
                value={formData.reporterEmail}
                onChange={(e) => handleInputChange("reporterEmail", e.target.value)}
                placeholder="Email address of reporter"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="assignedTo" className="text-sm font-medium">
                Assign To
              </Label>
              <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange("assignedTo", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Auto-assign or select analyst" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-assign based on severity</SelectItem>
                  {analysts.map((analyst) => (
                    <SelectItem key={analyst} value={analyst}>
                      {analyst}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="source" className="text-sm font-medium">
                Detection Source
              </Label>
              <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="How was this incident detected?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automated">Automated Detection</SelectItem>
                  <SelectItem value="user-report">User Report</SelectItem>
                  <SelectItem value="monitoring">Security Monitoring</SelectItem>
                  <SelectItem value="external">External Notification</SelectItem>
                  <SelectItem value="audit">Security Audit</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Affected Systems */}
          <div>
            <Label className="text-sm font-medium">Affected Systems</Label>
            <div className="mt-2 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {affectedSystemOptions.map((system) => (
                  <div key={system} className="flex items-center space-x-2">
                    <Checkbox
                      id={system}
                      checked={formData.affectedSystems.includes(system)}
                      onCheckedChange={() => handleSystemToggle(system)}
                    />
                    <Label htmlFor={system} className="text-sm">
                      {system}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={formData.customSystem}
                  onChange={(e) => handleInputChange("customSystem", e.target.value)}
                  placeholder="Add custom system"
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={addCustomSystem}>
                  Add
                </Button>
              </div>

              {formData.affectedSystems.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.affectedSystems.map((system) => (
                    <Badge key={system} variant="secondary" className="gap-1">
                      {system}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeSystem(system)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-sm font-medium">Tags</Label>
            <div className="mt-2 space-y-3">
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {commonTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag}
                      checked={formData.tags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                    />
                    <Label htmlFor={tag} className="text-sm">
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={formData.customTag}
                  onChange={(e) => handleInputChange("customTag", e.target.value)}
                  placeholder="Add custom tag"
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={addCustomTag}>
                  Add
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location" className="text-sm font-medium">
                Location/Department
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Physical location or department affected"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="impactAssessment" className="text-sm font-medium">
                Impact Assessment
              </Label>
              <Select
                value={formData.impactAssessment}
                onValueChange={(value) => handleInputChange("impactAssessment", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Assess business impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Business Impact</SelectItem>
                  <SelectItem value="minimal">Minimal Impact</SelectItem>
                  <SelectItem value="moderate">Moderate Impact</SelectItem>
                  <SelectItem value="significant">Significant Impact</SelectItem>
                  <SelectItem value="severe">Severe Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="immediateActions" className="text-sm font-medium">
                Immediate Actions Taken
              </Label>
              <Textarea
                id="immediateActions"
                value={formData.immediateActions}
                onChange={(e) => handleInputChange("immediateActions", e.target.value)}
                placeholder="Describe any immediate containment or mitigation actions already taken"
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button variant="outline" onClick={() => handleSubmit(true)} disabled={isSubmitting} className="gap-2">
          {isDraft && <Loader2 className="h-4 w-4 animate-spin" />}
          <Save className="h-4 w-4" />
          Save as Draft
        </Button>
        <Button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="gap-2">
          {isSubmitting && !isDraft && <Loader2 className="h-4 w-4 animate-spin" />}
          <Send className="h-4 w-4" />
          Create Incident
        </Button>
      </div>
    </div>
  )
}
