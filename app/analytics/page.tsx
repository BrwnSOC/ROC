import { DashboardLayout } from "@/components/dashboard-layout"
import { AnalyticsReports } from "@/components/analytics-reports"
import { BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              Analytics & Reports
            </h2>
            <p className="text-muted-foreground">
              Comprehensive security metrics, performance analytics, and automated reporting
            </p>
          </div>
        </div>

        <AnalyticsReports />
      </div>
    </DashboardLayout>
  )
}
