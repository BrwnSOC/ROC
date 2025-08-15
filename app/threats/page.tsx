import { DashboardLayout } from "@/components/dashboard-layout"
import { ThreatIntelligenceEnhanced } from "@/components/threat-intelligence-enhanced"
import { Globe } from "lucide-react"

export default function ThreatsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Globe className="h-8 w-8 text-primary" />
              Threat Intelligence
            </h2>
            <p className="text-muted-foreground">
              Advanced threat analysis, IOC management, and threat hunting platform
            </p>
          </div>
        </div>

        <ThreatIntelligenceEnhanced />
      </div>
    </DashboardLayout>
  )
}
