import { DashboardLayout } from "@/components/dashboard-layout"
import { IncidentManagement } from "@/components/incident-management"
import { AlertTriangle } from "lucide-react"

export default function IncidentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-primary" />
              Incident Management
            </h2>
            <p className="text-muted-foreground">Monitor, assign, and respond to security incidents in real-time</p>
          </div>
        </div>

        <IncidentManagement />
      </div>
    </DashboardLayout>
  )
}
