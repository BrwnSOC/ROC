"use client"

import { Card, CardContent } from "@/components/ui/card"
import { KpiDashboard } from "@/components/kpi-dashboard"
import { IncidentFeed } from "@/components/incident-feed"
import { CaseTable } from "@/components/case-table"
import { ThreatIntelPanel } from "@/components/threat-intel-panel"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { RealTimeMetrics } from "@/components/real-time-metrics"
import { Activity, Shield } from "lucide-react"

export function DashboardContent() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-card border rounded-lg">
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Security Operations Center</h2>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed ml-11 sm:ml-13">
            Monitor and respond to cybersecurity incidents across your organization
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-primary bg-primary/10 px-3 py-2 rounded-lg border border-primary/30 self-start sm:self-auto">
          <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
          <span className="whitespace-nowrap font-medium">Real-time monitoring active</span>
        </div>
      </div>

      <div className="w-full">
        <KpiDashboard />
      </div>

      <div className="w-full">
        <RealTimeMetrics />
      </div>

      <div className="w-full">
        <AnalyticsCharts />
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-2">
        <div className="w-full">
          <Card className="h-full">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <IncidentFeed />
            </CardContent>
          </Card>
        </div>

        <div className="w-full">
          <Card className="h-full">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <ThreatIntelPanel />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="w-full">
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <CaseTable />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-card border rounded-lg mt-8">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>System Status: Operational</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span>Threat Level: Moderate</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleString()}</div>
      </div>
    </div>
  )
}
