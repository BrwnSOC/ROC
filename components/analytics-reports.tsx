"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useToast } from "@/hooks/use-toast"
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Plus,
  Eye,
  FileText,
  Clock,
  Shield,
  AlertTriangle,
  Users,
  Target,
  RefreshCw,
} from "lucide-react"

interface Report {
  id: string
  name: string
  type: "security" | "performance" | "compliance" | "custom"
  description: string
  schedule: "daily" | "weekly" | "monthly" | "on-demand"
  lastGenerated: string
  status: "active" | "inactive" | "generating"
  recipients: string[]
}

interface MetricData {
  period: string
  incidents: number
  resolved: number
  responseTime: number
  threatLevel: number
  complianceScore: number
}

const mockReports: Report[] = [
  {
    id: "RPT-001",
    name: "Daily Security Summary",
    type: "security",
    description: "Daily overview of security incidents, threats, and response metrics",
    schedule: "daily",
    lastGenerated: "2025-08-14 06:00",
    status: "active",
    recipients: ["security-team@company.com", "ciso@company.com"],
  },
  {
    id: "RPT-002",
    name: "Weekly Performance Report",
    type: "performance",
    description: "Weekly analysis of SOC performance, response times, and team efficiency",
    schedule: "weekly",
    lastGenerated: "2025-08-12 08:00",
    status: "active",
    recipients: ["soc-manager@company.com"],
  },
  {
    id: "RPT-003",
    name: "Monthly Compliance Report",
    type: "compliance",
    description: "Monthly compliance status report for regulatory requirements",
    schedule: "monthly",
    lastGenerated: "2025-08-01 09:00",
    status: "active",
    recipients: ["compliance@company.com", "legal@company.com"],
  },
]

const mockMetricsData: MetricData[] = [
  { period: "Jan", incidents: 45, resolved: 42, responseTime: 4.2, threatLevel: 3, complianceScore: 94 },
  { period: "Feb", incidents: 52, resolved: 48, responseTime: 3.8, threatLevel: 4, complianceScore: 96 },
  { period: "Mar", incidents: 38, resolved: 36, responseTime: 4.1, threatLevel: 2, complianceScore: 93 },
  { period: "Apr", incidents: 61, resolved: 58, responseTime: 3.5, threatLevel: 5, complianceScore: 97 },
  { period: "May", incidents: 43, resolved: 41, responseTime: 4.0, threatLevel: 3, complianceScore: 95 },
  { period: "Jun", incidents: 55, resolved: 52, responseTime: 3.7, threatLevel: 4, complianceScore: 98 },
]

const complianceData = [
  { framework: "SOC 2", score: 98, status: "compliant" },
  { framework: "ISO 27001", score: 95, status: "compliant" },
  { framework: "NIST CSF", score: 92, status: "compliant" },
  { framework: "GDPR", score: 89, status: "needs-attention" },
  { framework: "HIPAA", score: 96, status: "compliant" },
]

const performanceMetrics = [
  { metric: "Mean Time to Detection (MTTD)", value: "12 minutes", trend: "-15%", status: "good" },
  { metric: "Mean Time to Response (MTTR)", value: "3.7 minutes", trend: "-8%", status: "good" },
  { metric: "Mean Time to Resolution", value: "2.4 hours", trend: "+5%", status: "warning" },
  { metric: "False Positive Rate", value: "8.2%", trend: "-12%", status: "good" },
  { metric: "Analyst Utilization", value: "87%", trend: "+3%", status: "good" },
  { metric: "Escalation Rate", value: "15%", trend: "-2%", status: "good" },
]

export function AnalyticsReports() {
  const [selectedTab, setSelectedTab] = useState("metrics")
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [createReportOpen, setCreateReportOpen] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState("6months")
  const [newReport, setNewReport] = useState({
    name: "",
    type: "security" as const,
    description: "",
    schedule: "weekly" as const,
    recipients: "",
  })

  const { toast } = useToast()

  const handleCreateReport = () => {
    const report: Report = {
      id: `RPT-${String(reports.length + 1).padStart(3, "0")}`,
      name: newReport.name,
      type: newReport.type,
      description: newReport.description,
      schedule: newReport.schedule,
      lastGenerated: "Never",
      status: "active",
      recipients: newReport.recipients
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean),
    }

    setReports([...reports, report])
    setCreateReportOpen(false)
    setNewReport({
      name: "",
      type: "security",
      description: "",
      schedule: "weekly",
      recipients: "",
    })

    toast({
      title: "Report Created",
      description: `Report "${report.name}" has been created successfully.`,
    })
  }

  const handleGenerateReport = (reportId: string) => {
    setReports(
      reports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: "generating" as const,
              lastGenerated: new Date().toISOString().slice(0, 16).replace("T", " "),
            }
          : report,
      ),
    )

    toast({
      title: "Report Generation Started",
      description: "Your report is being generated and will be available shortly.",
    })

    // Simulate report generation
    setTimeout(() => {
      setReports((prev) =>
        prev.map((report) => (report.id === reportId ? { ...report, status: "active" as const } : report)),
      )
      toast({
        title: "Report Generated",
        description: "Your report has been generated successfully.",
      })
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
      case "good":
        return "text-green-500 border-green-500"
      case "needs-attention":
      case "warning":
        return "text-yellow-500 border-yellow-500"
      case "non-compliant":
      case "critical":
        return "text-red-500 border-red-500"
      default:
        return "text-gray-500 border-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Analytics & Reports
          </h3>
          <p className="text-muted-foreground">
            Comprehensive security metrics, performance analytics, and automated reporting
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Security Metrics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          {/* Key Metrics Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="roc-border-glow bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-sm">Total Incidents</span>
                </div>
                <div className="text-2xl font-bold">294</div>
                <div className="text-xs text-muted-foreground">Last 6 months</div>
              </CardContent>
            </Card>

            <Card className="roc-border-glow bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-sm">Resolution Rate</span>
                </div>
                <div className="text-2xl font-bold">96.2%</div>
                <div className="text-xs text-muted-foreground">+2.1% vs last period</div>
              </CardContent>
            </Card>

            <Card className="roc-border-glow bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">Avg Response Time</span>
                </div>
                <div className="text-2xl font-bold">3.8m</div>
                <div className="text-xs text-muted-foreground">-12% improvement</div>
              </CardContent>
            </Card>

            <Card className="roc-border-glow bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  <span className="font-medium text-sm">Threat Level</span>
                </div>
                <div className="text-2xl font-bold">Medium</div>
                <div className="text-xs text-muted-foreground">Stable trend</div>
              </CardContent>
            </Card>
          </div>

          {/* Trend Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="roc-border-glow bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Incident Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    incidents: { label: "Incidents", color: "#ef4444" },
                    resolved: { label: "Resolved", color: "#22c55e" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockMetricsData}>
                      <XAxis dataKey="period" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="roc-border-glow bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Response Time Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    responseTime: { label: "Response Time (min)", color: "#3b82f6" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockMetricsData}>
                      <XAxis dataKey="period" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="responseTime" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {performanceMetrics.map((metric) => (
              <Card key={metric.metric} className="roc-border-glow bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{metric.metric}</h4>
                    <Badge variant="outline" className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold mb-1">{metric.value}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className={
                        metric.trend.startsWith("-")
                          ? "text-green-500"
                          : metric.trend.startsWith("+")
                            ? "text-red-500"
                            : "text-gray-500"
                      }
                    >
                      {metric.trend}
                    </span>
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid gap-4">
            {complianceData.map((item) => (
              <Card key={item.framework} className="roc-border-glow bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{item.framework}</h4>
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {item.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Compliance Score</span>
                      <span className="font-medium">{item.score}%</span>
                    </div>
                    <Progress value={item.score} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Reports Header */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold">Automated Reports</h4>
              <p className="text-sm text-muted-foreground">{reports.length} reports configured</p>
            </div>
            <Dialog open={createReportOpen} onOpenChange={setCreateReportOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Report</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Report Name</Label>
                      <Input
                        id="name"
                        value={newReport.name}
                        onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                        placeholder="e.g., Weekly Security Summary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Report Type</Label>
                      <Select
                        value={newReport.type}
                        onValueChange={(value: any) => setNewReport({ ...newReport, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="performance">Performance</SelectItem>
                          <SelectItem value="compliance">Compliance</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newReport.description}
                      onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                      placeholder="Describe what this report covers"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="schedule">Schedule</Label>
                      <Select
                        value={newReport.schedule}
                        onValueChange={(value: any) => setNewReport({ ...newReport, schedule: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="on-demand">On Demand</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="recipients">Recipients</Label>
                      <Input
                        id="recipients"
                        value={newReport.recipients}
                        onChange={(e) => setNewReport({ ...newReport, recipients: e.target.value })}
                        placeholder="email1@company.com, email2@company.com"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setCreateReportOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateReport} disabled={!newReport.name || !newReport.description}>
                      Create Report
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Reports List */}
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="roc-border-glow bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{report.name}</h4>
                        <Badge variant="outline" className="capitalize">
                          {report.type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            report.status === "active"
                              ? "text-green-500 border-green-500"
                              : report.status === "generating"
                                ? "text-yellow-500 border-yellow-500"
                                : "text-gray-500 border-gray-500"
                          }
                        >
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="capitalize">{report.schedule}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Last: {report.lastGenerated}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{report.recipients.length} recipients</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => handleGenerateReport(report.id)}
                        disabled={report.status === "generating"}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        {report.status === "generating" ? "Generating..." : "Generate"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
