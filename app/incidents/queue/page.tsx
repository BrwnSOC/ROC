import { DashboardLayout } from "@/components/dashboard-layout"
import { IncidentQueueView } from "@/components/incident-queue-view"
import { Clock } from "lucide-react"

export default function IncidentQueuePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Clock className="h-8 w-8 text-yellow-500" />
              Incident Queue
            </h2>
            <p className="text-muted-foreground">
              Manage incident workload distribution and prioritize response efforts
            </p>
          </div>
        </div>

        <IncidentQueueView />
      </div>
    </DashboardLayout>
  )
}
