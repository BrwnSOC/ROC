"use client"

import { KpiCard } from "@/components/kpi-card"
import { AlertTriangle, CheckCircle, Clock, Shield, Users, Target } from "lucide-react"

const kpiData = [
  {
    title: "Active Incidents",
    value: 12,
    trend: "+15%",
    icon: <AlertTriangle className="h-4 w-4" />,
    description: "Requiring immediate attention",
    status: "critical",
  },
  {
    title: "Resolved Today",
    value: 27,
    trend: "+5%",
    icon: <CheckCircle className="h-4 w-4" />,
    description: "Incidents closed successfully",
    status: "success",
  },
  {
    title: "Avg. Response Time",
    value: "4m 32s",
    trend: "-8%",
    icon: <Clock className="h-4 w-4" />,
    description: "Time to first response",
    status: "improvement",
  },
  {
    title: "Security Score",
    value: "94%",
    trend: "+2%",
    icon: <Shield className="h-4 w-4" />,
    description: "Overall security posture",
    status: "excellent",
  },
  {
    title: "Active Analysts",
    value: 8,
    trend: "0%",
    icon: <Users className="h-4 w-4" />,
    description: "Currently monitoring",
    status: "stable",
  },
  {
    title: "Threat Level",
    value: "Medium",
    trend: "-1",
    icon: <Target className="h-4 w-4" />,
    description: "Current risk assessment",
    status: "warning",
  },
]

export function KpiDashboard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-lg font-semibold text-foreground">Key Performance Indicators</h3>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpiData.map((kpi, index) => (
          <KpiCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            trend={kpi.trend}
            icon={kpi.icon}
            description={kpi.description}
            status={kpi.status}
          />
        ))}
      </div>
    </div>
  )
}
