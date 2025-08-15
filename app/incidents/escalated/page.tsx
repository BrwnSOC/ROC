import { DashboardLayout } from "@/components/dashboard-layout"
import { EscalatedIncidentsView } from "@/components/escalated-incidents-view"
import { TrendingUp } from "lucide-react"

export default function EscalatedIncidentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              Escalated Incidents
            </h2>
            <p className="text-muted-foreground">
              Monitor high-priority incidents requiring senior-level attention and management oversight
            </p>
          </div>
        </div>

        <EscalatedIncidentsView />
      </div>
    </DashboardLayout>
  )
}
