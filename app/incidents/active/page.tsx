import { DashboardLayout } from "@/components/dashboard-layout"
import { ActiveIncidentsView } from "@/components/active-incidents-view"
import { AlertTriangle } from "lucide-react"

export default function ActiveIncidentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              Active Incidents
            </h2>
            <p className="text-muted-foreground">
              Monitor and respond to currently active security incidents requiring immediate attention
            </p>
          </div>
        </div>

        <ActiveIncidentsView />
      </div>
    </DashboardLayout>
  )
}
