import { DashboardLayout } from "@/components/dashboard-layout"
import { CreateIncidentForm } from "@/components/create-incident-form"
import { Plus } from "lucide-react"

export default function CreateIncidentPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Plus className="h-8 w-8 text-primary" />
              Create New Incident
            </h2>
            <p className="text-muted-foreground">
              Report and document new security incidents for immediate investigation
            </p>
          </div>
        </div>

        <CreateIncidentForm />
      </div>
    </DashboardLayout>
  )
}
